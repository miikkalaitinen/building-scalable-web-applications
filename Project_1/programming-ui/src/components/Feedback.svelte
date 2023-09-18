<script>
  export let submission_status;
</script>

{#if submission_status.status="pending"}
<div class={`rounded-md h-96 p-12 bg-slate-200`}>
  <h3>In grading...</h3>
</div>
{:else}
<div class={`rounded-md h-96 p-12 ${submission_status.correct ? "bg-green-200" : "bg-red-200"}`}>
  <h3>Graded!</h3>
  <p>Test status: {submission_status.test_status}</p>
  <h4>Grader feedback:</h4>
  <div class="bg-white">{submission_status.grader_feedback}</div>
</div>
{/if}