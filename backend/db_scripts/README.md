# How to run db scripts
you need to run the following by replacing the terms in the < >

    psql -h <hostaddress> -p <port> -U <username> -f govpulse_db_create.sql 
    psql -h <hostaddress> -p <port> -U <username> -f sample_data_insert.sql 

"hostaddress" is the ip address of the machine where you installed postgreSQL (if you are setting this up locally use "localhost") 

"port" is the port on which postgreSQL is listening in that machine (5432 by default)

 "username" is the username of the user you configured in posgreSQL (default user is postgres). 
 
 You will be prompted for a password if password is setup properly. Remember to run **govpulse_db_create.sql** first and then **sample_data_insert.sql**.

# Example
example commands for local machine default settings (from within db_scripts folder)

```
psql -h localhost -p 5432 -U postgres -f govpulse_db_create.sql
psql -h localhost -p 5432 -U postgres -f sample_data_insert.sql
```

# Sample data Includes

| Table Name   | Number of Records |
| ------------ | ----------------- |
| USER         | 10                |
| OFFICIAL     | 10                |
| CATEGORIES   | 10                |
| AUTHORITIES  | 10                |
| ISSUE_STATUS | 10                |
| ISSUE        | 22                |
| APPOINTMENT  | 12                |
| UPVOTE       | 14                |
| ATTENDEES    | 10                |
| FREE_TIMES   | 11                |
| EMBEDDING    | 4                 |
| ATTACHMENT   | 4                 |
| FEEDBACK     | 4                 |
