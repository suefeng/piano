createKeyboard();

var KEY_ELEMENTS = document.querySelectorAll('button[id^="key"]');
var keyboard = document.getElementById("keyboard");
var complexityElement = document.getElementById("toggle-complexity");
var label = document.querySelector('[for="toggle-complexity"]');
var focusKey = document.getElementById("key39"); // middle C
var inputInfo = document.getElementById("input-info");
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var deviceAgent = navigator.userAgent.toLowerCase();
var recordedNotesTextarea = document.getElementById("recordedNotesTextarea");
var isTouchDevice =
  deviceAgent.match(/(iphone|ipod|ipad)/) ||
  deviceAgent.match(/(android)/) ||
  deviceAgent.match(/(iemobile)/) ||
  deviceAgent.match(/iphone/i) ||
  deviceAgent.match(/ipad/i) ||
  deviceAgent.match(/ipod/i) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 0) ||
  deviceAgent.match(/blackberry/i) ||
  deviceAgent.match(/bada/i);

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
window.addEventListener("keydown", (e) => playNote(e));
