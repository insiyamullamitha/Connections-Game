let totalSeconds = 0;
let mistakesRemaining = 5;
let usedWords = [];
let intervalId;

categoryWords = {
  "Things That Smell Nice": ["candle", "bathsalts", "baking", "coffee"],
  "Origami Items": ["crane", "box", "swan", "flower"],
  "Period of Time": ["era", "decade", "stretch", "seconds"],
  "Red ___": ["carpet", "flag", "bull", "handed"],
};

let getWordsFromCategories = () => {
  words = [];
  for (const key in categoryWords) {
    words = words.concat(categoryWords[key]);
  }
  return words;
};

const saveGameState = () => {
  const gameState = {
    words: words.map((word) => ({
      content: word.textContent,
      active: word.classList.contains("word-active"),
    })),
    elapsedSeconds: totalSeconds,
    mistakesRemaining: mistakesRemaining,
    rowsAchieved: Array.from(document.querySelectorAll(".row")).map(
      (row) => row.textContent
    ),
  };

  localStorage.setItem("gameState", JSON.stringify(gameState));
};

// Function to load game state from localStorage
const loadGameState = () => {
  const savedGameState = localStorage.getItem("gameState");
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);

    // Restore words and their positions
    gameState.words.forEach((wordState, index) => {
      const word = document.querySelector(`.word:nth-child(${index + 1})`);
      word.textContent = wordState.content;
      if (wordState.active) {
        word.classList.add("word-active");
      }
    });

    // Restore elapsed time
    totalSeconds = gameState.elapsedSeconds;
    document.getElementById("seconds").innerHTML = pad(totalSeconds % 60);
    document.getElementById("minutes").innerHTML = pad(
      parseInt(totalSeconds / 60)
    );

    // Restore rows achieved
    gameState.rowsAchieved.forEach((category) => {
      const newRow = document.createElement("div");
      newRow.classList.add("row");
      newRow.textContent = category;
      document.getElementById("rowsContainer").appendChild(newRow);
    });
  }
};

// Call loadGameState on page load
window.onload = loadGameState;

const getWords = () => {
  const wordsGrid = document.getElementById("wordsGrid");
  wordsGrid.innerHTML = "";

  for (const word of words) {
    const wordContainer = document.createElement("div");
    wordContainer.classList.add("word");
    wordContainer.textContent = word;
    wordContainer.addEventListener("click", selectWord);
    wordsGrid.appendChild(wordContainer);
  }
};

selectWord = (event) => {
  const target = event.target;
  if (target.classList.contains("word-active")) {
    target.classList.remove("word-active");
  } else if (document.querySelectorAll(".word-active").length < 4) {
    target.classList.add("word-active");
  }
  saveGameState();
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
      winGroup(wordsArray, firstWordCategory);
      usedWords = usedWords.concat(wordsArray.map((word) => word.textContent));
    } else {
      mistakesRemaining--;
      displayMistakes();
      alert("Incorrect guess, please try again");
      if (mistakesRemaining === 0) {
        alert("Game over!");
      }
    }
  }
  saveGameState();
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
    saveGameState();
  }, 1000);

  return intervalId;
};

const stopTimer = () => {
  clearInterval(intervalId);
};

const winGroup = (selectedWords, category) => {
  selectedWords.forEach((word) => {
    word.classList.remove("word-active");
    word.style.display = "none";
    word.removeEventListener("click", selectWord);
  });
  const categoryIndex = Object.keys(categoryWords).findIndex(
    (key) => key === category
  );

  let rowsContainer = document.getElementById("rowsContainer");
  if (!rowsContainer) {
    rowsContainer = document.createElement("div");
    rowsContainer.id = "rowsContainer";
    document.body.appendChild(rowsContainer);
  }

  const newRow = document.createElement("div");
  newRow.classList.add("row");

  if (categoryIndex === 0) {
    newRow.style.backgroundColor = "#F5E07E";
  } else if (categoryIndex === 1) {
    newRow.style.backgroundColor = "#A7C268";
  } else if (categoryIndex === 2) {
    newRow.style.backgroundColor = "#B4C3EB";
  } else if (categoryIndex === 3) {
    newRow.style.backgroundColor = "#B283C1";
  }

  newRow.textContent = category;
  rowsContainer.appendChild(newRow);

  if (rowsContainer.children.length === 4) {
    alert("You win!");
    stopTimer();
    usedWords = [];
  }
  saveGameState();
};

const displayMistakes = () => {
  const mistakesContainer = document.querySelector(".mistakes");
  mistakesContainer.innerHTML = ""; // Clear previous content

  for (let i = 0; i < mistakesRemaining; i++) {
    const dot = document.createElement("div");
    dot.classList.add("mistake-dot");
    mistakesContainer.appendChild(dot);
  }
  saveGameState();
};

const shuffleWords = () => {
  // Filter out words that have been submitted
  const remainingWords = words.filter((word) => !usedWords.includes(word));

  // Shuffle the remaining words
  for (let i = remainingWords.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = remainingWords[i];
    remainingWords[i] = remainingWords[j];
    remainingWords[j] = temp;
  }

  // Take the first 16 (or however many you want) unique words for the grid
  words = [...new Set(remainingWords.slice(0, 16))];

  // Update the grid with the new set of words
  getWords();
};

const newGame = () => {
  totalSeconds = 0;
  mistakesRemaining = 5;
  usedWords = [];
  let rowsContainer = document.getElementById("rowsContainer");
  if (rowsContainer) {
    rowsContainer.innerHTML = "";
  }
  stopTimer();
  startTimer();
  shuffleWords();
  getWords();
  displayMistakes();
  saveGameState();
};

getWordsFromCategories();
loadGameState();
shuffleWords();
getWords();
displayMistakes();
