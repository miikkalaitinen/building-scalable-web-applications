# Running

## For the development mode

1. Have docker running
2. Run `docker compose --profile migrate up -d --build` to run the application and flyway migrations for database.
3. The application should be running on `localhost:7800`, during first run it might take a while for the backend and database to start up.
4. After the first run, the application can be started with `docker compose up -d` to start the application without the migrations.

## For the production mode

1. Have docker running
2. Run `docker compose -f docker-compose.prod.yml --profile migrate up -d` to run the application and flyway migrations for database.
3. The application should be running on `localhost:7800`, during first run it might take a while for the backend and database to start up.
4. After the first run, the application can be started with `docker compose -f docker-compose.prod.yml up -d` to start the application without the migrations.

## Tests

For K6 see k6/README.md
For e2e-playwright see e2e-playwright/README.md

## In Kubernetes with Minikube

1. Run `init_kube.sh`
2. Run database migrations with `migration.sh`
3. Apply with `run_kube.sh`
4. You can now open a tunnel to the nginx service with `minikube service ingress-nginx-controller --url -n ingress-nginx` which will give you the ip for the application. Most of the time select the lower port number, since other one is for https.
5. The service should now work!
