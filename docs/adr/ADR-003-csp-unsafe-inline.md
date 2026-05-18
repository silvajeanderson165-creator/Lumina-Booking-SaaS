# ADR-003 — CSP com `'unsafe-inline'` em `script-src` (dívida temporária)

> **Status:** Aceito como dívida explícita (versão de portfólio) — revisitar com plugin de nonces do Vite.
> **Data:** 2026-05-18
> **Contexto:** auditoria 2026-05-18, achado novo #A.
> **Relacionado:** [ADR-002](ADR-002-token-storage.md), [THREAT_MODEL.md](../THREAT_MODEL.md), `frontend/vercel.json`.

---

## Contexto

A CSP do frontend (e do marketing-site) em `vercel.json` inclui `'unsafe-inline'` em `script-src`:

```json
"script-src 'self' 'unsafe-inline'"
```

O auditor de segurança (2026-05-18) classificou esse padrão como **teatro de segurança**: `'unsafe-inline'` em `script-src` anula a principal proteção da CSP contra XSS. Se um atacante conseguir injetar `<script>...</script>` no DOM (via XSS persistente em algum campo de input, ou via dependência comprometida no `node_modules`), o browser executa.

## Por que está assim

O Vite, no build de produção, gera `<script type="module">` inline no `index.html` para bootstrap da aplicação. Sem `'unsafe-inline'`, esse script bloqueia e a aplicação não carrega.

As soluções "corretas" são:

1. **Nonces** — gerar um nonce por request, injetar no header CSP E nos atributos `nonce=` dos scripts. Exige plugin de Vite + server-side rendering ou edge worker no Vercel.
2. **Hashes** — calcular SHA-256 de cada script inline no build, listar no header CSP. Exige plugin + manter os hashes sincronizados.
3. **Eliminar scripts inline** — extrair tudo para arquivos `.js` externos. Exige refactor do entry-point do Vite.

Nenhuma das três é trivial e todas adicionam complexidade ao build.

## Decisão

**Manter `'unsafe-inline'` na versão de portfólio. Implementar nonces via plugin Vite quando o projeto sair do estágio de portfólio (gatilhos definidos no [ADR-002](ADR-002-token-storage.md)).**

## Por que aceitar o risco agora

1. **Dados são sintéticos.** Um XSS bem-sucedido daria acesso a métricas geradas por Faker — não vaza nada de verdade.
2. **Sem coleta de PII real.** Não há input do usuário renderizado como HTML em campos públicos hoje. O vetor real de XSS exige uma feature que ainda não existe (comentários, descrições, etc.).
3. **Defesa em profundidade ainda existe**, mesmo com `'unsafe-inline'`:
   - `frame-ancestors 'none'` — clickjacking bloqueado.
   - `object-src 'none'` — Flash/plugins bloqueados.
   - `base-uri 'self'` — base tag hijacking bloqueado.
   - `form-action 'self'` — submissão de formulário pra terceiros bloqueada.
   - HSTS + `nosniff` + `X-Frame-Options=DENY` — em camada de header.
   - `ProtectedRoute` valida JWT (item 39B) — XSS em rota pública não vira sessão indevida em `/dashboard`.
   - **`SECURE_REFERRER_POLICY`** — limita o que vaza em navegação cross-site.

4. **Refactor de build não traz valor visível pro portfólio** comparado a, digamos, implementar testes pytest reais ou trocar a lib JWT abandonada. Em ordem de impacto, esse item fica abaixo dessas pendências.

## Quando revisitar

Esta decisão **expira** quando:

- [ ] Qualquer feature começar a renderizar input do usuário como HTML (comentários, descrições ricas, markdown).
- [ ] Qualquer dado de PII real começar a fluir pelo frontend.
- [ ] Saída do estágio de portfólio declarada no README.
- [ ] Adicionada qualquer dependência de UI nova → revisar impacto em supply chain.

Quando disparar, implementar via plugin Vite. Referências de implementação:

- `vite-plugin-csp-guard` (gera nonces automaticamente)
- Approach manual: middleware no edge da Vercel que injeta nonce no header CSP e substitui `<script>` por `<script nonce="...">` na resposta HTML.

## Trade-offs assumidos

| O que se ganha | O que se perde |
|---|---|
| Build do Vite continua simples (zero plugin extra) | XSS em qualquer das 30+ deps de UI executa script no contexto da página |
| Não atrasa entrega de outros itens do plano de ação | Item 41 do checklist universal permanece em "Opção 1" parcial (CSP existe mas é frouxa em script-src) |
| CSS inline (`style-src 'unsafe-inline'`) também é aceito — comum em React + Tailwind | Auditor superficial pode descontar o trabalho de CSP achando que é "tudo ou nada" |

## Defesas em profundidade que substituem parcialmente

Como `'unsafe-inline'` em script-src é fraqueza, intensificamos outras camadas:

- **CSP `default-src 'self'`** força allowlist explícita em todas as outras diretivas.
- **`object-src 'none'`** + **`base-uri 'self'`** + **`frame-ancestors 'none'`** fecham vetores não-script.
- **`SECURE_REFERRER_POLICY`** (adicionado nesta auditoria) limita info que vaza.
- **`Permissions-Policy`** bloqueia geo/mic/cam/payment — atacante não consegue ativar APIs sensíveis nem com XSS.
- **`ProtectedRoute` valida JWT** — XSS não vira sessão automaticamente.

## Alternativas consideradas

- **Implementar nonces agora via `vite-plugin-csp-guard`:** rejeitado por custo/benefício neste estágio. ~3-5h de configuração + risco de quebrar o build em prod.
- **Eliminar scripts inline do `index.html` manualmente:** rejeitado por mexer no template do Vite — frágil entre versões.
- **Remover CSP por completo:** descartado — mesmo `unsafe-inline` em script-src, as outras diretivas cobrem 70% dos vetores comuns.

## Referências

- [AUDIT_REPORT_2026-05-18.md](../AUDIT_REPORT_2026-05-18.md) — achado novo #A.
- [AUDIT_CHECKLIST.md item 20B](https://github.com/jeanderson-silva8/protocolo-de-seguranca) — pergunta nova derivada deste achado.
- `frontend/vercel.json` e `marketing-site/vercel.json` — onde a CSP atual mora.
