import graphene
from datetime import datetime
from django.db.models import Sum, Q
from django.db.models.functions import TruncDay
from graphene_django.types import DjangoObjectType
from .models import Subscription

class SummaryMetrics(graphene.ObjectType):
    mrr = graphene.Float()
    churn_rate = graphene.Float()
    voluntary_churn = graphene.Float()
    involuntary_churn = graphene.Float()
    ltv = graphene.Float()

class TimelineMetric(graphene.ObjectType):
    date = graphene.String()
    mrr_value = graphene.Float()
    churned_amount = graphene.Float()

class DashboardMetricsResponse(graphene.ObjectType):
    summary = graphene.Field(SummaryMetrics)
    timeline = graphene.List(TimelineMetric)

class Query(graphene.ObjectType):
    dashboard_metrics = graphene.Field(
        DashboardMetricsResponse,
        start_date=graphene.String(required=True),
        end_date=graphene.String(required=True)
    )

    def resolve_dashboard_metrics(self, info, start_date, end_date):
        dt_start = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        dt_end = datetime.fromisoformat(end_date.replace("Z", "+00:00"))

        base_qs = Subscription.objects.filter(start_date__lte=dt_end)
        
        # ACTIVE AT END OF PERIOD:
        active_qs = base_qs.filter(Q(status='active') | Q(canceled_at__gt=dt_end))
        
        mrr = active_qs.aggregate(total=Sum('amount_cents'))['total'] or 0
        active_count = active_qs.count()
        
        # CANCELED WITHIN PERIOD
        canceled_qs = base_qs.filter(
            status='canceled', 
            canceled_at__gte=dt_start, 
            canceled_at__lte=dt_end
        )
        
        vol_count = canceled_qs.filter(cancel_reason__in=['voluntary_cancel']).count()
        invol_count = canceled_qs.filter(cancel_reason__in=['involuntary_fraud', 'involuntary_card_declined']).count()
        total_canceled = vol_count + invol_count
        
        total_customers = active_count + total_canceled
        
        if total_customers > 0:
            churn_rate = (total_canceled / total_customers) * 100
            voluntary_churn = (vol_count / total_customers) * 100
            involuntary_churn = (invol_count / total_customers) * 100
        else:
            churn_rate = 0.0
            voluntary_churn = 0.0
            involuntary_churn = 0.0

        # LTV calculation: (ARPA * Gross_Margin) / Customer_Churn_Rate
        gross_margin = 0.82
        actual_churn_rate_decimal = churn_rate / 100.0 if churn_rate > 0 else 0.01 
        
        if active_count > 0:
            arpa = mrr / active_count
            ltv = (arpa * gross_margin) / actual_churn_rate_decimal
        else:
            arpa = 0
            ltv = 0
        
        # TIMELINE Calculation
        new_mrr_daily = base_qs.filter(
            start_date__gte=dt_start, start_date__lte=dt_end
        ).annotate(
            day=TruncDay('start_date')
        ).values('day').annotate(
            mrr_added=Sum('amount_cents')
        ).order_by('day')
        
        churn_daily = canceled_qs.annotate(
            day=TruncDay('canceled_at')
        ).values('day').annotate(
            mrr_churned=Sum('amount_cents')
        ).order_by('day')
        
        timeline_dict = {}
        for entry in new_mrr_daily:
            if not entry['day']: continue
            day_str = entry['day'].strftime('%Y-%m-%d')
            timeline_dict.setdefault(day_str, {'mrr_value': 0, 'churned_amount': 0})
            timeline_dict[day_str]['mrr_value'] += entry['mrr_added']
            
        for entry in churn_daily:
            if not entry['day']: continue
            day_str = entry['day'].strftime('%Y-%m-%d')
            timeline_dict.setdefault(day_str, {'mrr_value': 0, 'churned_amount': 0})
            timeline_dict[day_str]['churned_amount'] += entry['mrr_churned']
            
        timeline_list = []
        for day_str in sorted(timeline_dict.keys()):
            timeline_list.append(TimelineMetric(
                date=day_str,
                mrr_value=timeline_dict[day_str]['mrr_value'] / 100.0,
                churned_amount=timeline_dict[day_str]['churned_amount'] / 100.0
            ))

        return DashboardMetricsResponse(
            summary=SummaryMetrics(
                mrr=mrr / 100.0,
                churn_rate=churn_rate,
                voluntary_churn=voluntary_churn,
                involuntary_churn=involuntary_churn,
                ltv=ltv / 100.0
            ),
            timeline=timeline_list
        )
