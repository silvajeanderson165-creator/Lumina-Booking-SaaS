# Threat Model — Lumina Analytics Engine

> **Status:** versão de portfólio. Atualizado em 2026-05-17.
> **Relacionado:** [AUDIT_REPORT_2026-05-17.md](AUDIT_REPORT_2026-05-17.md), [ADR-001](adr/ADR-001-multi-tenant-fora-de-escopo.md), [ADR-002](adr/ADR-002-token-storage.md).

---

## Ativos protegidos

| Ativo | Onde vive | Sensibilidade hoje | Sensibilidade quando virar produto |
|-------|-----------|---------------------|--------------------------------------|
| Credenciais de usuário (hash de senha) | `auth_user` (PostgreSQL) | Baixa (single user, dev) | **Alta** |
| JWT access/refresh tokens | `localStorage` do navegador + `SECRET_KEY` no backend | Baixa (dados sintéticos) | **Alta** |
| Dados de assinatura (MRR/churn/LTV) | `metrics_subscription` (PostgreSQL) | **Nenhuma** (Faker) | **Alta** (dados financeiros de clientes reais) |
| `SECRET_KEY` do Django | env var no servidor | Média (assina JWT, mas só demo) | **Crítica** |
| Credenciais do banco | env var no servidor | Média (banco só tem Faker) | **Crítica** |
| Disponibilidade do dashboard | gunicorn + PostgreSQL | Baixa (downtime de demo é ok) | Média |

## Atores de ameaça

| Ator | Motivação | Capacidade | Probabilidade |
|------|-----------|-----------|---------------|
| **Script kiddie / bot** | Scan oportunista, prova de conceito | Baixa | Alta (qualquer endpoint público é varrido) |
| **Visitante curioso** | Explorar a demo, testar limites | Baixa | Alta (recrutador, dev curioso) |
| **Atacante autenticado** | Privilege escalation, IDOR, leak | Média | Média (precisa criar conta primeiro, mas modo portfólio facilita) |
| **Adversário direcionado** | Comprometer o portfólio, deface | Alta | Baixa (alvo de baixo valor hoje) |
| **Ex-mantenedor** | Acesso indevido após saída | Alta | Baixa (projeto solo, sem rotação de pessoal) |

## Superfícies de ataque

