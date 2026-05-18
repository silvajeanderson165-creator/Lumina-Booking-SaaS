"""
Camada de hardening do endpoint GraphQL.

Implementa as recomendações dos itens J1, J2, J3, J4 do CONTEXT_ADDONS.md:
- J1: introspecção desabilitada em produção.
- J2: depth limit (queries aninhadas demais derrubam o servidor).
- J3: limite de aliases por query (mitiga abuso de aliasing para bypassar rate limit).
- J4: batching de HTTP requests é desabilitado pelo default do graphene-django, mas
      documentado aqui para auditoria futura.

Auditoria 2026-05-17, Sessão 3 — críticos #2 e #3.
"""
from __future__ import annotations

import os
from typing import List, Type

from graphene_django.views import GraphQLView
from graphql import GraphQLError
from graphql.language import FieldNode, FragmentDefinitionNode, OperationDefinitionNode
from graphql.validation import NoSchemaIntrospectionCustomRule, ValidationRule


# ───────────────────────────────────────────────────────────────────────────────
# Configuração — ajustar conforme o uso legítimo da aplicação cresce.
# ───────────────────────────────────────────────────────────────────────────────
MAX_QUERY_DEPTH = 7         # Lumina hoje tem queries rasas (depth 2-3). 7 é folgado.
MAX_ALIASES_PER_FIELD = 10  # Bloqueia "login{...} login2:login{...} login3:login{...}" massivo.


# ───────────────────────────────────────────────────────────────────────────────
# Rule 1 — Depth limit
# ───────────────────────────────────────────────────────────────────────────────
class DepthLimitRule(ValidationRule):
    """Rejeita queries cuja profundidade ultrapasse MAX_QUERY_DEPTH."""

    def enter_operation_definition(self, node: OperationDefinitionNode, *_):  # noqa: D401
        depth = _selection_depth(node)
        if depth > MAX_QUERY_DEPTH:
            self.report_error(
                GraphQLError(
                    f"Query excede a profundidade máxima permitida ({MAX_QUERY_DEPTH}); "
                    f"recebida profundidade {depth}.",
                    nodes=[node],
                )
            )


def _selection_depth(node, current: int = 0) -> int:
    """Calcula a profundidade máxima da árvore de seleções a partir de um nó."""
    selection_set = getattr(node, "selection_set", None)
    if selection_set is None:
        return current

    next_depth = current + 1 if isinstance(node, FieldNode) else current
    deepest = next_depth

    for selection in selection_set.selections:
        if isinstance(selection, FieldNode):
            deepest = max(deepest, _selection_depth(selection, next_depth))
        # Fragmentos espalhados são ignorados aqui de propósito — implementação
        # simples; melhorar quando a aplicação usar fragments de verdade.

    return deepest


# ───────────────────────────────────────────────────────────────────────────────
# Rule 2 — Alias limit (mitiga "1000 logins em 1 request" via aliasing)
# ───────────────────────────────────────────────────────────────────────────────
class AliasLimitRule(ValidationRule):
    """Bloqueia uso abusivo de aliases para o mesmo field (anti-bypass de rate limit)."""

    def __init__(self, context):
        super().__init__(context)
        self._alias_counts: dict[str, int] = {}

    def enter_field(self, node: FieldNode, *_):
        # Conta apenas fields que TÊM alias — fields sem alias usam o próprio nome.
        if node.alias is None:
            return
        field_name = node.name.value
        self._alias_counts[field_name] = self._alias_counts.get(field_name, 0) + 1
        if self._alias_counts[field_name] > MAX_ALIASES_PER_FIELD:
            self.report_error(
                GraphQLError(
                    f"Campo '{field_name}' usado com aliases mais que {MAX_ALIASES_PER_FIELD} "
                    f"vezes — possível tentativa de bypass de rate limit via aliasing.",
                    nodes=[node],
                )
            )


# ───────────────────────────────────────────────────────────────────────────────
# Composição: lista final de regras aplicada em runtime
# ───────────────────────────────────────────────────────────────────────────────
def get_security_validation_rules() -> List[Type[ValidationRule]]:
    """
    Retorna o conjunto de validation rules a aplicar em CADA query GraphQL.

    Introspecção é desabilitada APENAS em produção (DEBUG=False) — em dev,
    introspecção continua disponível para tooling local (GraphiQL, codegen).
    """
    is_debug = os.environ.get("DEBUG", "0") == "1"
    rules: List[Type[ValidationRule]] = [DepthLimitRule, AliasLimitRule]
    if not is_debug:
        rules.append(NoSchemaIntrospectionCustomRule)
    return rules


# ───────────────────────────────────────────────────────────────────────────────
# View customizada — aplica as regras + bloqueia batching HTTP
# ───────────────────────────────────────────────────────────────────────────────
class SecureGraphQLView(GraphQLView):
    """
    GraphQLView com hardening de produção.

    - Aplica regras de validação (depth, alias, introspecção).
    - batch=False por default (rejeita arrays de queries no body).
    """

    # graphene-django lê validation_rules em execute_graphql_request.
    validation_rules = get_security_validation_rules()

    # Bloqueia HTTP batching (várias queries em 1 request).
    # graphene-django já vem com batch=False por default; reforçado aqui.
    batch = False
