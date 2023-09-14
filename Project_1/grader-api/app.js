import { getSubmissionFromRedisStream } from './util/fetchSubmission.js'
import { grade } from './services/gradingService.js'

// const handleRequest = async (request) => {
//   // the starting point for the grading api grades code following the
//   // gradingDemo function, but does not e.g. use code from the user
//   let result
//   try {
//     const requestData = await request.json()

//     console.log('Request data:')
//     console.log(requestData)

//     const code = requestData.code
//     const testCode = requestData.testCode

//     result = await grade(code, testCode)
//   } catch (e) {
//     result = await gradingDemo()
//   }

//   // in practice, you would either send the code to grade to the grader-api
//   // or use e.g. a message queue that the grader api would read and process

//   return new Response(JSON.stringify({ result: result }))
// }

while (true) {
  // fetch submissions
  // if one comes back, grade it
  // send the result to the programming api
}
