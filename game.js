const question = document.getElementById("question"); // reference to question
const choices = Array.from(document.getElementsByClassName("choice-text")); // reference to choices, converted into an array

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
    choice1: "msgBox('Hello World);",
    choice2: "alertBox('Hello World);",
    choice3: "msg('Hello World);",
    choice4: "alert('Hello World);",
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
    return window.location.assign("/end.html");
  } // send to end.html page if there are no questions left to display to the user and the game is over

  questionCounter++; // starting the game increments it to 1
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
    getNewQuestion();
  });
});

startGame();