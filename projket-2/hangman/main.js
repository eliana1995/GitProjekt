// Word list with words the players will guess
const wordList = [
    "banan",
    "äpple",
    // "jordgubbe", // commented out due to a word being longer than hangman stages causes a bug
    "päron",
    "melon",
    "apelsin",
    "kiwi",
    "avokado",
    "lime",
    "körsbär",
    "oliv",
    "persika",
];

// Switch the current player
function switchCurrentPlayer() {
    if (currentPlayer == players[0]) {
        currentPlayer = players[1];
        document.getElementById("message").textContent =
            "Player 2, it is your turn";
    } else if (currentPlayer == players[1]) {
        currentPlayer = players[0];
        document.getElementById("message").textContent =
            "Player 1, it is your turn";
    }
}

// Set up each player as an object
let player1 = {
    name: "player1",
    chosenWord: [], //Randomizes the player's word
    guessedLetters: [], // Stores the player's guessed letters
    displayedWord: [], // Representation of the word, underscores or correctly guessed letters
    wrongGuesses: 0, // Tracks number of wrong guesses
    addWrongGuess: function () {
        this.wrongGuesses++;
    },
};
let player2 = {
    name: "player2",
    chosenWord: [], //Randomizes the player's word
    guessedLetters: [], // Stores the player's guessed letters
    displayedWord: [], // Representation of the word, underscores or correctly guessed letters
    wrongGuesses: 0, // Tracks number of wrong guesses
    addWrongGuess: function () {
        this.wrongGuesses++;
    },
};

//Initialize each player, used when starting/resetting game, resetting the variables and randomizing a new word
function initPlayers() {
    player1 = {
        name: "player1",
        chosenWord: [], //Randomizes the player's word
        guessedLetters: [], // Stores the player's guessed letters
        displayedWord: [], // Representation of the word, underscores or correctly guessed letters
        wrongGuesses: 0, // Tracks number of wrong guesses
        addWrongGuess: function () {
            this.wrongGuesses++;
        },
    };
    player2 = {
        name: "player2",
        chosenWord: [], //Randomizes the player's word
        guessedLetters: [], // Stores the player's guessed letters
        displayedWord: [], // Representation of the word, underscores or correctly guessed letters
        wrongGuesses: 0, // Tracks number of wrong guesses
        addWrongGuess: function () {
            this.wrongGuesses++;
        },
    };
}

// Initialize each players displayedWord
function initPlayersWords() {
    player1.chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
    player1.displayedWord = player1.chosenWord
        .split("")
        .map((letter) =>
            player1.guessedLetters.includes(letter) ? letter : "_"
        );
    while (true) {
        player2.chosenWord =
            wordList[Math.floor(Math.random() * wordList.length)];
        if (
            player2.chosenWord != player1.chosenWord &&
            player2.chosenWord.length == player1.chosenWord.length
        ) {
            break;
        }
    }
    player2.displayedWord = player2.chosenWord
        .split("")
        .map((letter) =>
            player2.guessedLetters.includes(letter) ? letter : "_"
        );
    document.getElementById("player1-word-display").textContent =
        player1.displayedWord.join(" ");
    document.getElementById("player2-word-display").textContent =
        player2.displayedWord.join(" ");
}

// Function used to fetch the current players data in other functions
function getCurrentPlayerData(currentPlayer) {
    return currentPlayer === players[0] ? player1 : player2;
}

const hangmanStages = [
    `
     
     
     
     
     
     
    `,
    `
     
     
     
     
     
   -----
    `,
    `
     
     
     
     |
     |
   -----
    `,
    `
     O  
     |
     |
     |
     |
   -----
    `,
    `
     O  
    /|  
     |  
     |  
     |
   -----
    `,
    `
     O  
    /|\\
     |  
     |  
     |
   -----
    `,
    `
     O  
    /|\\
     |  
    / \\
     |
   -----
    `,
];

const maxWrongGuesses = hangmanStages.length; // Maximum number of wrong guesses

