import { sockets } from '../app.js'
import { createClient } from 'npm:redis@4.6.4'

export let user_queue = new Set()
export let graderIds = []

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})

await client.connect()

const sendToQueue = (submission) => {
  user_queue.add(submission.user_uuid)
  sendSubmissionToRedisStream(submission)
}

const sendSubmissionToRedisStream = (submission) => {
  const redisObject = {}

  for (const key in submission) {
    redisObject[key] = String(submission[key])
  }
  client.xAdd('gradingQueue', '*', redisObject)
  sockets.forEach(({ socket, id }) => {
    if (id == submission.id) {
      socket.send(JSON.stringify({ status: 'queued' }))
    }
  })
}

const parseGraderResponse = async (response) => {
  const result = (await response.json()).result
  if (result.charAt(0) == '.') {
    return {
      result,
      correct: true,
    }
  } else {
    return {
      result,
      correct: false,
    }
  }
}

export { sendToQueue }
