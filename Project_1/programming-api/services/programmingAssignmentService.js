import { sql } from '../database/database.js'

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignments;`
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
      WHERE user_uuid = ${user_uuid}
    )
  );
  `
}

const addSubmission = async (
  user_uuid,
  code,
  assignment_id,
  submission_status,
  grader_feedback,
  correct
) => {
  return await sql`
  INSERT INTO programming_assignment_submissions (user_uuid, code, programming_assignment_id, submission_status, grader_feedback, correct)
  VALUES (${user_uuid}, ${code}, ${assignment_id}, ${submission_status}, ${grader_feedback}, ${correct})
  RETURNING *;
  `
}

export { findAll, firstUndone, getTestCode, findMatching }
