import { motion } from 'framer-motion';
import { Database, Link2, CloudDownload, Zap } from 'lucide-react';

const stages = [
  { id: 1, icon: Database, label: 'Multi-Tenant', color: '#22D3EE' },
  { id: 2, icon: Link2, label: 'API Handshake', color: '#A78BFA' },
  { id: 3, icon: CloudDownload, label: 'Ingestão Cloud', color: '#FBBF24' },
  { id: 4, icon: Zap, label: 'Motor Analítico', color: '#4ADE80' },
];

export default function PipelineNodes() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-1 sm:gap-4 w-full overflow-hidden">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center gap-1 sm:gap-4">
            {/* Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                initial={{ borderColor: 'rgba(255,255,255,0.1)' }}
                animate={{
                  borderColor: stage.color,
                  boxShadow: `0 0 20px ${stage.color}30`,
                }}
                transition={{ delay: index * 0.5 + 0.3, duration: 0.6 }}
                className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-5 py-1.5 sm:py-3 rounded-full border"
                style={{ background: 'rgba(17, 24, 39, 0.8)' }}
              >
                <div
                  className="w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${stage.color}18` }}
                >
                  <stage.icon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: stage.color }} />
                </div>
                <span className="text-white text-[9px] sm:text-sm font-semibold whitespace-nowrap">
                  {stage.label}
                </span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.5 + 0.6, duration: 0.3 }}
                  className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0"
                >
                  <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                    style={{ background: stage.color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2"
                    style={{ background: stage.color }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Connector line (except after last node) */}
            {index < stages.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5 + 0.4, duration: 0.3 }}
                className="relative w-2 sm:w-12 lg:w-20 h-0.5"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {/* Animated pulse on the line */}
                <motion.div
                  initial={{ left: '0%' }}
                  animate={{ left: '100%' }}
                  transition={{
                    delay: index * 0.5 + 0.8,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'linear',
                  }}
                  className="absolute top-1/2 -translate-y-1/2 w-2 sm:w-4 h-0.5 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${stage.color}, transparent)`,
                  }}
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
