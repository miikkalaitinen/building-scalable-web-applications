INSERT INTO courses (course_name, course_description) VALUES ('Intro to SQL', 'Learn the basics of SQL');
INSERT INTO courses (course_name, course_description) VALUES ('Intro to Python', 'Learn the basics of Python');

INSERT INTO questions (question_title, question_text, user_id, course_id) VALUES ('How do I filter selected tables?','What is the keywords for this?', '00000000-0000-0000-0000-000000000000', 1);
INSERT INTO questions (question_title, question_text, user_id, course_id) VALUES ('How do I create a table?','I tried INSERT INTO tables.', '00000000-0000-0000-0000-000000000000', 1);

INSERT INTO questions (question_title, question_text, user_id, course_id) VALUES ('How to make a for loop in Python', 'How to do?','00000000-0000-0000-0000-000000000000', 2);
INSERT INTO questions (question_title, question_text, user_id, course_id) VALUES ('How to make a while loop in Python','I do not understand how while works.', '00000000-0000-0000-0000-000000000000', 2);

INSERT INTO answers (answer_text, user_id, question_id) VALUES ('Use the WHERE clause', '00000000-0000-0000-0000-000000000000', 1);
INSERT INTO answers (answer_text, user_id, question_id) VALUES ('CREATE TABLE', '00000000-0000-0000-0000-000000000000', 2);

INSERT INTO answers (answer_text, user_id, question_id) VALUES ('Use the for keyword', '00000000-0000-0000-0000-000000000000', 3);
INSERT INTO answers (answer_text, user_id, question_id) VALUES ('Use the while keyword', '00000000-0000-0000-0000-000000000000', 4);

INSERT INTO upvotes (user_id, answer_id) VALUES ('00000000-0000-0000-0000-000000000000', 1);
INSERT INTO upvotes (user_id, answer_id) VALUES ('00000000-0000-0000-0000-000000000000', 4);