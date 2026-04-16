"""
Camada 3 (Gatilho) - maintenance_cron.py
Este script define um gatilho autônomo (G) da Arquitetura VLAEG.
Ele deve ser injetado num crontab dentro do servidor de Produção (ex: EC2/Droplet)
ou configurado como uma task celery.

Objetivo:
Manutenção Autorregenerativa do Banco de Dados.
Varre o PostgreSQL por assinaturas inativas (`involuntary_fraud`) com mais de 30 dias 
para aplicar Hard Delete garantindo que "lixo analítico" não exploda os custos da nuvem.
"""
import os
import sys

# Mapeia o contexto do Django para este script standalone rodar via cron no Docker.
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from datetime import timedelta
from django.utils import timezone
from metrics.models import Subscription

def purge_old_fraud_data():
    """
    Limpa o DB de chruns involuntarios velhos que não têm mais valor analítico
    depois que um ano (365 dias) se passa, salvando disco da instância livre.
    """
    print("[CRON] Iniciando limpeza de dados mortos/involuntários...")
    
    threshold_date = timezone.now() - timedelta(days=365)
    
    dead_profiles = Subscription.objects.filter(
        status='canceled',
        cancel_reason='involuntary_fraud',
        canceled_at__lte=threshold_date
    )
    
    total_to_delete = dead_profiles.count()
    
    if total_to_delete > 0:
        dead_profiles.delete()
        print(f"[CRON-SUCCESS] Expurgados {total_to_delete} registros inativos. Disco Poupoado.")
    else:
        print("[CRON-INFO] O banco de dados está limpo. Zero perfis mortos acima de 365 dias encontrados.")

if __name__ == '__main__':
    purge_old_fraud_data()
