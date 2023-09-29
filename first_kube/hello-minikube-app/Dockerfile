FROM lukechannings/deno:v1.29.2

EXPOSE 7777

WORKDIR /app

COPY . .

RUN deno cache app.js

CMD [ "run", "--allow-net", "--unstable", "app.js" ]
