import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
  updateDocForLED, attachRealtimeListener, initFirestoreDocs,
} from '../controller/firestore_controller.js';

const noMonitor = 'No Monitor';

export let unsubButtonsDoc = null;

export function addEventListeners() {

  window.addEventListener('unload', e => {
    if (unsubButtonsDoc) {
      unsubButtonsDoc();
    }
  });

  Elements.buttonInitConfig.addEventListener('click', async e => {
    try {
      await initFirestoreDocs();
      alert('Firestore collection initialized!')
    } catch (e) {
      console.log(`Init Config error:\n${e}`);
      alert(`Init Config error:\n${e}`);
    }
  });

}

export function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }

  let html = '<h3 class="d-flex justify-content-center m-3">Control Panel<h3>';
  html += `
  <div style="background-color:rgb(245,245,220);">
    <div class="d-flex justify-content-start">
      <h5>Start/Stop Monitor Button Status:</h5>
      <button id="button-monitor-button-status" type="input" class="btn btn-outline-primary ms-3">Start</button>
    </div>
	<br>
    <div class="d-flex justify-content-start">
      <h5>Button1:</h5>
      <button disabled id="status-button1" type="input" class="btn btn-primary mx-3">
      ${noMonitor}</button>
      <h5>Button2:</h5>
      <button disabled id="status-button2" type="input" class="btn btn-primary mx-3">
      ${noMonitor}</button>
    </div>
  </div>

  <div style="background-color:rgb(240,248,255); margin-top: 50px;">
    <div class="d-flex justify-content-start">
      <h5>Control LED1</h5>
      <button id="button-led-control" type="input" class="btn btn-outline-primary ms-3">Turn ON</button>
    </div>
  </div>
  `;

  Elements.root.innerHTML = html;

  const statusMonitorButton = document.getElementById('button-monitor-button-status');
  statusMonitorButton.addEventListener('click', e => {
    const label = e.target.innerHTML;
    if (label == 'Start') {
      e.target.innerHTML = 'Stop';
      // listen to Firestore doc changes
      unsubButtonsDoc = attachRealtimeListener(Constants.COLLECTION,
        Constants.DOCNAME_BUTTONS, buttonListener);
    } else {
      e.target.innerHTML = 'Start';
      const status1 = document.getElementById('status-button1');
      const status2 = document.getElementById('status-button2');
      status1.innerHTML = noMonitor;
      status2.innerHTML = noMonitor;
      if (unsubButtonsDoc) unsubButtonsDoc();
    }
  });

  const ledButton = document.getElementById('button-led-control');
  ledButton.addEventListener('click', e => {
    const label = e.target.innerHTML;
    if (label == 'Turn ON') {
      e.target.innerHTML = 'Turn OFF';
      updateDocForLED({ led1: true });
    } else {
      e.target.innerHTML = 'Turn ON';
      updateDocForLED({ led1: false });
    }
  });

}

function buttonListener(doc) {
  const status1 = document.getElementById('status-button1');
  const status2 = document.getElementById('status-button2');
  const buttonDoc = doc.data();
  if (buttonDoc['button1']) {
    status1.innerHTML = 'ON';
  } else {
    status1.innerHTML = 'OFF';
  }
  if (buttonDoc['button2']) {
    status2.innerHTML = 'ON';
  } else {
    status2.innerHTML = 'OFF';
  }
}