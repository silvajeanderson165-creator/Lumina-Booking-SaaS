import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, TrendingUp, Shield, Database } from 'lucide-react';

const stats = [
  { value: '25K+', label: 'Dados Processados', icon: Database },
  { value: '<100ms', label: 'Tempo de Resposta', icon: TrendingUp },
  { value: '99.9%', label: 'Precisão', icon: Shield },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">SaaS Analytics Engine</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-400 text-xs font-medium">
              BETA
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Você Sabe Exatamente Quanto Dinheiro Está{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Vazando Agora?</span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Pare de confundir cancelamentos reais com cartões de crédito recusados. Conecte sua operação ao nosso <span className="text-cyan-400 font-semibold">Motor Analítico Definitivo</span> e descubra o seu verdadeiro LTV e Churn Líquido em milissegundos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.a
              href="https://frontend-woad-ten-96.vercel.app/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 rounded-full btn-gradient text-black font-semibold text-lg flex items-center gap-3 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Explorar Dashboard Demo
              </span>
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.a>

            <motion.button
              onClick={() => document.querySelector('#problema')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full glass text-white font-semibold text-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Saiba Mais
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Trust Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm text-gray-500 mb-16"
          >
            Nenhum cartão de crédito obrigatório para a demonstração
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group hover:border-cyan-400/30 transition-colors"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center group-hover:from-cyan-400/30 group-hover:to-purple-500/30 transition-colors">
                    <stat.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
    </section>
  );
}
