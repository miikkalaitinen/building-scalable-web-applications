# Running end to end tests

Run the E2E tests with the following command.

```
docker compose run --entrypoint=npx e2e-playwright playwright test && docker compose rm -sf
```

- GET courses
- GET course by id with questions
- GET questions by id with answers
- POST answer, check if it is added to the question
- Check order after upvote
