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

let mistakesRemaining = 5;
getWordsFromCategories();

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
      //remove word from class list
      wordsArray.forEach((word) => {
        word.classList.remove("word-active");
      });
      mergeIntoRectangle(wordsArray);
    } else {
      mistakesRemaining--;
      displayMistakes();
      alert("Incorrect guess, please try again");
      if (mistakesRemaining === 0) {
        alert("Game over!");
      }
    }
  }
};

const startTimer = () => {
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  let totalSeconds = 0;

  const pad = (num) => {
    return num < 10 ? "0" + num : num;
  };

  setInterval(() => {
    ++totalSeconds;
    seconds.innerHTML = pad(totalSeconds % 60);
    minutes.innerHTML = pad(parseInt(totalSeconds / 60));
  }, 1000);
};

const mergeIntoRectangle = (selectedWords) => {
  // Create a container for the rectangle
  const rectangleContainer = document.createElement("div");
  rectangleContainer.classList.add("words-grid");

  // make selected words disappear
  selectedWords.forEach((word) => {
    word.style.display = "none";
  });

  // Set the position and display properties of the rectangle container
  rectangleContainer.style.display = "flex";
  rectangleContainer.style.flexDirection = "row";
  rectangleContainer.style.alignItems = "center";
  rectangleContainer.style.gridColumn = "span 4";
  rectangleContainer.style.width = "100%";
  rectangleContainer.style.backgroundColor = "red";

  // Append the rectangle container to the original grid
  const wordsGrid = document.querySelector(".words-grid");
  wordsGrid.insertBefore(rectangleContainer, wordsGrid.firstChild);
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
  for (var i = words.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = words[i];
    words[i] = words[j];
    words[j] = temp;
  }
  getWords();
};
