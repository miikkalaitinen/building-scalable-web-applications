<script>
  import { onMount } from "svelte"
  import BackButton from "./BackButton.svelte"

  let courses = []

  onMount(async () => {
    const res = await fetch("/api/courses")
    courses = await res.json()
  })
</script>

<div>
  <BackButton />
  <h2>Main Page</h2>
  <p>Lists available courses and allows selecting a course, which opens up the course page.</p>
  {#each courses as course}
  <a href={`/course/${course.course_id}`}>
    <div class="rounded-lg m-5 p-5 text-white bg-goodblue">
      <h1>{course.course_name}</h1>
      <p>{course.course_description}</p> 
    </div>
  </a>
  {/each}
</div>