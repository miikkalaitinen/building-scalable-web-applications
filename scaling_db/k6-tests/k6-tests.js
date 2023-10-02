import http from 'k6/http'

export const options = {
  duration: '30s',
  vus: 10,
}

const url = 'http://127.0.0.1:51822' // Get from  minikube service visit-counter-app-service --url

export default function () {
  http.get(url)
}
