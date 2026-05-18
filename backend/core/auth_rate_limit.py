"""
Rate limit para mutations de autenticação.

Mitiga brute force em `tokenAuth` (item 7 do AUDIT_CHECKLIST.md, achado
crítico #6 da auditoria 2026-05-17).

⚠️ LIMITAÇÃO CONHECIDA (item E6 do CONTEXT_ADDONS.md):
   O backend de cache padrão do Django (`locmem`) é **por processo**.
   Com gunicorn rodando 3 workers, o limite efetivo é 3× o configurado.
   Para single-instance demo, é aceitável. Antes de escalar horizontalmente,
   trocar `CACHES` em `settings.py` para Redis — assim o contador vira
   compartilhado entre workers/instâncias.
"""
from __future__ import annotations

from django.core.cache import cache
from graphql import GraphQLError
import graphql_jwt


# ───────────────────────────────────────────────────────────────────────────────
# Configuração — ajustar conforme padrão real de uso.
# ───────────────────────────────────────────────────────────────────────────────
RATE_LIMIT_WINDOW_SECONDS = 60  # janela de 1 minuto
RATE_LIMIT_MAX_ATTEMPTS = 10    # máximo 10 tentativas / IP / janela


def _client_ip(request) -> str:
    """
    Extrai o IP confiável do cliente.

    ⚠️ Auditoria 2026-05-18, crítico #1 (item 23B novo): NÃO ler `X-Forwarded-For`
    cru — qualquer atacante pode mandar `curl -H 'X-Forwarded-For: 1.2.3.4' ...`
    e zerar o rate limit a cada request. Bug clássico de "rate limit que parece
    funcionar mas é teatro".

    Estratégia correta com Caddy como único proxy:
      - Caddy injeta `X-Real-IP` com o IP do cliente direto (não-fakeável porque
        Caddy é o ponto de entrada — sobrescreve qualquer X-Real-IP que venha
        do cliente).
      - Em dev (sem proxy), cai no REMOTE_ADDR.

    Quando adicionar CDN na frente do Caddy (Cloudflare, etc.), trocar para o
    header específico do CDN (`CF-Connecting-IP` no caso da Cloudflare) — esses
    headers também não são fakeáveis porque o CDN sobrescreve.
    """
    # Caddy seta X-Real-IP confiável (ver infra/Caddyfile). Cliente NÃO consegue forjar.
    real_ip = request.META.get("HTTP_X_REAL_IP")
    if real_ip:
        return real_ip.strip()
    # Sem proxy (dev local) — REMOTE_ADDR é o IP direto do cliente.
    return request.META.get("REMOTE_ADDR", "unknown")


class RateLimitedObtainJSONWebToken(graphql_jwt.ObtainJSONWebToken):
    """
    `tokenAuth` com rate limit por IP.

    A contagem incrementa em CADA tentativa (sucesso ou falha) — não distingue
    entre os dois propositalmente, para não vazar se o usuário existe via
    timing de "tentativas restantes". Isso casa com a defesa do item 6C
    (comparações tempo-constante).
    """

    @classmethod
    def mutate(cls, root, info, **kwargs):  # noqa: D401
        ip = _client_ip(info.context)
        cache_key = f"tokenauth_attempts:{ip}"
        attempts = cache.get(cache_key, 0)

        if attempts >= RATE_LIMIT_MAX_ATTEMPTS:
            raise GraphQLError(
                "Muitas tentativas de login. Tente novamente em alguns minutos."
            )

        # Incrementa ANTES de tentar autenticar — protege também contra
        # falhas lentas (queries de senha custosas com bcrypt/argon2).
        cache.set(cache_key, attempts + 1, timeout=RATE_LIMIT_WINDOW_SECONDS)

        return super().mutate(root, info, **kwargs)
