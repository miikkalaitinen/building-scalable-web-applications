import { getSubmissionFromRedisStream } from './util/fetchSubmission.js'
import { parseGraderResponse } from './util/parseGraderResponse.js'
import { grade } from './services/gradingService.js'

while (true) {
  await new Promise((r) => setTimeout(r, 1000))
  const submission = await getSubmissionFromRedisStream()

  if (submission) {
    console.log(`Grading submission ${submission.submissionId}`)
    const result = await grade(submission.code, submission.testCode)

    const response = await parseGraderResponse(result)

    await fetch(
      `http://programming-api:7777/feedback/${submission.submissionId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          submissionId: submission.submissionId,
          user_uuid: submission.user_uuid,
          ...response,
        }),
      }
    )
  }
}
