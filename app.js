const fruits = [
    { name: "apple", symbol: "🍎" },
    { name: "banana", symbol: "🍌" },
    { name: "cherry", symbol: "🍒" },
    { name: "coconut", symbol: "🥥" },
    { name: "grapes", symbol: "🍇" },
    { name: "mango", symbol: "🥭" },
    { name: "pineapple", symbol: "🍍" },
    { name: "watermelon", symbol: "🍉" },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Parts of the page
const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const statusMessage = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");

// Game state
let deck = []; // the shuffled cards
let turned = []; // cards face up in this turn
let moves = 0; // number of moves so far
let matchedPairs = 0; // number of pairs found
let waiting = false; // true while two cards wait to turn back
let timerId = null; // the timer for turning cards back

// Build of the board with cards face down
function buildBoard() {
    deck = shuffle([...fruits, ...fruits]);

    for (let i = 0; i < deck.length; i++) {
        const card = document.createElement("button");
        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;
        board.appendChild(card);
    }
}

// Turn a card face up
function flipUp(card) {
    const fruit = deck[card.dataset.index];
    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, ${fruit.name}`
    );
}

// Turn a card face down
function flipDown(card) {
    card.textContent = "";
    card.classList.remove("flipped");
    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, face down`
    );
}

// One click listener for the whole board
board.addEventListener("click", (event) => {
    const card = event.target;

    // Ignore clicks that are not on a card
    if (!card.classList.contains("card")) return;
    // Ignore clicks while two cards are waiting to turn back
    if (waiting) return;
    // Ignore clicks on a card that is already face up
    if (card.classList.contains("flipped")) return;

    // Turn the card over
    flipUp(card);
    turned.push(card);

    // Wait until two cards are face up
    if (turned.length < 2) return;

    // Exercise 3: that was one move
    moves++;
    movesDisplay.textContent = moves;

    const first = turned[0];
    const second = turned[1];

    if (deck[first.dataset.index].name === deck[second.dataset.index].name) {
        // It is a pair
        first.classList.add("matched");
        second.classList.add("matched");
        first.disabled = true;
        second.disabled = true;
        statusMessage.textContent = "That's a pair!";
        turned = [];
        matchedPairs++;

        // All pairs found
        if (matchedPairs === fruits.length) {
            statusMessage.textContent = `You found all the pairs in ${moves} moves!`;
            statusMessage.classList.add("you-won");
        }
    } else {
        // Turn both back after 1 second
        statusMessage.textContent = "Not a pair. Try again.";
        waiting = true;
        timerId = setTimeout(() => {
            flipDown(first);
            flipDown(second);
            turned = [];
            waiting = false;
        }, 1000);
    }
});

//Start a new game
function newGame() {
    clearTimeout(timerId); // cancel the timer if it is running
    waiting = false;
    turned = [];
    moves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = moves;
    statusMessage.textContent = "Turn over two cards to find a matching pair.";
    statusMessage.classList.remove("you-won");
    board.replaceChildren(); // remove the old cards
    buildBoard();
}

newGameButton.addEventListener("click", newGame);

// Build the board when the page loads
buildBoard();