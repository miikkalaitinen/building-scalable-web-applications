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
</script>

{#if course.course_name}
<div>
  <BackButton />
  <h1>{course.course_name}</h1>
  <p>{course.course_description}</p> 

  <h2 class="my-5">Funtionality</h2>
  <ul>
    <li>Create new questions</li>
    <li>List questions</li>
    <li>Upvote questions</li>
    <li>Open question</li>
  </ul>

  <h2 class="my-5">Questions</h2>

  {#each course.questions as question}
  <a href={`/question/${question.question_id}`}>
    <div class="rounded-lg m-5 p-5 text-white bg-goodblue flex items-center">
      <div class="flex-auto w-64">
        <h1>{question.question_title}</h1>
      </div>
      <div class="flex-none w-14">
        <p>{question.upvotes}</p>
      </div>
    </div>
  </a>
  {/each}

  <AddQuestion course_id={id} />
</div>
{:else}
  <p>Loading...</p>
{/if}