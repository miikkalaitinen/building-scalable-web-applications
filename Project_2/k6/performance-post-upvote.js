import http from 'k6/http'
import ws from 'k6/ws'
import { check } from 'k6'
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js'

export const options = {
  vus: 10,
  duration: '60s',
  summaryTrendStats: ['med', 'p(99)'],
}

export default function () {
  const user_uuid = uuidv4()
  const payload = JSON.stringify({
    answer_id: 2,
  })
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user_uuid,
    },
  }
  const res = http.post('http://localhost:7800/api/upvote', payload, params)
  check(res, {
    'status is 201': (r) => r.status === 200,
    'response body is correct': (r) => {
      const body = JSON.parse(r.body)
      return body.user_id === user_uuid && body.answer_id === 2
    },
  })
}
