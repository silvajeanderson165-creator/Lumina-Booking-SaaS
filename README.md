# 🌌 Lumina Analytics Engine
**Plataforma B2B de Inteligência Financeira e Churn Prediction**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

> **🟢 LIVE DEMO:** [Acesse o Lumina Ao Vivo Aqui](https://marketing-site-black-pi.vercel.app)

<div align="center">
  <video src="assets/demo-lumina.mp4" autoplay loop muted playsinline width="100%"></video>
</div>

---

## 🛑 O Problema
Plataformas SaaS corporativas costumam sofrer com severos gargalos no banco de dados quando tentam calcular métricas financeiras complexas (MRR, LTV e Churn Rate) em tempo real. Lidar simultaneamente com milhares de assinaturas ativas de dezenas de empresas diferentes (Tenants) costuma travar a API ou gerar respostas extremamente lentas para o Frontend.

## ✅ A Solução (Lumina)
O Lumina Analytics é um motor avançado de métricas financeiras B2B desenhado para **processamento massivo e isolamento de dados**. 

Ele resolve o problema de performance delegando os cálculos pesados diretamente para a fonte da verdade (PostgreSQL), gerenciando o tráfego via filas assíncronas (Celery/Redis) e entregando para o Frontend apenas os bytes estritamente necessários através de uma API GraphQL otimizada. Tudo isso embalado numa interface luxuosa e rigorosa batizada de *Midnight Luxe*.

---

## 🧠 Maior Desafio Técnico Superado
**Garantir precisão e alta performance em Testes de Estresse com carga massiva.**
O backend foi preparado e populado com dezenas de milhares de registros falsos mapeados via Python Faker. Para que a API não caísse ao processar esses dados, implementei duas estratégias cruciais:
1. **Otimização no Banco:** O uso de operações como `DATE_TRUNC` e `GROUP BY` diretamente na query do PostgreSQL, poupando a API (Python/Django) de ter que iterar sobre milhares de objetos em memória.
2. **Data Fetching sem Payload Cego:** Utilização do GraphQL para eliminar o *over-fetching*. O Dashboard pede e a rede trafega **exatamente** os campos que vão ser renderizados na tela, garantindo um carregamento instantâneo no frontend.

---

## ✨ Principais Funcionalidades

- **Dashboard Financeiro (Midnight Luxe):** Interface rica com Glassmorphism, totalmente responsiva e guiada por animações suaves que compila dados complexos (Receita Ativa vs Perdida).
- **Segregação B2B por Tenant:** Dados de clientes isolados de forma segura através de Tenant UUIDs.
- **Integração Real-Time (Mock/Showcase):** Mostruário de arquitetura para ingestão de dados em nuvem (Stripe, Hotmart) protegido por Webhooks e Handshakes.
- **Autenticação Segura JWT:** Regras rigorosas de segurança impedindo travessias (Directory Traversal) e protegendo a integridade das chamadas de API.

---

## 🛠️ Stack Tecnológico & Arquitetura

O ecossistema Lumina segue uma rígida Arquitetura de 3 Camadas inspirada nos protocolos construtivos A.N.T e V.L.A.E.G:

### 1. Frontend (CDN Vercel / Edge Network)
- **Framework:** React 19 + TypeScript + Vite.
- **Estilização & UI:** TailwindCSS Customizado e Animações fluidas com Framer Motion. Visual rico guiado por Design Tokens (Hex: `#A020F0`, `#00FFFF`).
- **Comunicação:** Chamadas encapsuladas e diretas à rota segura do Graphene (GraphQL).

### 2. Backend (Docker + AWS EC2 / DigitalOcean)
- **Motor Lógico:** Python 3.11+ e Django 5.
- **API Engine:** Graphene-Django para expor o schema GraphQL.
- **Processamento Assíncrono:** Fila de processamento com Celery e Redis para garantir que ingestões massivas não travem a thread principal da API.
- **Gateway & Orquestração:** Docker Compose fortificando as camadas de web e db, mapeando as portas internas numa sub-rede selada (bridge). O banco de dados é impenetrável por vias externas diretas.

### 3. Banco de Dados (Fonte da Verdade)
- **PostgreSQL 15:** Mantém a integridade transacional do sistema (Subscriptions, Auth) e realiza cálculos em tempo real.

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
```
> Acesse: `http://localhost:5173`

### 3. Rodando o Backend (Docker)
Na raiz do projeto, suba a infraestrutura completa de contêineres:
```bash
docker-compose up -d --build
```

Caso queira popular o banco com dados massivos para o teste de estresse:
```bash
docker-compose exec web python backend/manage.py migrate
docker-compose exec web python backend/seed_subscriptions.py
```
> Acesse a API GraphQL em: `http://localhost:8000/graphql`

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

## 👑 Autor

**Jeanderson Silva** 🤓✍️

*Desenvolvedor Full-Stack | Engenheiro Frontend | Arquiteto de Software*

Construído desde o mapeamento de arquitetura de dados massivos (PostgreSQL + GraphQL) até a orquestração de contêineres Docker em nuvem, passando por pipelines CI/CD automatizados e uma interface analítica de nível corporativo.

Sinta-se à vontade para auditar as queries GraphQL, explorar a lógica de processamento no banco relacional ou testar a interatividade do Dashboard ao vivo!
