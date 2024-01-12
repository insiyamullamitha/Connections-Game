let mistakesRemaining = 5;
let usedWords = [];
let repeatedCombinations = [];
let intervalId;
let totalSeconds = 0;
let playing = true;

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
      winGroup(wordsArray, firstWordCategory);
      usedWords = usedWords.concat(wordsArray.map((word) => word.textContent));
    } else {
      const combination = [];
      wordsArray.forEach((word) => {
        combination.push(word.textContent);
      });
      combination.sort();
      const combinationString = combination.join(",");
      if (repeatedCombinations.includes(combinationString)) {
        alert("You have already tried this combination of words");
      } else {
        repeatedCombinations.push(combinationString);
        mistakesRemaining--;
        displayMistakes();
        alert("Incorrect guess, please try again");
      }
      if (mistakesRemaining === 0) {
        alert("Game over!");
        stopTimer();
        playing = false;
        const rows = document.querySelectorAll(".row");
        rows.forEach((row) => {
          const categoryIndex = row.id.split("-")[1];
          const category = Object.keys(categoryWords)[categoryIndex];
          const categoryWordsArray = categoryWords[category];

          row.style.display = "flex";
          row.textContent = `${category}: ${categoryWordsArray.join(", ")}`;
        });

        grid = document.getElementById("wordsGrid");
        grid.style.display = "none";
      }
    }
  }
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
    word.style.display = "none";
    word.removeEventListener("click", selectWord);
  });
  const categoryIndex = Object.keys(categoryWords).findIndex(
    (key) => key === category
  );

  const row = document.getElementById("row-" + categoryIndex);
  row.style.display = "flex";
  row.textContent =
    category + ": " + selectedWords.map((word) => word.textContent).join(", ");

  if (usedWords.length === words.length) {
    alert("You win!");
    stopTimer();
    playing = false;
  }
};

const displayMistakes = () => {
  const mistakesContainer = document.querySelector(".mistakes");
  mistakesContainer.innerHTML = ""; // Clear previous content

  for (let i = 0; i < mistakesRemaining; i++) {
    const dot = document.createElement("div");
    dot.classList.add("mistake-dot");
    mistakesContainer.appendChild(dot);
  }
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
  mistakesRemaining = 5;
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
  shuffleWords();
  getWords();
  displayMistakes();
  startTimer();
};

getWordsFromCategories();
shuffleWords();
getWords();
displayMistakes();
