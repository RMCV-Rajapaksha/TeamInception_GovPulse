to create a postgreSQL database dump file you need the pg_dump utility which is a part of the default postgreSQL installation. To create a dump file of the database "govpulse" using psql deployed in your local machine with default settings you can use the following,

```
pg_dump -h localhost -p 5432 -U postgres -d govpulse > govpulse_dump_file.sql
```
