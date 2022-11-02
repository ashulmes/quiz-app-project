const question = document.getElementById("question"); // reference to question
const choices = Array.from(document.getElementsByClassName("choice-text")); // reference to choices, converted into an array
const progressText = document.getElementById("progress-text");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progress-bar-full");

let currentQuestion = {};
let acceptingAnswers = false; // start as false, to create a slight delay before the user can answer
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
  {
    question: "Inside which HTML element do we put the JavaScript?",
    choice1: "<script>",
    choice2: "<javascript>",
    choice3: "<js>",
    choice4: "<scripting>",
    answer: 1,
  },
  {
    question:
      "What is the correct system for referring to an external script called 'xxx.js'?",
    choice1: "<script href='xxx.js'>",
    choice2: "<script name='xxx.js'>",
    choice3: "<script src='xxx.js'>",
    choice4: "<script file='xxx.js'>",
    answer: 3,
  },
  {
    question: "How do you write 'Hello World' in an alert box?",
    choice1: "msgBox('Hello World');",
    choice2: "alertBox('Hello World');",
    choice3: "msg('Hello World');",
    choice4: "alert('Hello World');",
    answer: 4,
  },
];

// CONSTANTS
const CORRECT_BONUS = 10; // points for a correct answer
const MAX_QUESTIONS = 3; // number of questions a user gets before the game ends

startGame = () => {
  questionCounter = 0; // reset
  score = 0; // reset
  availableQuestions = [...questions]; // creates a copy as a new array that can be manipulated, without changing the original array
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score); // saves the most recent score to the local storage, which can be accessed through the "Application" tab in Chrome
    return window.location.assign("/end.html"); // send to end.html page if there are no questions left to display to the user and the game is over
  }

  questionCounter++; // starting the game increments it to 1
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`; // updates question number dynamically using the question counter
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`; // sets width of progress bar dynamically, depending on the question number

  const questionIndex = Math.floor(Math.random() * availableQuestions.length); // chooses a random question from the available options left to the user
  currentQuestion = availableQuestions[questionIndex]; // gets a reference to the current question
  question.innerText = currentQuestion.question; // updates the question text to the current question

  choices.forEach((choice) => {
    const number = choice.dataset["number"]; // gets number from data-number custom property
    choice.innerText = currentQuestion["choice" + number]; // uses the data-number property to pull the correct choice text and display it
  });

  availableQuestions.splice(questionIndex, 1); // removes the question that's just been used from the available questions array
  acceptingAnswers = true; // allows answers once the question has been loaded
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return; // ignore if we're not ready for answers

    acceptingAnswers = false; // creates delay
    const selectedChoice = e.target; // reference to clicked answer
    const selectedAnswer = selectedChoice.dataset["number"]; // reference to clicked answer, based on data-number property

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect"; // checks if the answer is correct or incorrect

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    } // if the answer is correct, the increment function is called and 10 points are added to the score

    selectedChoice.parentElement.classList.add(classToApply); // adds the "correct" or "incorrect" class to the selected choice container

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000); // removes the "correct" or "incorrect" class and serves a new question after a delay
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
}; // increments the score and updates the score text with the new score

startGame();
