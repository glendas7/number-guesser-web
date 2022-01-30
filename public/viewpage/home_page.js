import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
  updateDocForLED, attachRealtimeListener, initFirestoreDocs, updateGameData, updateButtons,
} from '../controller/firestore_controller.js';

export let buttonsDoc = null;
export let gameDataDoc = null;

let inputNumberGuess
let startGuessButton
let myGuess
let randomNum

export function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }

  let html = '<h3 class="d-flex justify-content-center m-3">Control Panel<h3>';
  html += `
  <div class="container">
    <div class="instruction-div">
      <B>Number Guesser</B><BR>
      How to play:<BR>
      1)Press Start<BR>
      2)Enter a number from 1-10<BR>
      3)Click submit to see if you guess right!
    </div>
  </div>
  <div class="container">
    <div class="input-div">
      <input id="input-number-guess" type="number" class="form-control" placeholder="your guess goes here" readonly>
      <button id="button-start-guess" type="input" class="btn">START</button>
      <button id="button-submit-guess" type="input" class="btn ">SUBMIT</button>
      <div><p id="answer-content">Your answer will display here!</p></div>
    </div>
  </div>
  `;

  Elements.root.innerHTML = html;

  updateDocForLED({ ledBlue: false })
  updateDocForLED({ ledWhite: false })
  updateButtons({submitButton: false})
  updateButtons({startButton: false})
  updateGameData({guess: 0})
  updateGameData({answer: 0})

  buttonsDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.DOCNAME_BUTTONS, buttonListener);
  gameDataDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.DOCNAME_GAMEDATA, gameDataListener);
  inputNumberGuess = document.getElementById('input-number-guess');
  startGuessButton = document.getElementById('button-start-guess');


  startGuessButton.addEventListener('click', e => {
    inputNumberGuess.removeAttribute('readonly')
    randomNum = Math.floor(Math.random() * 10) + 1;
    updateGameData({answer: randomNum })
    document.getElementById("input-number-guess").value = parseInt("0");
    updateGameData({guess: 0})
    updateButtons({submitButton: false})
    updateButtons({startButton: true})
  }) 

  const submitGuessButton = document.getElementById('button-submit-guess');
    submitGuessButton.addEventListener('click', e => {
      myGuess = inputNumberGuess.value
      if(myGuess <= 0 || myGuess > 10){
        alert("Please select a number between 1 & 10")
        inputNumberGuess.value = parseInt("0");
      }
      else{
        inputNumberGuess.setAttribute("readonly", "")
        console.log(myGuess);
        console.log(randomNum);
        updateGameData({guess: parseInt(myGuess) })
        updateButtons({startButton: false})
        updateButtons({submitButton: true})
      }
    });

}

function buttonListener(doc) {
  const buttonDoc = doc.data();
  const answerMessage = document.getElementById('answer-content')
  if (buttonDoc['startButton']) {
    inputNumberGuess.value = parseInt("0");
    inputNumberGuess.removeAttribute('readonly')
    answerMessage.innerHTML = "Your answer will display here!"
  }
  if (buttonDoc['submitButton']) {
    let html
    inputNumberGuess.setAttribute("readonly", "")
    if(myGuess == randomNum) html = "CORRECT!"
    else html = "INCORRECT!"

    html += `<BR>Your guess was ${myGuess} and the answer was ${randomNum}!<BR>`
    answerMessage.innerHTML = html

  }
}

function gameDataListener(doc) {
  const buttonDoc = doc.data();
  if (buttonDoc['guess']) {
    myGuess = buttonDoc['guess']
  }
  if (buttonDoc['submitButton']) {
    randomNum = buttonDoc['submitButton']
  }
}