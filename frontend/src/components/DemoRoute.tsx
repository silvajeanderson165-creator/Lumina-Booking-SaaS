import { Navigate } from 'react-router-dom';

interface DemoRouteProps {
  children: React.ReactNode;
}

/**
 * Guard da rota `/demo` (modo portfólio público).
 *
 * Auditoria 2026-05-18, discrepância #3 (alinhamento com item 39B):
 * o ProtectedRoute antes tinha uma exceção hardcoded `PORTFOLIO_DEMO_TOKEN`
 * que violava o próprio item 39B do checklist universal:
 *
 *   "Nunca comparar token contra string literal hardcoded"
 *   "Se houver modo demo intencional, isolar em rota separada (/demo)
 *    com dados sintéticos próprios — não usar o ProtectedRoute real"
 *
 * Esta solução implementa exatamente a recomendação:
 * - Rota separada `/demo` (não compartilha lógica com `/dashboard`).
 * - Flag em `sessionStorage` (não `localStorage`) — modo demo é por aba,
 *   não persistente. Fecha aba = sai do demo. Coerente com "visitante curioso".
 * - Sem token JWT envolvido — não há comparação de string literal contra token.
 * - Bypass via `sessionStorage.setItem('lumina_demo_mode','1')` no console é
 *   intencional: o demo é PÚBLICO. Não é vulnerabilidade, é a feature.
 */
export default function DemoRoute({ children }: DemoRouteProps) {
  const demoActive = sessionStorage.getItem('lumina_demo_mode') === '1';

  if (!demoActive) {
    // Quem chega em /demo sem ativar o modo (ex: link direto) é redirecionado
    // pra landing — não pra /auth, pra não confundir com fluxo de login real.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
