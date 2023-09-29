First create the app.js and dockerfiles, after which we can build the image with
`minikube image build -t hello-minikube-app -f ./Dockerfile .`

After this, i created the deployment and service files in the kubernetes folder, and applied them with `kubectl apply -f hello-minikube-app-deployment.yaml` and `kubectl apply -f hello-minikube-app-service.yaml`

Finally you can access the application by opening a tunnel to the service with:
`minikube service hello-minikube-app-service --url`
