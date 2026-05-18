# syntax=docker/dockerfile:1.7
#
# Dockerfile multi-stage para o backend Django/Graphene.
# Auditoria 2026-05-17, crítico #9 (Sessão 5, item 8):
#   - Single-stage virou multi-stage (toolchain de build fora da imagem final).
#   - USER appuser (não-root) em runtime.
#   - HEALTHCHECK explícito.
#   - .dockerignore complementa este arquivo evitando copiar .env, .git, __pycache__.

# ───────────────────────────────────────────────────────────────────────────────
# Stage 1 — builder: compila as wheels com toolchain completa.
# ───────────────────────────────────────────────────────────────────────────────
FROM python:3.14-alpine AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Dependências de build (gcc, libpq, etc.) — ficam SÓ neste stage.
RUN apk add --no-cache \
    postgresql-dev \
    gcc \
    python3-dev \
    musl-dev \
    g++ \
    libffi-dev

COPY requirements.txt .

# Compila wheels que serão copiadas pro stage runtime.
RUN pip install --upgrade pip && \
    pip wheel --no-cache-dir --wheel-dir /build/wheels -r requirements.txt


# ───────────────────────────────────────────────────────────────────────────────
# Stage 2 — runtime: imagem mínima, sem toolchain, com user não-root.
# ───────────────────────────────────────────────────────────────────────────────
FROM python:3.14-alpine AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

# Apenas libs de RUNTIME (não compilador). libpq pra psycopg2 funcionar.
RUN apk add --no-cache libpq curl

# Cria user não-root.
RUN addgroup -S app && adduser -S -G app -h /app app

WORKDIR /app

# Copia wheels do builder e instala (sem rede, sem toolchain).
COPY --from=builder /build/wheels /wheels
COPY requirements.txt .
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    rm -rf /wheels

# Copia o código (respeitar .dockerignore para NÃO trazer .env, .git, __pycache__).
COPY --chown=app:app . /app/

# Permissões mínimas — usuário não-root daqui em diante.
USER app

# Healthcheck — bate em /admin/login/ (rota leve garantida pelo Django).
# Quando houver /health/ready dedicado, trocar.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -fsS http://localhost:${PORT}/admin/login/ || exit 1

EXPOSE 8000

# Default: gunicorn de produção. Compose dev sobrescreve com runserver.
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--threads", "2"]
