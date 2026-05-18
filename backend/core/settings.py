"""
Django settings for core project.
═══════════════════════════════════════════════════════
🛡️ PROTOCOLO DE SEGURANÇA ENTERPRISE — LUMINA ANALYTICS
═══════════════════════════════════════════════════════
"""
import os
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ═══════════════════════════════════════════════════════
# 🔐 CAMADA 1: CHAVES E MODO DE EXECUÇÃO
# ═══════════════════════════════════════════════════════

# [SEGURANÇA] SECRET_KEY sem fallback — crashar se não existir é o comportamento correto
SECRET_KEY = os.environ.get('SECRET_KEY', os.environ.get('DJANGO_SECRET_KEY'))
if not SECRET_KEY:
    raise ValueError("[SEGURANÇA] SECRET_KEY não definida! Configure no .env ou variável de ambiente.")

# [SEGURANÇA] DEBUG forçado False em produção
DEBUG = os.environ.get('DEBUG', '0') == '1'

# [SEGURANÇA] ALLOWED_HOSTS restrito — NUNCA usar ['*'] em produção
ALLOWED_HOSTS = os.environ.get(
    'ALLOWED_HOSTS',
    'localhost,127.0.0.1,marketing-site-black-pi.vercel.app'
).split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'corsheaders',
    'graphene_django',
    
    # Local
    'metrics',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# ═══════════════════════════════════════════════════════
# 🛡️ CAMADA 3: CORS RESTRITO
# ═══════════════════════════════════════════════════════

# [SEGURANÇA] CORS restrito — aceita APENAS origens autorizadas
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ORIGINS',
    'http://localhost:5173,http://localhost:3000,https://marketing-site-black-pi.vercel.app'
).split(',')
CORS_ALLOW_CREDENTIALS = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'lumina_analytics'),
        'USER': os.environ.get('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'postgres_password'),
        'HOST': os.environ.get('POSTGRES_HOST', 'db'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ═══════════════════════════════════════════════════════
# 🛡️ CAMADA 4: HEADERS HTTP DE SEGURANÇA
# ═══════════════════════════════════════════════════════

# [SEGURANÇA] XSS Protection
SECURE_BROWSER_XSS_FILTER = True

# [SEGURANÇA] Impede Content-Type Sniffing
SECURE_CONTENT_TYPE_NOSNIFF = True

# [SEGURANÇA] X-Frame-Options — Impede clickjacking (iframes maliciosos)
X_FRAME_OPTIONS = 'DENY'

# [SEGURANÇA] HSTS — Força HTTPS por 1 ano
if not DEBUG:
    SECURE_HSTS_SECONDS = 31536000  # 1 ano
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

    # Reconhece o terminador TLS upstream (Caddy em docker-compose.prod.yml).
    # Caddy seta X-Forwarded-Proto=https quando o request chega via TLS.
    # Sem isso + SECURE_SSL_REDIRECT=True, o Django entraria em loop de redirect
    # (auditoria 2026-05-17, crítico #10 + Sessão 5 item 10).
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# [SEGURANÇA] SameSite explícito para cookies — mitiga CSRF.
# 'Strict' = nunca enviado em navegação cross-site (proteção máxima).
# Usar 'Lax' apenas se houver fluxo legítimo de navegação cross-site (ex: OAuth callback).
# Auditoria 2026-05-17, item 17 da Sessão 1: defaults do Django não são suficientes para postura "enterprise".
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SAMESITE = 'Strict'

# ═══════════════════════════════════════════════════════
# 🔐 CAMADA 2: JWT CONFIGURATION (GraphQL)
# ═══════════════════════════════════════════════════════

# Configurando o GraphQL Graphene
GRAPHENE = {
    'SCHEMA': 'core.schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

# [SEGURANÇA] JWT — expiração curta + allowlist explícita de algoritmo.
# Auditoria 2026-05-17, item 6B do checklist universal:
#   - JWT_ALGORITHM explícito (HS256) — rejeita alg: none e algorithm confusion attacks.
#   - JWT_LEEWAY zerado (sem tolerância de tempo na verificação de exp).
#   - JWT_AUDIENCE não usado aqui — adicionar quando houver múltiplos serviços validando.
# TODO (Sessão futura): substituir django-graphql-jwt==0.3.4 (lib abandonada, último release 2020)
# por strawberry-django ou JWT próprio. Crítico #11 da auditoria 2026-05-17.
GRAPHQL_JWT = {
    'JWT_ALGORITHM': 'HS256',
    'JWT_EXPIRATION_DELTA': timedelta(minutes=15),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
    'JWT_VERIFY': True,
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LEEWAY': 0,
}

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]
