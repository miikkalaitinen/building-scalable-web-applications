<script>
  import { onMount } from "svelte"
  import { userUuid } from "../stores/stores.js"

  import AddQuestion from "./AddQuestion.svelte";
  import BackButton from "./BackButton.svelte"

  export let id;

  let course = {}

  onMount(async () => {
    const res = await fetch(`/api/courses/${id}`, {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    })
    course = await res.json()
  })

  const handleUpvote = async (question_id) => {
    const res = await fetch(`/api/upvote`, {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
      },
      body: JSON.stringify({
        question_id: question_id,
      })
    })
  }

  const handleRemoveUpvote = async (question_id) => {
    const res = await fetch(`/api/upvote?question_id=${question_id}`, {
      method: "DELETE",
      headers: {
        'X-User-Id': $userUuid,
      },
    })
  }
</script>

{#if course.course_name}
<div>
  <BackButton />
  <h1 class="mb-4 text-xl">Course: {course.course_name}</h1>
  <p class="mb-2 text-md">{course.course_description}</p> 

  <h2 class="mb-4 text-lg my-5">Questions: </h2>

  {#each course.questions as question}
  <div class="rounded-lg m-5 p-5 text-white bg-goodblue flex items-center">
    <a class="flex-auto w-64" href={`/question/${question.question_id}`}>
      <div>
        <h1>{question.question_title}</h1>
      </div>
    </a>
    <div class="flex-none w-14 flex items-center">
      <p>{question.upvotes}</p>
      {#if question.user_upvoted}
        <button on:click={() => handleRemoveUpvote(question.question_id)}>
          <img src="/upvote_green.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
        </button>
      {:else}
        <button on:click={() => handleUpvote(question.question_id)}>
          <img src="/upvote_black.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
        </button>
      {/if}
    </div>
  </div>
  {/each}

  <AddQuestion course_id={id} />
</div>
{:else}
  <p>Loading...</p>
{/if}