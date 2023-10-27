import http from 'k6/http'
import { check } from 'k6'

export const options = {
  vus: 10,
  duration: '10s',
  summaryTrendStats: ['med', 'p(99)'],
}

export default function () {
  // Get course Intro to SQL
  const res = http.get('http://localhost:7800/api/courses/1')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'course name is correct': (r) => {
      const body = JSON.parse(r.body)
      return body.course_name === 'Intro to SQL'
    },
  })
}
