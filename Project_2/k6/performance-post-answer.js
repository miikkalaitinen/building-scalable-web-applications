import http from 'k6/http'
import ws from 'k6/ws'
import { check } from 'k6'
import { ip, port } from './settings.js'
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js'

export const options = {
  vus: 10,
  duration: '30s',
  summaryTrendStats: ['med', 'p(99)'],
}

export default function () {
  const user_uuid = uuidv4()
  const payload = JSON.stringify({
    question_id: 1,
    answer_text: '42',
  })
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user_uuid,
    },
  }

  ws.connect(`ws://${ip}:${port}/api/socket/answer`, {}, function (socket) {
    socket.on('message', function (message) {
      check(message, {
        'message is correct': (m) => {
          const mes = JSON.parse(m)
          return (
            mes.type === 'answer' &&
            mes.data.answer_text === '42' &&
            mes.data.question_id === 1
          )
        },
      })
      socket.close()
    })
    const res = http.post(`http://${ip}:${port}/api/answers`, payload, params)
    check(res, {
      'status is 201': (r) => r.status === 201,
    })
  })
}
