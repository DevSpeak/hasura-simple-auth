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
Table Name: `User`
- id (uuid)
- email (string/text)
- password (string/text)

```PLpgSQL
CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
    
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
```

**Queries**
```
me { email } // Used for login check
```

**Mutations**
```
login(email: String, password: String) { token }
signup(email: String, password: String) { token }
```
