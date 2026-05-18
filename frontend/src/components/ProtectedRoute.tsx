import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Token literal usado pelo "MODO PORTFÓLIO" (bypass intencional de registro em Login.tsx:35).
// É público de propósito — qualquer visitante pode entrar pelo demo. Validação JWT abaixo é
// para tokens reais; este literal é uma exceção explícita para o showcase.
const PORTFOLIO_DEMO_TOKEN = 'lumina_portfolio_demo';

/**
 * Decodifica payload de um JWT sem validar assinatura (validação real é no backend).
 * Aqui só precisamos do `exp` para impedir uso de token vencido no client.
 * Retorna null se o token não for um JWT válido.
 */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    const padded = base64Payload + '='.repeat((4 - (base64Payload.length % 4)) % 4);
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Valida o token antes de liberar acesso à rota protegida.
 *
 * Auditoria 2026-05-17, crítico #3 (item 39B novo do checklist):
 * o guard anterior aceitava QUALQUER string truthy — bypass trivial com
 * `localStorage.setItem('lumina_token','x')` no console.
 */
function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  // Exceção explícita: token do modo portfólio é aceito sem validação JWT.
  if (token === PORTFOLIO_DEMO_TOKEN) return true;

  // Token real precisa ser JWT válido e não-expirado.
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  return payload.exp * 1000 > Date.now();
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('lumina_token');

  if (!isTokenValid(token)) {
    // Token inválido/expirado: limpa storage e manda pra auth.
    if (token) localStorage.removeItem('lumina_token');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
