# How to run db scripts

example command to run a db script from this folder

```
psql -U postgres -f govpulse_db_create.sql
```

you can replace "postgres" (defaul postgreSQL usernmae) with a different username. You will be prompted for a password if password is setup properly. Remember to run **govpulse_db_create.sql** first and then **sample_data_insert.sql**.
