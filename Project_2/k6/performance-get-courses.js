import http from 'k6/http'
import { check } from 'k6'
import { ip, port } from './settings.js'

export const options = {
  vus: 10,
  duration: '10s',
  summaryTrendStats: ['med', 'p(99)'],
}

export default function () {
  // Get all courses
  const res = http.get(`http://${ip}:${port}/api/courses`)
  check(res, {
    'status is 200': (r) => r.status === 200,
    'all courses returned': (r) => {
      const body = JSON.parse(r.body)
      return body.length === 3 && body[0].course_name === 'Intro to SQL'
    },
  })
}
