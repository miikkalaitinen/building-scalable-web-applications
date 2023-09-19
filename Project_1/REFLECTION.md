## Description of the project

This project was overall quite educational and useful. Learing to use the redis streams will come very hany in the future.

The application contains the frontend: programming-ui, backend: programmin-api, and grader: grader-api, as well as a postgresql database and a redis database. The http routing is done with nginx. Frontend request are handled by the programmin-api, which processes the requests and requests data from the postgresql database and sometimes redis cache.

The posting submissions are handled as a post requests from the frontend to the programming-api which
forwards the submission to "graderQueue" redis stream, after a few checks, such as if the user has already submitted the same assignment. The grader-api then processes the submissions from the "graderQueue" redis stream by querying the stream.

When the grader gets a submission from the stream, it will try to delete it. If deleting form the stream is succesfull, meaning that the submission was not already processed, the grader will grade the submission. If the deletion was not succesfull, the grader will continue querying the stream since some other grader is already processing the submission.

After the grading is complete, the grader posts the result back to the programming-api, which then sends the result back to the frontend via a websocket connection.

## Possible improvements

One easy improvement to the application would be to cache the assignment data to redis. This would require changing the way i implemented the quering of undone assignments, but would propably improve the inital loading of the page.

To make the application truly scalable the redis database should be clustered and the programming api should be implemented so that it can be scaled horizontally. This would require some changes to the application, such as a load balancer for the programming-api that would distribute the requests to multiple instances of the programming-api.

Code wise, the error handling of both the backend and the frontend should be improved, since the current error handling is very minimal. Also the frontend could be improved by adding some more features, such as a way to view the submissions and their results.
