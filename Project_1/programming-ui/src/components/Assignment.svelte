<script>
  import { userUuid } from "../stores/stores.js";
  import { onMount } from "svelte";
  import Feedback from "./Feedback.svelte";

  let title = "";
  let handout = "";
  let id = 0;
  let submission = "";

  let submission_status;

  let webSocket;

  const postSubmission = async () => {
    const response = await fetch("/api/assignments/submit", {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
      },
      body: JSON.stringify({ code: submission, assignment_id: id })
    });
    const data = await response.json();

    const host = window.location.hostname;
    webSocket = new WebSocket(`ws://${host}:7800/api/assignments/status/${data.id}`);
    webSocket.onmessage = (event) => {
      console.log(event.data);
    };
  };

  onMount(async () => {
    const response = await fetch("/api/assignments/undone", {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    });
    const data = await response.json();
    title = data.title;
    handout = data.handout;
    id = data.id;

    document.getElementById("textbox").addEventListener("keydown", function(e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

        this.selectionStart = this.selectionEnd = start + 1;
      }
    });
  });

</script>

<h1>{title || "Loading"}</h1>
<p>{handout || "Loading"}</p>

<textarea id="textbox" bind:value={submission} class="w-full h-64 border-2 border-gray-300 rounded-md p-2"></textarea>

{#if submission_status}
  <Feedback {submission_status} />
{:else}
  <button
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
    on:click={postSubmission}
  >
   Grade my code
  </button>
{/if}
