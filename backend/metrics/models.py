import uuid
from django.db import models

class Subscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_id = models.UUIDField(default=uuid.uuid4)
    plan_name = models.CharField(max_length=100) # Starter, Pro, Enterprise
    amount_cents = models.IntegerField()
    status = models.CharField(max_length=20) # active, canceled, past_due
    start_date = models.DateTimeField()
    canceled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.CharField(max_length=50, null=True, blank=True) # voluntary_cancel, involuntary_fraud, involuntary_card_declined

    def __str__(self):
        return f"{self.plan_name} - {self.status}"
