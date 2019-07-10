const { GraphQLClient } = require('graphql-request')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const graphql = new GraphQLClient(process.env.ENDPOINT, {
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET
  }
})

const LOGIN = `
  query($email: String) {
    user(where:{email: {_eq: $email}}) { id password }
  }
`

const SIGNUP = `
  mutation($email: String, $password: String) {
    insert_user(objects: { email: $email, password: $password }) { returning { id }}
  }
`

const ME = `
  query($id: uuid) {
    user(where:{id: {_eq: $id}}) { email }
  }
`

const resolvers = {
  Query: {
    me: async (_, args, req) => {
      if (req.userId) {
        const user = await graphql.request(ME, { id: req.userId }).then(data => {
          return data.user[0]
        })
        return { ...user }
      } else {
        throw new Error('Not logged in.')
      }
    }
  },
  Mutation: {
    signup: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await graphql.request(SIGNUP, { email, password: hashedPassword }).then(data => {
        return data.insert_user.returning[0]
      })

      const token = jwt.sign({
        userId: user.id,
        'https://hasura.io/jwt/claims': {
          'x-hasura-user-id': user.id,
          'x-hasura-default-role': 'user',
          'x-hasura-allowed-roles': ['user']
        }
      }, process.env.JWT_SECRET)

      return { token }
    },
    login: async (_, { email, password }) => {
      const user = await graphql.request(LOGIN, { email }).then(data => {
        return data.user[0]
      })

      if (!user) throw new Error('No such user found.')

      const valid = await bcrypt.compare(password, user.password)

      if (valid) {
        const token = jwt.sign({
          userId: user.id,
          'https://hasura.io/jwt/claims': {
            'x-hasura-user-id': user.id,
            'x-hasura-default-role': 'user',
            'x-hasura-allowed-roles': ['user']
          }
        }, process.env.JWT_SECRET)

        return { token }
      } else {
        throw new Error('Invalid password.')
      }
    }
  }
}

module.exports = { resolvers }
