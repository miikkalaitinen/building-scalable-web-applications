import { postgres } from '../deps.js'

const sql = postgres({})

const getCourses = async () => {
  return await sql`SELECT * FROM courses`
}

const getCourse = async (id) => {
  return await sql`SELECT * FROM courses WHERE course_id = ${id}`
}

const getQuestions = async (course_id) => {
  return await sql`SELECT * FROM questions WHERE course_id = ${course_id}`
}

const getQuestion = async (question_id) => {
  return await sql`SELECT * FROM questions WHERE question_id = ${question_id}`
}

const getAnswers = async (question_id) => {
  return await sql`SELECT * FROM answers WHERE question_id = ${question_id}`
}

const getUpvotes = async (question_ids, answer_ids) => {
  if (question_ids && answer_ids) {
    console.log('question_id and answer_id')
    return await sql`SELECT * FROM upvotes WHERE question_id IN ${sql(
      question_ids
    )} AND answer_id IN ${sql(answer_ids)}`
  } else if (question_ids) {
    return await sql`SELECT * FROM upvotes WHERE question_id IN ${sql(
      question_ids
    )}`
  } else if (answer_ids) {
    return await sql`SELECT * FROM upvotes WHERE answer_id IN ${sql(
      answer_ids
    )}`
  } else return null
}

const addQuestion = async (
  course_id,
  question_title,
  question_description,
  user
) => {
  return await sql`
  INSERT INTO questions (course_id, question_title, question_text, user_id)
  VALUES (${course_id}, ${question_title}, ${question_description}, ${user})
  RETURNING *;
  `
}

const addAnswer = async (question_id, answer, user) => {
  return await sql`
  INSERT INTO answers (question_id, answer_text, user_id)
  VALUES (${question_id}, ${answer}, ${user})
  RETURNING *;
  `
}

export {
  getCourses,
  getCourse,
  getQuestions,
  getQuestion,
  getAnswers,
  getUpvotes,
  addQuestion,
  addAnswer,
}
