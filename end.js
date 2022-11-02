const username = document.getElementById("username"); // reference to username input
const saveScoreBtn = document.getElementById("save-score-btn"); // reference to "save" button
const finalScore = document.getElementById("final-score"); // reference to final score text
const mostRecentScore = localStorage.getItem("mostRecentScore"); // gets the most recent score from local storage

const highScores = JSON.parse(localStorage.getItem("highScores")) || []; // converts the string from local storage into an array object, or returns an empty high scores array if there's nothing in local storage yet
const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore; // dynamically updates the final score text to the most recent score

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
}); // looks for a username input, disables the save score button if there isn't one and enables it if there is

saveHighScore = (e) => {
  e.preventDefault(); // prevents the default submit to a new page behaviour

  const score = {
    score: mostRecentScore, // object includes most recent score
    name: username.value, // name comes from the username input
  };

  highScores.push(score); // pushes the score object into the high scores array whenever a score is saved
  highScores.sort((a, b) => b.score - a.score); // sorts the scores in decreasing order, highest to lowest
  highScores.splice(5); // cuts the high scores array off at the top five objects

  localStorage.setItem("highScores", JSON.stringify(highScores)); // updates high scores in local storage, so they are saved even if refreshed
  window.location.assign("/"); // redirects the user back to the home page after saving
};
