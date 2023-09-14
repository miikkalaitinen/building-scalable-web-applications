<script>
  export let submission_status;
</script>


<div>
  <h3>{submission_status.status}</h3>
  {#if submission_status === "graded"}
    <p>{submission_status.correct ? "Correct" : "Not Correct"}</p>
    <p>{submission_status.grader_feedback}</p>
  {/if}
</div>