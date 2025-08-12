# Prequisites

These required to run the backend service

- postgreSQL
- node.js

# Steps to setup postgreSQL

1. Install postgreSQL on your machine (environment)
2. It is recommended to create a new user (eg:"user1") and give it a password (eg:"admin"). you can also use the default postgres user, for which you need to setup a password if not already set.
3. Navigate to /backend/db_scripts refer the README.md file there and run the govpulse_db_create.sql first (this will create the govpulse database) then run sample_data_insert.sql (this will insert some sample data)

# Environmental variables setup

create a .env file or export following environmental variables accordingly,

```
BACKEND_PORT=4000
DATABASE_URL=postgres://postgres:admin@localhost:5432/govpulse
JWT_SECRET=ThisIsASecretKeyfgnjsgojq1orj314
```

note that here the default "postgres" user with a password "admin" is used to connect to the local postgreSQL instance running on port 5432. You can change this according to the way you have setup you user.

# How to start the server

to start the server for development purposes use following,

```
npx prisma generate # see the Note
npm run dev
```

to start the server for production environment use following

```
npx prisma generate # see the Note
npm start
```

### Note

you dont need to run the npx prisma generate everytime. Just after cloning the repo and after making and saving changes to /prisma/schema.prisma are instances when you'd need to execute this command

# ‼️About Endpoint usage ‼️

The endpoints exposed by the backend service has been documented by using the OpenAPI v3.1.0 specification, and this documentation is stored in /backend/openapi.yaml file. Please note!! the easiest way to read this is to use the [Swagger editor](https://editor.swagger.io/). You can replace the default file present in the webpage with the contents of /backend/openapi.yaml.
This will load up colorful and highly user friendly interface in the right handside region of the webpage. you can go through the endpoints, read their descriptions, sample request body, required fields, sample response body, endpoint security, etc.s
