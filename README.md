# 🌌 Lumina Analytics Engine
Plataforma de Inteligência Financeira (MRR, Churn, LTV) construída sobre Django + GraphQL + PostgreSQL, com dashboard React de alta densidade visual.

![React](https://img.shields.io/badge/React-19-blue?logo=react) ![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django) ![GraphQL](https://img.shields.io/badge/GraphQL-Graphene-E10098?logo=graphql) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?logo=postgresql) ![Docker](https://img.shields.io/badge/Docker-Multi--stage-2CA5E0?logo=docker) ![Caddy](https://img.shields.io/badge/Caddy-Auto_HTTPS-1F88C0?logo=caddy) ![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions)

🟢 **LIVE DEMO:** [Acesse o Lumina Ao Vivo Aqui](https://marketing-site-black-pi.vercel.app)
🛡️ **Auditoria de Segurança Aplicada:** [Veja o relatório completo](docs/AUDIT_REPORT_2026-05-17.md)

<div align="center">
  <video src="assets/demo-lumina.mp4" autoplay loop muted playsinline width="100%"></video>
</div>

---

## 🛑 O Problema
Plataformas SaaS B2B precisam responder em tempo real a perguntas sobre **MRR, LTV e Churn Rate** sobre dezenas de milhares de assinaturas. A abordagem ingênua — buscar tudo do banco e iterar em Python — não escala: a API trava ou devolve respostas lentas, o dashboard mostra spinner por minutos, e o usuário desiste antes de ver o dado.

## ✅ A Solução (Lumina)
O Lumina é um motor analítico onde **o cálculo pesado fica onde o dado vive (PostgreSQL)** e **a rede só carrega o que a tela vai renderizar (GraphQL)**.

Em vez de carregar milhares de registros em memória do Python, agregações como `DATE_TRUNC + GROUP BY + SUM` rodam direto na query do PostgreSQL — a API só recebe a métrica final. No front, o GraphQL elimina over-fetching: a tela declara exatamente os campos que precisa, e a rede trafega só isso. Resultado: dashboard com tempo de resposta sub-segundo mesmo sobre 25k+ assinaturas sintéticas.

---

## ⚠️ Escopo desta versão (honestidade primeiro)

Esta é uma **versão de portfólio (prévia)**. Decisões de escopo conscientes:

- **Multi-tenant não implementado.** Separação por `tenant_id` exigiria integração real de pagamento recorrente (Stripe/MercadoPago) — custo operacional incompatível com projeto-demo. Documentado em [ADR-001](docs/adr/ADR-001-multi-tenant-fora-de-escopo.md).
- **Celery/Redis são destino arquitetural**, não implementação atual.
- **Django 4.2** (não Django 5 como mencionado em iterações anteriores).
- **Dados são sintéticos** (gerados por `Faker` no `seed_subscriptions.py`).
- **`STRIPE_*` em `.env.example` é decorativo** — sem rota de webhook implementada.

A intenção é que esta seção evolua para "✅ implementado" item por item conforme o projeto sair do estágio de portfólio.

---

## 🧠 Maior Desafio Técnico Superado
**Garantir tempo de resposta sub-segundo no dashboard com 25k+ registros sintéticos.**

Duas estratégias resolveram:

1. **Agregação no banco, não na aplicação.** Em vez de `Subscription.objects.filter(...).all()` + iteração Python, o resolver usa `aggregate(Sum, Q)` + `TruncDay` — o PostgreSQL faz `GROUP BY` em milissegundos e a API recebe uma linha por dia, não 25k linhas. O Django ORM aqui é só tradutor de SQL.
2. **GraphQL sem over-fetching.** O dashboard declara o shape exato dos dados que vai consumir; nada além disso trafega. Comparado a REST com `select=*`, é payload menor e renderização mais rápida.

A combinação faz a aplicação se comportar como se o banco fosse um cache pré-calculado, sem precisar de cache de verdade nesta escala.

---

## 📐 Decisões Arquiteturais (Trade-offs)
Documentadas em [`docs/adr/`](docs/adr/):

- **[ADR-001 — Multi-tenant fora de escopo](docs/adr/ADR-001-multi-tenant-fora-de-escopo.md):** decisão de não implementar isolamento por tenant nesta versão; custo de integração de pagamento real é o gatilho. Revisita quando houver primeiro tenant pagante.
- **[ADR-002 — Token JWT em localStorage](docs/adr/ADR-002-token-storage.md):** aceita o trade-off de `localStorage` enquanto a demo não tem PII real. Decisão expira no primeiro tenant pagante ou na coleta de qualquer dado pessoal real; migra para cookie `httpOnly` + CSRF antes disso.
- **GraphQL (Graphene) em vez de REST (DRF):** payloads precisos por tela, schema único auto-documentado, evita versionamento de endpoints. Trade-off: ferramental Python mais verboso que TypeScript, complexity analysis exige plumbing manual (resolvido em `core/graphql_security.py`).
- **`django-graphql-jwt==0.3.4`** — biblioteca **abandonada** (último release 2020). Mantida nesta versão com `JWT_ALGORITHM='HS256'` explícito para mitigar algorithm confusion; substituição planejada como ADR futura quando o projeto sair de portfólio.
- **Caddy em vez de nginx** como reverse proxy: auto-HTTPS via Let's Encrypt sem configuração manual de certificado, Caddyfile mais legível que `nginx.conf`.

---

## 🧪 Testes
Status **honesto**: hoje só existem dois scripts ad-hoc (`backend/test_graphql.py` e `test_graphql_full.py`) que disparam `urlopen` contra `localhost:8000`. Não são testes `pytest` reais.

A suíte `pytest-django` está marcada como **TODO** no plano de ação da auditoria (item 16), com escopo mínimo definido:

- Autenticação: token inválido / expirado / `alg: none` → 401
- Autorização: usuário autenticado lê apenas o que pode (quando multi-tenant existir)
- Rate limit: 11ª tentativa de login no mesmo minuto → erro
- Validation rules: query profunda demais / aliasing massivo → erro do GraphQL

Mesmo sem suíte real, o **CI já bloqueia deploy** se houver problema de qualidade ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)):

