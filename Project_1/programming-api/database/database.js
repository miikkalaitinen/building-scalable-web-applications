import { postgres } from '../deps.js'

const sql = postgres({})

const findUserPoints = async (user_uuid) => {
  return await sql`
  SELECT DISTINCT programming_assignment_id
  FROM programming_assignment_submissions
  WHERE user_uuid = ${user_uuid} AND correct = true;
  `
}

const findMatching = async (user_uuid, code, assignment_id) => {
  return await sql`SELECT status, grader_feedback, correct FROM programming_assignment_submissions 
    WHERE user_uuid = ${user_uuid} 
    AND code = ${code} 
    AND programming_assignment_id = ${assignment_id};`
}

const getTestCode = async (assignment_id) => {
  return await sql`
    SELECT test_code
    FROM programming_assignments
    WHERE id = ${assignment_id};
    `
}

const firstUndone = async (user_uuid) => {
  return await sql`
  SELECT title, handout, id
  FROM programming_assignments
  WHERE assignment_order = (
    SELECT MIN(assignment_order)
    FROM programming_assignments
    WHERE id NOT IN (
      SELECT programming_assignment_id
      FROM programming_assignment_submissions
      WHERE user_uuid = ${user_uuid} AND correct = true
    )
  );
  `
}

const addSubmission = async (user_uuid, code, assignment_id) => {
  return await sql`
  INSERT INTO programming_assignment_submissions (user_uuid, code, programming_assignment_id)
  VALUES (${user_uuid}, ${code}, ${assignment_id})
  RETURNING *;
  `
}

const updateSubmission = async (id, status, grader_feedback, correct) => {
  return await sql`
  UPDATE programming_assignment_submissions
  SET status = ${status}, grader_feedback = ${grader_feedback}, correct = ${correct}
  WHERE id = ${id} RETURNING status, grader_feedback, correct;
  `
}

const removeUserAssignments = async (id) => {
  return await sql`
  DELETE FROM programming_assignment_submissions
  WHERE user_uuid = ${id};`
}

export {
  firstUndone,
  getTestCode,
  findMatching,
  addSubmission,
  updateSubmission,
  removeUserAssignments,
  findUserPoints,
}
