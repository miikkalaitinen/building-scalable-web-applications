## Apply servics
cd kubernetes

## Install redis operator
kubectl apply -f redis/standard-storageclass.yaml
kubectl apply -f redis/configmap.yaml
kubectl apply -f redis/service.yaml
kubectl apply -f redis/statefulset.yaml

###Database
kubectl apply -f database/qa-app-database-cluster.yaml

###LLM
kubectl apply -f llm-api/llm-api-deployment.yaml
kubectl apply -f llm-api/llm-api-service.yaml
kubectl apply -f llm-api/llm-api-deployment-hpa.yaml

###API
kubectl apply -f qa-api/qa-api-deployment.yaml
kubectl apply -f qa-api/qa-api-service.yaml
kubectl apply -f qa-api/qa-api-deployment-hpa.yaml

###UI
kubectl apply -f qa-ui/qa-ui-deployment.yaml
kubectl apply -f qa-ui/qa-ui-service.yaml
kubectl apply -f qa-ui/qa-ui-deployment-hpa.yaml

###Ingress
kubectl apply -f ingress-service.yaml


###Database migration
kubectl apply -f database/qa-app-database-migration-job.yaml