import http from 'k6/http'
import ws from 'k6/ws'
import { check } from 'k6'

export const options = {
  vus: 10,
  duration: '30s',
  summaryTrendStats: ['med', 'p(99)'],
}

export default function () {
  const user_uuid = Math.random().toString(36)

  // Measure the performance of submitting assignments
  const payload = JSON.stringify({
    code: 'def hello():\n    return "Hello"',
    assignment_id: 1,
  })
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user_uuid,
    },
  }
  const res2 = http.post(
    'http://localhost:7800/api/assignments/submit',
    payload,
    params
  )
  check(res2, {
    'status is 200': (r) => r.status === 200,
  })

  const { id } = res2.json()

  const assignment_one_message = `{"test_status":"correct","status":"processed","grader_feedback":".\\n----------------------------------------------------------------------\\nRan 1 test in 0.000s\\n\\nOK","correct":true}`

  // Measure the performance getting the assignment graded
  const res3 = ws.connect(
    `ws://localhost:7800/api/assignments/status/${id}`,
    {},
    function (socket) {
      socket.on('message', function (message) {
        check(message, {
          'message is correct': (m) => m == assignment_one_message,
        })
        socket.close()
      })
    }
  )
}
