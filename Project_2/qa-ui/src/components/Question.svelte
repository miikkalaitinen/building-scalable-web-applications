<script>
  import { onMount } from "svelte"
  import { userUuid } from "../stores/stores.js"
  import AddAnswer from "./AddAnswer.svelte";
  import BackButton from "./BackButton.svelte"

  export let id;

  let question = {};

  onMount(async () => {
    const res = await fetch(`/api/questions/${id}`, {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    })
    question = await res.json()

    const host = window.location.hostname;
    webSocket = new WebSocket(`ws://${host}:7800/api/socket/answer`);
    webSocket.onmessage = (event) => {
      console.log(event.data);
    };
  })

  const handleUpvote = async (answer_id) => {
    const res = await fetch(`/api/upvote`, {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
      },
      body: JSON.stringify({
        answer_id: answer_id,
      })
    })
  }

  const handleRemoveUpvote = async (answer_id) => {
    const res = await fetch(`/api/upvote?answer_id=${answer_id}`, {
      method: "DELETE",
      headers: {
        'X-User-Id': $userUuid,
      },
    })
  }

</script>

{#if question.question_title}
<div>
  <BackButton />

  <h1 class="mb-4 text-xl">Question: {question.question_title}</h1>
  <p class="mb-2 text-md">{question.question_text}</p>

  <h2 class="mb-4 text-lg my-5">Answers:</h2>
  {#each question.answers as answer}
    <div class="rounded-lg m-5 p-5 text-white bg-goodblue flex items-center">
      <div class="flex-auto w-64">
        <h1>{answer.answer_text}</h1>
      </div>
      <div class="flex-none w-14 flex items-center">
        <p>{answer.upvotes}</p>
        {#if answer.user_upvoted}
          <button on:click={() => handleRemoveUpvote(answer.answer_id)}>
            <img src="/upvote_green.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
          </button>
        {:else}
          <button on:click={() => handleUpvote(answer.answer_id)}>
            <img src="/upvote_black.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
          </button>
        {/if}
      </div>
    </div>
  {/each}

  <AddAnswer question_id={id} />

</div>
{:else}
  <p>Loading...</p>
{/if}