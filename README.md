

## Run project:

1. Open terminal window and clone repository.
2. Create **.env** file in the root folder:

*The idea with .env file is to make sure the project depends on process variables which can be set be execution environment (e.g. containers)*
```
COMPOSE_PROJECT_NAME=powerflex
SERVICE_NAME=powerflex
DB_NAME=powerflex
DB_USER_NAME=powerflex-admin
DB_USER_PASSWORD=powerflex999999
DB_PORT=5432
API_VERSION=v1
API_SERVER_PORT=4500
```
3. Run `docker compose up` command *please, make sure docker is running*. It will pull and start postgres database on port `5432`, create `powerflex_postgres` volume, create `powerflex_server` image, and start api server on port `4500`.
4. Open new terminal window, navigate to folder where `package.json` is located.
5. Run `pnpm i` *please, install pnpm globally if not installed yet*
6. Run `pnpm init-db:dev`. This will create database schema and load initial production data from seed file.
7. Open `http://localhost:4500/v1/sprocket-production` url in web browser. The first page (50 rows) will be loaded.

## Scripts in package.json
- `init-db:dev` - creates database tables and loads sprocket production data seed;
- `start` - used by docker to start API server;
- `start:dev` - starts API server locally outside of docker;
- `prettier` - prettifies all files;

## Hardcoded data
### Factory ids
```
1cfaaac5-64fb-428c-9e29-2580d0815397
1cfaaac5-64fb-428c-9e29-2580d0815398
1cfaaac5-64fb-428c-9e29-2580d0815399
```
These factory ids were used for inserting records from `seed_factory_data.json` file.

## API Reference
### /sprockets
#### Get all sprockets:
- **GET** `http://localhost:4500/v1/sprockets?take=100&skip=0` where `take` and `skip` are used fro paging. `take` max value is `1000`.

#### Get sprocket by id:
- **GET** `http://localhost:4500/v1/sprockets/:id` where `:id` is sprocket id which can be found in database or in **POST** response. E.g. `http://localhost:4500/v1/sprockets/00138d06-d0e2-441d-8b84-083ee22b2c29`.

#### Create new sprocket:
- **POST** `http://localhost:4500/v1/sprockets`

Request example:
```
Header:
Content-Type: application/json

Request body:
{
    "factoryId": "1cfaaac5-64fb-428c-9e29-2580d0815397",
    "teeth": 51,
    "pitchDiameter": 151,
    "outsideDiameter": 170,
    "pitch": 111
}
```
#### Update existing sprocket:
- **PUT** `http://localhost:4500/v1/sprockets/:id` where `:id` is sprocket id which can be found in database or in **POST** response. E.g. `http://localhost:4500/v1/sprockets/00138d06-d0e2-441d-8b84-083ee22b2c29`

Request example:
```
Header:
Content-Type: application/json

Request body:
{
    "factoryId": "1cfaaac5-64fb-428c-9e29-2580d0815397",
    "teeth": 51,
    "pitchDiameter": 151,
    "outsideDiameter": 170,
    "pitch": 111
}
```

### /sprocket-productions
#### Get all sprocket production data (goal/actual/reporting time) or by factory id:
- **GET** `http://localhost:4500/v1/sprocket-productions?take=100&skip=0` where `take` and `skip` are used fro paging. `take` max value is `1000`.

#### Get all sprocket production data per factory:
- **GET** `http://localhost:4500/v1/sprocket-productions/:factory_id?take=100&skip=0` where `take` and `skip` are used fro paging. `take` max value is `1000`. `factory_id` path parameter can be found in **Factory ids** section. E.g. `http://localhost:4500/v1/sprocket-productions/1cfaaac5-64fb-428c-9e29-2580d0815397?take=100&skip=0`

## API version
API urls have **version** prefix for seamless migration on newer versions when both old and new versions should be served during API upgrade. The version is stored in `API_VERSION` environment.

## Implementation details
- Stack: `Docker Compose`, `PostgreSQL`, `pnpm`, `NodeJS 20+`, `ExpressJS`, `Zod validator`, `Winston logger`, `TypeORM` framework, `TypeScript`, `tsx` transpiler.
- Feature sliced approach: code base is split on self sufficient high cohesive parts **features** which can be hidden behind `feature flags` and merged into main repo even when implementation is not completed. It simplifies development process and repository management (no need to rebase from outdated codebase).
- Following **Clean Architecture** approach:
    - **Infrastructure** folder contains `framework | lib | database type  | data source | connection and other` implementation specific code. This can be changed without affecting business logic (i.e. use cases, domain model).
    - **Presentation** folder contains HTTP related code: route definitions and request validation code.
    - **Domain** contains DTOs, persistence entities, use cases, and domain models.
- Validating path params, query params, and `PUT/POST` request body.
- In order to get all benefits from TS (and path aliases in particular) the code is executed as TS in NodeJS under super fast `ESBuild` based **TSX** transpiler.
- `SprocketDomainEntity` is domain model example which is added to demonstrate how business logic is consumed in `create` use case of `sprocket` feature.
- Logging via `winston` logger.

## Considerations and limitations
- Authentication is not implemented for simplicity.

## Future improvements
1. Hot reload.
2. Add `domain entity` to `DTO` mappers for better type checking. E.g. `morphism` npm library.
3. Use `UUID V7` for postgres ID for better performance `https://pgxn.org/dist/pg_uuidv7/`.
4. Add `swagger` for integrated documentation.

## Recommended IDE
It is recommended to use VSCode with the following plugins installed:
- **ESLint** `https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint`
- **Prettier** `https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode`
- **Trailing Spaces** `https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces`
- **Code Spell Checker** `https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker`

