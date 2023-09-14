const getSubmissionFromRedisStream = (workerId, callback) => {
  const client = redis.createClient(6379, 'localhost')
  const streamKey = 'gradingQueue'

  // TODO: Get the oldets submission from the stream

  // Remove the oldest submission from the stream
  // if removed successfully, call callback with the submission
  // if not removed successfully, call callback with null
}
