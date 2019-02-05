# hasura-simple-auth
Simple Auth Server For Signup &amp; Login Mutation

**Setup**
1. npm install
1. follow https://docs.hasura.io/1.0/graphql/manual/auth/jwt.html for setting up JWT mode
1. edit config.json
1. npm start
1. add url to remote schemas
   1. using docker and localhost? https://docs.hasura.io/1.0/graphql/manual/deployment/docker/index.html#network-config
1. add required schema

**Required Schema**
- id (uuid)
- email (string/text)
- password (string/text)

**Queries**
```
me { email } // Used for login check
```

**Mutations**
```
login(email: String, password: String) { token }
signup(email: String, password: String) { token }
```
