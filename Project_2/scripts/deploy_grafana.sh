kubectl create deployment grafana --image=docker.io/grafana/grafana:latest
kubectl expose deployment grafana --port 3000
