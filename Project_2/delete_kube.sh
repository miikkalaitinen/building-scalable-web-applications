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

kubectl delete -f redis/standard-storageclass.yaml
kubectl delete -f redis/configmap.yaml
kubectl delete -f redis/service.yaml
kubectl delete -f redis/statefulset.yaml

kubectl delete -f database/qa-app-database-cluster.yaml
kubectl delete -f database/qa-app-database-migration-job.yaml