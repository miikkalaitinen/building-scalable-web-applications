import { createClient } from '../deps.js'
import { sockets } from '../app.js'

export const subClient = createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
  pingInterval: 1000,
})

await subClient.connect()
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
    } catch (e) {
      console.log(e)
    }
  }
})
