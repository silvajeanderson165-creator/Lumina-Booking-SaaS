import { motion } from 'framer-motion';

const tags = [
  { label: 'PostgreSQL', color: '#22D3EE' },
  { label: 'Django', color: '#4ADE80' },
  { label: 'Celery', color: '#FBBF24' },
  { label: 'Redis', color: '#DC2626' },
  { label: 'Stripe API', color: '#4ADE80' },
  { label: 'Hotmart API', color: '#F97316' },
  { label: 'JWT Auth', color: '#22D3EE' },
  { label: 'Webhooks', color: '#A78BFA' },
  { label: 'Async Tasks', color: '#FBBF24' },
  { label: 'Aggregation Queries', color: '#22D3EE' },
  { label: 'LTV Analysis', color: '#A78BFA' },
  { label: 'Churn Classification', color: '#FBBF24' },
  { label: 'Multi-Tenant', color: '#4ADE80' },
  { label: 'TLS 1.3', color: '#22D3EE' },
];

export default function TechTags() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Stack Tecnológico
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag, index) => (
          <motion.span
            key={tag.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.04,
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium cursor-default transition-shadow duration-300"
            style={{
              background: `${tag.color}10`,
              color: tag.color,
              border: `1px solid ${tag.color}25`,
            }}
          >
            {tag.label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
