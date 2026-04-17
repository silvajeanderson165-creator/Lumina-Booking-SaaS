import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, Eye, MousePointer, Sparkles } from 'lucide-react';

const dashboardMetrics = [
  { label: 'MRR', value: '$127.5K', change: '+12.5%', positive: true },
  { label: 'Churn Líquido', value: '3.2%', change: '-0.8%', positive: true },
  { label: 'Churn Voluntário', value: '1.8%', change: '-0.3%', positive: true },
  { label: 'Churn Involuntário', value: '1.4%', change: '-0.5%', positive: true },
  { label: 'LTV Real', value: '$4.2K', change: '+8.2%', positive: true },
];

const chartBars = [
  { height: 40, month: 'Jan' },
  { height: 55, month: 'Fev' },
  { height: 45, month: 'Mar' },
  { height: 70, month: 'Abr' },
  { height: 60, month: 'Mai' },
  { height: 85, month: 'Jun' },
  { height: 75, month: 'Jul' },
  { height: 90, month: 'Ago' },
  { height: 80, month: 'Set' },
  { height: 95, month: 'Out' },
  { height: 88, month: 'Nov' },
  { height: 100, month: 'Dez' },
];

export function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="demo" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      
      
      {/* Cyan Glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.1) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Demonstração</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Veja o{' '}
            <span className="gradient-text">Dashboard</span>{' '}
            em Ação
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Interface limpa, dados claros, decisões rápidas. 
            Assim é a experiência Lumina.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Browser Frame */}
          <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Browser Header */}
            <div className="bg-[hsl(220,15%,8%)] px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/5 rounded-lg px-4 py-1.5 text-sm text-gray-500 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  lumina.engine/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-[hsl(220,20%,4%)] p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Lumina Engine</h3>
                  <p className="text-sm text-gray-500">Métricas Financeiras</p>
                </div>
                <div className="flex gap-2">
                  {['Últimos 30 Dias', 'Últimos 12 Meses', 'Todo o Histórico'].map((period, i) => (
                    <button
                      key={period}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        i === 0 
                          ? 'bg-cyan-400/20 text-cyan-400' 
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {dashboardMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="glass-card rounded-xl p-4 border border-white/5"
                  >
                    <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                    <p className="text-xl font-bold text-white mb-1">{metric.value}</p>
                    <p className={`text-xs ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change} vs last period
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="glass-card rounded-xl p-6 border border-white/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Dinâmica de Receita</h4>
                    <p className="text-xs text-gray-500">Receita Recorrente Mensal (MRR)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-400" />
                      <span className="text-xs text-gray-400">MRR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-xs text-gray-400">Churn</span>
                    </div>
                  </div>
                </div>

                {/* Chart Bars */}
                <div className="flex items-end justify-between gap-2 h-40">
                  {chartBars.map((bar, index) => (
                    <motion.div
                      key={bar.month}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${bar.height}%` } : {}}
                      transition={{ duration: 0.8, delay: 1 + index * 0.05 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-400/50 to-cyan-400 rounded-t-sm relative group cursor-pointer"
                        style={{ height: '100%' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${(bar.height * 1275).toFixed(0)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{bar.month}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute -left-4 top-1/4 glass-card rounded-xl p-4 border border-cyan-400/20 hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Interativo</p>
                <p className="text-xs text-gray-500">Passe o mouse</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="absolute -right-4 bottom-1/4 glass-card rounded-xl p-4 border border-purple-400/20 hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-400/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">25K+ Dados</p>
                <p className="text-xs text-gray-500">Processados</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 text-center"
        >
          <motion.a
            href="https://frontend-woad-ten-96.vercel.app/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 btn-gradient px-10 py-5 rounded-full text-black font-bold text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6" />
            Explorar Dashboard Demo Ao Vivo
          </motion.a>
          <p className="mt-4 text-sm text-gray-500">
            Sem cadastro, sem cartão de crédito. Acesse agora.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
