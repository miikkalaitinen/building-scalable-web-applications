<script>
  import { onMount } from "svelte"
  import { userUuid } from "../stores/stores.js"

  import AddQuestion from "./AddQuestion.svelte";
  import BackButton from "./BackButton.svelte"
  import InfinteScroller from "./InfiniteScroller.svelte"

  export let id;

  let course = {}
  let question_page = 0
  let webSocket;
  let show_form = false;

  const getCourse = async () => {
    const res = await fetch(`/api/courses/${id}`, {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    })
    if (res.status === 200) {
      course = await res.json()
      question_page += 1
    }
  }

  const getQuestions = async () => {
    const res = await fetch(`/api/courses/${id}/${question_page}`, {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    })
    if (res.status === 200) {
      const data = await res.json()
      if (data.length === 0) {
        return true
      }
      question_page += 1
      course = {
        ...course,
        questions: [
          ...course.questions,
          ...data,
        ]
      }
      return true
    }
    return false
  }

  onMount(() => {
    getCourse();

    const host = window.location.hostname;
    const port = window.location.port;
    webSocket = new WebSocket(`ws://${host}:${port}/api/socket/question`);
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data.course_id == id) {
        course = {
          ...course,
          questions: [
            data.data,
            ...course.questions,
          ]}
      }
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  })

  const handleUpvote = async (question_id) => {
    const res = await fetch(`/api/upvote`, {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
      },
      body: JSON.stringify({
        question_id: question_id,
      })
    })

    if (res.status === 200) {
      const questions = course.questions.map(q => {
        if (q.question_id === question_id) {
          q.upvotes += 1
          q.user_upvoted = true
        }
        return q
      })  

      course = {
        ...course,
        questions: questions,
      }
    }
  }

  const handleRemoveUpvote = async (question_id) => {
    const res = await fetch(`/api/upvote?question_id=${question_id}`, {
      method: "DELETE",
      headers: {
        'X-User-Id': $userUuid,
      },
    })

    if (res.status === 200) {
      const questions = course.questions.map(q => {
        if (q.question_id === question_id) {
          q.upvotes -= 1
          q.user_upvoted = false
        }

        return q
      })  

      course = {
        ...course,
        questions: questions,
      }
    }
  }

  const dateToString = (date) => {
    const d = new Date(date)
    return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
  }
</script>

{#if course.course_name}
<div>

  <div class="bg-origin-padding bg-[url('https://raw.githubusercontent.com/miikkalaitinen/building-scalable-web-applications/master/Project_2/qa-ui/public/sisuback.png')] h-64">
    <BackButton />
    <h1 class="text-4xl p-8 font-semibold" id="course-title">Course: {course.course_name}</h1>
    <p class="mb-2 ml-8 text-lg">{course.course_description}</p> 
  </div>

  <div class="px-12">
    <div class="m-5 flex justify-between items-center">
      <h2 class="text-lg my-5">Questions:</h2>
      {#if !show_form}
      <button on:click={() => show_form = true} class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4">Add Question</button>
      {/if}
    </div>

    {#if show_form}
      <AddQuestion course_id={id} closeForm={() => {show_form = false}}/>
    {/if}

    <div id="questionlist">
      {#each course.questions as question}
      <div class="m-5 border-gray-500 border-2" id={`question-${question.id}`}>
        <div class="flex items-center bg-lightblue p-2 ">
          <a class="flex-auto flex justify-between w-64" href={`/question/${question.question_id}`}>
            <h1 class="underline text-goodblue">{question.question_title}</h1>
            <div class="pr-10 text-xs">
              <p>Asked: {dateToString(question.created_at)}</p>
              <p>Updated: {dateToString(question.updated_at)}</p>
            </div>
          </a>
          <p>{question.upvotes}</p>
          {#if question.user_upvoted}
            <button class="mr-4" on:click={() => handleRemoveUpvote(question.question_id)}>
              <img src="https://raw.githubusercontent.com/miikkalaitinen/building-scalable-web-applications/master/Project_2/qa-ui/public/upvote_green.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
            </button>
          {:else}
            <button class="mr-4" on:click={() => handleUpvote(question.question_id)}>
              <img src="https://raw.githubusercontent.com/miikkalaitinen/building-scalable-web-applications/master/Project_2/qa-ui/public/upvote_black.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
            </button>
          {/if}
        </div>
        <div>
          <p class="p-2">{String(question.question_text).length > 60 ? `${String(question.question_text).substring(0,60)}...` : question.question_text}</p>
        </div>
      </div>
      {/each}
      <InfinteScroller onVisible={getQuestions} page={"Questions"}/>
    </div>
  </div>
</div>
{:else}
  <p>Loading...</p>
{/if}