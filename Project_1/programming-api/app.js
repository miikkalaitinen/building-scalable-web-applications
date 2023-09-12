import * as programmingAssignmentService from './services/programmingAssignmentService.js'
import { serve } from './deps.js'
import { sql } from './database/database.js'

const handlePost = async (request) => {
  const { code, assignment_id } = await request.json()
  const userId = request.headers.get('X-User-Id')

  // Check if the user has already submitted the same code for the same assignment
  const matchingSubmissions = await programmingAssignmentService.findMatching(
    userId,
    code,
    assignment_id
  )
  if (matchingSubmissions[0]) {
    return new Response(JSON.stringify(matchingSubmissions[0]), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Send the code to the grader
  const testCode = await programmingAssignmentService.getTestCode(assignment_id)
  const data = {
    testCode: testCode,
    code: code,
  }

  const response = await fetch('http://grader-api:7000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  // Save the submission to the database

  const graderResponse = await response.json()

  const result = await programmingAssignmentService.addSubmission(
    user_uuid,
    code,
    assignment_id,
    submission_status,
    grader_feedback,
    correct
  )

  return new Response(JSON.stringify(result[0]), { status: 404 })
}

const handleGetFirstUndone = async (request) => {
  const userId = request.headers.get('X-User-Id')
  const undoneAssignment = await programmingAssignmentService.firstUndone(
    userId
  )
  if (!undoneAssignment[0]) {
    return new Response('Not found', { status: 404 })
  }
  return new Response(JSON.stringify(undoneAssignment[0]), {
    headers: { 'Content-Type': 'application/json' },
  })
}

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/assignments/undone' }),
    fn: handleGetFirstUndone,
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
