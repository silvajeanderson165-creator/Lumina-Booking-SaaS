import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, DollarSign, RefreshCcw, UserMinus, AlertTriangle } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { DashboardChart } from '../components/DashboardChart';
import '../App.css';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Date helper
const getFilterDates = (filter: string) => {
  const end = new Date("2026-04-15T00:00:00Z"); // Fixado no limite sintético do db para garantir q os dados estão cobrindo
  const start = new Date("2026-04-15T00:00:00Z");
  
  if (filter === 'Últimos 30 Dias') {
    start.setDate(end.getDate() - 30);
  } else if (filter === 'Últimos 12 Meses') {
    start.setMonth(end.getMonth() - 12);
  } else if (filter === 'Todo o Histórico') {
    start.setFullYear(2023, 0, 1);
  }
  
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  };
};

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('Últimos 12 Meses');
  const [metrics, setMetrics] = useState<any>(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('lumina_token');
    navigate('/auth');
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const { startDate, endDate } = getFilterDates(timeFilter);

    const query = `
      query GetDashboardMetrics($startDate: String!, $endDate: String!) {
        dashboardMetrics(startDate: $startDate, endDate: $endDate) {
          summary {
            mrr
            churnRate
            voluntaryChurn
            involuntaryChurn
            ltv
          }
          timeline {
            date
            mrrValue
            churnedAmount
          }
        }
      }
    `;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql';

    const token = localStorage.getItem('lumina_token');
    
    fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `JWT ${token}` } : {})
      },
      body: JSON.stringify({ query, variables: { startDate, endDate } })
    })
      .then(res => res.json())
      .then(result => {
        if (result.errors) {
          const authError = result.errors.some((e: any) => e.message.toLowerCase().includes('do not have permission') || e.message.toLowerCase().includes('signature has expired'));
          if (authError) {
            logout();
            return;
          }
          setError(result.errors[0]?.message || "Erro no GraphQL");
        } else if (result.data?.dashboardMetrics) {
          setMetrics(result.data.dashboardMetrics);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("GraphQL Error:", err);
        setError("Não foi possível conectar ao backend. Verifique se o Docker está rodando.");
        setIsLoading(false);
      });

  }, [timeFilter]);

  const handleFilterClick = (filter: string) => {
    if (filter !== timeFilter) {
      setTimeFilter(filter);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header animate-fade-in">
        <div>
          <div className="dashboard-subtitle">Lumina Engine</div>
          <h1 className="dashboard-title text-gradient">Métricas Financeiras</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="filter-bar glass-panel" style={{ padding: '0.25rem' }}>
            {['Últimos 30 Dias', 'Últimos 12 Meses', 'Todo o Histórico'].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${timeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <button 
            className="demo-btn-primary animate-pulse-glow"
            style={{ padding: '0.6rem 1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 'bold' }}
            onClick={() => alert('Fluxo de Integração (Stripe/Hotmart) será iniciado...')}
          >
            <Activity size={18} />
            Conectar minha operação
          </button>
        </div>
      </header>

      <main>
        {error && (
          <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        <section className="metrics-grid">
          <MetricCard
            title="Receita Recorrente Mensal"
            value={metrics ? formatCurrency(metrics.summary.mrr) : '$0'}
            change="Ativa"
            isPositive={true}
            icon={<DollarSign size={24} />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Taxa de Churn (Líquida)"
            value={metrics ? `${metrics.summary.churnRate.toFixed(2)}%` : '0%'}
            change="da Base"
            isPositive={true}
            icon={<RefreshCcw size={24} />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Churn Voluntário"
            value={metrics ? `${metrics.summary.voluntaryChurn.toFixed(2)}%` : '0%'}
            change="Cancelamentos"
            isPositive={false}
            icon={<UserMinus size={24} color="var(--text-secondary)" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Churn Involuntário"
            value={metrics ? `${metrics.summary.involuntaryChurn.toFixed(2)}%` : '0%'}
            change="Fraudes/Inadimplência"
            isPositive={false}
            icon={<AlertTriangle size={24} color="var(--accent-red)" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="LTV Real (Margem 82%)"
            value={metrics ? formatCurrency(metrics.summary.ltv) : '$0'}
            change="Saúde"
            isPositive={true}
            icon={<Activity size={24} />}
            isLoading={isLoading}
          />
        </section>

        <section style={{ display: 'flex', flexGrow: 1 }}>
          <DashboardChart 
            data={metrics ? metrics.timeline : []} 
            isLoading={isLoading} 
          />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
