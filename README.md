# Northcoders News API - A Back-End Project Created By Me

## Project Summary:

This project is a "hypothetical" news service for Northcoders. It is accessible and interactable via a fully functioning RESTful API built with Express.js.

The API interfaces with a "development" PostgreSQL database which contains the following tables: Articles, Topics, Comments and Users.

The API was built through test driven development, so naturally I have made the test suite available in the project. For testing purposes a "test" database was used which is in a like for like format as the development database.

The project utilises the following npm packages / modules:

**Dependencies:**

* express.js
* node-postgres 
* pg-format
* dotenv
* node: fs

**Dev Dependendies:**

* husky
* jest
* jest-extended
* jest-sorted
* supertest

## Hosted version of the API is available here:

> https://nc-news.cyclic.app/api

## Installation instructions:

### <ins>Minimum requirements</ins> 

* Node v17.2.0
* PSQL 12.12

-------------------------

1. Clone the repo in GitHub and make a local copy:

    [Instructions on cloning a repo / making a local copy](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

2. Ensure the local working directory is the root of the repo, then run the following command to install all dependencies:

    ```
    npm install
    ```
3. Two databases exist in the project - "test" and "development". To ensure the correct database runs in the test or development environments we need to setup the environment variables.

    Create two files in the root of the local repo:

    ```
    touch .env.test .env.development
    ```

    Add the corresponding database to each file

    In the .env.test file add the following:
    ```
    PGDATABASE=nc_news_test
    ```

    In the .env.development file add the following:
    ```
    PGDATABASE=nc_news
    ```


4. Setup the databases with the following script:

    ```
    npm run setup-dbs
    ```


5. Seed the development database ***(the repo has a seed.js file to do the seeding with an associated script in package.json)*** running this script will seed the database:

    ```
    npm run seed
    ```

6. To run the test suite use the following command:

    ```
    npm t
    ```

    ***Two test suites exist, one for utilty functions and one for the app. Before every test in the `app.test.js` file the test database is reseeded to ensure any alterations / changes are reset.***
