import { motion } from 'framer-motion';
import { Database, Link2, CloudDownload, Zap } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Database,
    title: 'Multi-Tenant & Setup',
    subtitle: 'Isolamento B2B',
    description: 'PostgreSQL aloca tenant_id único. JWT Auth criptografado via Django backend.',
    detail: 'Enterprise Security Rules aplicadas. Dados nunca se misturam entre empresas.',
    color: '#22D3EE',
    metrics: { label: 'Tenants', value: '128' },
  },
  {
    id: 2,
    icon: Link2,
    title: 'API Handshake',
    subtitle: 'Stripe / Hotmart',
    description: 'Chaves Read-Only validadas. Tokens criptográficos trocados. Webhooks confirmados.',
    detail: 'O handshake avisa o sistema que temos permissão para acessar dados na fonte.',
    color: '#A78BFA',
    metrics: { label: 'APIs', value: '2' },
  },
  {
    id: 3,
    icon: CloudDownload,
    title: 'Ingestão Cloud',
    subtitle: 'Background Tasks',
    description: 'Celery + Redis processam milhares de pagamentos historicos de forma assíncrona.',
    detail: 'Progress bar async puxando transações financeiras nos bastidores (IaaS).',
    color: '#FBBF24',
    metrics: { label: 'Transações', value: '14.2K' },
  },
  {
    id: 4,
    icon: Zap,
    title: 'Motor Analítico',
    subtitle: 'Decisão Inteligente',
    description: 'Aggregation queries massivas no PostgreSQL decodificam LTV e categorizam churn.',
    detail: 'Churn Voluntário (Insatisfação) vs Involuntário (Cartão Falho) classificado automaticamente.',
    color: '#4ADE80',
    metrics: { label: 'Precisão', value: '93.4%' },
  },
];

export default function ArchitectureSteps() {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass-card glass-card-hover p-4 sm:p-5 flex gap-4 items-start"
          >
            {/* Step number & icon */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${step.color}15` }}
              >
                <Icon size={18} style={{ color: step.color }} />
              </div>
              {index < steps.length - 1 && (
                <div className="w-px h-6 border-l border-dashed border-white/10" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded"
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  {String(step.id).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {step.subtitle}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1">{step.title}</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{step.description}</p>
              <p className="text-[11px] text-gray-600 mt-1.5 italic">{step.detail}</p>
            </div>

            {/* Metric badge */}
            <div className="flex-shrink-0 text-right">
              <div
                className="text-lg sm:text-xl font-bold"
                style={{ color: step.color }}
              >
                {step.metrics.value}
              </div>
              <div className="text-[10px] text-gray-500">{step.metrics.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
