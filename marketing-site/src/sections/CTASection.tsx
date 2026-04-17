import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

const benefits = [
  'Decisões Baseadas em Dados Reais',
  'Previsibilidade de Caixa Absoluta',
  'Blindagem Contra Churn Involuntário',
  'Aumento Direto de Margem',
];

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background Orbs - Increased Intensity */}
      <div 
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.20) 0%, transparent 60%)',
          filter: 'blur(120px)',
        }}
      />
      <div 
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(260 100% 60% / 0.20) 0%, transparent 60%)',
          filter: 'blur(120px)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] p-[2px] group overflow-hidden"
        >
          {/* Animated Gradient Border */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-gradient" 
            style={{ backgroundSize: '200% 200%' }} 
          />
          
          <div className="relative h-full w-full bg-[#050505]/95 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-20 text-center overflow-hidden">
            {/* Inner Glow Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-900/40 border border-cyan-400/50 mb-10 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-semibold tracking-wide uppercase">O Fim Do Churn Silencioso</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8 leading-[1.1]"
            >
              Pare de Perder{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 animate-pulse">
                Dinheiro
              </span>{' '}
              <br className="hidden md:block" />
              No Escuro
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Lumina é um <strong className="text-white font-semibold">motor implacável de auditoria de receita</strong> construído para operações sérias. 
              Grandes negócios não estagnam por falta de vendas, mas porque sangram caixa no escuro. 
              Aja na raiz do problema: assuma o controle absoluto do seu MRR, elimine o churn silencioso 
              e transforme sua inteligência de dados na alavanca definitiva para dominar o seu mercado.
            </motion.p>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex flex-wrap items-center justify-center gap-3 lg:gap-6 mb-16"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm md:text-base text-gray-200 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Premium CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <motion.a
                href="#pricing"
                className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-cyan-400 to-purple-500 p-[2px] rounded-full overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_80px_rgba(34,211,238,0.5)] transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="flex items-center gap-3 px-12 py-6 bg-black rounded-full group-hover:bg-transparent transition-colors duration-500">
                  <Zap className="w-6 h-6 text-cyan-400 group-hover:text-black transition-colors duration-500" />
                  <span className="relative z-10 text-xl font-bold text-white group-hover:text-black transition-colors duration-500">
                    Quero Elevar Meu Nível Empresarial
                  </span>
                  <ArrowRight className="w-6 h-6 text-purple-400 group-hover:text-black group-hover:translate-x-2 transition-all duration-500" />
                </div>
                
                {/* Shine Effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: '-200%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.8 }}
                />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
