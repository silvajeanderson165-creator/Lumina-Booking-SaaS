import graphene
import metrics.schema

class Query(metrics.schema.Query, graphene.ObjectType):
    hello = graphene.String(default_value="Hi! Lumina Analytics GraphQL is running.")

schema = graphene.Schema(query=Query)
