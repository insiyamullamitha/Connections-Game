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
    words.forEach((word) => {
      word.classList.remove("word-active");
    });
    mergeIntoRectangle(words);
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

let mistakesRemaining = 5;

const displayMistakes = () => {
  const mistakesContainer = document.querySelector(".mistakes");
  mistakesContainer.innerHTML = ""; // Clear previous content

  for (let i = 0; i < mistakesRemaining; i++) {
    const dot = document.createElement("div");
    dot.classList.add("mistake-dot");
    mistakesContainer.appendChild(dot);
  }
};
