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
