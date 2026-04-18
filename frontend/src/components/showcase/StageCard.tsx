import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StageCardProps {
  number: number;
  title: string;
  description: string;
  code: string;
  badge: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

function CodeBlock({ code }: { code: string }) {
  // Simple syntax highlighting
  const highlighted = code
    .replace(/(def |import |from |return |if |else |for |while |class )/g, '<span class="code-keyword">$1</span>')
    .replace(/('.*?')/g, '<span class="code-string">$1</span>')
    .replace(/(\d+\.?\d*)/g, '<span class="code-number">$1</span>')
    .replace(/(#.*$)/gm, '<span class="code-comment">$1</span>');

  return (
    <div className="mt-4 rounded-lg overflow-hidden" style={{ background: '#0B1120' }}>
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-2 text-[10px] text-gray-600 font-mono-code">code.py</span>
      </div>
      <pre className="p-3 overflow-x-auto">
        <code
          className="font-mono-code text-[11px] sm:text-xs leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

export default function StageCard({
  number,
  title,
  description,
  code,
  badge,
  icon: Icon,
  color,
  index,
}: StageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card glass-card-hover p-5 sm:p-7"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: `${color}20`, color }}
          >
            {String(number).padStart(2, '0')}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="relative flex h-2.5 w-2.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ background: '#4ADE80' }}
          />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
        </div>
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}12` }}
      >
        <Icon size={24} style={{ color }} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>

      {/* Code block */}
      <CodeBlock code={code} />

      {/* Badge */}
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${color}12` }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-xs font-medium" style={{ color }}>{badge}</span>
      </div>
    </motion.div>
  );
}
