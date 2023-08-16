<script>

  const getTodos = () => {
    const data = fetch("/api/todos").then((res) =>
      res.json()
    );
  };

  let todos = getTodos() || [];
  let input = "";

  const addTodo = () => {
    const data = {
      item: input,
    };

    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        todos = getTodos();
        input = "";
      }
    });
  };

  const deleteTodo = (id) => {
    fetch(`/api/todos/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        todos = getTodos();
      }
    });
  };
</script>

<h1>Todolist</h1>

{#if todos.length === 0}
  <p>No todos found</p>
{:else}
  <ul>
    {#each todos as todo}
      <li>{todo.item}</li>
      <button on:click={deleteTodo(todo.id)}>Delete</button>
    {/each}
  </ul>
{/if}

<input type="text" placeholder="Add todo item" bind:value={input}/>
<button on:click={addTodo}>Add Todo</button>