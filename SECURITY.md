# Política de Segurança

> Versão de portfólio — ver `README.md` seção "Escopo desta versão".

## Versões suportadas

Este projeto está em estágio de **portfólio (prévia)**. Não há versionamento semântico estável e não há promessa de SLA. A `main` é a única versão suportada.

| Versão | Suporte |
|--------|---------|
| `main` | ✅ Última auditoria: 2026-05-17 ([relatório](docs/AUDIT_REPORT_2026-05-17.md)) |
| Outros branches | ❌ Não suportados |

## Reportando uma vulnerabilidade

Se você encontrou um problema de segurança neste projeto:

1. **NÃO abra uma issue pública.** Vulnerabilidades reportadas publicamente antes da correção ficam expostas para qualquer pessoa.
2. **Use [GitHub Security Advisories](https://github.com/jeanderson-silva8/Lumina-Booking-SaaS/security/advisories/new)** (preferido) ou envie email para `silvajeanderson165@gmail.com`.
3. Inclua no relatório:
   - Descrição do problema.
   - Passos para reproduzir (com PoC se possível).
   - Versão/commit afetado.
   - Impacto estimado.

## SLA de resposta

Como projeto de portfólio mantido individualmente:

- **Resposta inicial:** até 7 dias úteis.
- **Triagem completa:** até 14 dias.
- **Correção:** depende da severidade — críticos em até 30 dias; outros conforme prioridade.

Após a correção, posso reconhecer a contribuição publicamente no commit/PR se você desejar.

## Escopo

**Dentro do escopo:**
- Backend Django/Graphene (`backend/`)
- Frontend React/Vite (`frontend/`)
- Marketing-site (`marketing-site/`)
- Configurações de orquestração (`docker-compose.*.yml`, `Dockerfile`, `infra/`)
- Workflows CI/CD (`.github/workflows/`)

**Fora do escopo:**
- Dependências de terceiros (reportar diretamente aos mantenedores).
- Infraestrutura do provedor (Vercel, AWS/Droplet) — reportar ao provedor.
- Features ainda não implementadas listadas em "Escopo desta versão" do README — não dá pra ter vulnerabilidade no que não existe.

## Histórico de auditorias

| Data | Tipo | Resultado |
|------|------|-----------|
| 2026-05-17 | Auditoria inicial completa via [Protocolo de Segurança](https://github.com/jeanderson-silva8/protocolo-de-seguranca) | 1 sólido, 4 parciais, 13 críticos → plano de ação em 7 sessões. Ver [relatório](docs/AUDIT_REPORT_2026-05-17.md). |
