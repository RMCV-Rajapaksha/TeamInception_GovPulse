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
DATABASE_URL=postgres://postgres:@12@localhost:5432/govpulse
JWT_SECRET=ThisIsASecretKeyfgnjsgojq1orj314
GOOGLE_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
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
This will load up colorful and highly user friendly interface in the right handside region of the webpage. you can go through the endpoints, read their descriptions, sample request body, required fields, sample response body, endpoint security, etc.

# Notes to Developers
please take note of following:
1. if a developer edits the db_script govpulse_db_create.sql, unless its a very minor change like to the comments, the /prisma/schema.prisma file should be updated accordingly.

2. updating the govpulse_db_create.sql would normally require you to re-run it or else the changes to be made to the schema wont happen (unless its a very minor change like to the comments )

3. when you are pulling in code changes to your branch, know that if the govpulse_db_create.sql has been updated you will have to rerun it for your own postgres database to properly updated too. This would result in your stored data being erased. If you want attempt to update your own database without losing its current data refer 4. below.

4. running **npx prisma migrate dev** from within /backend directory will attempt to sync your database with the schema.prisma, it only in some cases result in your data being reset (depending on how out of sync your database is with current database).

5. It is recommended to wait until it is confirmable that the database schema will no longer be changed and then add considerable number of demo data records. And also to add the demo data also through a db script and then in the case of the database reset discussed above you would just need to refactor you demo data db script and then run it and you would have your data available without issues.


