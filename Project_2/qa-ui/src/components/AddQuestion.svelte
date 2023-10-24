<script>
  import { userUuid } from "../stores/stores";
  export let course_id;

  let show_form = false;
  let question_title = "";
  let question_description = "";

  const postQuestion = () => {

    if (question_title === "") {
      alert("Question title cannot be empty");
      return;
    } else if (question_description === "") {
      alert("Question description cannot be empty");
      return;
    }

    fetch(`/api/questions`, {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        course_id: course_id,
        question_title: question_title,
        question_description: question_description
      })
    })
    .then((res) => {
      if (res.status === 201) {
        question_description = "";
        question_title = "";
        show_form = false;
      } else if (res.status === 429) {
        alert("You are posting too fast. You can post at most once every 60 seconds.");
        return;
      }
    })
    .catch(err => console.log(err));
  }

</script>

{#if !show_form}
  <button on:click={() => show_form = true} class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4">Add Question</button>
{:else}
  <div class="rounded bg-blue-500 p-1">
    <div class="m-4">
      <label for="question_title" class="text-white font-bold">Question Title</label>
      <br>
      <input type="text" bind:value={question_title}/>
      <br>
      <label for="question_description" class="text-white font-bold">Question Description</label>
      <br>
      <textarea bind:value={question_description}></textarea>
    </div>
    <div class="flex">
        <button on:click={() => postQuestion()} class="bg-green-500 hover:bg-green-700 text-white font-bold rounded p-1 m-4">Send Question</button>
        <button on:click={() => show_form = false} class="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-1 m-4">Cancel</button>
    </div>
  </div>
{/if}