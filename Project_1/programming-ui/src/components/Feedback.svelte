<script>
  export let submission_status
</script>

{#if submission_status.status == "pending"}
<div class={`rounded-md h-96 p-12 bg-slate-200 mt-4`}>
  <h2>
    In grading...
  </h2>
</div>
{:else}
<div class={`mt-4 rounded-md px-10 py-6 ${submission_status.correct ? "bg-green-200" : "bg-red-200"}`}>
  <h2 class="text-xl my-2">Graded!</h2>
  <p>Test status: {submission_status.test_status}</p>
  <h4>Grader feedback:</h4>
  <div class="bg-white p-2 rounded-md whitespace-pre-wrap">{submission_status.grader_feedback}</div>
</div>
{/if}