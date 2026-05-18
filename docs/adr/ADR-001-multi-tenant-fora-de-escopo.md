# ADR-001 — Multi-tenant fora de escopo (versão de portfólio)

> **Status:** Aceito (versão de portfólio) — revisitar antes do primeiro tenant pagante.
> **Data:** 2026-05-17
> **Contexto:** auditoria 2026-05-17, achado crítico originalmente classificado como "zero isolamento entre tenants", reposicionado para "decisão consciente de escopo" após confirmação do autor.
> **Relacionado:** [ADR-002](ADR-002-token-storage.md), [THREAT_MODEL.md](../THREAT_MODEL.md), [AUDIT_REPORT_2026-05-17.md](../AUDIT_REPORT_2026-05-17.md).

---

## Contexto

O README descreve o Lumina como "plataforma B2B com isolamento de dados por Tenant UUIDs". A auditoria 2026-05-17 encontrou:

- `metrics/models.py` — modelo `Subscription` tem apenas `customer_id = UUIDField(default=uuid.uuid4)` solto, **sem ForeignKey para User ou Tenant**.
- `metrics/schema.py` resolver `dashboard_metrics` usa `Subscription.objects.filter(start_date__lte=dt_end)` — **sem filtro de dono ou tenant**.
- Resultado: qualquer usuário autenticado lê MRR/churn/LTV agregados de toda a base.

Isto seria "zero isolamento entre tenants" — bug crítico de IDOR em qualquer SaaS B2B real.

## Decisão

**Não implementar multi-tenant nesta versão.** Posicionar o Lumina explicitamente como **demo de portfólio (prévia)** no README e documentar a decisão como ADR rastreável.

## Por que aceitar essa lacuna agora

1. **Custo operacional inviável para um projeto-demo.** Implementar multi-tenant corretamente exige:
   - Modelo `Tenant` + ForeignKey em todas as entidades.
   - Onboarding (criar tenant, convidar membros).
   - **Integração real de pagamento recorrente** (Stripe/MercadoPago) — porque um tenant que não paga não é tenant, é fraude.
   - Cobrança de mensalidade, gateway de pagamento, gestão de inadimplência.
   - Infraestrutura de cobrança gera custo operacional contínuo (fees do Stripe, conta jurídica para emissão de notas, etc.).

   Para um projeto cujo único objetivo é mostrar competência técnica em entrevista, esse custo é injustificável.

2. **Os dados são 100% sintéticos.** O `seed_subscriptions.py` popula o banco com 25.000 registros gerados pelo `Faker`. Não há cliente real, não há PII real, não há transação financeira real. O "vazamento entre tenants" não vaza nada de verdade.

3. **A demo é declaradamente pública.** O `Login.tsx:35` tem um "modo portfólio" que cria conta sem credencial. Qualquer visitante entra. Discutir "isolamento entre tenants" num contexto onde qualquer um pode logar é discutir um problema que não existe.

4. **A arquitetura está pronta para receber multi-tenant.** Adicionar `tenant = models.ForeignKey(Tenant, on_delete=models.PROTECT)` em `Subscription` + middleware que injeta `filter(tenant=request.user.tenant)` automaticamente é trabalho de horas, não semanas. A pendência é decisão de produto/financeira, não dívida técnica.

## Por que era um problema crítico no README

O problema **real** identificado pela auditoria não era a ausência de multi-tenant em si, mas o fato de o **README descrever a feature como entregue** ("Segregação B2B por Tenant: Dados de clientes isolados de forma segura através de Tenant UUIDs"). Esse texto leva o leitor honesto a ler o código esperando ver isolamento — não vê — e conclui que o README mente.

A correção foi reescrever a seção "Escopo desta versão" do README deixando explícito o que está e o que não está implementado. Após essa correção, a postura passa de "marketing acima da realidade" para "demo honesta com roadmap claro".

## Quando revisitar

Esta decisão **expira** quando qualquer um dos seguintes acontecer:

- [ ] **Primeiro tenant pagante real.** Qualquer cobrança recorrente real exige multi-tenant antes do onboarding.
- [ ] Integração de pagamento real (Stripe/MercadoPago) implementada e funcional.
- [ ] Saída do estágio de "versão de portfólio" declarada no README.
- [ ] Início de coleta de qualquer PII real (login com email real, dados pessoais).
- [ ] Qualquer auditoria externa exigir isolamento por compliance (LGPD/GDPR aplicado em escala).

Quando disparar, implementar **em PR dedicado** antes de qualquer cliente real onboardar:

1. Modelo `Tenant` com membership.
2. `ForeignKey` em todas as entidades de negócio (`Subscription`, futuras tabelas).
3. Manager do Mongoose/QuerySet wrapper que injeta `filter(tenant=request.user.tenant)` em TODAS as queries automaticamente.
4. Middleware que rejeita acesso cross-tenant (`payload.tenant_id != request.user.tenant_id → 403`).
5. Teste adversarial: "usuário A não vê dados de tenant B → 403" como gate de CI.
6. Backfill dos dados existentes (atribuir tenant aos registros que tinham `customer_id` solto).

## Trade-offs assumidos

| O que se ganha | O que se perde |
|---|---|
| Demo enxuta, focada em mostrar engenharia (GraphQL, métricas em PostgreSQL, dashboard React) | Item 2 e seção D do checklist universal permanecem em "Opção 1" — auditoria fica sempre com esse débito declarado |
| Sem custo operacional de gateway de pagamento | Não dá pra usar o Lumina como "produto pronto" — só como demo |
| Tempo de desenvolvimento focado em features de alta visibilidade (dashboard, animações) | Recrutador que não ler `docs/` pode confundir a postura honesta com "não sabe fazer multi-tenant" |

## Alternativas consideradas

- **Implementar multi-tenant sem pagamento real (cadastro manual de tenants):** rejeitado por adicionar complexidade significativa sem demonstrar nada de novo — multi-tenant sem cobrança é só "users com namespacing", não vende o projeto.
- **Remover a menção a Tenant do README e fingir que nunca foi planejado:** rejeitado por ser desonesto e por descartar uma decisão de arquitetura legítima — melhor manter como roadmap explícito.
- **Implementar multi-tenant inteiro com Stripe sandbox:** considerado, mas pesa 2-3 semanas de dev em refactor que cruza todos os módulos. Postergado até haver demanda real.

## Referências

- [README.md → "Escopo desta versão"](../../README.md)
- [AUDIT_REPORT_2026-05-17.md](../AUDIT_REPORT_2026-05-17.md) — achado original e reposicionamento como decisão consciente.
- [THREAT_MODEL.md](../THREAT_MODEL.md) — onde esse risco aceito aparece explicitamente.
- `AUDIT_CHECKLIST.md` (Protocolo de Segurança) — itens 2, 19 e Seção D (Multi-tenant).
