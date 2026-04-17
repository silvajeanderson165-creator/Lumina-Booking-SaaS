import { Navigation } from '../components/Navigation';
import { Footer } from '../sections/Footer';
import { ParticleBackground } from '../components/effects/ParticleBackground';

export default function ContentPage({ title }: { title: string }) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-32 pb-24 min-h-[70vh]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-8">
            {title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Esta é a aba de {title}. Como este é o ambiente de laboratório para demonstração do projeto técnico Lumina SaaS B2B, este conteúdo estrutural ainda não foi populado por advogados ou equipes de redação.
          </p>
          <div className="p-8 mt-12 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Selo Arquitetural</h3>
            <p className="text-sm text-gray-500">
              O roteamento via <code>react-router-dom</code> já está isolando essas páginas na Edge Vercel sem recarregar recursos.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
