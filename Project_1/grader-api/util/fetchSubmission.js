import { createClient } from '../deps.js'

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})

await client.connect()

const getSubmissionFromRedisStream = async () => {
  try {
    const streamKey = 'gradingQueue'

    // TODO: Get the oldets submission from the stream
    const data = await client.xRange(streamKey, '-', '+', 'COUNT', 1)

    if (data && data.length > 0) {
      const message = data[0].message
      const id = data[0].id

      const del = await client.xDel(streamKey, id)
      console.log(`Deleted message from Redis stream: ${del}`)

      if (del == 1) {
        return message
      }
    }

    return null
  } catch (e) {
    console.error(`Error retrieving messages from Redis stream: ${e}`)
  }
}

export { getSubmissionFromRedisStream }
