## Description

REST API built using [Nest](https://github.com/nestjs/nest) framework, [mongoose](https://mongoosejs.com/) for database integration and [jest](https://jestjs.io/) for E2E and unit tests.

## Pre-requisites

- [Node](https://nodejs.org/en/)
- [Docker](https://www.docker.com/get-started) 

## Installation

```bash
$ npm install
```

## Running the app

```bash
docker-compose up
```

## API documentation

With the app running go to http://localhost:3000/api/ to see the API documentation.
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

