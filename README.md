# Northcoders News API

## Creating environment variables

There are two databases in the project file (test and development) in order to ensure the correct database runs when either a test or development environment is chosen we need to setup environment variables.

These can be done easily by creating two files in the terminal

```
.env.test
.env.development
```

Add the correct database to the environment in the following format

```
PGDATABASE=<database_name_here>
```

Database names are available in the `db` directory => `setup.sql` file