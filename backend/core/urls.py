"""
URL configuration for core project.
═══════════════════════════════════════════════════════
🛡️ PROTOCOLO DE SEGURANÇA — ROTAS
═══════════════════════════════════════════════════════
"""
import os

from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from core.graphql_security import SecureGraphQLView

# [SEGURANÇA] GraphiQL (interface interativa) desabilitado em produção.
# Em produção, a API aceita apenas queries programáticas.
is_debug = os.environ.get("DEBUG", "0") == "1"

# [SEGURANÇA] SecureGraphQLView aplica:
#   - Depth limit (J2) — bloqueia queries aninhadas demais.
#   - Alias limit (J3) — mitiga bypass de rate limit via aliasing.
#   - Introspecção off em produção (J1) — atacante não recebe o schema.
#   - Batching HTTP off (J4) — múltiplas queries em 1 request rejeitadas.
# Ver auditoria 2026-05-17, Sessão 3, críticos #2 e #3.
#
# ⚠️ DÍVIDA TÉCNICA RECONHECIDA (auditoria 2026-05-18, discrepância #2):
# `csrf_exempt` está aplicado porque a auth atual é via JWT no header
# Authorization (não via cookie de sessão Django). Hoje é seguro — atacante
# não consegue forçar request cross-site com o JWT certo no header.
#
# Quando alguma das condições abaixo acontecer, REMOVER csrf_exempt e
# implementar CSRF via header X-CSRFToken para mutations:
#   - Multi-tenant chegar (ADR-001) → começa a usar sessão Django
#   - Migrar JWT para cookie httpOnly (ADR-002 expira) → cookie automático = CSRF possível
#   - Adicionar qualquer mutation que mude estado e seja chamada via cookie
#
# Ver THREAT_MODEL.md → seção "Riscos residuais conhecidos".
urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql", csrf_exempt(SecureGraphQLView.as_view(graphiql=is_debug))),
]
