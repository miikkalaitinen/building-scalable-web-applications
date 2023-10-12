import { createClient } from '../deps.js'

export const pubClient = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})

await pubClient.connect()
