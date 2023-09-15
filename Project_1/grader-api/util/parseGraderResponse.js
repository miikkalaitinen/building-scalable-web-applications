const parseGraderResponse = async (result) => {
  console.log(result)
  if (result.startsWith('Traceback')) {
    return {
      status: 'error',
      correct: false,
      feedback: result,
    }
  } else if (result.startsWith('F')) {
    return {
      status: 'failed',
      correct: false,
      feedback: result.substring(73),
    }
  } else if (result.startsWith('.')) {
    return {
      status: 'correct',
      correct: true,
      feedback: result,
    }
  } else {
    return {
      status: 'gradererror',
      correct: false,
      feedback: 'Unhandled error in grader-image',
    }
  }
}

export { parseGraderResponse }
