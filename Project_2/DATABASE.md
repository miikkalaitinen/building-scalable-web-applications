# Database

The database schema includes four tables: `courses`, `questions`, `answers`, and `upvotes`.
These tables include the relevant information for each, such as name, description, created_at, update_at.

Some of the tables have foreign keys to other tables, such as `questions` having a foreign key to `course_id`, in order to link the question to the course it is associated with. This could have also been done with a join table, but on a such a small and simple database, with such simple requirements, using a join table would have more complicated. There are also no need for many-to-many relationships, so a join table would not be necessary.

The indexes set for the database are based on the queries the backend will be making to the database.
They are pretty straightforward, simply indexing by the foreing key columns, since those are the only non primary key columns that will be used in the queries.

## Caching

The are is a redis caching for the non editable data, such as courses and questions. This is done in order to reduce the number of queries to the database, and to improve the performance of the backend. However, since the sites data is updated quite often (questions and answers), the caching is not used for those.
In a real world scenario, the caching could be re-thought so that the setting and deleting big caches (like a whole list of answers) would be avoided. Also, if having delay in the data being updated is not a problem, the caching could be easily used for the questions and answers as well by setting a time to live for the cache.
