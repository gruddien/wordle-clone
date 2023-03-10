import { WORDS } from "./words.js" //world list, server needed

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let correctAnswer = WORDS[Math.floor(Math.random() * WORDS.length)]
const fKeys = ["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"]; //ignore F-keys
const screenKeyboard = Array.from(document.getElementsByClassName("keyboardButton"));
let keyboardColorMap = new Map();

console.log(correctAnswer)

//colors
let grey = '#363636';
let green = '#3c8233';
let yellow = '#cc9d1d';

function initBoard() { //generate board function
    let board = document.getElementById("gameBoard");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letterRow";

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letterBox";
            row.appendChild(box);
        };
        board.appendChild(row);
    };
};

initBoard(); //generate board

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
    let validKey = pressedKey.match(/[A-Z]/gi); //get only letters with regex
    if (validKey && validKey.length === 1) {
        if (!fKeys.includes(pressedKey)){ //if not Fkey then insterLetter
            insertLetter(pressedKey);
        }
    }
})

//onscreen keyboard input
screenKeyboard.forEach(key => {
    key.addEventListener("click", () =>{
        if (guessesRemaining === 0){
            return
        };

        let keyLetter = key.innerHTML;

        if (keyLetter === "Del" && nextLetter !== 0){
            deleteLetter();
            key.blur();
            return
        }

        if (keyLetter === "Enter"){
            checkGuess();
            key.blur();
            return
        }

        if (keyLetter && keyLetter.length === 1) {
            insertLetter(keyLetter);
            key.blur();
        }
    })
});

function insertLetter(letter){
    if (nextLetter === 5){
        return;
    }
    let targetRow = document.getElementsByClassName("letterRow")[NUMBER_OF_GUESSES - guessesRemaining];
    let targetBox = targetRow.children[nextLetter];
    targetBox.style.animation = "pop .1s"; //letter pop animation when typing
    targetBox.innerText = letter;
    nextLetter++;
    currentGuess.push(letter);
    
    //reset animations of letterBox
    targetBox.addEventListener('animationend', () => {
        targetBox.style.animation = "";
    });
    
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

    let checkedRow = document.getElementsByClassName("letterRow")[NUMBER_OF_GUESSES - guessesRemaining];

    let guessString = currentGuess.join('');
    if (!WORDS.includes(guessString)) {
        checkedRow.style.animation = "wobble .2s";
        checkedRow.addEventListener('animationend', () => {
            checkedRow.style.animation = "";
        });
        displayPopup("Not in word list");
        return
    }

    let correctArray = Array.from(correctAnswer);
    let colorTable = [grey, grey, grey, grey, grey];

    for (let i = 0; i < correctAnswer.length; i++) {
        if(correctArray[i] == currentGuess[i]){
            colorTable[i] = green;
            correctArray[i] = "#";
        }; 
    };

    for (let i = 0; i < correctArray.length; i++) {
        if (colorTable[i] == green) continue;

        for (let j = 0; j < correctArray.length; j++) {
            if (correctArray[j] == currentGuess[i]){
                colorTable[i] = yellow;
                correctArray[j] = "#";
                break;
            };
        };
        
    }

    //flipping letters and adding colors
    colorTable.forEach((color, i) => {
        let checkedBox = checkedRow.children[i];
        let time = 200*i;

        setTimeout(()=>{
            checkedBox.style.transform = "rotateX(90deg)"
        },time);

        checkedBox.addEventListener('transitionend', () => {
            checkedBox.style.backgroundColor = color;
            checkedBox.style.border = "2px solid transparent";
            checkedBox.style.transform = "rotateX(0)"
        });

        if (keyboardColorMap.get(checkedBox.innerHTML) == green){
            return
        } else if (keyboardColorMap.get(checkedBox.innerHTML) == yellow && color !== green){
            return
        } else {
            keyboardColorMap.set(checkedBox.innerHTML, color);
        }

        checkedRow.children[colorTable.length - 1].addEventListener('transitionend', () => {
            setTimeout(() => {
                colorKeyboard(checkedBox.innerHTML, color)
            }, 200)
        });
    });

    function colorKeyboard(letter, color){
        screenKeyboard.forEach(key => {
            if (key.innerHTML === letter){
                key.style.backgroundColor = color;  
            }
        });
    };

    guessesRemaining--;
    nextLetter = 0;
    currentGuess = [];
}

function displayPopup(popupText){
    let popupContainer = document.getElementById("popupContainer");
    let popupBox = document.createElement("div");
    popupBox.className = "popupBox";
    popupBox.innerText = popupText;
    popupContainer.appendChild(popupBox);

    setTimeout(()=>{
        popupContainer.removeChild(popupContainer.lastChild);
    },1300)
}
