<script>
  import { onMount } from "svelte"

  let courses = []

  onMount(async () => {
    const res = await fetch("/api/courses")
    courses = await res.json()
  })
</script>

<div>
  <div class="bg-origin-padding bg-[url('/sisuback.png')] h-64">
    <h1 class="text-4xl p-14 font-semibold">Welcome to Aalto University Q&A site</h1>
  </div>
  <h2 class="mb-2 text-xl m-6 font-medium">Courses:</h2>
  {#each courses as course}
  <a href={`/course/${course.course_id}`}>
    <div class="m-5 border-coursecolor border-2 border-l-[64px] bg-coursebg">
      <h1 class="p-2 text-goodblue underline">{course.course_name}</h1>
      <p class="p-2 font-bold">{course.course_description}</p> 
    </div>
  </a>
  {/each}
</div>