| Superfície | Onde | Status hoje |
|-----------|------|-------------|
| Endpoint GraphQL público | `/graphql` (POST) | ✅ Validation rules (depth, alias, introspecção off em prod) — ver `core/graphql_security.py`. `csrf_exempt` por design — JWT no body. |
| Mutation `tokenAuth` (login) | `/graphql` (mutation) | ✅ Rate limit por IP (`core/auth_rate_limit.py`). ⚠️ Locmem por processo — ver E6 do CONTEXT_ADDONS. |
| Admin Django | `/admin/` | ⚠️ Habilitado. Considerar bloquear via Caddy quando subir produção. |
| Frontend React (Vercel) | `marketing-site-black-pi.vercel.app` | ⚠️ Sem CSP no `vercel.json` ainda (item 14 do plano de ação). |
| Cookies (CSRF/session) | Browser do usuário | ✅ `Secure`, `HttpOnly`, `SameSite=Strict` em prod. |
| Banco PostgreSQL | Container `db` na rede interna | ✅ Não exposto ao host. |
| Reverse proxy | Caddy (auto-HTTPS via Let's Encrypt) | ✅ Adicionado na Sessão 5 da auditoria. |

## STRIDE aplicado

### S — Spoofing (falsificação de identidade)

| Cenário | Mitigação atual | Status |
|---------|----------------|--------|
| Atacante usa token JWT roubado | Expiração curta (15 min) + `JWT_ALGORITHM=HS256` explícito | ✅ |
| Atacante envia `userId` no payload pra fingir ser outra pessoa | N/A — sem multi-tenant, identidade vem do JWT (`@login_required`) | ✅ |
| Atacante registra conta com email de terceiro | Sem verificação de email implementada | 🟠 Aceito por escopo (versão demo) |

### T — Tampering (alteração indevida)

| Cenário | Mitigação atual | Status |
|---------|----------------|--------|
| Modificação de `Subscription` via API | Não há mutation de update/delete exposta | ✅ |
| Modificação direta no banco | Banco não exposto ao host | ✅ |
| Modificação de JWT (alg confusion) | `JWT_ALGORITHM=HS256` explícito | ✅ |

### R — Repudiation (negação de ação)

| Cenário | Mitigação atual | Status |
|---------|----------------|--------|
| Usuário nega ter feito login | Sem audit log de login (item 34 do checklist) | 🔴 Pendente |
| Mantenedor nega ter feito deploy | GitHub Actions registra autor; SSH log no servidor | 🟠 Parcial |

### I — Information disclosure (vazamento)

| Cenário | Mitigação atual | Status |
|---------|----------------|--------|
| Introspecção GraphQL revela schema | `NoSchemaIntrospectionCustomRule` em prod | ✅ |
| Erros vazam stack trace | `DEBUG=False` em prod + error handler do graphene | ✅ |
| `.env` versionado | `.gitignore` cobre | ✅ |
| Logs gravam senha | `logger.info` no seed não loga input; auth não logado hoje | ✅ |
| README revela features que não existem | Seção "Escopo desta versão" adicionada | ✅ (Sessão prévia à auditoria) |

### D — Denial of service

| Cenário | Mitigação atual | Status |
|---------|----------------|--------|
| Query GraphQL profunda derruba servidor | `DepthLimitRule` (max 7) | ✅ |
| 1000 logins via aliasing em 1 request | `AliasLimitRule` (max 10) | ✅ |
| Brute force no `tokenAuth` | Rate limit 10/IP/min | ✅ |
| Flood HTTP | Sem rate limit global (depende de Caddy/IaaS) | 🟠 Parcial |

### E — Elevation of privilege

| Cenário | Mitigação atual | Status |
|---------|----------------|--------|
| Usuário comum vira admin | Único admin é o do seed; sem promoção via API | ✅ |
| `ProtectedRoute` aceita string truthy | Validação JWT (`decodeJwtPayload` + `exp`) | ✅ (Sessão 2) |
| Container roda como root | `USER app` no Dockerfile multi-stage | ✅ (Sessão 5) |

## Limites declarados (decisões conscientes)

Ver ADRs:

- [ADR-001 — Multi-tenant fora de escopo](adr/ADR-001-multi-tenant-fora-de-escopo.md): **risco aceito** — qualquer usuário autenticado vê todas as métricas. Mitigado pelo fato de os dados serem 100% sintéticos.
- [ADR-002 — Token em localStorage](adr/ADR-002-token-storage.md): **risco aceito** — XSS bem-sucedido em qualquer das 30+ deps de UI consegue ler o token. Mitigado por: expiração de 15 min, demo pública por design, ausência de PII.

## Riscos residuais conhecidos

Itens que CONTINUAM em 🔴/🟠 mesmo após a auditoria 2026-05-17 (sem mitigação ainda):

1. **`django-graphql-jwt==0.3.4`** — lib abandonada (último release 2020). Substituição planejada como ADR futura.
2. **Audit log de login** — não implementado (item 34 do checklist).
3. **Testes pytest reais** — só scripts ad-hoc hoje (item 16).
4. **CSP no frontend** — `vercel.json` ainda sem headers de segurança.
5. **Rate limit in-memory** (E6) — quebra com múltiplas instâncias. OK enquanto single-instance.

## Quando revisitar este threat model

- Quando qualquer um dos gatilhos do ADR-001 ou ADR-002 disparar (primeiro tenant pagante, integração de pagamento real, saída do estágio de portfólio).
- A cada nova auditoria via [Protocolo de Segurança](https://github.com/jeanderson-silva8/protocolo-de-seguranca).
- Quando uma nova feature for adicionada (especialmente: upload, webhooks, integração externa, fila assíncrona).
