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
    course_id: 1,
    question_title: "What's the answer to life, the universe, and everything?",
    question_description: 'Answer the question',
  })
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user_uuid,
    },
  }

  ws.connect(`ws://localhost:7800/api/socket/question`, {}, function (socket) {
    socket.on('message', function (message) {
      check(message, {
        'message is correct': (m) => {
          const mes = JSON.parse(m)
          return (
            mes.type === 'question' &&
            mes.data.question_title ===
              "What's the answer to life, the universe, and everything?" &&
            mes.data.question_text === 'Answer the question'
          )
        },
      })
      socket.close()
    })
    const res = http.post(
      'http://localhost:7800/api/questions',
      payload,
      params
    )
    check(res, {
      'status is 201': (r) => r.status === 201,
    })
  })
}
