import http from 'k6/http'
import { check } from 'k6'

export const options = {
  vus: 10,
  duration: '10s',
  summaryTrendStats: ['med', 'p(99)'],
}

export default function () {
  // Measure the performance of loading the assignment page
  const res = http.get('http://localhost:7800')
  check(res, {
    'status is 200': (r) => r.status === 200,
  })
}
