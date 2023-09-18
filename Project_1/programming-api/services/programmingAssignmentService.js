import * as database from '../database/database.js'
import { createClient } from 'npm:redis@4.6.4'

const client = createClient({
  url: 'redis://redis:6379',
  pingInterval: 1000,
})
await client.connect()

const findMatchingSubmission = async (assignmentId, studentId, code) => {
  const matchingSubmissions = await database.findMatching(
    studentId,
    code,
    assignmentId
  )

  if (matchingSubmissions[0]) {
    console.log('Found matching submission')
    return matchingSubmissions[0]
  }
  return null
}

const insertNewSubmission = async (studentId, code, assignmentId) => {
  const submission = await database.addSubmission(studentId, code, assignmentId)
  return submission[0]
}

const updateSubmission = async (submissionId, feedback, correct) => {
  console.log(submissionId, feedback, correct)
  const updatedSubmission = await database.updateSubmission(
    submissionId,
    'processed',
    feedback,
    correct
  )
  const submission = updatedSubmission[0]
  return submission
}

// Get the first undone assignment for a student
const getFirstUndone = async (studentId) => {
  const undoneAssignment = await database.firstUndone(studentId)
  if (!undoneAssignment[0]) {
    return null
  }
  return undoneAssignment[0]
}

const getTestCode = async (assignment_id) => {
  let testCode = await client.get(`test_code_${assignment_id}`)
  if (testCode) {
    return testCode
  }

  testCode = await database.getTestCode(assignment_id)
  if (!testCode[0]) {
    return null
  }
  client.set(`test_code_${assignment_id}`, testCode[0].test_code)
  return testCode[0].test_code
}

const getUserPoints = async (studentId) => {
  let userPoints = await client.get(`user_points_${studentId}`)
  if (userPoints) {
    return userPoints
  }

  const ids = await database.findUserPoints(studentId)
  let points = 0
  for (const id in ids) {
    points += 100
  }
  client.set(`user_points_${studentId}`, points)
  return points
}

export {
  findMatchingSubmission,
  insertNewSubmission,
  getFirstUndone,
  updateSubmission,
  getTestCode,
  getUserPoints,
}
