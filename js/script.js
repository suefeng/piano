createKeyboard();

const KEY_ELEMENTS = document.querySelectorAll('button[id^="key"]');
const keyboard = document.getElementById("keyboard");
const complexityElement = document.getElementById("toggle-complexity");
const label = document.querySelector('[for="toggle-complexity"]');
const focusKey = document.getElementById("key39"); // middle C
const inputInfo = document.getElementById("input-info");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const deviceAgent = navigator.userAgent.toLowerCase();
const recordedNotesTextarea = document.getElementById("recordedNotesTextarea");
const isTouchDevice =
  deviceAgent.match(/(iphone|ipod|ipad)/) ||
  deviceAgent.match(/(android)/) ||
  deviceAgent.match(/(iemobile)/) ||
  deviceAgent.match(/iphone/i) ||
  deviceAgent.match(/ipad/i) ||
  deviceAgent.match(/ipod/i) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 0) ||
  deviceAgent.match(/blackberry/i) ||
  deviceAgent.match(/bada/i);
let pressed = {};
const beatsPerMin = 60; // may make a menu of metronome values later;

// default to minimal version if on touch device
if (isTouchDevice) {
  document.body.classList.add("touch-version");
  complexityElement.checked = true;
  toggleComplexity();
} else {
  focusKey.focus(); // make middle C be in center view
}

// detect action and play a note
KEY_ELEMENTS.forEach((el) => {
  if (isTouchDevice) {
    el.addEventListener("touchstart", (e) => playNote(e));
  } else {
    el.addEventListener("mousedown", (e) => playNote(e));
  }
});

{
  let fired = false;
  window.addEventListener("keydown", (e) => {
    if (!fired) {
      fired = true;
      playNote(e);
    }
    window.addEventListener("keyup", (e) => {
      fired = false;
    });
  });
}
