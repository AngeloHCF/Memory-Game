// HTML Elements - Query DOM once and store references
const elements = {
  startButton: document.getElementById("start-btn"),
  createButton: document.getElementById("create-btn"),
  modalCloseButton: document.getElementById("modal-close-btn"),
  modalSaveButton: document.getElementById("modal-save-btn"),
  modalInput: document.getElementById("modal-input"),
  userGuess: document.getElementById("user-guess"),
  whatUserWroteElement: document.getElementById("what-user-wrote"),
  modalContainer: document.getElementById("modal"),
  storedItems: document.getElementById("stored-items"),
  overlay: document.getElementById("overlay"),
  historyModal: document.getElementById("history-modal"),
  guessHistory: document.getElementById("guesses-history"),
  chosenItemDisplay: document.getElementById("chosen-item-display"),
  historyButton: document.getElementById("history-btn"),
  itemDescription: document.getElementById("item-description"),
  helpModal: document.getElementById("help-modal"),
  helpButton: document.getElementById("help-btn"),
};

// Game State
const gameState = {
  running: false,
  chosenItem: null,
  chosenItemLetters: null,
  history: [],
};

// Data Management
const itemsManager = {
  get items() {
    return (
      JSON.parse(localStorage.getItem("items")) || [
        "You can measure the size of the person by what makes him or her angry",
        "You stop being insecure once you realize you can't be perfect",
        "Peace grows when you stop needing approval",
        "Growth starts the moment excuses end",
        "Discipline is choosing what you want most over what you want now",
        "Most people don't lack potential, they lack patience with the process that turns effort into results",
      ]
    );
  },

  save(items) {
    localStorage.setItem("items", JSON.stringify(items));
  },

  add(item) {
    const items = this.items;
    items.push(item);
    this.save(items);
  },

  remove(index) {
    const items = this.items;
    items.splice(index, 1);
    this.save(items);
  },
};

// Event Handlers
const handlers = {
  guessEnter: null,
  escape: null,
  overlayClick: null,
};

// Event Listeners Setup
const setupEventListeners = () => {
  elements.startButton.addEventListener("click", startGame);
  elements.createButton.addEventListener("click", openModal);
  elements.modalCloseButton.addEventListener("click", hideModal);
  elements.modalSaveButton.addEventListener("click", saveItem);
  elements.historyButton.addEventListener("click", openHistoryModal);
  elements.helpButton.addEventListener("click", openHelpModal);

  elements.modalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") saveItem();
  });

  // Event delegation for item selection and deletion
  elements.storedItems.addEventListener("click", (e) => {
    const itemContainer = e.target.closest(".item-container");
    const deleteButton = e.target.closest(".item-delete-button");

    if (deleteButton && itemContainer) {
      e.stopPropagation();
      const index = Array.from(elements.storedItems.children).indexOf(
        itemContainer,
      );
      deleteItem(index);
    } else if (itemContainer) {
      const entry = itemContainer.dataset.item;
      chooseItem(entry, itemContainer);
    }
  });
};

// Game Missing
const startGame = () => {
  if (!gameState.chosenItem && !gameState.running) {
    alert("Please select something you want to memorize!");
    return;
  }

  if (gameState.running) {
    stopGame();
    return;
  }

  // Start Game
  elements.whatUserWroteElement.textContent = "";
  elements.startButton.textContent = "Stop";
  gameState.running = true;
  gameState.chosenItemLetters = gameState.chosenItem
    .trim()
    .toLowerCase()
    .split("");
  gameState.history = [];

  elements.storedItems.classList.add("hide");
  elements.itemDescription.textContent = gameState.chosenItem.toLowerCase();

  handlers.guessEnter = handleGuessEnter;
  document.addEventListener("keydown", handlers.guessEnter);
  elements.startButton.blur();
  elements.userGuess.disabled = true;
};

const stopGame = () => {
  // Clean up event listener
  if (handlers.guessEnter) {
    document.removeEventListener("keydown", handlers.guessEnter);
    handlers.guessEnter = null;
  }

  elements.startButton.textContent = "Start";
  listHistory();
  elements.storedItems.classList.remove("hide");
  gameState.running = false;
};

