# ADR-002 — Armazenamento do JWT no `localStorage` (versão de portfólio)

> **Status:** Aceito (versão de portfólio) — revisitar antes do primeiro tenant pagante.
> **Data:** 2026-05-17
> **Contexto desta decisão:** auditoria de segurança 2026-05-17, achado crítico #4 (item 39 do `AUDIT_CHECKLIST.md`), Sessão 2 do plano de ação.
> **Relacionado:** ADR-001 (multi-tenant fora de escopo), AUDIT_REPORT 2026-05-17.

---

## Contexto

O frontend (React + Vite) precisa persistir o JWT entre reloads para manter o usuário logado no dashboard. Existem três opções comuns:

1. **`localStorage`** — simples; vulnerável a XSS (qualquer script consegue ler `localStorage.getItem('lumina_token')`).
2. **Cookie `httpOnly` + `Secure` + `SameSite=Strict`** — não acessível via JavaScript; mitiga XSS; exige proteção CSRF; exige refactor no backend (endpoint que faz `Set-Cookie`, CORS com `credentials: true`).
3. **Token em memória (state) + refresh via cookie httpOnly** — mais seguro; exige fluxo de refresh silencioso no reload.

A auditoria 2026-05-17 (achado crítico #4 e item 39 do checklist) recomenda explicitamente a opção 2 ou 3 como postura "sênior" e classifica a opção 1 como **vulnerável a XSS**, especialmente porque o frontend instala 30+ dependências de UI (`@radix-ui/*`, `recharts`, `embla-carousel`, etc.) — superfície real de supply chain.

## Decisão

**Manter `localStorage` na versão de portfólio. Migrar para cookie `httpOnly` antes do primeiro tenant pagante.**

## Por que aceitar o risco agora

1. **Não há dados reais de cliente.** Todos os dados visíveis no dashboard são gerados por `Faker` no `seed_subscriptions.py` — são fictícios. Um XSS bem-sucedido daria acesso a métricas sintéticas, não a PII real.
2. **Não há multi-tenant** (ver ADR-001). Sem separação por dono, "vazar" um token equivale a "vazar" o acesso de demonstração — que já é público por design (o modo portfólio em `Login.tsx:35` cria conta sem credencial).
3. **A demo é declaradamente pública.** Qualquer visitante pode entrar via modo portfólio. O JWT real, quando emitido via `tokenAuth`, é válido por 15 minutos (`SETTINGS:GRAPHQL_JWT:JWT_EXPIRATION_DELTA`) — janela curta limita o blast radius mesmo em caso de XSS.
4. **Refactor cruzaria backend + frontend** simultaneamente: endpoint `/login` precisaria fazer `Set-Cookie`, CORS exigiria `credentials: true`, `Login.tsx`/`Dashboard.tsx`/`ProtectedRoute.tsx` precisariam ser ajustados, `/refresh` precisaria de proteção CSRF (`Origin` check). 3-4h de refactor com risco real de quebrar a demo no ar antes que valha a pena.
5. **Defesas em volta foram fortalecidas na auditoria** mesmo mantendo `localStorage`:
   - `ProtectedRoute.tsx` agora valida o JWT (decode + `exp`) em vez de aceitar qualquer string truthy. Bypass via `localStorage.setItem('lumina_token','x')` no console **foi corrigido** (item 1 da Sessão 2 da auditoria 2026-05-17).
   - `SESSION_COOKIE_SAMESITE=Strict` e `CSRF_COOKIE_SAMESITE=Strict` adicionados em `settings.py` (item 17).
   - CSP a ser adicionada em `vercel.json` (Sessão 7) reduz vetores comuns de XSS.

## Quando revisitar

Esta decisão **expira** quando qualquer um dos seguintes acontecer:

- [ ] Primeiro tenant pagante real (qualquer dado de cliente real entrar no banco).
- [ ] Integração de pagamento real (Stripe/MercadoPago) implementada — significa que existe sessão financeira de verdade.
- [ ] Saída do estágio de "versão de portfólio" declarada no README.
- [ ] Qualquer dado de PII real começar a ser coletado (login com email real, dados pessoais, etc.).

Quando qualquer um disparar, **implementar imediatamente o caminho A**: cookie httpOnly + CSRF, em PR dedicado.

## Trade-offs assumidos

| O que se ganha | O que se perde |
|---|---|
| Refactor adiado para quando trouxer valor real (tenant pagante) | XSS bem-sucedido (em qualquer das 30+ deps de UI) consegue ler o token e fingir ser o usuário até o `exp` |
| Demo continua simples e estável | Postura de segurança fica abaixo do recomendado pelo checklist |
| Modo portfólio (público) continua funcionando sem fricção | Item 39 do `AUDIT_CHECKLIST.md` permanece em "Opção 1" até o caminho A ser executado |

## Alternativas consideradas

- **Caminho A imediato** (cookie httpOnly + CSRF): rejeitado por custo/benefício neste estágio (ver pontos 4 e 5 acima).
- **Token em memória sem persistência**: rejeitado porque quebra a UX da demo — visitante faria login a cada reload, o que prejudica o showcase.
- **Não persistir nada (re-login a cada sessão)**: mesmo problema de UX; demo perde fluidez.

## Referências

- `AUDIT_REPORT_2026-05-17.md` — achado crítico #4 e Sessão 2 do plano de ação.
- `AUDIT_CHECKLIST.md` — item 39 (token storage) e item 39B (validação no guard de rota).
- `frontend/src/components/ProtectedRoute.tsx` — validação JWT implementada na auditoria (commit referente ao item 1 da Sessão 2).
- `frontend/src/pages/Login.tsx:35` — modo portfólio (bypass intencional de registro).
