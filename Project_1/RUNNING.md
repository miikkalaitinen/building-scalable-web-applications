## Running service

1. Build grader-image container

- `cd grader-image`
- `docker build -t grader-image:latest .`

2. Run docker-compose to start the containers

- `cd ..`
- `docker-compose up -d --build`

3. Open the browser and go to http://localhost:7800

Running the production build is the same as above, but with `docker-compose -f docker-compose.prod.yml up -d --build`

## Running the tests

k6: run tests.js in k6 folder
playwright: `docker compose run --entrypoint=npx e2e-playwright playwright test`

## Notes

- Sometimes flyway doesn't run the migrations correctly, in that case run `docker compose up -d flyway` after the initial `docker compose up -d --build`
