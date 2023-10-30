<script>
  import { userUuid } from "../stores/stores.js";
  export let question_id;
  export let closeForm = () => {};

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
        closeForm()
      } else if (res.status === 429) {
        alert("You are posting too fast. You can post at most once every 60 seconds.");
        return;
      }
    })
    .catch(err => console.log(err));
  }

</script>

<div class="bg-coursebg p-1">
  <h1 class="font-bold m-4">New answer</h1>
  <div class="m-4 mb-0">
    <textarea id="answerarea" class="w-full min-h-[150px]" bind:value={answer_text}/>
  </div>
  <div class="flex">
      <button on:click={postAnswer} class="bg-green-500 hover:bg-green-700 text-white font-bold rounded p-2 m-4">Send Answer</button>
      <button on:click={closeForm} class="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2 m-4">Cancel</button>
  </div>
</div>