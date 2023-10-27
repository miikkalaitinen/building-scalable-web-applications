import http from 'k6/http'
import { check } from 'k6'

export const options = {
  vus: 10,
  duration: '10s',
  summaryTrendStats: ['med', 'p(99)'],
}

export default function () {
  // Get questions from Python course with many answers
  const res = http.get('http://localhost:7800/api/questions/31')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'question text is correct': (r) => {
      const body = JSON.parse(r.body)
      return body.question_title === 'How to make a for loop in Python'
    },
  })
}
