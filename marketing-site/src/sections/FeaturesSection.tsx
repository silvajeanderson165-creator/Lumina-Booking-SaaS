import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowUpRight
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'LTV Real & Margem',
    description: 'Métrica apurada instantaneamente considerando margens brutas personalizadas e vazamento de receita. Não é estimativa, é cálculo real.',
    gradient: 'from-cyan-400 to-blue-500',
    stat: 'Precisão',
    statValue: '99.9%',
  },
  {
    icon: Users,
    title: 'Detecção de Churn',
    description: 'Separação visual entre Cartões de Crédito Falhos (Involuntário) vs Insatisfação do Cliente (Voluntário). Saiba exatamente quem salvar.',
    gradient: 'from-purple-400 to-pink-500',
    stat: 'Taxa',
    statValue: 'Real',
  },
  {
    icon: CreditCard,
    title: 'MRR em Tempo Real',
    description: 'Receita Recorrente Mensal calculada com precisão milimétrica. Acompanhe o crescimento ou identifique quedas instantaneamente.',
    gradient: 'from-green-400 to-emerald-500',
    stat: 'Atualização',
    statValue: '<100ms',
  },
  {
    icon: BarChart3,
    title: 'Análise Histórica',
    description: 'Processe anos de dados de vendas em segundos. Identifique padrões sazonais, tendências e oportunidades ocultas no histórico.',
    gradient: 'from-orange-400 to-red-500',
    stat: 'Dados',
    statValue: '25K+',
  },
  {
    icon: Shield,
    title: 'Segurança Enterprise',
    description: 'Criptografia de ponta a ponta, conformidade com LGPD e GDPR. Seus dados financeiros nunca foram tão seguros.',
    gradient: 'from-indigo-400 to-purple-500',
    stat: 'Conformidade',
    statValue: 'LGPD',
  },
  {
    icon: Zap,
    title: 'IaaS Processing',
    description: 'Esqueça consultas lentas. Cálculos baseados em Aggregation Functions diretas no PostgreSQL. Velocidade de verdade.',
    gradient: 'from-yellow-400 to-orange-500',
    stat: 'Velocidade',
    statValue: 'Extrema',
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Purple Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(260 100% 60% / 0.08) 0%, transparent 50%)',
          filter: 'blur(100px)',
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Features</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Tudo Que Você Precisa{' '}
            <span className="gradient-text">Em Um Só Lugar</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Dashboard completo com todas as métricas financeiras que importam para 
            o crescimento sustentável do seu negócio.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="glass-card rounded-3xl p-8 h-full border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden">
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  {feature.title}
                  <ArrowUpRight className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Stat Badge */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {feature.stat}
                  </span>
                  <span className={`text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.statValue}
                  </span>
                </div>

                {/* Corner Glow on Hover */}
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">
            Quer ver todas as funcionalidades em ação?
          </p>
          <motion.a
            href="https://frontend-woad-ten-96.vercel.app/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explorar Dashboard Completo
            <ArrowUpRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
