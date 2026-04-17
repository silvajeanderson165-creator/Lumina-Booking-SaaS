import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertTriangle, CreditCard, UserX, TrendingDown, DollarSign } from 'lucide-react';

const problems = [
  {
    icon: CreditCard,
    title: 'Cartões Falhos',
    description: 'Clientes que cancelaram porque o cartão expirou ou não tinha saldo. Você perde receita sem saber o motivo real.',
    stat: '40%',
    statLabel: 'do churn é involuntário',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: UserX,
    title: 'Insatisfação Oculta',
    description: 'Clientes insatisfeitos que cancelam silenciosamente. Sem dados, você não consegue identificar o padrão.',
    stat: '60%',
    statLabel: 'sem análise de causa',
    color: 'from-red-400 to-pink-500',
  },
  {
    icon: TrendingDown,
    title: 'Vazamento de Receita',
    description: 'Dinheiro saindo da empresa todos os dias sem visibilidade. Cada dia sem dados é dinheiro perdido.',
    stat: 'R$',
    statLabel: 'perdido diariamente',
    color: 'from-purple-400 to-indigo-500',
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="problema" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Red Glow for Drama */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(0 80% 50% / 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">O Problema</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Você Sabe Quanto{' '}
            <span className="text-red-400">Gasta</span> em Marketing...
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            ...mas sabe exatamente{' '}
            <span className="text-white font-semibold">por onde seu dinheiro está vazando</span>{' '}
            todo dia?
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="glass-card rounded-3xl p-8 h-full border border-red-500/10 hover:border-red-500/30 transition-all duration-500">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${problem.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <problem.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {problem.description}
                </p>

                {/* Stat */}
                <div className="pt-6 border-t border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">
                    {problem.stat}
                  </div>
                  <div className="text-sm text-gray-500">
                    {problem.statLabel}
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Realization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass-card rounded-3xl p-8 md:p-12 border border-yellow-500/20 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(45 100% 50% / 0.1) 0%, transparent 60%)',
              filter: 'blur(60px)',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center pulse-glow">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                A Maioria dos Empresários Confunde{' '}
                <span className="text-yellow-400">Churn Voluntário</span> com{' '}
                <span className="text-orange-400">Involuntário</span>
              </h3>
              <p className="text-gray-400 text-lg">
                Sem essa separação clara, você toma decisões erradas, gasta dinheiro 
                em retenção de clientes que querem ficar, e perde os que realmente 
                precisam de atenção.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
