import * as todoService from './services/todoService.js'
import { cacheMethodCalls } from './util/cacheUtil.js'
const SERVER_ID = crypto.randomUUID()

const cacheTodoService = cacheMethodCalls(todoService, [
  'addTodo',
  'deleteTodo',
])

const handlePostTodo = async (request) => {
  try {
    const todo = await request.json()
    if (!todo.item) return new Response('Invalid data', { status: 401 })
    await cacheTodoService.addTodo(todo.item)
    return new Response('OK', { status: 200 })
  } catch {
    return new Response('Invalid data', { status: 400 })
  }
}

const handleDeleteTodo = async (request, urlPatternResult) => {
  try {
    const id = urlPatternResult.pathname.groups.id
    await cacheTodoService.deleteTodo(id)
    return new Response('OK', { status: 200 })
  } catch {
    return new Response('Item not found', { status: 404 })
  }
}

const handleGetTodo = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id
  const item = await cacheTodoService.getTodo(id)
  if (item.length == 0) {
    return Response.json(item[0])
  } else {
    return new Response('Item not found', { status: 404 })
  }
}

const handleGetTodos = async (request) => {
  const items = await cacheTodoService.getTodos()
  return Response.json(items)
}

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleGetTodo,
  },
  {
    method: 'DELETE',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleDeleteTodo,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handlePostTodo,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handleGetTodos,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/' }),
    fn: () => new Response(`Hello world from ${SERVER_ID}!`),
  },
]

const handleRequest = async (request) => {
  try {
    const mapping = urlMapping.find(
      (um) => um.method === request.method && um.pattern.test(request.url)
    )

    if (!mapping) {
      return new Response('Route not found', { status: 404 })
    }

    const mappingResult = mapping.pattern.exec(request.url)
    return await mapping.fn(request, mappingResult)
  } catch (e) {
    return new Response(e.stack, { status: 500 })
  }
}

Deno.serve({ port: 7777 }, handleRequest)
