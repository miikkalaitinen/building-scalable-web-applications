minikube start
minikube addons enable metrics-server

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.19/releases/cnpg-1.19.1.yaml

minikube addons enable ingress

## Build the images
cd ./flyway
minikube image build -t qa-app-database-migrations -f ./Dockerfile .
cd ../llm-api
minikube image build -t llm-api -f ./Dockerfile.prod .
cd ../qa-api
minikube image build -t qa-api -f ./Dockerfile.prod .
cd ../qa-ui
minikube image build -t qa-ui -f ./Dockerfile.prod .

cd ../kubernetes
kubectl apply -f database/qa-app-database-cluster.yaml