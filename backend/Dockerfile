FROM python:3.11-alpine

# Impedir criar arquivos .pyc e manter logs abertos
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instalar libs do sistema essenciais para bancos SQL e analíticos (Pandas/Psycopg2)
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev g++ libffi-dev

COPY requirements.txt /app/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app/
