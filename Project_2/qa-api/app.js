import { serve } from './deps.js'
import * as qaApiService from './services/qaApiService.js'

// const handleRequest = async (request) => {
//   const data = await request.json();

//   const response = await fetch("http://llm-api:7000/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return response;
// };

const handleGetCourses = async (request) => {
  try {
    const courses = await qaApiService.handleGetAllCourses()
    return new Response(JSON.stringify(courses), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const handleGetCourse = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id
    const userId = await request.headers.get('X-User-Id')
    const course = await qaApiService.handleGetCourse(id, userId)
    return new Response(JSON.stringify(course), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const handleGetQuestion = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.question_id
    const userId = await request.headers.get('X-User-Id')
    const questions = await qaApiService.handleGetQuestion(id, userId)
    return new Response(JSON.stringify(questions), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const handlePostQuestion = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const { course_id, question_title, question_description } =
      await request.json()
    const newQuestion = await qaApiService.handlePostQuestion(
      course_id,
      question_title,
      question_description,
      userId
    )
    return new Response(JSON.stringify(newQuestion), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const handlePostAnswer = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const { question_id, answer_text } = await request.json()
    const newAnswer = await qaApiService.handlePostAnswer(
      question_id,
      answer_text,
      userId
    )
    return new Response(JSON.stringify(newAnswer), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/courses' }),
    fn: handleGetCourses,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/courses/:id' }),
    fn: handleGetCourse,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/questions/:question_id' }),
    fn: handleGetQuestion,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/questions' }),
    fn: handlePostQuestion,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/answers' }),
    fn: handlePostAnswer,
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