- `ruff` (lint Python)
- `bandit` (security static analysis)
- `pip-audit` (CVE check em dependências Python)
- `eslint` + `vite build` (frontend)
- `npm audit --audit-level=high` (CVE check em dependências Node)
- `gitleaks` (secret scanning no histórico completo)

`deploy_backend.yml` usa `workflow_run` aguardando o CI concluir com sucesso antes de rodar.

---

## 🔒 Segurança

| Camada | Implementação | Status |
|---|---|---|
| Hash de senha | Padrão Django (`PBKDF2` com 600k iterações) — adequado para esta escala | ✅ |
| Tokens | JWT HS256 (15 min) com `algorithms` explícito, `JWT_LEEWAY=0`, refresh 7 dias | ✅ |
| Cookies | `Secure`, `HttpOnly`, `SameSite=Strict` em prod (sessão + CSRF) | ✅ |
| Rate limit auth | `tokenAuth` limitado a 10 tentativas/IP/minuto via cache Django ([`auth_rate_limit.py`](backend/core/auth_rate_limit.py)) | ✅ |
| GraphQL hardening | Introspecção off em prod + depth limit (7) + alias limit (10) + batching off ([`graphql_security.py`](backend/core/graphql_security.py)) | ✅ |
| Validação | Schemas Graphene tipados; UUIDField com formato estrito; resolver com `@login_required` | ✅ |
| Headers backend | HSTS (1 ano + preload), `nosniff`, `X-Frame-Options=DENY`, `SECURE_PROXY_SSL_HEADER` | ✅ |
| CSP frontend | `vercel.json` (frontend + marketing-site) com CSP restritiva + HSTS + Permissions-Policy | ✅ |
| Reverse proxy + TLS | Caddy com auto-HTTPS via Let's Encrypt; gunicorn não exposto ao host ([`infra/Caddyfile`](infra/Caddyfile)) | ✅ |
| CORS | Allowlist explícita (não `*`); `credentials: true` reservado para frontend autorizado | ✅ |
| Fail-fast | `settings.py` aborta sem `SECRET_KEY`; `docker-compose.prod.yml` usa `${VAR:?required}` em TODAS as envs sensíveis | ✅ |
| `ProtectedRoute` (frontend) | Decode JWT + verificação de `exp` antes de liberar rota; literal `'x'` no localStorage **não passa** mais | ✅ |
| Container | Dockerfile multi-stage (builder + runtime mínimo), `USER app` (não-root), `HEALTHCHECK`, `.dockerignore` | ✅ |
| Dependências | `dependabot.yml` cobrindo pip, npm, github-actions, docker — PRs semanais | ✅ |
| Logging | `logging.getLogger` estruturado no seed; logger nativo do Django nas views | ✅ |
| Governança | `SECURITY.md`, `THREAT_MODEL.md` (STRIDE completo), 2 ADRs, relatório de auditoria datado | ✅ |

**O que NÃO está implementado:**

