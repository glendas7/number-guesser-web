import {
	getFirestore, onSnapshot, doc, setDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

import * as Constants from '../model/constants.js'

const db = getFirestore();

export async function initFirestoreDocs() {
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_BUTTONS), Constants.docButtons);
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_LEDS), Constants.docLEDs);
}

export async function updateDocForLED(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.DOCNAME_LEDS);
	await updateDoc(docRef, update);
}

export function attachRealtimeListener(collection, document, callback) {
	const unsubscribeListener = onSnapshot(doc(db, collection, document), callback);
	return unsubscribeListener;
}