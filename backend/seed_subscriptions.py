import sys
import os
import random
from datetime import timedelta, datetime
import django

# Setup Django Context
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from metrics.models import Subscription
from faker import Faker

fake = Faker()

def run():
    print("Iniciando o Seeder Massivo de Subscriptions (O Teste de Fogo)...")
    
    # Parâmetros
    TOTAL_RECORDS = 25000
    START_DATE_LIMIT = datetime(2023, 1, 1) # ~3 years ago
    END_DATE_LIMIT = datetime(2026, 4, 15)
    
    # Limpar banco
    print("Limpando banco de dados...")
    Subscription.objects.all().delete()
    
    print(f"Gerando {TOTAL_RECORDS} inscrições...")
    
    plans = [
        {"name": "Starter", "price": 2900, "weight": 60},
        {"name": "Pro", "price": 9900, "weight": 30},
        {"name": "Enterprise", "price": 29900, "weight": 10}
    ]
    
    plan_population = []
    for p in plans:
        plan_population.extend([p] * p['weight'])

    batch = []
    batch_size = 5000

    for i in range(TOTAL_RECORDS):
        plan = random.choice(plan_population)
        
        # Random start date between Jan 2023 and Apr 2026
        start_date = fake.date_time_between(start_date=START_DATE_LIMIT, end_date=END_DATE_LIMIT)
        
        # Decide if active or canceled
        is_canceled = random.random() < 0.45 # 45% do histórico será churn
        
        status = 'active'
        canceled_at = None
        cancel_reason = None
        
        if is_canceled:
            status = 'canceled'
            # Canceled between start_date and END_DATE_LIMIT
            canceled_at = fake.date_time_between(start_date=start_date, end_date=END_DATE_LIMIT)
            
            # Sub-divide cancel_reason (Voluntary vs Involuntary)
            # 70% voluntary, 30% involuntary (fraud, declined)
            if random.random() < 0.70:
                cancel_reason = 'voluntary_cancel'
            else:
                cancel_reason = random.choice(['involuntary_fraud', 'involuntary_card_declined'])

        sub = Subscription(
            customer_id=fake.uuid4(),
            plan_name=plan['name'],
            amount_cents=plan['price'],
            status=status,
            start_date=start_date,
            canceled_at=canceled_at,
            cancel_reason=cancel_reason
        )
        batch.append(sub)
        
        if len(batch) >= batch_size:
            Subscription.objects.bulk_create(batch)
            print(f"{i+1} registros inseridos...")
            batch = []

    # Final batch
    if batch:
        Subscription.objects.bulk_create(batch)
        print(f"{TOTAL_RECORDS} registros inseridos com sucesso!")

    print("Seeding concluído!")

if __name__ == "__main__":
    run()
