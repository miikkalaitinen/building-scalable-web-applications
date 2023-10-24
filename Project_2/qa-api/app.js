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

export let sockets = new Set()

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

const handleGetQuestions = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id
    const userId = await request.headers.get('X-User-Id')
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page'))
    const questions = await qaApiService.handleGetQuestions(id, userId, page)
    return new Response(JSON.stringify(questions), {
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
    if (!course_id || !question_title || !question_description || !userId) {
      throw new Error('Missing required fields')
    }
    if (qaApiService.question_timeouts.has(userId)) {
      return new Response('You can post at most one question in 60 seconds', {
        status: 429,
      })
    }

    qaApiService.question_timeouts.add(userId)
    setTimeout(() => {
      qaApiService.question_timeouts.delete(userId)
    }, 60000)

    const res = await qaApiService.handlePostQuestion(
      course_id,
      question_title,
      question_description,
      userId
    )
    if (!res) throw new Error('Something failed, no Error was thrown')
    return new Response('OK', { status: 201 })
  } catch (error) {
    console.log(error)
    return new Response(error, { status: 500 })
  }
}

const handlePostAnswer = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const { question_id, answer_text } = await request.json()

    if (!question_id || !answer_text || !userId) {
      throw new Error('Missing required fields')
    }

    if (qaApiService.answer_timeouts.has(userId)) {
      return new Response('You can post at most one answer in 60 seconds', {
        status: 429,
      })
    }

    qaApiService.answer_timeouts.add(userId)
    setTimeout(() => {
      qaApiService.answer_timeouts.delete(userId)
    }, 60000)

    const res = await qaApiService.handlePostAnswer(
      question_id,
      answer_text,
      userId
    )
    if (!res) throw new Error('Something failed, no Error was thrown')
    return new Response('OK', { status: 201 })
  } catch (error) {
    console.log(error)
    return new Response(error, { status: 500 })
  }
}

const handlePostUpvote = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const { question_id, answer_id } = await request.json()
    const newUpvote = await qaApiService.handlePostUpvote(
      question_id,
      answer_id,
      userId
    )
    return new Response(JSON.stringify(newUpvote), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const handleDeleteUpvote = async (request) => {
  try {
    const userId = await request.headers.get('X-User-Id')
    const url = new URL(request.url)
    const answer_id = url.searchParams.get('answer_id')
    const question_id = url.searchParams.get('question_id')
    const deletedUpvote = await qaApiService.handleDeleteUpvote(
      question_id,
      answer_id,
      userId
    )
    return new Response(JSON.stringify(deletedUpvote), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const handleSocket = async (request, urlPatternResult) => {
  try {
    const type = urlPatternResult.pathname.groups.type
    const { socket, response } = Deno.upgradeWebSocket(request)
    let id =
      (Math.random() + 1).toString(36).substring(7) +
      (Math.random() + 1).toString(36).substring(7)

    socket.onopen = () => {
      sockets.add({ socket, type, id })
    }

    socket.onclose = () => {
      sockets.forEach((client) => {
        if (client.id === id) {
          sockets.delete(client)
        }
      })
    }

    socket.onerror = (error) => {
      console.log(error)
    }

    return response
  } catch (error) {
    console.log(error)
    return new Response('Internal server error', { status: 500 })
  }
}

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/socket/:type' }),
    fn: handleSocket,
  },
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
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/upvote' }),
    fn: handlePostUpvote,
  },
  {
    method: 'DELETE',
    pattern: new URLPattern({ pathname: '/upvote' }),
    fn: handleDeleteUpvote,
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
