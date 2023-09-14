import { controllers } from '../app.js'
const encoder = new TextEncoder()

const sendToQueue = async (submission, code, assignmentId) => {
  // Somehow add the submission to the queue
  // ...

  // Return the graded sumbission after it has been graded

  await new Promise(() =>
    setTimeout(() => {
      const gradedSubmission = {
        id: submission.id,
        user_uuid: submission.user_uuid,
        code: submission.code,
        programming_assignment_id: submission.programming_assignment_id,
        status: 'graded',
        grader_feedback: 'Good job!',
        correct: true,
      }
      console.log(controllers)
      controllers.forEach((c) => {
        if (c.submissionId == submission.id) {
          console.log(
            'Sending graded submission to client with submission id: ' +
              submission.id
          )
          c.controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(gradedSubmission)}\n\n`)
          )
          c.controller.close()
          controllers.delete(c)
        }
      })
    }, 5000)
  )
}

const sendToGrader = async (code, assignmentId) => {
  const testCode = await database.getTestCode(assignmentId)
  if (!testCode[0]) {
    throw new Error('Test code not found')
  }

  const response = await fetch('http://grader-api:7000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      testCode: testCode[0].test_code,
      code: code,
    }),
  })

  return response
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
