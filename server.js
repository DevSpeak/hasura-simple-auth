import { ApolloServer, gql } from 'apollo-server'
import { resolvers } from './resolvers.js'
import { getUserId } from './utils.js'

const typeDefs = gql`
  type Query {
    me: User!
  }
  type Mutation {
    signup(email: String, password: String): AuthPayload!
    login(email: String, password: String): AuthPayload!
  }
  type AuthPayload {
    token: String
  }
  type User {
    email: String
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const userId = getUserId(req)
    return { ...req, userId }
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
