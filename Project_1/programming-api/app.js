import * as programmingAssignmentService from './services/programmingAssignmentService.js'
import * as gradingQueueService from './services/gradingQueueService.js'
import { serve } from './deps.js'

export let controllers = new Set()

// Handle new submission POST request
const handlePost = async (request) => {
  try {
    // Data from the request body
    const { code, assignment_id } = await request.json()
    const userId = request.headers.get('X-User-Id')

    // Check if the user has already submitted the same code for the same assignment
    const matchingSubmission =
      await programmingAssignmentService.findMatchingSubmission(
        assignment_id,
        userId,
        code
      )
    if (matchingSubmission) {
      return new Response(JSON.stringify(matchingSubmission), { status: 200 })
    }

    // If not, Insert the submission to the database
    const submission = await programmingAssignmentService.insertNewSubmission(
      userId,
      code,
      assignment_id
    )

    // Add the submission to the grading queue
    gradingQueueService.sendToQueue(submission)

    // Return the submission
    return new Response(JSON.stringify(submission), { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response(e, { status: 500 })
  }
}

// Open datastream to the client to handle real time updates
const handleStatus = async (request, urlPatternResult) => {
  let controller
  const id = urlPatternResult.pathname.groups.id

  const body = new ReadableStream({
    start(c) {
      controller = c
      controllers.add({ controller: controller, submissionId: id })
    },
    cancel() {
      controllers.delete({ controller: controller, submissionId: id })
    },
  })

  console.log('New client connected')
  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*',
      Connection: 'keep-alive',
    },
  })
}

// Handle GET request for the first undone assignment
const handleGetFirstUndone = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const assignment = await programmingAssignmentService.getFirstUndone(userId)
    if (!assignment) {
      return new Response('No undone assignments', { status: 404 })
    }
    return new Response(JSON.stringify(assignment), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response(error, { status: 500 })
  }
}

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/assignments/undone' }),
    fn: handleGetFirstUndone,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/assignments/status/:id' }),
    fn: handleStatus,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/assignments/submit' }),
    fn: handlePost,
  },
]

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  )

  if (!mapping) {
    console.log('Not found')
    return new Response('Not found', { status: 404 })
  }

  const mappingResult = mapping.pattern.exec(request.url)
  return await mapping.fn(request, mappingResult)
}

const portConfig = { port: 7777, hostname: '0.0.0.0' }
serve(handleRequest, portConfig)
