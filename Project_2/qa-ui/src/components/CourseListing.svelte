<script>
  const courses = [{
    name: "Course 1",
    description: "This is the first course",
    id: 1
  }
  , {
    name: "Course 2",
    description: "This is the second course",
    id: 2
  }]

  // Fetch courses from backend on load
</script>

<div>
  <h2>Main Page</h2>
  <p>Lists available courses and allows selecting a course, which opens up the course page.</p>
  {#each courses as course}
  <a href={`/course/${course.id}`}>
    <div class="flex justify-evenly bg-blue-700 rounded-lg m-5 text-white">
      <h1>{course.name}</h1>
      <p>{course.description}</p> 
    </div>
  </a>
  {/each}
</div>