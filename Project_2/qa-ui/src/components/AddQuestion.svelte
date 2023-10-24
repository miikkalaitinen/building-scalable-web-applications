<script>
  import { userUuid } from "../stores/stores";
  export let course_id;
  export let closeForm = () => {};

  let question_title = "";
  let question_description = "";

  const handleCancel = () => {
    closeForm();
  }

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
  <h1 class="font-bold m-4">New Question</h1>
  <div class="m-4 mb-0">
    <p class="font-bold my-2">Question Title</p>
    <input class="w-72" type="text" bind:value={question_title}/>
    <p  class="font-bold my-2">Question Description</p>
    <textarea class="w-full min-h-[150px]"  bind:value={question_description}></textarea>
  </div>
  <div class="flex">
      <button on:click={postQuestion} class="bg-green-500 hover:bg-green-700 text-white font-bold rounded p-1 m-4">Send Question</button>
      <button on:click={handleCancel} class="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-1 m-4">Cancel</button>
  </div>
</div>