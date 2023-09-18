<script>
  import { userUuid, points } from "../stores/stores.js";
  import { onMount } from "svelte";
  import Feedback from "./Feedback.svelte";

  let title = "";
  let handout = "";
  let id = 0;
  let allDone = false;
  
  let submission = "";
  let lines = "1\n";
  let lineCount = 1;

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

    if (data.status === "processed") {
      submission_status = data;
      fetchPoints();
      return;
    } else {
      submission_status = {status: "pending"};
    }

    const host = window.location.hostname;
    webSocket = new WebSocket(`ws://${host}:7800/api/assignments/status/${data.id}`);
    webSocket.onmessage = (event) => {
      submission_status = JSON.parse(event.data);
      fetchPoints();
    };
  };

  const fetchAssignment = async () => {
    const response = await fetch("/api/assignments/undone", {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    });

    if (response.status === 204) {
      allDone = true;
      return;
    }

    const data = await response.json();

    submission_status = null;
    submission = "";
    title = data.title;
    handout = data.handout;
    id = data.id;
  }

  const resetAssignments = async () => {
    await fetch("/api/assignments/reset", {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    });
    allDone = false;
    submission_status = null;
    fetchAssignment();
    fetchPoints();
  }

  const fetchPoints = async () => {
    const response = await fetch("/api/users/points", {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    });
    const data = await response.json();
    points.set(data.points);
  }

  const setLineCount = (text) => {
    console.log(text);
    const count = text.split(/\r|\r\n|\n/).length;
    if (count != lineCount) {
      lines = "";
      lineCount = count;
      for (let i = 1; i <= lineCount; i++) {
        lines += i + "\n";
      }
    }
  }

  $: setLineCount(submission);

  onMount(async () => {
    await fetchAssignment();
    await fetchPoints();
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

{#if allDone} 
  <h1 class="text-2xl ">You have completed all assignments</h1>
  <button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
  on:click={resetAssignments}
  >
  Reset all assignments
  </button>
{:else}

  <h1 class="text-2xl ">{title || "Loading"}</h1>
  <p class="text-lg">{handout || "Loading"}</p>

  <div class="flex w-full">
    <textarea id="linebox" readonly bind:value={lines} class="w-1/12 h-100 border-2 bg-gray-50 rounded-s-md p-2 resize-none !outline-none text-right text-gray-400"></textarea>
    <textarea id="textbox" bind:value={submission} class="w-11/12 h-64 border-2 border-gray-300 rounded-e-md p-2"></textarea>
  </div>

  {#if submission_status}
    <Feedback {submission_status} />
    {#if submission_status.correct}
      <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
      on:click={fetchAssignment}
    >
    Next assignment
    </button>
    {:else if submission_status.status == "processed"}
      <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
      on:click={() => { submission_status = null; }}>
      Close feedback and try again
      </button>
    {/if}
  {:else}
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
      on:click={postSubmission}
    >
    Grade my code
    </button>
  {/if}
{/if}
