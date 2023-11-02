import { createClient } from '../deps.js'
import * as qaApiService from './qaApiService.js'
import { sockets } from '../app.js'

export const subClient = createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
  pingInterval: 1000,
})

await subClient.connect()

/* Subscribe to the qa channel, when a message is received, 
send it to the correct client based on the type and
add sender to cooldown Set */
subClient.subscribe('qa', (message, channel) => {
  const msg = JSON.parse(message)
  if (msg.type === 'answer') {
    try {
      sockets.forEach((client) => {
        const { socket, type } = client
        if (type === 'answer') {
          socket.send(JSON.stringify(msg))
        }
      })

      qaApiService.answer_timeouts.add(msg.data.user_id)
      setTimeout(() => {
        qaApiService.answer_timeouts.delete(msg.data.user_id)
      }, 60000)
    } catch (e) {
      console.log(e)
    }
  } else if (msg.type === 'question') {
    try {
      sockets.forEach((client) => {
        const { socket, type } = client
        if (type === 'question') {
          socket.send(JSON.stringify(msg))
        }
      })
      qaApiService.question_timeouts.add(msg.data.user_id)
      setTimeout(() => {
        qaApiService.question_timeouts.delete(msg.data.user_id)
      }, 60000)
    } catch (e) {
      console.log(e)
    }
  }
})
