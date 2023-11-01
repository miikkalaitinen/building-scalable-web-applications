<script>
  import { onMount } from "svelte"
  import { userUuid } from "../stores/stores.js"
  import AddAnswer from "./AddAnswer.svelte";
  import BackButton from "./BackButton.svelte"
  import InfiniteScroller from "./InfiniteScroller.svelte"

  export let id;

  let question = {};
  let answer_page = 0;
  let webSocket;
  let show_form = false;

  const getQuestion = async () => {
    const res = await fetch(`/api/questions/${id}`, {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    })
    if (res.status === 200) {
      answer_page += 1;
      question = await res.json()
    }
  }

  const getAnswers = async () => {
    const res = await fetch(`/api/questions/${id}/${answer_page}`, {
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
      answer_page += 1
      question = {
        ...question,
        answers: [
          ...question.answers,
          ...data,
        ]
      }
      return true
    }
    return false
  }

  onMount(() => {
    getQuestion();

    const host = window.location.hostname;
    const port = window.location.port;
    webSocket = new WebSocket(`ws://${host}:${port}/api/socket/answer`);
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data.question_id == id) {
        question = {
          ...question,
          answers: [
            data.data,
            ...question.answers,
          ]
        }
      }
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  })

  const handleUpvote = async (answer_id) => {
    const res = await fetch(`/api/upvote`, {
      method: "POST",
      headers: {
        'X-User-Id': $userUuid,
      },
      body: JSON.stringify({
        answer_id: answer_id,
      })
    })

    if (res.status === 200) {
      const answers = question.answers.map(a => {
        if (a.answer_id === answer_id) {
          a.upvotes += 1
          a.user_upvoted = true
        }
        return a
      })
      question = {
        ...question,
        answers: answers,
      }
    }
  }

  const handleRemoveUpvote = async (answer_id) => {
    const res = await fetch(`/api/upvote?answer_id=${answer_id}`, {
      method: "DELETE",
      headers: {
        'X-User-Id': $userUuid,
      },
    })

    if (res.status === 200) {
      const answers = question.answers.map(a => {
        if (a.answer_id === answer_id) {
          a.upvotes -= 1
          a.user_upvoted = false
        }
        return a
      })
      question = {
        ...question,
        answers: answers,
      }
    }
  }

  const dateToString = (date) => {
    const d = new Date(date)
    return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
  }

</script>

{#if question.question_title}
<div>
  <div class="bg-origin-padding bg-[url('/sisuback.png')] h-64">
    <BackButton />
    <h1 class="text-4xl p-8 font-semibold">Question: {question.question_title}</h1>
    <p class="mb-2 ml-8 text-lg">{question.question_text}</p>
  </div>
  <div class="px-12">
    <div class="m-5 flex justify-between items-center">
      <h2 class="text-lg my-5">Answers:</h2>
      {#if !show_form}
      <button on:click={() => show_form = true} class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4">Add Answer</button>
      {/if}
    </div>

    {#if show_form}
      <AddAnswer class="mr-8" question_id={id} closeForm={() => show_form = false} />
    {/if}
    <div id="answerlist">
      {#each question.answers as answer}
        <div class="m-5 border-gray-500 border-2 p-5 flex items-center justify-between">
          <div class="w-[90%] justify-between">
            <h1 class="pb-2 mb-2 border-b-2 w-[90%]">Answer posted on {dateToString(answer.created_at)}</h1>
            <p class="w-[90%]">{answer.answer_text}</p>
          </div>
          <div class="w-[10%] flex">
            <p>{answer.upvotes}</p>
            {#if answer.user_upvoted}
              <button on:click={() => handleRemoveUpvote(answer.answer_id)}>
                <img src="/upvote_green.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
              </button>
            {:else}
              <button on:click={() => handleUpvote(answer.answer_id)}>
                <img src="/upvote_black.png" alt="upvote" class="w-6 h-6 mb-1 ml-2 cursor-pointer"/>
              </button>
            {/if}
        </div>
        </div>
      {/each}
      <InfiniteScroller onVisible={getAnswers} page={"Answers"}/>
    </div>
  </div>
</div>
{:else}
  <p>Loading...</p>
{/if}