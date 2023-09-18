<script>
  import { userUuid, points } from "../stores/stores.js";
  import { onMount } from "svelte";
  import Feedback from "./Feedback.svelte";

  // Variables

  // Assignment information
  let title = "";
  let handout = "";
  let id = 0;

  // Submission information
  let submission = "";
  let lines = "1\n";
  let lineCount = 1;
  
  let allDone = false;   // Are all done?

  let submission_status; // Submission status for feedback

  let webSocket; // Websocket for updates


  // Functio to handle posting a submission and setting up a websocket for updates
  const postSubmission = async () => {
    const response = await fetch("/api/assignments/submit", {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
      },
      body: JSON.stringify({ code: submission, assignment_id: id })
    });
    const data = await response.json();

    // Check if the submission was processed immediately from database
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


  // Fetch next undone assignment
  const fetchAssignment = async () => {
    const response = await fetch("/api/assignments/undone", {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    });

    // If no more assignments, set allDone to true
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


  // Reset all assignments, you know, just for fun
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


  // Fetch user points
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


  // Handle line count for editor
  const setLineCount = (text) => {
    console.log(text);
    const count = text.split(/\r|\r\n|\n/).length;
    if (count != lineCount) {
      lines = "";
      lineCount = count;
      for (let i = 1; i <= lineCount; i++) {
        lines += i;
        if (i != lineCount) {
          lines += "\n";
        }
      }
    }
  }

  $: setLineCount(submission);

  onMount(async () => {

    await fetchAssignment();
    await fetchPoints();

    // Handle tab in editor, since python is a tabbed language
    document.getElementById("textbox").addEventListener("keydown", function(e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
      }
    });

    // Handle resizing of editor
    document.getElementById("textbox").addEventListener("input", () => {

      const textArea = document.getElementById("textbox");
      const linesArea = document.getElementById("linebox");

      textArea.style.height = "0px";
      const height = 24 + textArea.scrollHeight;
      if (height > 256) {
        textArea.style.height = height + "px";
        linesArea.style.height = height + "px";
      } else {
        textArea.style.height = "256px";
        linesArea.style.height = "256px";
      }
    });
    
  });

</script>

<div class="flex h-screen">
  {#if allDone} 
  <div class="mx-auto">
    <h1 class="text-2xl ">You have completed all assignments</h1>
    <button
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
    on:click={resetAssignments}
    >
    Reset all assignments
    </button>
  </div>
  {:else}
  <div class="mx-auto w-5/6">
    <h1 class="text-2xl ">{title || "Loading"}</h1>
    <p class="text-lg">{handout || "Loading"}</p>

    <div class="flex w-full max-w-6xl">
      <textarea id="linebox" readonly bind:value={lines} class="w-1/12 h-64 border-2 bg-gray-50 rounded-s-md p-2 resize-none !outline-none text-right text-gray-400"></textarea>
      <textarea id="textbox" bind:value={submission} class="w-11/12 h-64 border-2 border-gray-300 rounded-e-md p-2 resize-none"></textarea>
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
  </div>
  {/if}
</div>
