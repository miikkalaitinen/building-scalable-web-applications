import { handlePostAnswer } from './qaApiService.js'

const generateAnswers = async (question_id, question_text, amount) => {
  for (let i = 0; i < amount; i++) {
    generateAnswer(question_id, question_text)
  }
}

const generateAnswer = async (question_id, question_text) => {
  try {
    const response = await fetch('http://llm-api:7000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question_text }),
    })

    const data = await response.json()
    if (data[0] && data[0].generated_text) {
      console.log(data[0].generated_text)
      await handlePostAnswer(
        question_id,
        data[0].generated_text,
        '00000000-0000-0000-0000-000000000000'
      )
    }
  } catch (error) {
    console.log(error)
  }
}

export { generateAnswers }
