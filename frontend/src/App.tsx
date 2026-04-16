import React, { useState, useEffect } from 'react';
import { Activity, DollarSign, RefreshCcw, UserMinus, AlertTriangle } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { DashboardChart } from './components/DashboardChart';
import './App.css';

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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Últimos 12 Meses');
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
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

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { startDate, endDate } })
    })
      .then(res => res.json())
      .then(result => {
        if (result.data?.dashboardMetrics) {
          setMetrics(result.data.dashboardMetrics);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("GraphQL Error:", err);
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
          <h1 className="dashboard-title text-gradient">Financial Metrics</h1>
        </div>
        
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
      </header>

      <main>
        <section className="metrics-grid">
          <MetricCard
            title="Monthly Recurring Revenue"
            value={metrics ? formatCurrency(metrics.summary.mrr) : '$0'}
            change="Active"
            isPositive={true}
            icon={<DollarSign size={24} />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Net Churn Rate"
            value={metrics ? `${metrics.summary.churnRate.toFixed(2)}%` : '0%'}
            change="Base"
            isPositive={true}
            icon={<RefreshCcw size={24} />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Voluntary Churn"
            value={metrics ? `${metrics.summary.voluntaryChurn.toFixed(2)}%` : '0%'}
            change="Cancelamentos"
            isPositive={false}
            icon={<UserMinus size={24} color="var(--text-secondary)" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Involuntary Churn"
            value={metrics ? `${metrics.summary.involuntaryChurn.toFixed(2)}%` : '0%'}
            change="Fraudes/Inadimplência"
            isPositive={false}
            icon={<AlertTriangle size={24} color="var(--accent-red)" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="True LTV (82% Gross)"
            value={metrics ? formatCurrency(metrics.summary.ltv) : '$0'}
            change="Health"
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

export default App;
