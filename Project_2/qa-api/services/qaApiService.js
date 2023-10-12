import * as database from '../database/database.js'

const handleGetAllCourses = async () => {
  const courses = await database.getCourses()
  return courses
}

const handleGetCourse = async (id, user_id) => {
  const res = await database.getCourse(id)

  if (!res) {
    return null
  }
  const course = res[0]
  const questions = await database.getQuestions(course.course_id)

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

const handleGetQuestion = async (id, user_id) => {
  const res = await database.getQuestion(id)

  if (!res) {
    return null
  }
  const question = res[0]
  const answers = await database.getAnswers(question.question_id)

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

const handlePostQuestion = async (
  course_id,
  question_title,
  question_description,
  user
) => {
  if (!course_id || !question_title || !question_description || !user) {
    throw new Error('Missing required fields')
  }
  const res = await database.addQuestion(
    course_id,
    question_title,
    question_description,
    user
  )
  return res[0]
}

const handlePostAnswer = async (question_id, answer, user) => {
  if (!question_id || !answer || !user) {
    throw new Error('Missing required fields')
  }
  const res = await database.addAnswer(question_id, answer, user)
  return res[0]
}

const handlePostUpvote = async (question_id, answer_id, user) => {
  if ((!question_id && !answer_id) || !user) {
    throw new Error('Missing required fields')
  }
  const res = await database.addUpvote(question_id, answer_id, user)
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
  handlePostQuestion,
  handlePostAnswer,
  handlePostUpvote,
  handleDeleteUpvote,
}
