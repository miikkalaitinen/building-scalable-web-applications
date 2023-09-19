import { createClient } from '../deps.js'

// Queue for users that are currently being graded
export let user_queue = new Set()

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})

await client.connect()

const sendToQueue = (submission, test_code) => {
  // Add user to queue
  user_queue.add(submission.user_uuid)
  sendSubmissionToRedisStream(submission, test_code)
}

const sendSubmissionToRedisStream = (submission, test_code) => {
  // Send submission to redis stream
  const redisObject = {
    submissionId: String(submission.id),
    user_uuid: submission.user_uuid,
    code: submission.code,
    testCode: test_code,
  }

  client.xAdd('gradingQueue', '*', redisObject)
}

export { sendToQueue }
