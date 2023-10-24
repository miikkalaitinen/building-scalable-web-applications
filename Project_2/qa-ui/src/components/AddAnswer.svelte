<script>
  import { userUuid } from "../stores/stores";
  export let question_id;

  let show_form = false;
  let answer_text = "";

  const postAnswer = () => {

    if (answer_text === "") {
      alert("Answer cannot be empty");
      return;
    }
    fetch(`/api/answers`, {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question_id: question_id,
        answer_text: answer_text,
      })
    })
    .then((res) => {
      if (res.status === 201) {
        answer_text = "";
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
  <button on:click={() => show_form = true} class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4">Add Answer</button>
{:else}
  <div class="rounded bg-blue-500 p-1">
    <div class="m-4">
      <label for="answer_text" class="text-white font-bold">Answer:</label>
      <br>
      <input type="text" bind:value={answer_text}/>
    </div>
    <div class="flex">
        <button on:click={() => postAnswer()} class="bg-green-500 hover:bg-green-700 text-white font-bold rounded p-1 m-4">Send Answer</button>
        <button on:click={() => show_form = false} class="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-1 m-4">Cancel</button>
    </div>
  </div>
{/if}