kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml --force-conflicts=true --server-side=true

cd ./kubernetes

kubectl apply -f prometheus/service_monitor.yaml
kubectl apply -f prometheus/prometheus_rbac.yaml
kubectl apply -f prometheus/expose_prometheus.yaml