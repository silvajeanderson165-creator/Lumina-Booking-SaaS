import { motion } from 'framer-motion';
import NeuralBackground from './components/NeuralBackground';
import Header from './components/Header';
import PipelineNodes from './components/PipelineNodes';
import StageCard from './components/StageCard';
import DataFlowVisualization from './components/DataFlowVisualization';
import MetricsRow from './components/MetricsRow';
import LiveLog from './components/LiveLog';
import ArchitectureSteps from './components/ArchitectureSteps';
import TechTags from './components/TechTags';
import FooterCTA from './components/FooterCTA';
import { Shield, Link2, CloudDownload, Zap } from 'lucide-react';

const stages = [
  {
    number: 1,
    title: 'Multi-Tenant & Setup',
    description:
      'No momento em que o cliente decide avançar além da demonstração, isolamos o ambiente B2B. Nossa base em PostgreSQL aloca um tenant_id único garantindo que dados de diferentes empresas jamais se misturem (Enterprise Security Rules). O usuário cria a conta final recebendo painéis de autenticação criptografados via JWT Auth no nosso backend Django.',
    code: "tenant_id = uuid4()\\nclaims = {\\n  'sub': str(tenant_id),\\n  'iat': datetime.utcnow(),\\n  'role': 'enterprise'\\n}\\ntoken = jwt.encode(claims, key, algorithm='HS256')",
    badge: '128 Tenants Ativos',
    icon: Shield,
    color: '#22D3EE',
  },
  {
    number: 2,
    title: 'Handshake de APIs (Stripe / Hotmart)',
    description:
      'Em uma tela segura de Integrações, o cliente preenche chaves de API com permissão apenas de Leitura (Read-Only). O backend as valida instantaneamente trocando tokens criptográficos e confirma o Webhook para os pagamentos futuros. O Handshake avisa o sistema que agora temos permissão para acessar os dados na fonte.',
    code: "# Validação de webhook Stripe\\nevent = stripe.Webhook.construct_event(\\n  payload=request.body,\\n  sig_header=signature,\\n  secret=endpoint_secret\\n)\\nprocess_payment_intent(event.data.object)",
    badge: '2 APIs Conectadas',
    icon: Link2,
    color: '#A78BFA',
  },
  {
    number: 3,
    title: 'Ingestão de Dados em Nuvem (Background Tasks)',
    description:
      'Como a primeira carga pode englobar milhares de pagamentos de anos anteriores, nós não podemos travar o site do cliente aguardando o fim do upload. O Django repassa esse trabalho sujo para mensagerias escaláveis frequentemente usando Celery e Redis. O cliente é liberado pra passear na plataforma enquanto um "progress bar" roda async puxando transações financeiras nos bastidores (IaaS).',
    code: "@shared_task(bind=True, max_retries=3)\\ndef sync_transactions(self, tenant_id, cursor=None):\\n    batch = fetch_stripe_batch(cursor, limit=100)\\n    if batch.has_more:\\n        self.apply_async(\\n            args=[tenant_id, batch.next_cursor],\\n            countdown=5\\n        )",
    badge: '14.2K Transações sincronizadas',
    icon: CloudDownload,
    color: '#FBBF24',
  },
  {
    number: 4,
    title: 'O Motor Analítico Entra em Ação',
    description:
      'Com a tabela Subscription totalmente alimentada do Stripe, disparamos consultas aggregation massivas direto no PostgreSQL para decodificar LTV verdadeiro e categorizar as perdas como Churn Voluntário (Insatisfação) e Involuntário (Cartão Falho).',
    code: "SELECT \\\n  churn_type,\\n  COUNT(*) as total,\\n  AVG(lifetime_value) as avg_ltv,\\n  DATE_TRUNC('month', churned_at) as month\\nFROM subscriptions\\nWHERE status = 'churned'\\nGROUP BY churn_type, month\\nORDER BY month DESC",
    badge: '93.4% Precisão de Classificação',
    icon: Zap,
    color: '#4ADE80',
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-x-hidden">
      {/* Neural Network Background */}
      <NeuralBackground />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(34, 211, 238, 0.08)',
                border: '1px solid rgba(34, 211, 238, 0.15)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-xs font-medium text-cyan-400">
                Integration Showcase v2.4.1
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              <span className="text-gradient-cyan">Pipeline de Integração</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Arquitetura de dados end-to-end: do pagamento à inteligência analítica.
              Conecte, processe e transforme dados em decisões estratégicas.
            </p>
          </motion.div>

          {/* Pipeline Nodes */}
          <div className="mb-16 sm:mb-20">
            <PipelineNodes />
          </div>

          {/* Metrics Row */}
          <div className="mb-12 sm:mb-16">
            <MetricsRow />
          </div>
        </section>

        {/* Stage Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Etapas do Pipeline</h2>
            <p className="text-sm text-gray-500">Como os dados fluem de ponta a ponta</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {stages.map((stage, index) => (
              <StageCard
                key={stage.number}
                number={stage.number}
                title={stage.title}
                description={stage.description}
                code={stage.code}
                badge={stage.badge}
                icon={stage.icon}
                color={stage.color}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Data Flow Visualization */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Arquitetura em Tempo Real</h2>
            <p className="text-sm text-gray-500">Visualização do fluxo de dados entre sistemas</p>
          </motion.div>

          <DataFlowVisualization />
        </section>

        {/* Architecture Steps + Live Log */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left: Architecture Steps */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Fluxo Detalhado</h2>
                <p className="text-xs sm:text-sm text-gray-500">Passo a passo da integração</p>
              </motion.div>
              <ArchitectureSteps />
            </div>

            {/* Right: Live Log */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Monitoramento</h2>
                <p className="text-xs sm:text-sm text-gray-500">Eventos do sistema em tempo real</p>
              </motion.div>
              <LiveLog />
            </div>
          </div>
        </section>

        {/* Tech Tags */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <TechTags />
        </section>

        {/* Footer CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="glass-card p-8 sm:p-12">
            <FooterCTA />
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-gray-600">
            Lumina Integration Engine — TLS 1.3 — {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
