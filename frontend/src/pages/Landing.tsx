import { useNavigate } from 'react-router-dom';
import { Activity, Database, Shield, Zap, ChevronRight } from 'lucide-react';
import '../Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar Minimalista */}
      <nav className="landing-nav">
        <div className="logo text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
          LUMINA
        </div>
        <button 
          className="demo-btn-outline"
          onClick={() => navigate('/dashboard')}
        >
          Acessar Dashboard
        </button>
      </nav>

      {/* Hero Section Cinematográfica */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="chip">SaaS Analytics Engine</div>
          <h1 className="hero-title">
            O Fim do <span className="text-gradient">Churn Silencioso</span>.
          </h1>
          <p className="hero-subtitle">
            Plataforma B2B de alta precisão que calcula seu LTV Real e injeta os dados mais cruciais da sua operação financeira direto da sua gateway de pagamento.
          </p>
          
          <div className="hero-actions">
            <button 
              className="demo-btn-primary animate-pulse-glow"
              onClick={() => navigate('/dashboard')}
            >
              Explorar Live Demo <ChevronRight size={20} />
            </button>
            <div className="hero-disclaimer">Nenhum cartão de crédito obrigatório para a demonstração.</div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Database color="var(--accent-cyan)" /></div>
            <h3>IaaS Processing</h3>
            <p>Esqueça consultas lentas. Cálculos baseados em Aggregation Functions diretas no PostgreSQL.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Activity color="var(--accent-purple)" /></div>
            <h3>LTV Real & Margem</h3>
            <p>Métrica apurada instantaneamente considerando margens brutas personalizadas e vazamento de receita.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Shield color="var(--accent-red)" /></div>
            <h3>Detecção de Churn</h3>
            <p>Separação visual entre Cartões de Crédito Falhos (Involuntário) vs Insatisfação do Cliente (Voluntário).</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Zap color="#F5A623" /></div>
            <h3>CDN Global Vercel</h3>
            <p>Interface React isolada na borda da rede. Entrega em milissegundos independente do tráfego do servidor.</p>
          </div>
        </div>
      </main>

      <div className="background-glow pos-1"></div>
      <div className="background-glow pos-2"></div>
    </div>
  );
}

export default Landing;
