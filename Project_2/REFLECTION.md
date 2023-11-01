# Reflection of the assingment:

This assingment was at the same time very intresting and also quite frustrating, especially when configuring the kubernetes part of the assignment. The application itself was quite easy and straithforward:

The frontend consists of a few svelte components, and there is really nothing fancy going on. I did, however, have some fun while styling the frontend. For a real application more time would be needed to make it work on mobile devices.

The backend, once again it nothing fancy, quite standard get and post calls. I decided to implement the automatic updates via websockets, which are opened when the user get onto a page with live updates. The new questions / answers are broadcasted to other backend instances using redis events, which turned out quite easy to implement. With new questions, the backend also posts the message to the llm-api, and then broadcasts the answers to the frontends when they are received back.

Deploying the application to docker was quite easy, since I have a lot of experience using docker thanks to work. However, I had not used kubernetes before this course and I found the course example project quite lacking when it came to to deploy a true fullstack application. I also ran into some errors, such as the llm-apis crashing due to running out of memory when ran in kubernetes, if there was more than one instance running. I also had some hardship with getting the routing inside kube to work, as well as getting an ingress to work so that the applications is accessible from outside the cluster and that the requests to the api are redirectd to the correct service.

All and all this project to a lot of time. That said, I also did learn a ton while doing it. All and all I would have liked the course materials to have a bit more information about how to deploy a fullstack application to kubernetes, as well as how to configure the ingress and routing, since the materials available on the internet are all over the place and the kubernetes documentation is really quite hard to chew on for a beginner.

KNOWN ISSUES:

- If a course or a question is opened from a straight link the back button does not function.
- If left for a long time on the site, the websocket connection might be lost and the site needs to be refreshed.
- Startup can take a while
