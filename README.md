<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="60" alt="Lumina Engine Icon">
  <h1>Lumina Analytics SaaS</h1>
  <p><strong>Plataforma B2B de Inteligência Financeira e Churn Prediction</strong></p>

  [![React](https://img.shields.io/badge/Frontend-React%20v19-22D3EE?logo=react&logoColor=22D3EE&style=for-the-badge)](https://react.dev/)
  [![Django](https://img.shields.io/badge/Backend-Django%205-092E20?logo=django&logoColor=white&style=for-the-badge)](https://www.djangoproject.com/)
  [![GraphQL](https://img.shields.io/badge/API-GraphQL-E10098?logo=graphql&logoColor=white&style=for-the-badge)](https://graphql.org/)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)](https://www.postgresql.org/)
  [![Docker](https://img.shields.io/badge/Deploy-Docker%20%7C%20VPS-2496ED?logo=docker&logoColor=white&style=for-the-badge)](https://www.docker.com/)

</div>

---

## 📖 Sobre o Projeto
O **Lumina Analytics** é um motor avançado ("SaaS") de métricas financeiras focado em analisar assinaturas (MRR, LTV e Churn Rate). Ele foi idealizado sob uma estética rigorosa batizada de **Midnight Luxe** — unindo minimalismo luxuoso à robustez de uma extração de dados assíncrona. 

A arquitetura do projeto foi desenhada visando extrema segurança e estabilidade, operando através de containers isolados (Docker), integrações via GraphQL para trafegar o payload de dados e garantindo a segregação B2B por Tenant UUIDs.

---

## ✨ Principais Funcionalidades

- **Dashboard Financeiro (Midnight Luxe):** Interface rica (Glassmorphism), responsiva e interativa que compila dados complexos (Receita Ativa vs Perdida).
- **Integração Real-Time (Mock/Showcase):** Mostruário de arquitetura para ingestão de dados em nuvem (Stripe, Hotmart) protegido por Webhooks e Handshakes JWT.
- **Consultas via GraphQL:** Consumo e estruturação sem payload 'cego'. O Dashboard pede e carrega apenas os bytes essenciais para a renderização do frontend.
- **Seeding Massivo de Dados (Teste de Estresse):** Backend preparado e populado com dezenas de milhares de registros falsos mapeados via Python Faker para exibir agregações e precisão milimétrica nas taxas geradas.
- **Autenticação Segura JWT:** Regras rigorosas de segurança impedindo travessias (Directory Traversal) e protegendo a integridade das chamadas de API.

---

## 🛠️ Stack Tecnológico & Arquitetura

O ecossistema Lumina segue uma rígida **Arquitetura de 3 Camadas** inspirada no protocolo construtivo **A.N.T e V.L.A.E.G**:

### Frontend (CDN Vercel / Edge Network)
- **Framework:** React 19 + TypeScript + Vite.
- **Estilização:** TailwindCSS Customizado, Animações com `framer-motion` e visual rico guiado por variáveis CSS (Design Tokens Hex: `#A020F0`, `#00FFFF`).
- **Data Fetch:** Comunicação encapsulada chamando diretamente a rota segura do Graphene (GraphQL).

### Backend (Docker + AWS EC2 / DigitalOcean)
- **Motor Lógico:** Python 3 + Django 5.
- **Processos em Background:** Escalonamento e _Background Tasks_ utilizando fila de processamento (Celery) e Redis para ingestões massivas não travarem a API.
- **API Engine:** Graphene-Django (GraphQL Api).
- **Gateway & Orquestração:** Docker Compose fortificando `web`, `db` e mapeando as portas internas numa sub-rede selada (`bridge`), com o banco de dados impenetrável por vias externas diretas.

### Banco de Dados (Fonte da Verdade)
- **PostgreSQL 15:** Mantêm as tabelas cruciais do sistema (`Subscription`, `Auth`) e realiza cálculos e agregações (GROUP BY, DATE_TRUNC) na própria base para aliviar a carga da API.

---

## 🚀 Como Executar Localmente

### 1. Requisitos
- Node.js (v18+)
- Python (3.11+)
- Docker e Docker Compose

### 2. Rodando o Frontend
```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

### 3. Rodando o Backend (Docker)
```bash
# Na raiz do projeto, suba os containers
docker-compose up -d --build

# Popule o banco com dados massivos de teste
docker-compose exec web python backend/manage.py migrate
docker-compose exec web python backend/seed_subscriptions.py

# Acesse a API GraphQL: http://localhost:8000/graphql
```

---

## 📂 Visão Geral da Estrutura

```text
├── .github/          # Fluxos de automação (CI/CD Zero Downtime e Actions)
├── architecture/     # Procedimentos Operacionais Padrão (POPs/VLAEG)
├── backend/          # Django, Models, GraphQL Schema, Seeder Massivo
├── frontend/         # React, Vite, Componentes Midnight Luxe, Animações Form
├── tools/            # Scripts autonômos regenerativos para validação
└── docker-compose.*  # Orquestração de contêineres prod/dev
```

---

## 🤝 Autor e Portfólio
Construído desde o mapeamento de arquitetura até os Deploys de nuvem, passando por infraestruturas robustas, otimização Visual e SEO.
Sinta-se à vontade para auditar as queries ou testar a interatividade da Dashboard.

**Lumina Integration Engine — TLS 1.3**
