## Apply servics
cd kubernetes

###Install redis
kubectl apply -f redis/redis-config.yaml
kubectl apply -f redis/redis-service.yaml
kubectl apply -f redis/redis-deployment.yaml

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