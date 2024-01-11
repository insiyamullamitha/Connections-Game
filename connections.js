const selectWord = (event) => {
  // check if word is selected or not
  // remove class if selected
  // otherwise check that less than 4 words are selected before adding class
  // if 4 words are selected, show alert
  const target = event.target;
  if (target.classList.contains("word-active")) {
    target.classList.remove("word-active");
  } else if (document.querySelectorAll(".word-active").length < 4) {
    target.classList.add("word-active");
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
