import * as programmingAssignmentService from './services/programmingAssignmentService.js'
import * as gradingQueueService from './services/gradingQueueService.js'
import * as databse from './database/database.js'
import { serve } from './deps.js'

export let sockets = new Set()

const handlePost = async (request) => {
  try {
    const { code, assignment_id } = await request.json()
    const userId = request.headers.get('X-User-Id')

    const matchingSubmission =
      await programmingAssignmentService.findMatchingSubmission(
        assignment_id,
        userId,
        code
      )
    if (matchingSubmission) {
      return new Response(JSON.stringify(matchingSubmission), { status: 200 })
    }

    if (gradingQueueService.user_queue.has(userId)) {
      return new Response('Already in queue', { status: 200 })
    }

    const test_code = await programmingAssignmentService.getTestCode(
      assignment_id
    )

    if (!test_code) {
      return new Response('No test code found', { status: 500 })
    }

    const submission = await programmingAssignmentService.insertNewSubmission(
      userId,
      code,
      assignment_id
    )

    gradingQueueService.sendToQueue(submission, test_code)
    return Response.json(submission)
  } catch (e) {
    console.log(e)
    return new Response(e, { status: 500 })
  }
}

const handleStatus = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id
  const { socket, response } = Deno.upgradeWebSocket(request)

  sockets.add({ socket, id })

  socket.onclose = () => {
    sockets.delete({ socket, id })
  }

  return response
}

const handleResetAssignments = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    await databse.removeUserAssignments(userId)
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(error, { status: 500 })
  }
}

const handleGetFirstUndone = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const assignment = await programmingAssignmentService.getFirstUndone(userId)
    if (!assignment) {
      return new Response(null, { status: 204 })
    }
    return new Response(JSON.stringify(assignment), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response(error, { status: 500 })
  }
}

const handleGetPoints = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const points = await programmingAssignmentService.getUserPoints(userId)
    return new Response(JSON.stringify({ points: points }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response(error, { status: 500 })
  }
}

const handlePostFeedback = async (request) => {
  try {
    const result = await request.json()
    await gradingQueueService.user_queue.delete(result.user_uuid)

    const response = await programmingAssignmentService.updateSubmission(
      result.submissionId,
      result.feedback,
      result.correct
    )

    sockets.forEach(({ socket, id }) => {
      if (id == result.submissionId) {
        socket.send(JSON.stringify({ test_status: result.status, ...response }))
        socket.close()
        sockets.delete({ socket, id })
      }
    })

    return new Response('OK', { status: 200 })
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
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/assignments/reset' }),
    fn: handleResetAssignments,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/users/points' }),
    fn: handleGetPoints,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/grader' }),
    fn: handlePostFeedback,
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
