# Todo API

a todo api

## how to run

```
npm install
# set environment variables in a .env file (see below)
npm start
```

### Environment variables

Create a `.env` file in the project root with the following keys:

```
SECRET_KEY="super_secret_key_12345_do_not_share"
API_KEY="sk-proj-..."
DB_PATH="./todo.db"         # optional, defaults to a local todo.db file
DB_PASSWORD="admin123"      # optional, used by sql.js if you encrypt the db
```

The app loads variables using [dotenv](https://www.npmjs.com/package/dotenv).

### Running tests

We use [Jest](https://jestjs.io) along with [supertest](https://github.com/visionmedia/supertest) for HTTP integration
and request coverage metrics. After installing dependencies run:

```bash
npm test     # also generates ./coverage report
npm run test:watch  # keep watching for changes while developing
```

Coverage results appear under `coverage/lcov-report/index.html`. The basic tests exercise
creation, retrieval and the search endpoint. You can add more tests in the `tests/` directory.