// Checks how many letters in a word are not guessed yet,
// used in updateHangman() to calculate stage of hangman figure
function unknownLettersLeftInWord(word) {
    let number = 0;
    for (let char of word) {
        if (char == "_") {
            number++;
        }
    }
    return number;
}

function updateHangman(player) {
    let playerData = player; // Fetch current player data
    let drawOnPlayer; // the opponent
    let lettersLeft =
        hangmanStages.length -
        unknownLettersLeftInWord(playerData.displayedWord); // diff between non correct guessed letters and
    // hangman stages to count backwards which stage the figure should be
    if (playerData.name == "player1") {
        drawOnPlayer = "player2";
    }
    if (playerData.name == "player2") {
        drawOnPlayer = "player1";
    }
    let hangmanElement = document.getElementById(
        `${drawOnPlayer}-hangman-display`
    ); // Update the opponents hangman figure
    hangmanElement.textContent = hangmanStages[lettersLeft - 1]; // Draw hangman->
    // based on how many letters in the word are yet to guess correctly
    console.log(lettersLeft);
}

function displayWord() {
    let playerData = getCurrentPlayerData(currentPlayer); // Fetch current player data
    playerData.displayedWord = playerData.chosenWord
        .split("")
        .map((letter) =>
            playerData.guessedLetters.includes(letter) ? letter : "_"
        );
    document.getElementById(`${currentPlayer}-word-display`).textContent =
        playerData.displayedWord.join(" ");
}

function handleGuess() {
    let playerData = getCurrentPlayerData(currentPlayer); // Fetch current player data
    const letterInput = document.getElementById("letter-input");
    const guess = letterInput.value.toLowerCase();
    if (
        guess &&
        guess.length === 1 &&
        !playerData.guessedLetters.includes(guess)
    ) {
        playerData.guessedLetters.push(guess);
        if (playerData.chosenWord.includes(guess)) {
            displayWord();
            updateHangman(playerData);
        } else {
            alert("Fel gissning!");
            playerData.addWrongGuess();
            if (playerData.wrongGuesses >= maxWrongGuesses) {
                document.getElementById(
                    `${currentPlayer}-message`
                ).textContent = `Du förlorade! Ordet var: ${playerData.chosenWord}`;
                console.log("loss");
                if (currentPlayer == players[0]) {
                    endGame("Player 1", "loss"); // Call end function
                } else if (currentPlayer == players[1]) {
                    endGame("Player 2", "loss"); // Call end function
                }
            }
        }
        letterInput.value = "";
        if (!playerData.displayedWord.includes("_")) {
            if (currentPlayer == players[0]) {
                endGame("Player 1", "win"); // Call end function
            } else if (currentPlayer == players[1]) {
                endGame("Player 2", "win"); // Call end function
            }
        } else {
            switchCurrentPlayer(); // Switch the current player if the game has not ended
        }
    } else {
        alert("Ange en giltig bokstav som du inte redan har gissat.");
    }
}

// Funktion för att starta spelet
function startGame() {
    initPlayers();
    initPlayersWords();
    updateHangman(player1);
    updateHangman(player2);
    if (currentPlayer == players[0]) {
        // Sets the message to says whos turn it is
        document.getElementById("message").textContent =
            "Player 1, it is your turn";
    } else if (currentPlayer == players[1]) {
        document.getElementById("message").textContent =
            "Player 2, it is your turn";
    }
    document.getElementById("guess-button").disabled = false;
    document.getElementById("letter-input").disabled = false;
}

// Starta spelet när sidan laddas
window.onload = startGame;

// Lägg till eventlyssnare på knappen för gissningar
document.getElementById("guess-button").addEventListener("click", handleGuess);

// Funktion för att slumpa startspelare
function choosStartingPlayer(players) {
    const randomIndex = Math.floor(Math.random() * players.length);
    startingPlayer = players[randomIndex];
    console.log(`${startingPlayer} börjer gissa!`);
    return startingPlayer;
}

