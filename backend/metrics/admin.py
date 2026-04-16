from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'plan_name', 'amount_cents', 'status', 'start_date', 'canceled_at')
    list_filter = ('status', 'plan_name')
