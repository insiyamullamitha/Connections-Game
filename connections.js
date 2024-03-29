let mistakesRemaining = 4;
let usedWords = [];
let repeatedCombinations = [];
let intervalId;
let totalSeconds = 0;
let playing = true;
let words = [];

const categoryWords = {
  "Topic of Discussion": ["issue", "matter", "point", "subject"],
  "Origami Items": ["crane", "box", "swan", "flower"],
  "Period of Time": ["era", "phase", "stretch", "seconds"],
  "Red ___": ["carpet", "flag", "bull", "handed"],
};

const initialiseGame = () => {
  getWordsFromCategories();
  shuffleWords();
  getWords();
  displayMistakes();
};

const getWordsFromCategories = () => {
  words = [];
  for (const key in categoryWords) {
    words = words.concat(categoryWords[key]);
  }
  return words;
};

const getWords = () => {
  const wordsGrid = document.getElementById("wordsGrid");
  wordsGrid.innerHTML = "";
  for (const word of words) {
    const wordContainer = createWordContainer(word);
    wordsGrid.appendChild(wordContainer);
  }
};

const createWordContainer = (word) => {
  const wordContainer = document.createElement("div");
  wordContainer.classList.add("word");
  wordContainer.textContent = word;
  wordContainer.addEventListener("click", selectWord);
  return wordContainer;
};

const selectWord = (event) => {
  const target = event.target;
  if (playing) {
    if (target.classList.contains("word-active")) {
      target.classList.remove("word-active");
    } else if (document.querySelectorAll(".word-active").length < 4) {
      target.classList.add("word-active");
    }
  }
};

const submitGroup = () => {
  const words = document.querySelectorAll(".word-active");
  if (words.length === 4) {
    const firstWordCategory = Object.keys(categoryWords).find((key) =>
      categoryWords[key].includes(words[0].textContent)
    );
    const wordsArray = Array.from(words);
    const hasSameCategory = wordsArray.every((word) =>
      categoryWords[firstWordCategory].includes(word.textContent)
    );
    if (hasSameCategory) {
      usedWords = usedWords.concat(wordsArray.map((word) => word.textContent));
      winGroup(wordsArray, firstWordCategory);
    } else {
      handleIncorrectGuess(wordsArray);
    }
  }
};

const handleIncorrectGuess = (wordsArray) => {
  const combination = wordsArray.map((word) => word.textContent).sort();
  const combinationString = combination.join(",");
  if (repeatedCombinations.includes(combinationString)) {
    alert("You have already tried this combination of words");
  } else {
    repeatedCombinations.push(combinationString);
    mistakesRemaining--;
    displayMistakes();

    if (mistakesRemaining === 0) {
      endGame("Game over!");
    } else {
      alert("Incorrect guess, please try again");
    }
  }
};

const endGame = (message) => {
  alert(message);
  stopTimer();
  playing = false;
  if (message === "Game over!") {
    const rows = document.querySelectorAll(".row");
    rows.forEach((row) => {
      const categoryIndex = row.id.split("-")[1];
      const category = Object.keys(categoryWords)[categoryIndex];
      const categoryWordsArray = categoryWords[category];
      revealRow(category, categoryWordsArray);
    });
  }
  grid = document.getElementById("wordsGrid");
  grid.style.display = "none";
};

const startTimer = () => {
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  const pad = (num) => {
    return num < 10 ? "0" + num : num;
  };

  intervalId = setInterval(() => {
    ++totalSeconds;
    seconds.innerHTML = pad(totalSeconds % 60);
    minutes.innerHTML = pad(parseInt(totalSeconds / 60));
  }, 1000);

  return intervalId;
};

startTimer();

const stopTimer = () => {
  clearInterval(intervalId);
};

const winGroup = (selectedWords, category) => {
  selectedWords.forEach((word) => {
    word.classList.remove("word-active");
    word.classList.add("word-float-up");
    setTimeout(() => {
      word.style.display = "none";
    }, 500);
    word.removeEventListener("click", selectWord);
  });
  let selectedWordsArray = selectedWords.map((word) => word.textContent);
  revealRow(category, selectedWordsArray);
  checkGameWin();
};

const checkGameWin = () => {
  console.log(usedWords.length, words.length);
  if (usedWords.length === words.length) {
    stopTimer();
    playing = false;
    endGame("You win!");
  }
};

const displayMistakes = () => {
  const mistakesContainer = document.querySelector(".mistakes");
  mistakesContainer.innerHTML = "";

  for (let i = 0; i < mistakesRemaining; i++) {
    const dot = document.createElement("div");
    dot.classList.add("mistake-dot");
    mistakesContainer.appendChild(dot);
  }
};

const shuffleWords = () => {
  const remainingWords = words.filter((word) => !usedWords.includes(word));
  for (let i = remainingWords.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = remainingWords[i];
    remainingWords[i] = remainingWords[j];
    remainingWords[j] = temp;
  }
  words = [...new Set(remainingWords.slice(0, 16))];
  getWords();
};

const newGame = () => {
  mistakesRemaining = 4;
  usedWords = [];
  playing = true;
  repeatedCombinations = [];
  let rows = document.querySelectorAll(".row");
  rows.forEach((row) => {
    row.style.display = "none";
  });
  let grid = document.getElementById("wordsGrid");
  grid.style.display = "grid";
  stopTimer();
  totalSeconds = 0;
  initialiseGame();
  startTimer();
};

const revealRow = (category, selectedWords) => {
  const categoryIndex = Object.keys(categoryWords).findIndex(
    (key) => key === category
  );
  const row = document.getElementById("row-" + categoryIndex);
  row.style.display = "flex";
  let categoryName = row.children[0];
  categoryName.textContent = category;
  let categoryWordsDiv = row.children[1];
  categoryWordsDiv.textContent = selectedWords.join(", ");
};

initialiseGame();