const players = ["player1", "player2"]; // Exempel på spelare
let currentPlayer = choosStartingPlayer(players); //Slumpa och visa vem som börjar

console.log(`Spelet börjar! ${currentPlayer} är först.`); // Hänga med i turordningen i spelet

// Reveals the word with guessed letters or underscores
function revealWord() {
    // Stores this array. It is used to keep track of which letters have been revealed
    let revealedWord = chosenWord; //Maps each letter in the word to either the guesses letter or an underscore
    chosenWord.split(""); // Splits the string "____"into an array where each - becomes a separate element
    chosenWord.map((letter) =>
        guessedLetters.includes(letter) ? letter : "_"
    );
    document.getElementById("word-display").textContent =
        revealedWord.join(" "); // Update the word display in the UI
}

// Ends the game and shows optins to play again or exit
function endGame(player, win) {
    document.getElementById("guess-button").disabled = true;
    document.getElementById("letter-input").disabled = true;

    const messageElement = document.getElementById("message");
    if (win) {
        messageElement.textContent = `Congratulations ${player}! You've guessed the word!`;
    } else {
        messageElement.textContent = `You lost! The word was: ${player.chosenWord}`;
    }
    showEndOptions();
}

// Show button for playing again or exiting
function showEndOptions() {
    const messageElement = document.getElementById("message");
    messageElement.insertAdjacentHTML(
        "afterend",
        `<div id = "end-options">
        <button id = "play-again-button" class = "button">Play Again</button>
        <button id = "exit-button" class = "button">Exit </button>
        </div>`
    );

    // Event listener for "Play Again"
    document
        .getElementById("play-again-button")
        .addEventListener("click", () => {
            document.getElementById("end-options").remove();
            startGame();
        });

    // Event listener for "Exit"
    document.getElementById("exit-button").addEventListener("click", () => {
        document.getElementById("message").textContent =
            "Thank you for playing!";
        document.getElementById("word-display").textContent = "";
        document.getElementById("hangman-display").textContent = "";
        document.getElementById("end-option").remove();
    });
}

const startBtn = document.getElementById("start-btn"); // Variable for Start new game-button
// What happens when a user presses the Start new game button
startBtn.addEventListener("click", () => {
    startGame();
});

// Funktion för att lägga till nytt ord till ordlistan
function addNewWord() {
    const newWordInput = document.getElementById("new-word-input");
    const newWord = newWordInput.value.trim().toLowerCase();

    // Kontrollera om ordet är giltigt
    if (newWord && !wordList.includes(newWord)) {
        wordList.push(newWord);
        alert("Ordet har lagts till!");
    } else {
        alert("Ange ett giltigt ord som inte redan finns i listan.");
    }

    // Rensa input-fältet
    newWordInput.value = "";
}

// Lägg till eventlyssnare på knappen för att lägga till ord
document
    .getElementById("add-word-button")
    .addEventListener("click", addNewWord);


    function addNewWord() {
        const newWordInput = document.getElementById("new-word-input");
        const newWord = newWordInput.value.trim().toLowerCase();
    
        // Kontrollera om ordet är giltigt
        if (newWord && !wordList.includes(newWord)) {
            wordList.push(newWord); // Lägg till ordet i ordlistan
    
            // Spara den uppdaterade ordlistan till localStorage
            localStorage.setItem("wordList", JSON.stringify(wordList));
    
            alert("Ordet har lagts till!");
        } else {
            alert("Ange ett giltigt ord som inte redan finns i listan.");
        }
    
        // Rensa input-fältet
        newWordInput.value = "";
    }

    
    function loadWordList() {
        // Hämta ordlistan från localStorage
        const storedWordList = localStorage.getItem("wordList");
    
        // Om det finns en sparad ordlista, använd den, annars använd den fördefinierade
        if (storedWordList) {
            wordList = JSON.parse(storedWordList);
        }
    }
    
    // Kör denna funktion vid sidladdning
    window.onload = function() {
        loadWordList();  // Ladda ordlistan från localStorage
        startGame();      // Starta spelet
    };
    