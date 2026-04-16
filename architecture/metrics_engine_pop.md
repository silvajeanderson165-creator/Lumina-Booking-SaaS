# Procedimento Operacional Padrão (POP): Motor Analítico (Metrics Engine)

## 1. Visão Geral
Este POP consolida o determinismo lógico por trás do Motor Analítico (Analytics Engine). Ele rege os processamentos em Camada 3 (`backend/metrics/schema.py`) das medições de: MRR, Voluntary Churn, Involuntary Churn e True LTV.

## 2. Estrutura de Retenção de Dados: Modelo `Subscription`
Assinaturas representadas no PostgreSQL contém o status (`active`, `canceled`, `past_due`).
Novidade: `cancel_reason` permite fracionamento inteligente do Churn:
- **Voluntary Churn**: `cancel_reason` = `'voluntary_cancel'` (o cliente cancelou por vontade própria).
- **Involuntary Churn**: `cancel_reason` em `['involuntary_fraud', 'involuntary_card_declined']` (cancelamento devido a falha técnica ou estorno).

## 3. Lógica Determinística

### 3.1 MRR (Monthly Recurring Revenue)
Agregações por período dependem do status ativo na data solicitada, ou de uma visão contínua usando Window Functions / Aggregation onde `status='active'`.
**Premissa:** Soma simples do `amount_cents` das assinaturas cujo status é 'active'.

### 3.2 Churn Rate Segmentado
**Fórmula de Churn Genérica:** (Assinaturas perdidas no período / Assinaturas ativas no inicio do período).
No Django:
- Count de assinaturas cujo `cancel_reason` é "voluntary" vs "involuntary".
- Exibimos os dois vazamentos separadamente no Dashboard. O Churn Rate total soma ambos.

### 3.3 LTV (Life Time Value) c/ True LTV
O LTV baseia-se no MRR e Churn, indicando quanto dinheiro o cliente deixa ao longo do tempo.
**O cálculo tradicional do ARPA** = MRR Atual / Total de Clientes Ativos
**Cálculo do True LTV (Com Margem Grossa Teórica)**: (ARPA * Gross_Margin) / Customer_Churn_Rate
*Premissa:* Usaremos `Gross_Margin` de 0.82 (82%, comum em SaaS com baixos custos de infra vs software).

### 4. Engine Core em PostgreSQL 
Devido a alta variabilidade de >20.000 clientes em 3 anos, NÃO devemos utilizar laços imperativos (for loops) via Python. A arquitetura exige `django.db.models` em conjunção de funções de agregação massivas (`Sum`, `Count`, `Case`, `When`) convertidas puramente em queries SQL pelo GraphQL engine.
