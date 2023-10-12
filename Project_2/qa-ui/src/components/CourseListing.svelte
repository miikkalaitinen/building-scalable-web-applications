<script>
  import { onMount } from "svelte"

  let courses = []

  onMount(async () => {
    const res = await fetch("/api/courses")
    courses = await res.json()
  })
</script>

<div>
  <h1 class="mb-4 text-xl">Welcome to 🌊 University Q&A site</h1>
  <h2 class="mb-2 text-lg">Courses:</h2>
  {#each courses as course}
  <a href={`/course/${course.course_id}`}>
    <div class="rounded-lg m-5 p-5 text-white bg-goodblue">
      <h1>{course.course_name}</h1>
      <p>{course.course_description}</p> 
    </div>
  </a>
  {/each}
</div>