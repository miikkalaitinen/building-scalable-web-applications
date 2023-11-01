import { createClient } from '../deps.js'

export const pubClient = createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
  pingInterval: 1000,
})

await pubClient.connect()
