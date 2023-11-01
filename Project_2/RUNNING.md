# Running

## For the development mode

1. Have docker running
2. Run `docker compose --profile migrate up -d --build` to run the application and flyway migrations for database.
3. The application should be running on `localhost:7800`, during first run it might take a while for the backend and database to start up.
4. After the first run, the application can be started with `docker compose up -d` to start the application without the migrations.

## For the production mode

1. Have docker running
2. Run `docker compose -f docker-compose.prod.yml --profile migrate up -d --build` to run the application and flyway migrations for database.
3. The application should be running on `localhost:7800`, during first run it might take a while for the backend and database to start up.
4. After the first run, the application can be started with `docker compose -f docker-compose.prod.yml up -d` to start the application without the migrations.

## Tests

For K6 see k6/README.md
For e2e-playwright see e2e-playwright/README.md

## In Kubernetes with Minikube

SCRIPTS MUST BE RUN IN THE ROOT OF THE PROJECT e.g. `sh scripts/init_kube.sh`
If you run windows you can manually run the commands in the scripts.

1. Run `init_kube.sh`
2. Run database migrations with `migration.sh`
3. Apply with `run_kube.sh`
4. You can now open a tunnel to the nginx service with `minikube service ingress-nginx-controller --url -n ingress-nginx` which will give you the ip for the application. Most of the time select the lower port number, since other one is for https.
5. The service should now work!

6. You can deploy prometheus with `deploy_prometheus.sh` and grafana with `deploy_grafana.sh` to monitor the application.

Prometheus will be available at `localhost:9090` after running `kubectl port-forward svc/prometheus-operated 9090:9090`

Grafana will be available at `localhost:3000` after running and `kubectl port-forward svc/grafana 3000:3000`

Instructions for setting up prometheus to feed data to grafana can be found in article [How to monitor Kubernetes clusters with the Prometheus Operator](https://grafana.com/blog/2023/01/19/how-to-monitor-kubernetes-clusters-with-the-prometheus-operator/)
