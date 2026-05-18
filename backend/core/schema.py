import graphene
import graphql_jwt

import metrics.schema
from core.auth_rate_limit import RateLimitedObtainJSONWebToken


class Query(metrics.schema.Query, graphene.ObjectType):
    hello = graphene.String(default_value="Hi! Lumina Analytics GraphQL is running.")


class Mutation(graphene.ObjectType):
    # tokenAuth com rate limit por IP (auditoria 2026-05-17, crítico #6).
    token_auth = RateLimitedObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
