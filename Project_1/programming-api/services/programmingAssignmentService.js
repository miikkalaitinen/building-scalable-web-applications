import * as database from '../database/database.js'

const findMatchingSubmission = async (assignmentId, studentId, code) => {
  const matchingSubmissions = await database.findMatching(
    studentId,
    code,
    assignmentId
  )

  if (matchingSubmissions[0]) {
    console.log('Found matching submission')
    return matchingSubmissions[0]
  } else return null
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
    return false
  } else return undoneAssignment[0]
}

export {
  findMatchingSubmission,
  insertNewSubmission,
  getFirstUndone,
  updateSubmission,
}
