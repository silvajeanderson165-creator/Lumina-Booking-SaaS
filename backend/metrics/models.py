import uuid
from django.db import models


class Subscription(models.Model):
    """
    Modelo de assinatura.

    ⚠️ DÍVIDA CONCEITUAL CONHECIDA (auditoria 2026-05-18, achado novo #C):
    `customer_id` é gerado aleatório a CADA assinatura — não há entidade `Customer`
    e duas assinaturas do mesmo cliente real ficariam como `customer_id` distintos.
    Isso afeta a correção de cálculos analíticos:
      - **Churn**: clientes que cancelam e voltam contam como 2 clientes diferentes.
      - **LTV (Lifetime Value)**: não é possível somar receita por cliente real.
      - **Cohort analysis**: agregação por mês de aquisição fica incorreta.

    Hoje aceitável porque os dados são 100% sintéticos (Faker) — não há "cliente real"
    a respeitar. Quando multi-tenant chegar (ADR-001), introduzir entidade `Customer`
    com FK em `Subscription` e migration de backfill.

    Ver: docs/AUDIT_REPORT_2026-05-18.md, docs/adr/ADR-001-multi-tenant-fora-de-escopo.md.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_id = models.UUIDField(default=uuid.uuid4)
    plan_name = models.CharField(max_length=100)  # Starter, Pro, Enterprise
    amount_cents = models.IntegerField()
    status = models.CharField(max_length=20)  # active, canceled, past_due
    start_date = models.DateTimeField()
    canceled_at = models.DateTimeField(null=True, blank=True)
    # voluntary_cancel, involuntary_fraud, involuntary_card_declined
    cancel_reason = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.plan_name} - {self.status}"
