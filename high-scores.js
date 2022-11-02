const highScoresList = document.getElementById("high-scores-list"); // reference to the high scores unordered list
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; // gets the high scores out of local storage, or returns an empty array

highScoresList.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`; // maps through each item in the high scores list array and returns a new array, displaying the username and score of each item
  })
  .join(""); // joins all array objects into a string, which can be used to replace the high scores list inner HTML
