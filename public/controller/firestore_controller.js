import {
	getFirestore, onSnapshot, doc, setDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"

import * as Constants from '../model/constants.js'

const db = getFirestore();

export async function initFirestoreDocs() {
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_BUTTONS), Constants.docButtons);
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_LEDS), Constants.docLEDs);
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_GAMEDATA), Constants.docGameData);
}

export async function updateGuess(guess){
	const docRef = doc(db, Constants.COLLECTION, Constants.DOCNAME_GAMEDATA);
	await updateDoc(docRef, guess);
}

export async function updateAnswer(answ){
	const docRef = doc(db, Constants.COLLECTION, Constants.DOCNAME_LEDS);
	await updateDoc(docRef, answ);
}

export async function updateDocForLED(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.DOCNAME_LEDS);
	await updateDoc(docRef, update);
}

export function attachRealtimeListener(collection, document, callback) {
	const unsubscribeListener = onSnapshot(doc(db, collection, document), callback);
	return unsubscribeListener;
}