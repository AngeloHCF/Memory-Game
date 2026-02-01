// HTML Elements
const startButton = document.getElementById("start-btn");
const createButton = document.getElementById("create-btn");
const modalCloseButton = document.getElementById("modal-close-btn");
const modalSaveButton = document.getElementById("modal-save-btn");
const modalInput = document.getElementById("modal-input");
const userGuess = document.getElementById("user-guess");
const whatUserWroteElement = document.getElementById("what-user-wrote");

const modalContainer = document.getElementById("modal");
const storedItemsContainer = document.getElementById("stored-items");
const overlay = document.getElementById("overlay");

const historyModal = document.getElementById("history-modal");
const guessHistory = document.getElementById("guesses-history");
const chosenItemDisplay = document.getElementById("chosen-item-display");
const historyButton = document.getElementById("history-btn");

const itemDescription = document.getElementById("item-description");

// Declaring Variables
let gameRunning = false;
const items = JSON.parse(localStorage.getItem("items")) || [
  "You can measure the size of the person by what makes him or her angry",
  `You stop being insecure once you find out you can’t be perfect
`,
];
let chosenItem = null;
let chosenItemLetters = null;
const historyGame = [];

// Event Listeners
startButton.addEventListener("click", () => {
  startGame();
});

createButton.addEventListener("click", () => {
  openModal();
});

modalCloseButton.addEventListener("click", () => {
  hideModal();
});

modalSaveButton.addEventListener("click", () => {
  saveItem();
});

historyButton.addEventListener("click", () => {
  openHistoryModal();
});

modalInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    saveItem();
  }
});

// Functions
const startGame = () => {
  if (!chosenItem && !gameRunning) {
    alert("Please select something you want to memorize!");
    return;
  }
  if (gameRunning) {
    // remove event listener
    document.removeEventListener("keydown", handleGuessEnter);

    startButton.innerHTML = "Start";
    listHistory();
    historyGame.length = 0;
    storedItemsContainer.classList.remove("hide");
    gameRunning = false;
    return;
  }
  startButton.innerHTML = "Stop";
  setTimeout(
    () => {
      userGuess.disabled = false;
      itemDescription.innerHTML = "";
      whatUserWroteElement.innerHTML = "";
      userGuess.focus();
    },
    chosenItem.split("").length * 50,
  );
  // event listener
  document.addEventListener("keydown", handleGuessEnter);

  // Starting Game
  chosenItemLetters = chosenItem.trim().toLowerCase().split("");
  storedItemsContainer.classList.add("hide");
  itemDescription.innerText = chosenItem.toLowerCase();
  userGuess.disabled = true;
  gameRunning = true;
};

const handleGuessEnter = (e) => {
  const Enter = e.key === "Enter";
  const buttonDisabled = userGuess.disabled;

  if (Enter && gameRunning && !buttonDisabled) {
    checkUsersGuess();
  }
  if (Enter && gameRunning && buttonDisabled) {
    handleNext(e);
  }
  clearInterval();
};

const listHistory = () => {
  guessHistory.innerHTML = "";
  chosenItemDisplay.innerHTML = chosenItem;
  for (let i = 0; i < historyGame.length; i++) {
    const wrapper = document.createElement("div");

    const number = document.createElement("p");
    number.innerHTML = i + 1;
    const guess = document.createElement("p");
    guess.innerHTML = historyGame[i];

    wrapper.append(number, guess);

    guessHistory.appendChild(wrapper);
  }
};

const hideItem = () => {
  setTimeout(() => {
    userGuess.disabled = false;
    itemDescription.innerHTML = "";
    whatUserWroteElement.innerHTML = "";
    userGuess.focus();
  }, 3000);
};

const checkUsersGuess = () => {
  if (!gameRunning || !chosenItem) return;
  if (userGuess.disabled === true) return;
  const value = userGuess.value.toLowerCase().trim();
  userGuess.disabled = true;
  historyGame.push(value);
  if (value === chosenItem) {
    compareAnswer(value);
    hideItem();
  } else {
    compareAnswer(value);
  }
  userGuess.value = "";
};

const compareAnswer = (value) => {
  const letterCheck = value.trim().split("");
  const answerDisplay = document.createElement("h1");

  for (let i = 0; i < letterCheck.length; i++) {
    if (letterCheck[i] === chosenItemLetters[i]) {
      const span = document.createElement("span");
      span.innerHTML = letterCheck[i];
      span.classList.add("right");
      answerDisplay.appendChild(span);
    } else if (letterCheck[i] !== chosenItemLetters[i]) {
      const span = document.createElement("span");
      span.innerHTML = letterCheck[i];
      span.classList.add("wrong");
      answerDisplay.appendChild(span);
    }
  }
  whatUserWroteElement.appendChild(answerDisplay);
  itemDescription.innerHTML = chosenItem.toLowerCase().trim();
};

const handleNext = (e) => {
  if (e.key === "Enter") {
    moveOn();
  }
};

const moveOn = () => {
  console.log("Hello");
  userGuess.disabled = false;
  itemDescription.innerHTML = "";
  whatUserWroteElement.innerHTML = "";
  userGuess.focus();
};

const openHistoryModal = () => {
  hideModal();
  document.addEventListener("keydown", handleEscape);
  overlay.addEventListener("click", hideModal);

  historyModal.classList.toggle("hide");
  overlay.classList.toggle("hide");
};

const openModal = () => {
  document.addEventListener("keydown", handleEscape);
  overlay.addEventListener("click", hideModal);

  modalContainer.classList.toggle("hide");
  overlay.classList.toggle("hide");
};

const hideModal = () => {
  historyModal.classList.add("hide");
  modalContainer.classList.add("hide");
  overlay.classList.add("hide");

  overlay.removeEventListener("click", hideModal);
  document.removeEventListener("keydown", handleEscape);
};

const handleEscape = (e) => {
  if (e.key === "Escape") {
    hideModal();
  }
};

const saveItem = () => {
  const value = modalInput.value.trim();
  if (!value) return;

  modalInput.value = "";
  hideModal();

  items.push(value);
  localStorage.setItem("items", JSON.stringify(items));
  loadItems();
};

const deleteItem = (index) => {
  items.splice(index, 1);
  localStorage.setItem("items", JSON.stringify(items));
  loadItems();
};

const chooseItem = (entry, element) => {
  if (element.classList.contains("chosen")) {
    chosenItem = null;
    chosenItemLetters = null;
    element.classList.remove("chosen");
    return;
  }
  chosenItem = entry;

  document.querySelectorAll(".item-container").forEach((el) => {
    el.classList.remove("chosen");
  });

  element.classList.add("chosen");
};

const loadItems = () => {
  storedItemsContainer.innerHTML = "";
  items.forEach((entry, index) => {
    const divElement = document.createElement("div");
    divElement.classList.add("item-container");
    divElement.addEventListener("click", () => {
      chooseItem(entry, divElement);
    });
    const headingElement = document.createElement("h2");
    headingElement.textContent = entry;
    headingElement.classList.add("item-heading");
    const buttonElement = document.createElement("button");
    buttonElement.addEventListener("click", () => {
      deleteItem(index);
    });
    buttonElement.classList.add("item-delete-button");
    buttonElement.innerText = "Delete";

    divElement.append(headingElement, buttonElement);

    storedItemsContainer.appendChild(divElement);
  });
};

// Window on load
window.addEventListener("DOMContentLoaded", () => {
  if (items) {
    loadItems();
  }
});