- **Multi-tenant** ([ADR-001](docs/adr/ADR-001-multi-tenant-fora-de-escopo.md) — decisão consciente)
- **Cookie httpOnly para JWT** ([ADR-002](docs/adr/ADR-002-token-storage.md) — trade-off aceito até primeiro tenant pagante)
- **Substituição de `django-graphql-jwt==0.3.4`** (lib abandonada) — TODO em `settings.py:158`
- **Suíte pytest real** — só scripts ad-hoc hoje
- **Audit log de login/logout** (item 34 do checklist universal)
- **MFA / 2FA**
- **Account lockout por e-mail** (apenas rate limit por IP existe)
- **Hard delete pós-N dias** (sem fluxo de exclusão de conta ainda)
- **Argon2id** (Django default PBKDF2 é suficiente nesta escala)
- **Encryption at rest em nível de aplicação** (depende do TDE do provedor)
- **Celery / Redis** para processamento assíncrono
- **Integração real de pagamento** (Stripe / MercadoPago)

Para reportar vulnerabilidades, veja [`SECURITY.md`](SECURITY.md). Para modelagem completa de ameaças (STRIDE + ativos + atores), veja [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md).

---

## ✨ Principais Funcionalidades
- **Dashboard analítico em tempo real:** MRR, churn rate, LTV calculados em < 1s sobre 25k+ assinaturas via aggregate no PostgreSQL.
- **GraphQL como única API:** schema único, payload mínimo por tela, sem versionamento de endpoint.
- **Login JWT com rate limit:** brute force em `tokenAuth` mitigado por contador de tentativas no cache.
- **Modo portfólio:** botão de "criar conta" no frontend gera um token de demo (`'lumina_portfolio_demo'`) para que visitantes explorem sem cadastro real — isolado do fluxo de auth real e marcado explicitamente no [`ProtectedRoute`](frontend/src/components/ProtectedRoute.tsx).
- **Auto-HTTPS via Caddy:** certificados Let's Encrypt provisionados automaticamente no deploy.

---

## 🛡️ Arquitetura de Segurança GraphQL

O endpoint GraphQL é o único ponto de entrada da aplicação e por isso recebe defesas em camadas:

1. **Validation rules customizadas** (`core/graphql_security.py`):
   - `DepthLimitRule` rejeita queries com profundidade > 7
   - `AliasLimitRule` rejeita > 10 aliases do mesmo campo (anti-bypass de rate limit via aliasing)
   - `NoSchemaIntrospectionCustomRule` em produção — atacante não recebe o schema via `__schema`
   - `batch=False` — múltiplas queries num único request HTTP são rejeitadas

2. **Rate limit por IP na mutation `tokenAuth`** (`core/auth_rate_limit.py`):
   - 10 tentativas / IP / janela de 1 minuto
   - Contador incrementa em qualquer tentativa (sucesso ou falha) — não vaza se o usuário existe via timing
   - Backend: cache Django (locmem hoje; troca para Redis quando escalar horizontalmente, ver item E6 do CONTEXT_ADDONS no protocolo de segurança)

3. **JWT com algoritmo explícito**:
   - `JWT_ALGORITHM='HS256'` declarado em `GRAPHQL_JWT` — rejeita `alg: none` e algorithm confusion
   - Access token de 15 minutos, refresh de 7 dias
   - `JWT_LEEWAY=0` — sem tolerância de tempo na verificação de `exp`

4. **TLS terminado no Caddy, não no Django**:
   - `web` não expõe `:8000` ao host — só Caddy escuta `:80` e `:443`
   - `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')` reconhece o terminador upstream — evita loop infinito de `SECURE_SSL_REDIRECT`

5. **CSP restritiva no edge (Vercel)**:
   - `vercel.json` do frontend define `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`
   - Aplicada antes do JavaScript executar — XSS via inline scripts bloqueado

---

## 🛠️ Stack Tecnológico & Arquitetura

### 1. Frontend (CDN Vercel / Edge Network)
- **Framework:** React 19 + TypeScript + Vite
- **Estilização:** TailwindCSS customizado, animações com Framer Motion
- **Comunicação:** `fetch` direto contra `/graphql`; `VITE_API_URL` para alternar dev/prod
- **Resiliência:** `ProtectedRoute` valida JWT no client antes de liberar rota; `vercel.json` com CSP, HSTS, X-Frame-Options, Permissions-Policy

### 2. Backend (Docker + IaaS — Droplet/EC2)
- **Motor lógico:** Python 3.11 + Django 4.2
- **API:** Graphene-Django (GraphQL) com `SecureGraphQLView` customizada (depth/alias/introspecção)
- **Auth:** `django-graphql-jwt` com `JWT_ALGORITHM='HS256'` explícito + rate limit por IP no `tokenAuth`
- **Defesa perimetral:** Caddy (auto-HTTPS) → gunicorn (3 workers × 2 threads) → Django; banco isolado em rede interna
- **Observabilidade:** logger estruturado nativo do Django; `Caddyfile` configurado para logs JSON

