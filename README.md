# gql-tut

## db setup

```
console#> psql postgres

postgres=# CREATE USER plcgi1 WITH ENCRYPTED PASSWORD 'qazwsxedc';
postgres=# ALTER USER plcgi1 WITH SUPERUSER;
postgres=# DROP database "gql"
postgres=# CREATE database "gql"

console#> npm run migrate
```
