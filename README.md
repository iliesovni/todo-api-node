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