### 3. Banco de Dados
- **PostgreSQL 15-alpine:** integridade transacional + agregações pesadas direto na query
- **Mongoose-like ORM:** Django ORM com `select_related`/`prefetch_related` quando aplicável; aggregate functions em `Subscription` para os cálculos do dashboard

### 4. Orquestração
- **Dockerfile multi-stage:** builder com toolchain (gcc/g++) + runtime mínima sem toolchain
- **`docker-compose.prod.yml`:** db + web + Caddy, com fail-fast em todas as envs sensíveis (`${VAR:?required}`)
- **`docker-compose.yml` (dev):** defaults aceitáveis, header explícito "DEV-ONLY"

---

## 🚀 Como Executar Localmente

### 1. Requisitos
- Node.js 18+
- Python 3.11+
- Docker + Docker Compose

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
> Acesse: `http://localhost:5173`

### 3. Backend (Docker)
```bash
docker-compose up -d --build
```

Para popular o banco com dados sintéticos:
```bash
docker-compose exec web python manage.py migrate
docker-compose exec web python backend/seed_subscriptions.py
```
> GraphQL em: `http://localhost:8000/graphql` (GraphiQL habilitado em dev)

### 4. Produção
`docker-compose -f docker-compose.prod.yml up -d` **só funciona se todas as envs obrigatórias estiverem setadas** (`PROD_SECRET_KEY`, `PROD_DB_USER`, `PROD_DB_PASSWORD`, `ALLOWED_PROD_HOSTS`, `PROD_DOMAIN`). O fail-fast é proposital — ver auditoria 2026-05-17 item 5C.

---

## 📂 Visão Geral da Estrutura
```text
├── backend/
│   ├── core/
│   │   ├── settings.py            # HSTS, SameSite, JWT_ALGORITHM, SECURE_PROXY_SSL_HEADER
│   │   ├── urls.py                # SecureGraphQLView no /graphql
│   │   ├── schema.py              # RateLimitedObtainJSONWebToken plugado
│   │   ├── graphql_security.py    # DepthLimit + AliasLimit + NoIntrospection
│   │   └── auth_rate_limit.py     # Rate limit por IP no tokenAuth
│   ├── metrics/                   # Models, schema GraphQL (dashboard_metrics resolver)
│   ├── seed_subscriptions.py      # Faker — 25k assinaturas sintéticas
│   ├── Dockerfile                 # Multi-stage, user não-root, HEALTHCHECK
│   └── .dockerignore              # Impede .env, .git, __pycache__ na imagem
├── frontend/
│   ├── src/components/
│   │   └── ProtectedRoute.tsx     # Valida JWT (decode + exp) antes de liberar rota
│   ├── src/pages/                 # Login, Dashboard, Landing, IntegrationShowcase
│   └── vercel.json                # CSP, HSTS, X-Frame-Options, Permissions-Policy
├── marketing-site/
│   └── vercel.json                # CSP + headers de segurança
├── infra/
│   └── Caddyfile                  # Reverse proxy + auto-HTTPS + headers
├── docs/
│   ├── AUDIT_REPORT_2026-05-17.md # Relatório completo da auditoria
│   ├── THREAT_MODEL.md            # STRIDE + ativos + atores + riscos residuais
│   └── adr/
│       ├── ADR-001-multi-tenant-fora-de-escopo.md
│       └── ADR-002-token-storage.md
├── .github/
│   ├── dependabot.yml             # pip + npm + actions + docker
│   └── workflows/
│       ├── ci.yml                 # ruff + bandit + pip-audit + eslint + vite build + npm audit + gitleaks
│       └── deploy_backend.yml     # Gate via workflow_run aguardando CI
├── docker-compose.yml             # DEV — defaults aceitáveis, header explícito
├── docker-compose.prod.yml        # PROD — fail-fast em todas as envs + Caddy
├── SECURITY.md                    # Política de disclosure
└── README.md
```

---

## 👑 Autor

**Jeanderson Silva** 🤓✍️

*Desenvolvedor Full-Stack | Engenheiro Frontend | Arquiteto de Software*

Construído desde o desenho do schema relacional otimizado para agregações em PostgreSQL até a orquestração com Caddy + Docker em IaaS, passando por hardening de GraphQL (depth/alias/introspecção) e pipeline CI/CD com bloqueio de deploy se algum check de segurança falhar.

Sinta-se à vontade para auditar o `SecureGraphQLView`, explorar o resolver de métricas no `metrics/schema.py`, ler os ADRs para entender as decisões de escopo, ou testar a interatividade do dashboard ao vivo.
