export function IntegrationsSection() {
  const integrations = [
    "Hotmart",
    "Stripe",
    "PayPal",
    "Pagar.me",
    "Mercado Pago"
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-6">
          <span className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
            Integrações Diretas
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
            {integrations.map((name, i) => (
              <span 
                key={i} 
                className="text-xl md:text-2xl font-semibold tracking-tight text-gray-400 hover:text-white transition-colors duration-300 cursors-default select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
