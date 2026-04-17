import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  const commonFeatures = [
    "Motor PostgreSQL Isolado",
    "Painel 'Midnight Luxe'",
    "Acesso GlobalEdge (Distribuição Vercel)",
    "API Key B2B Própria",
    "SLA Uptime 99.9%",
    "Separação Churn Fraude/Voluntário"
  ];

  const plans = [
    {
      name: "Mensal",
      description: "Controle estrito. Livre de fidelidade.",
      monthly: "997",
      cents: ",00",
      billedAction: "Todo mês",
      features: commonFeatures,
      isPopular: false,
      buttonText: "Assinar Mensal",
      buttonVariant: "outline"
    },
    {
      name: "Anual",
      description: "Para Startups e Agências focadas em longo termo.",
      monthly: "727",
      cents: ",81",
      billedAction: "R$ 8.733,72 / anualmente",
      features: commonFeatures,
      isPopular: true,
      badge: "27% OFF",
      buttonText: "Assinar Anual (Recomendado)",
      buttonVariant: "default"
    },
    {
      name: "Semestral",
      description: "Planejamento focado a cada dois trimestres.",
      monthly: "847",
      cents: ",45",
      billedAction: "R$ 5.084,70 a cada 6 meses",
      features: commonFeatures,
      isPopular: false,
      badge: "15% OFF",
      buttonText: "Assinar Semestral",
      buttonVariant: "outline"
    }
  ];

  return (
    <section id="pricing" className="py-24 relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Assuma o Controle Total do Seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">MRR</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Nenhuma taxa por transação ou processamento extra. Escolha o plano que melhor calibra o ciclo financeiro da sua operação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative rounded-3xl p-8 backdrop-blur-sm border transition-all duration-300 ${
                plan.isPopular 
                  ? "bg-slate-900/80 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)] transform md:-translate-y-4" 
                  : "bg-black/40 border-white/10 hover:border-white/20"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 pb-1.5 rounded-full uppercase tracking-wider">
                    Mais Escolhido
                  </span>
                </div>
              )}
              {plan.badge && !plan.isPopular && (
                <div className="absolute top-4 right-4">
                  <span className="bg-white/10 text-gray-300 text-xs font-bold px-2 py-1 rounded">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6 border-b border-white/10 pb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm h-10">{plan.description}</p>
                <div className="mt-4 flex items-end">
                  <span className="text-4xl font-extrabold text-white">R$ {plan.monthly}</span>
                  <span className="text-xl text-gray-300 mb-1">{plan.cents}</span>
                  <span className="text-sm text-gray-500 ml-2 mb-1.5">/ mês</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  {plan.billedAction}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="block w-full">
                <Button 
                  variant={plan.buttonVariant === 'default' ? 'default' : 'outline'} 
                  onClick={(e) => e.preventDefault()}
                  className={`w-full font-semibold rounded-xl h-12 transition-all cursor-default ${
                    plan.isPopular 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
