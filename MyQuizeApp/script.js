document.addEventListener('DOMContentLoaded', () => {

  //grading the elements
  const startBtn = document.getElementById('start-btn')
  const QuestionBox = document.getElementById('question-container')
  const statement = document.getElementById('question-text')
  const Options = document.getElementById('choices-list')
  const nextBtn = document.getElementById('next-btn')
  const resultBox = document.getElementById('result-container')
  const scoreDisplay = document.getElementById('score')
  const restart = document.getElementById('restart-btn')

  const questions = [
    {
      question: 'Which planets is called Red planet?',
      options: ['Venus', 'Moon', 'Sun', 'Mars'],
      answer: 'Mars'
    },
    {
      question: 'What is full form of UK',
      options: ['UttraKhand', 'United Korea', 'United Kingdom', 'Non'],
      answer: 'United Kingdom'
    },
    {
      question: 'Where is Statue of Unity?',
      options: ['Agra', 'AMerika', 'Ahemdabad', 'Argentina'],
      answer: 'Ahemdabad'
    }
  ]

  let currentQuestionIndex = 0
  let score = 0
  startBtn.addEventListener('click', startQuiz)

  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++
    if (currentQuestionIndex < questions.length) {
      showquestion()
    }
    else {
      QuestionBox.classList.add('hidden')
      nextBtn.classList.add('hidden')
      resultBox.classList.remove('hidden')
      scoreDisplay.innerText = `${score} out of ${questions.length}`
      restart.addEventListener('click',restartQuiz)
    }
  })

  function startQuiz() {
    startBtn.classList.add('hidden')
    resultBox.classList.add('hidden')
    QuestionBox.classList.remove('hidden')
    showquestion()
  }

  function showquestion() {
    nextBtn.classList.add('hidden')
    statement.innerText = questions[currentQuestionIndex].question
    Options.innerHTML = ""
    questions[currentQuestionIndex].options.forEach(option => {
      const li = document.createElement('li')
      li.innerText = option
      li.addEventListener('click', () => selectedOption(option))
      Options.appendChild(li)
    })
  }

  function selectedOption(choice) {
    const correctAnswer = questions[currentQuestionIndex].answer
    if (choice === correctAnswer) {
      score++
    }
    nextBtn.classList.remove('hidden')
  }

  function restartQuiz(){
    currentQuestionIndex = 0
    score = 0
    resultBox.classList.add('hidden')
    startBtn.classList.remove('hidden')
  }
})