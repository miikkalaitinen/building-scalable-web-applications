<script>
import { onMount } from "svelte";
import Card from "./Card.svelte";

let todos = [];
let todoInput = '';

const getTodos = async () => {
    const res = await fetch('/api/todos')
    const fetchdTodos = await res.json();
    return fetchdTodos;
}

const addTodo = async () => {
    const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: todoInput })
    })
    if (!res.ok) {
        throw new Error('Could not add todo')
    }
    todos = [...todos, { item: todoInput }];
    todoInput = '';
}
const deleteTodo = todo => async () => {
    const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE'
    })
    if (!res.ok) {
        throw new Error('Could not delete todo')
    }
    todos = todos.filter(t => t.id !== todo.id);
}

onMount(() => {
    getTodos().then(fetched => {
        todos = fetched;
    })
})
</script>
<ul class="link-card-grid">
    {#each todos as todo}
        <Card todo={todo} onDelete={deleteTodo(todo)}/>
    {/each}
</ul>
<input bind:value={todoInput} placeholder="Add new todo"/>
<button on:click={addTodo}>Add new todo</button>
<style>
	.link-card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(24ch, 1fr));
		gap: 1rem;
		padding: 0;
	}
    button {
		font-weight: 800;
        width: 100%;
        background-color: rgb(var(--accent));
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    input {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
</style>