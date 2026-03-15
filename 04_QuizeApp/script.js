document.addEventListener('DOMContentLoaded', () => {

  /*What do I want to add?
     Single highlight ✔️
     Single marking 1 Q - 1Marking
     Previous Q option with selected Q
  */


  //grading the elements
  const startBtn = document.getElementById('start-btn')
  const QuestionBox = document.getElementById('question-container')
  const statement = document.getElementById('question-text')
  const Options = document.getElementById('choices-list')
  const prevBtn = document.getElementById('prev-btn')
  const nextBtn = document.getElementById('next-btn')
  const resultBox = document.getElementById('result-container')
  const scoreDisplay = document.getElementById('score')
  const restart = document.getElementById('restart-btn')


  const questions = [
    {
      question: 'Which planet is called the Red Planet?',
      options: ['Venus', 'Moon', 'Earth', 'Mars'],
      answer: 'Mars',
      OptionSelected: null
    },
    {
      question: 'What is the capital of India?',
      options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
      answer: 'New Delhi',
      OptionSelected: null
    },
    {
      question: 'Which language is mainly used for web page structure?',
      options: ['HTML', 'Python', 'C++', 'Java'],
      answer: 'HTML',
      OptionSelected: null
    },
    {
      question: 'Who is known as the father of computers?',
      options: ['Alan Turing', 'Charles Babbage', 'Bill Gates', 'Steve Jobs'],
      answer: 'Charles Babbage',
      OptionSelected: null
    },
    {
      question: 'Which data structure uses FIFO (First In First Out)?',
      options: ['Stack', 'Queue', 'Tree', 'Graph'],
      answer: 'Queue',
      OptionSelected: null
    },
    {
      question: 'Which planet is the largest in our solar system?',
      options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
      answer: 'Jupiter',
      OptionSelected: null
    },
    {
      question: 'Which company developed the Java programming language?',
      options: ['Microsoft', 'Sun Microsystems', 'Google', 'IBM'],
      answer: 'Sun Microsystems',
      OptionSelected: null
    },
    {
      question: 'Which unit is used to measure electric current?',
      options: ['Volt', 'Ohm', 'Ampere', 'Watt'],
      answer: 'Ampere',
      OptionSelected: null
    },
    {
      question: 'Which HTML tag is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<hyper>'],
      answer: '<a>',
      OptionSelected: null
    },
    {
      question: 'Which gas do plants absorb from the atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
      answer: 'Carbon Dioxide',
      OptionSelected: null
    }
  ]

  currentQuestionIndex = 0
  score = 0

  startBtn.addEventListener('click', startQuiz)

  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++
    if (currentQuestionIndex < questions.length) {
      showquestion()
      prevBtn.classList.remove('hidden')
    }
    else {
      QuestionBox.classList.add('hidden')
      nextBtn.classList.add('hidden')
      resultBox.classList.remove('hidden')
      scoreDisplay.innerText = `${score} out of ${questions.length}`
      restart.addEventListener('click', restartQuiz)
    }
  })

  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--
      showquestion()
      if (currentQuestionIndex > 0) prevBtn.classList.remove('hidden')
      nextBtn.classList.remove('hidden')
    }
  })
  function startQuiz() {
    startBtn.classList.add('hidden')
    resultBox.classList.add('hidden')
    QuestionBox.classList.remove('hidden')
    showquestion()
  }

  function showquestion() {
    const SelectedIndex = questions[currentQuestionIndex].OptionSelected

    //IN-case Q is previously attempted 'Next' should be visible
    if (!SelectedIndex) nextBtn.classList.add('hidden')

    if (currentQuestionIndex === 0) prevBtn.classList.add('hidden')
    statement.innerText = questions[currentQuestionIndex].question
    Options.innerHTML = ""
    questions[currentQuestionIndex].options.forEach((option, index) => {
      const li = document.createElement('li')
      li.innerText = option
      li.setAttribute("Index", index)
      if (index == SelectedIndex) li.classList.add('selected')
      li.addEventListener('click', () => {

        // Remove the "selected" class from any previously selected option
        Options.querySelectorAll('li').forEach(el => el.classList.remove('selected'))
        li.classList.toggle('selected')
        selectedOption(option, index)
      })
      Options.appendChild(li)
    })
  }

  function selectedOption(choice, index) {
    const prevSelctedQ = questions[currentQuestionIndex].OptionSelected
    questions[currentQuestionIndex].OptionSelected = index

    const correctAnswer = questions[currentQuestionIndex].answer
    if (questions[currentQuestionIndex].options[prevSelctedQ] == correctAnswer) score--
    if (choice === correctAnswer) {
      score++
    }
    if (currentQuestionIndex > 0) prevBtn.classList.remove('hidden')
    nextBtn.classList.remove('hidden')
  }

  function restartQuiz() {
    currentQuestionIndex = 0
    score = 0
    resultBox.classList.add('hidden')
    startBtn.classList.remove('hidden')
    questions.forEach(Q => Q.OptionSelected = null)
  }
})