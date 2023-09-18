import { createClient } from 'npm:redis@4.6.4'

export let user_queue = new Set()
export let graderIds = []

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})

await client.connect()

const sendToQueue = (submission, test_code) => {
  user_queue.add(submission.user_uuid)
  sendSubmissionToRedisStream(submission, test_code)
}

const sendSubmissionToRedisStream = (submission, test_code) => {
  const redisObject = {
    submissionId: String(submission.id),
    user_uuid: submission.user_uuid,
    code: submission.code,
    testCode: test_code,
  }

  client.xAdd('gradingQueue', '*', redisObject)
}

export { sendToQueue }
