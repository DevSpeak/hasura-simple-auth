const { ApolloServer, gql } = require('apollo-server')
const { resolvers } = require('./resolvers')

const { getUserId } = require('./utils')

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
