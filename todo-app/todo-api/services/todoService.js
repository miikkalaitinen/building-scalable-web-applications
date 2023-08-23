import { postgres } from '../deps.js'
const sql = postgres({})

const getTodo = async (id) => {
  const todos = await sql`SELECT * FROM items WHERE id = ${id}`
  return todos[0]
}

const getTodos = async () => {
  return await sql`SELECT * FROM todos`
}

const addTodo = async (item) => {
  return await sql`INSERT INTO todos (item) VALUES (${item}) RETURNING id, item`
}

const deleteTodoById = async (id) => {
  return await sql`DELETE FROM todos WHERE id = ${id}`
}

export default { getTodo, getTodos, addTodo, deleteTodoById }
