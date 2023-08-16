FROM lukechannings/deno:v1.36.0

EXPOSE 7777

WORKDIR /todo-api

COPY deps.js .

RUN deno cache deps.js

COPY . .

CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--no-check", "app.js" ]