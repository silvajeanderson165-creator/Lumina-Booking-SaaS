import { motion } from 'framer-motion';
import { Layers, Wifi } from 'lucide-react';

const integrations = [
  { label: 'Stripe API', status: 'active', color: '#4ADE80' },
  { label: 'Hotmart API', status: 'active', color: '#4ADE80' },
  { label: 'PostgreSQL', status: 'active', color: '#22D3EE' },
  { label: 'Redis', status: 'active', color: '#DC2626' },
];

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16"
      style={{
        background: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Layers size={16} className="text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-white">Lumina</span>
            <span className="hidden sm:inline text-[10px] font-mono-code text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
              v2.4.1
            </span>
          </div>
        </div>

        {/* Integration Status */}
        <div className="hidden md:flex items-center gap-5">
          {integrations.map((integration) => (
            <div key={integration.label} className="flex items-center gap-2">
              <div className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                  style={{ background: integration.color }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: integration.color }}
                />
              </div>
              <span className="text-[11px] text-gray-400">{integration.label}</span>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 text-cyan-400 text-xs font-medium">
            <Wifi size={12} />
            <span>Online</span>
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #22D3EE, #A78BFA)' }}
          >
            L
          </div>
        </div>
      </div>
    </motion.header>
  );
}
