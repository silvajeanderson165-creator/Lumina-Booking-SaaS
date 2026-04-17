import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Zap, Database, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'PostgreSQL Aggregation',
    description: 'Consultas diretas no banco com aggregation functions otimizadas. Processamento em milissegundos, não em segundos.',
  },
  {
    icon: Cpu,
    title: 'Motor Analítico',
    description: 'Algoritmos proprietários que separam churn voluntário de involuntário com precisão cirúrgica.',
  },
  {
    icon: Lock,
    title: 'Conexão Segura',
    description: 'Integração direta com Hotmart, Stripe e gateways de pagamento via APIs criptografadas.',
  },
  {
    icon: Zap,
    title: 'LTV Real Instantâneo',
    description: 'Cálculo de Lifetime Value considerando margens brutas personalizadas e vazamento de receita.',
  },
];

const benefits = [
  'Identifique churn involuntário em tempo real',
  'Separe cancelamentos por insatisfação',
  'Calcule LTV com margens reais',
  'Processe anos de dados em segundos',
  'Tome decisões baseadas em dados',
];

export function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="solucao" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      
      
      {/* Cyan Glow */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.1) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">A Solução</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Apresentamos o{' '}
              <span className="gradient-text">Motor Analítico</span>{' '}
              Financeiro
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              A <span className="text-white font-semibold">Lumina</span> não é um dashboard comum 
              que gera planilhas lentas e travadas. Desenvolvemos um motor de processamento 
              de alta performance que se conecta diretamente às suas fontes de dados.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="https://frontend-woad-ten-96.vercel.app/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-gradient px-8 py-4 rounded-full text-black font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver Demo Ao Vivo
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`glass-card rounded-2xl p-6 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 group ${
                  index === 0 || index === 3 ? 'sm:translate-y-8' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-cyan-400/30 group-hover:to-purple-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
