<script>

  export let id;

  const course = {
    name: "Course 1",
    description: "This is the first course"
  }


  const questions = [
    {
      question: "What is the meaning of life?",
      id: 1
    },
    {
      question: "Is this all for nothing?",
      id: 2
    }
  ]
</script>

<div>
  <h1>{course.name}</h1>
  <p>{course.description}</p> 

  <h2 class="my-5">Funtionality</h2>
  <ul>
    <li>Create new questions</li>
    <li>List questions</li>
    <li>Upvote questions</li>
    <li>Open question</li>
  </ul>

  <h2 class="my-5">Questions</h2>

  {#each questions as question}
    <a href={`/question/${question.id}`}>
      <div class="flex justify-evenly bg-blue-700 rounded-lg m-5 text-white">
        <h1>{question.question}</h1>
      </div>
    </a>
  {/each}
</div>