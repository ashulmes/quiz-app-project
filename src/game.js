const question = document.getElementById("question"); // reference to question
const choices = Array.from(document.getElementsByClassName("choice-text")); // reference to choices, converted into an array
const progressText = document.getElementById("progress-text");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progress-bar-full");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false; // start as false, to create a slight delay before the user can answer
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
  "https://the-trivia-api.com/api/questions?categories=film_and_tv&limit=10&difficulty=medium"
) // returns a promise from the trivia API
  .then((res) => {
    return res.json(); // converts the http response body into a json
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions);
    questions = loadedQuestions.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      }; // iterates through the questions array and returns a new array of objects in the format we need

      const answerChoices = [...loadedQuestion.incorrectAnswers]; // provides an array of the incorrect answers
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1; // gives the selected answer a random index/position between 0 - 3
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correctAnswer
      ); // adds the selected answer to the incorrect answers and correct answer array, in random positions

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      }); // iterate through all the answer choices, set the choice property and assign an index

      return formattedQuestion;
    });

    startGame(); // game now starts once the questions are loaded
  })
  .catch((err) => {
    // when a promise is returned, the catch/error scenario should always be handled
    console.error(err); // logs errors to the console
  });

// CONSTANTS
const CORRECT_BONUS = 10; // points for a correct answer
const MAX_QUESTIONS = 10; // number of questions a user gets before the game ends

startGame = () => {
  questionCounter = 0; // reset
  score = 0; // reset
  availableQuestions = [...questions]; // creates a copy as a new array that can be manipulated, without changing the original array
  getNewQuestion();
  game.classList.remove("hidden"); // when the first question is loaded, the game displays
  loader.classList.add("hidden"); // when the first question is loaded, the loader is hidden
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score); // saves the most recent score to local storage, which uses key value pairs where the value is a string
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
