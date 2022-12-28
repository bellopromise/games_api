# Ultra Coding Test

## Description

Hello, this is my solution to the coding test. This component exposes a REST api with CRUD operations to fetch one or several games, create, update, delete a game and get the publisher of a game.  This was built using [Nest](https://github.com/nestjs/nest) framework, [mongoose](https://mongoosejs.com/) for database storage and [jest](https://jestjs.io/) for unit and E2E tests.

### Note
    A cron job was implemented to automatically remove the games having a release date older than 18 months and apply a discount of 20% to all games having a release date between 12 and 18 months.

## Pre-requisites

-   **NodeJS**: v16.15.0 or higher
-   **MongoDB**: v4.2.1 or higher
-   **Docker**(https://www.docker.com/get-started)


## How to install

### Using Git (recommended)

```sh
$ git clone https://github.com/bellopromise/ultra_test # or clone your own fork
```

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory
   
### Set environment variable

Below is the default variable, replace it if needed

-   `MONGODB_URL`= **the name of your db**


## Installation

```bash
$ cd test_task
$ npm install
```

## Running the app

Default port for API is `3000`. So 
```bash
# development
$ docker-compose up
```

## API documentation

With the application running, go to http://localhost:3000/docs/ to see the API swagger documentation.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support
For more questions and clarifications, you can reach out to me here `bellopromise5322@gmail.com`




