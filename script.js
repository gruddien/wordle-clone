import { WORDS } from "./words.js" //list słów, trzeba odpalać na localhoscie

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;

let correctAnswer = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(correctAnswer)

const fKeys = ["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"]; //nie umiałem regexem wywalić F-keys


function initBoard() { //wygeneruj plansze
    let board = document.getElementById("gameBoard");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letterRow";

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letterBox"
            row.appendChild(box);
        };
        board.appendChild(row);
    };
};

initBoard(); //odpala generowanie planszy na starcie gry

document.addEventListener("keydown", (e) =>{
    if (guessesRemaining === 0){
        return
    };

    let pressedKey = String(e.key);

    if (pressedKey === "Backspace" && nextLetter !== 0){
        deleteLetter();
        return
    }

    if (pressedKey === "Enter"){
        checkGuess();
        return
    }
    let validKey = pressedKey.match(/[A-Z]/gi); //regex sprawdza tylko litery
    if (validKey && validKey.length === 1) {
        if (!fKeys.includes(pressedKey)){ //jeśli nie jest F-key to odpal insterLetter
            insertLetter(pressedKey);
        }
    }
})

function insertLetter(letter){
    if (nextLetter === 5){
        return;
    }
    let targetRow = document.getElementsByClassName("letterRow")[NUMBER_OF_GUESSES - guessesRemaining];
    let targetBox = targetRow.children[nextLetter];
    targetBox.innerText = letter;
    nextLetter++;
    currentGuess.push(letter);
}

function deleteLetter(){
    let targetRow = document.getElementsByClassName("letterRow")[NUMBER_OF_GUESSES - guessesRemaining];
    let targetBox = targetRow.children[nextLetter-1];
    targetBox.innerText = "";
    nextLetter--;
    currentGuess.pop();
}

function checkGuess(){
    if (nextLetter !== 5){
        return
    }

    let guessString = currentGuess.join('');

    if (!WORDS.includes(guessString)) {
        alert("Word not on the list!")
        return
    }

    let checkedRow = document.getElementsByClassName("letterRow")[NUMBER_OF_GUESSES - guessesRemaining];
    let correctArray = Array.from(correctAnswer);

    for (let i = 0; i < currentGuess.length; i++) {
        let letter = currentGuess[i];
        let box = checkedRow.children[i];
        let color = "";
        let numberOfDuplcates = correctArray.filter(l => l === letter).length;
        console.log(numberOfDuplcates);

        if (letter === correctArray[i]){
            color = "#3c8233"; //green

        } else if (correctArray.includes(letter)){
            color = "#cc9d1d"; //yellow
        } else {
            color = "#363636"; //grey
        }

    box.style.backgroundColor = color;

        
    }
    guessesRemaining--;
    nextLetter = 0;
    console.log(currentGuess);
    currentGuess = [];

}

function colorKeyboard(letter){
    
}