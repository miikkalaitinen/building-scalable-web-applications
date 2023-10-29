import * as database from '../database/database.js'
import { pubClient } from './pubService.js'
import { subClient } from './subService.js'
import { createClient } from '../deps.js'

export const redis = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})

await redis.connect()

export const question_timeouts = new Set()
export const answer_timeouts = new Set()

const handleGetAllCourses = async () => {
  const cache = await redis.get(`courses`)
  if (cache) {
    console.log('redis')
    return JSON.parse(cache)
  }
  const courses = await database.getCourses()
  redis.set(`courses`, JSON.stringify(courses))
  return courses
}

const handleGetCourse = async (id, user_id) => {
  let course = null
  const cache = await redis.get(`course_${id}`)
  if (cache) {
    console.log('redis')
    course = JSON.parse(cache)
  } else {
    const res = await database.getCourse(id)
    if (!res) {
      return null
    }
    redis.set(`course_${id}`, JSON.stringify(res[0]))
    course = res[0]
  }

  const questions = await database.getQuestions(course.course_id, 0)

  const questionIds = questions.map((question) => question.question_id)
  const upvotes = await database.getUpvotes(questionIds, null)

  const result = questions.map((question) => {
    const questionUpvotes = upvotes.filter(
      (upvote) => upvote.question_id === question.question_id
    )

    const userUpvoted = questionUpvotes.find(
      (upvote) => upvote.user_id === user_id
    )
    const userUpvoteCount = questionUpvotes.length

    return {
      ...question,
      upvotes: userUpvoteCount,
      user_upvoted: !!userUpvoted,
    }
  })

  return {
    ...course,
    questions: result,
  }
}

const handleGetQuestions = async (id, user_id, page) => {
  let course = null
  const cache = await redis.get(`course_${id}`)
  if (cache) {
    console.log('redis')
    course = JSON.parse(cache)
  } else {
    const res = await database.getCourse(id)
    if (!res) {
      return null
    }
    redis.set(`course_${id}`, JSON.stringify(res[0]))
    course = res[0]
  }
  const questions = await database.getQuestions(course.course_id, page)

  const questionIds = questions.map((question) => question.question_id)
  const upvotes = await database.getUpvotes(questionIds, null)

  const result = questions.map((question) => {
    const questionUpvotes = upvotes.filter(
      (upvote) => upvote.question_id === question.question_id
    )

    const userUpvoted = questionUpvotes.find(
      (upvote) => upvote.user_id === user_id
    )
    const userUpvoteCount = questionUpvotes.length

    return {
      ...question,
      upvotes: userUpvoteCount,
      user_upvoted: !!userUpvoted,
    }
  })

  return result
}

const handleGetQuestion = async (id, user_id) => {
  let question = null
  const cache = await redis.get(`question_${id}`)
  if (cache) {
    console.log('redis')
    question = JSON.parse(cache)
  } else {
    const res = await database.getQuestion(id)
    if (!res) {
      return null
    }
    redis.set(`question_${id}`, JSON.stringify(res[0]))
    question = res[0]
  }

  const answers = await database.getAnswers(question.question_id, 0)

  const answerIds = answers.map((answer) => answer.answer_id)
  const upvotes = await database.getUpvotes(null, answerIds)

  const result = answers.map((answer) => {
    const answerUpvotes = upvotes.filter(
      (upvote) => upvote.answer_id === answer.answer_id
    )

    const userUpvoted = answerUpvotes.find(
      (upvote) => upvote.user_id === user_id
    )
    const userUpvoteCount = answerUpvotes.length

    return {
      ...answer,
      upvotes: userUpvoteCount,
      user_upvoted: !!userUpvoted,
    }
  })

  return {
    ...question,
    answers: result,
  }
}

const handleGetAnswers = async (id, user_id, page) => {
  let question = null
  const cache = await redis.get(`question_${id}`)
  if (cache) {
    console.log('redis')
    question = JSON.parse(cache)
  } else {
    const res = await database.getQuestion(id)
    if (!res) {
      return null
    }
    redis.set(`question_${id}`, JSON.stringify(res[0]))
    question = res[0]
  }

  const answers = await database.getAnswers(question.question_id, page)

  const answerIds = answers.map((answer) => answer.answer_id)
  const upvotes = await database.getUpvotes(null, answerIds)

  const result = answers.map((answer) => {
    const answerUpvotes = upvotes.filter(
      (upvote) => upvote.answer_id === answer.answer_id
    )

    const userUpvoted = answerUpvotes.find(
      (upvote) => upvote.user_id === user_id
    )
    const userUpvoteCount = answerUpvotes.length

    return {
      ...answer,
      upvotes: userUpvoteCount,
      user_upvoted: !!userUpvoted,
    }
  })

  return result
}

const handlePostQuestion = async (
  course_id,
  question_title,
  question_description,
  user
) => {
  const res = await database.addQuestion(
    course_id,
    question_title,
    question_description,
    user
  )
  pubClient.publish(
    'qa',
    JSON.stringify({
      type: 'question',
      data: { ...res[0], upvotes: 0, user_upvoted: false },
    })
  )
  return res[0]
}

const handlePostAnswer = async (question_id, answer, user) => {
  const res = await database.addAnswer(question_id, answer, user)
  pubClient.publish(
    'qa',
    JSON.stringify({
      type: 'answer',
      data: { ...res[0], upvotes: 0, user_upvoted: false },
    })
  )
  await redis.del(`question_${question_id}`)
  return true
}

const handlePostUpvote = async (question_id, answer_id, user) => {
  if ((!question_id && !answer_id) || !user) {
    throw new Error('Missing required fields')
  }
  const res = await database.addUpvote(question_id, answer_id, user)
  if (question_id) {
    await redis.del(`question_${question_id}`)
  } else if (answer_id) {
    await redis.del(`answer_${answer_id}`)
  }
  return res[0]
}

const handleDeleteUpvote = async (question_id, answer_id, user) => {
  if ((!question_id && !answer_id) || !user) {
    throw new Error('Missing required fields')
  }
  const res = await database.deleteUpvote(question_id, answer_id, user)
  return res[0]
}

export {
  handleGetAllCourses,
  handleGetCourse,
  handleGetQuestion,
  handleGetQuestions,
  handleGetAnswers,
  handlePostQuestion,
  handlePostAnswer,
  handlePostUpvote,
  handleDeleteUpvote,
}
