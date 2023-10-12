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
  })

</script>

{#if question.question_title}
<div>
  <BackButton />
  <h1>{question.question_title}</h1>
  <p>{question.question_text}</p>

  <h2 class="my-5">Funtionality</h2>
  <ul>
    <li>Answer question</li>
    <li>List answers</li>
    <li>Upvote answer</li>
  </ul>

  <h2>Answers:</h2>
  {#each question.answers as answer}
    <div class="rounded-lg m-5 p-5 text-white bg-goodblue flex items-center">
      <div class="flex-auto w-64">
        <h1>{answer.answer_text}</h1>
      </div>
      <div class="flex-none w-14">
        <p>{answer.upvotes}</p>
      </div>
    </div>
  {/each}

  <AddAnswer question_id={id} />

</div>
{:else}
  <p>Loading...</p>
{/if}