const handleGuessEnter = (e) => {
  if (e.key !== "Enter" || !gameState.running) return;

  if (!elements.userGuess.disabled) {
    checkUsersGuess();
  } else {
    moveOn();
  }
};

const checkUsersGuess = () => {
  if (
    !gameState.running ||
    !gameState.chosenItem ||
    elements.userGuess.disabled
  )
    return;

  const value = elements.userGuess.value.toLowerCase().trim();
  elements.userGuess.disabled = true;
  gameState.history.push(value);

  compareAnswer(value);
  elements.userGuess.value = "";
};

const compareAnswer = (value) => {
  const userLetters = value.replace(/\s+/g, " ").split("");
  const answerDisplay = document.createElement("h1");
  console.log(userLetters);

  userLetters.forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.classList.add(
      letter === gameState.chosenItemLetters[i] ? "right" : "wrong",
    );
    answerDisplay.appendChild(span);
  });

  elements.whatUserWroteElement.appendChild(answerDisplay);
  elements.itemDescription.textContent = gameState.chosenItem
    .toLowerCase()
    .trim();
};

const moveOn = () => {
  elements.userGuess.disabled = false;
  elements.itemDescription.textContent = "";
  elements.whatUserWroteElement.textContent = "";
  elements.userGuess.focus();
};

// History
const listHistory = () => {
  elements.guessHistory.innerHTML = "";
  elements.chosenItemDisplay.textContent = gameState.chosenItem;

  gameState.history.forEach((guess, i) => {
    const wrapper = document.createElement("div");

    const number = document.createElement("p");
    number.textContent = i + 1;

    const guessText = document.createElement("p");
    guessText.textContent = guess;

    wrapper.append(number, guessText);
    elements.guessHistory.appendChild(wrapper);
  });
};

const openHistoryModal = () => {
  hideModal();
  showModal(elements.historyModal);
};

const openHelpModal = () => {
  hideModal();
  showModal(elements.helpModal);
};

const openModal = () => {
  showModal(elements.modalContainer);
};

const showModal = (modal) => {
  handlers.escape = handleEscape;
  handlers.overlayClick = hideModal;

  document.addEventListener("keydown", handlers.escape);
  elements.overlay.addEventListener("click", handlers.overlayClick);

  modal.classList.remove("hide");
  elements.overlay.classList.remove("hide");
};

const hideModal = () => {
  elements.historyModal.classList.add("hide");
  elements.helpModal.classList.add("hide");
  elements.modalContainer.classList.add("hide");
  elements.overlay.classList.add("hide");

  if (handlers.overlayClick) {
    elements.overlay.removeEventListener("click", handlers.overlayClick);
    handlers.overlayClick = null;
  }

  if (handlers.escape) {
    document.removeEventListener("click", handlers.escape);
    handlers.overlayClick = null;
  }
};

const handleEscape = (e) => {
  if (e.key === "Escape") hideModal();
};

const saveItem = () => {
  const value = elements.modalInput.value.trim().replace(/\s+/g, " ");
  if (!value) return;

  elements.modalInput.value = "";
  hideModal();

  itemsManager.add(value);
  loadItems();
};

const deleteItem = (index) => {
  itemsManager.remove(index);
  loadItems();
};

const chooseItem = (entry, element) => {
  if (element.classList.contains("chosen")) {
    gameState.chosenItem = null;
    gameState.chosenItemLetters = null;
    element.classList.remove("chosen");
    return;
  }

  gameState.chosenItem = entry;

  elements.storedItems.querySelectorAll(".item-container").forEach((el) => {
    el.classList.remove("chosen");
  });

  element.classList.add("chosen");
};

const loadItems = () => {
  const items = itemsManager.items;
  elements.storedItems.innerHTML = "";

  items.forEach((entry) => {
    const divElement = document.createElement("div");
    divElement.classList.add("item-container");
    divElement.dataset.item = entry; // Store item in data attribute

    const headingElement = document.createElement("h2");
    headingElement.textContent = entry;
    headingElement.classList.add("item-heading");

    const buttonElement = document.createElement("button");
    buttonElement.classList.add("item-delete-button");
    buttonElement.textContent = "Delete";

    divElement.append(headingElement, buttonElement);
    elements.storedItems.appendChild(divElement);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadItems();
});
