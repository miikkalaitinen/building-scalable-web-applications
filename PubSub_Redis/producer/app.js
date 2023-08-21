import { createClient } from 'npm:redis@4.6.4'
import { serve } from 'https://deno.land/std@0.171.0/http/server.ts'

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})

await client.connect()

const handleRequest = async (request) => {
  client.publish('channel', 'hello!')
  return new Response('Data published!')
}

serve(handleRequest, { port: 7777 })
