/* Create your schema here */

CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  course_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  question_title VARCHAR(255) NOT NULL,
  question_text TEXT NOT NULL,
  user_id UUID,
  course_id INT REFERENCES courses(course_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  answer_text TEXT NOT NULL,
  user_id UUID,
  question_id INT REFERENCES questions(question_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE upvotes (
  upvote_id SERIAL PRIMARY KEY,
  user_id UUID,
  answer_id INT REFERENCES answers(answer_id),
  question_id INT REFERENCES questions(question_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT UC_Answer_Upvote UNIQUE (user_id, answer_id),
  CONSTRAINT UC_Question_Upvote UNIQUE (user_id, question_id)
);

CREATE INDEX questions_course_id_idx ON questions(course_id);
CREATE INDEX answers_question_id_idx ON answers(question_id);
CREATE INDEX upvotes_question_id_idx ON upvotes(question_id);
CREATE INDEX upvotes_answer_id_idx ON upvotes(answer_id);