import { cacheMethodCalls } from './util/cacheUtil.js'
import todoService from './services/todoService.js'

const handleGetRoot = async (request) => {
  return new Response('Hello world at root!')
}

const cachedTodoService = cacheMethodCalls(todoService, [
  'addTodo',
  'deleteTodoById',
])

const handleDeleteTodo = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id
  if (isNaN(id)) return new Response('Not found', { status: 404 })
  try {
    const item = await cachedTodoService.deleteTodoById(id)
    if (item) {
      return Response.json(item)
    }
  } catch (e) {
    console.error(e)
    return new Response('Not found', { status: 404 })
  }
  return new Response('Not found', { status: 404 })
}

const handleGetTodo = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id
  if (isNaN(id)) return new Response('Not found', { status: 404 })
  try {
    const item = await cachedTodoService.getTodoById(id)
    console.log('ITEM', item)
    if (item.length > 0) {
      return Response.json(item[0])
    }
    return new Response('Not found', { status: 404 })
  } catch (e) {
    return new Response('Not found', { status: 404 })
  }
}

const handleGetTodos = async (request) => {
  const todos = await cachedTodoService.getTodos()
  return Response.json(todos)
}

const handlePostTodos = async (request) => {
  try {
    const ret = await request.json()
    console.log(ret)
    if (ret.item) {
      const todo = await cachedTodoService.addTodo(ret.item)
      console.log('TODO', todo)
      return Response.json(todo)
    }
    return new Response('Bad request', { status: 400 })
  } catch (e) {
    console.log(e)
    return new Response('Bad request', { status: 400 })
  }
}

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleGetTodo,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handleGetTodos,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handlePostTodos,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/' }),
    fn: handleGetRoot,
  },
  {
    method: 'DELETE',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleDeleteTodo,
  },
]

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  )

  if (!mapping) {
    return new Response('Not found', { status: 404 })
  }

  const mappingResult = mapping.pattern.exec(request.url)
  return await mapping.fn(request, mappingResult)
}

const portConfig = { port: 7777, hostname: '0.0.0.0' }
Deno.serve(portConfig, handleRequest)
