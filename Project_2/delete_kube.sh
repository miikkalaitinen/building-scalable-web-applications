### Delete the kubernetes cluster
cd kubernetes

kubectl delete -f ingress-service.yaml

kubectl delete -f qa-ui/qa-ui-deployment.yaml
kubectl delete -f qa-ui/qa-ui-service.yaml
kubectl delete -f qa-ui/qa-ui-deployment-hpa.yaml

kubectl delete -f qa-api/qa-api-deployment.yaml
kubectl delete -f qa-api/qa-api-service.yaml
kubectl delete -f qa-api/qa-api-deployment-hpa.yaml

kubectl delete -f llm-api/llm-api-deployment.yaml
kubectl delete -f llm-api/llm-api-service.yaml
kubectl delete -f llm-api/llm-api-deployment-hpa.yaml

kubectl delete -f redis/redis-deployment.yaml
kubectl delete -f redis/redis-service.yaml
kubectl delete -f redis/redis-config.yaml