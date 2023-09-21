var NOTES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
var NOTES_MAP = [
  { note: "A", octave: "0", key: "" },
  { note: "B♭", octave: "0", key: "" },
  { note: "B", octave: "0", key: "" },
  { note: "C", octave: "1", key: "" },
  { note: "C♯", octave: "1", key: "" },
  { note: "D", octave: "1", key: "" },
  { note: "E♭", octave: "1", key: "" },
  { note: "E", octave: "1", key: "" },
  { note: "F", octave: "1", key: "" },
  { note: "F♯", octave: "1", key: "" },
  { note: "G", octave: "1", key: "" },
  { note: "G♯", octave: "1", key: "" },
  { note: "A", octave: "1", key: "" },
  { note: "B♭", octave: "1", key: "" },
  { note: "B", octave: "1", key: "" },
  { note: "C", octave: "2", key: "1" },
  { note: "C♯", octave: "2", key: "8" },
  { note: "D", octave: "2", key: "2" },
  { note: "E♭", octave: "2", key: "9" },
  { note: "E", octave: "2", key: "3" },
  { note: "F", octave: "2", key: "4" },
  { note: "F♯", octave: "2", key: "0" },
  { note: "G", octave: "2", key: "5" },
  { note: "G♯", octave: "2", key: "-" },
  { note: "A", octave: "2", key: "6" },
  { note: "B♭", octave: "2", key: "=" },
  { note: "B", octave: "2", key: "7" },
  { note: "C", octave: "3", key: "q" },
  { note: "C♯", octave: "3", key: "i" },
  { note: "D", octave: "3", key: "w" },
  { note: "E♭", octave: "3", key: "o" },
  { note: "E", octave: "3", key: "e" },
  { note: "F", octave: "3", key: "r" },
  { note: "F♯", octave: "3", key: "p" },
  { note: "G", octave: "3", key: "t" },
  { note: "G♯", octave: "3", key: "[" },
  { note: "A", octave: "3", key: "y" },
  { note: "B♭", octave: "3", key: "]" },
  { note: "B", octave: "3", key: "u" },
  { note: "C", octave: "4", key: "a" },
  { note: "C♯", octave: "4", key: "`" },
  { note: "D", octave: "4", key: "s" },
  { note: "E♭", octave: "4", key: "k" },
  { note: "E", octave: "4", key: "d" },
  { note: "F", octave: "4", key: "f" },
  { note: "F♯", octave: "4", key: "l" },
  { note: "G", octave: "4", key: "g" },
  { note: "G♯", octave: "4", key: ";" },
  { note: "A", octave: "4", key: "h" },
  { note: "B♭", octave: "4", key: "Enter" },
  { note: "B", octave: "4", key: "j" },
  { note: "C", octave: "5", key: "z" },
  { note: "C♯", octave: "5", key: "," },
  { note: "D", octave: "5", key: "x" },
  { note: "E♭", octave: "5", key: "." },
  { note: "E", octave: "5", key: "c" },
  { note: "F", octave: "5", key: "v" },
  { note: "F♯", octave: "5", key: "ArrowLeft" },
  { note: "G", octave: "5", key: "b" },
  { note: "G♯", octave: "5", key: "ArrowDown" },
  { note: "A", octave: "5", key: "n" },
  { note: "B♭", octave: "5", key: "ArrowRight" },
  { note: "B", octave: "5", key: "m" },
  { note: "C", octave: "6", key: "" },
  { note: "C♯", octave: "6", key: "" },
  { note: "D", octave: "6", key: "" },
  { note: "E♭", octave: "6", key: "" },
  { note: "E", octave: "6", key: "" },
  { note: "F", octave: "6", key: "" },
  { note: "F♯", octave: "6", key: "" },
  { note: "G", octave: "6", key: "" },
  { note: "G♯", octave: "6", key: "" },
  { note: "A", octave: "6", key: "" },
  { note: "B♭", octave: "6", key: "" },
  { note: "B", octave: "6", key: "" },
  { note: "C", octave: "7", key: "" },
  { note: "C♯", octave: "7", key: "" },
  { note: "D", octave: "7", key: "" },
  { note: "E♭", octave: "7", key: "" },
  { note: "E", octave: "7", key: "" },
  { note: "F", octave: "7", key: "" },
  { note: "F♯", octave: "7", key: "" },
  { note: "G", octave: "7", key: "" },
  { note: "G♯", octave: "7", key: "" },
  { note: "A", octave: "7", key: "" },
  { note: "B♭", octave: "7", key: "" },
  { note: "B", octave: "7", key: "" },
  { note: "C", octave: "8", key: "" },
];

createKeyboard();

var KEY_ELEMENTS = document.querySelectorAll('button[id^="key"]');
var keyboard = document.getElementById("keyboard");
var complexityElement = document.getElementById("toggle-complexity");
var label = document.querySelector('[for="toggle-complexity"]');
var focusKey = document.getElementById("key39"); // middle C
var inputInfo = document.getElementById("input-info");
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var deviceAgent = navigator.userAgent.toLowerCase();
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

/* Functions */
function createKeyboard() {
  var keyboardKeys = document.getElementById("keyboard-keys");

  NOTES_MAP.map((note_map, i) => {
    var note = note_map.note;
    var key = note_map.key;
    var octave = note_map.octave;
    var frequency = getPitch(note, octave);
    var prevKeyIndex = i > 0 ? i - 1 : 0;
    var keyElement = document.createElement("button");

    keyElement.setAttribute("id", `key${i}`);
    keyElement.setAttribute("data-note", note);
    keyElement.setAttribute("data-key", key);
    keyElement.setAttribute("data-octave", octave);
    keyElement.setAttribute("data-frequency", frequency.toFixed(2));

    if (note.includes("♯") || note.includes("♭")) {
      var previousElement = document.getElementById(`key${prevKeyIndex}`);
      keyElement.classList.add("black-key");
      previousElement.appendChild(keyElement);
    } else {
      keyElement.classList.add("white-key");
      keyboardKeys.appendChild(keyElement);
    }
  });
}

function getKeyElement(e) {
  if (e.key) {
    return document.querySelector(`button[data-key="${e.key}"]`);
  } else {
    return e.target;
  }
}

function getPitch(note, octave) {
  // ("A", 4) => 440
  // multiply by 2^(1/12) N times to get N steps higher
  var step = NOTES.indexOf(note);
  var power = Math.pow(2, (octave * 12 + step - 57) / 12);
  var pitch = 440 * power;

  return pitch;
}

function makeSound(keyElement, frequency, volume) {
  var oscillator = audioContext.createOscillator();
  var gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = "triangle";
  oscillator.start(0);

  inputInfo.innerHTML = `<span>gain: ${gainNode.gain.value.toFixed(
    2
  )}</span><span>${oscillator.frequency.value.toFixed(2)}Hz</span><span>
  ${keyElement.getAttribute("data-note")}${keyElement.getAttribute(
    "data-octave"
  )}</span>`;

  keyElement.classList.add("selected");

  if (isTouchDevice) {
    keyElement.addEventListener("touchend", () =>
      stopSound(keyElement, gainNode, oscillator)
    );
  } else {
    window.addEventListener("keyup", () =>
      stopSound(keyElement, gainNode, oscillator)
    );
    keyElement.addEventListener("mouseup", () =>
      stopSound(keyElement, gainNode, oscillator)
    );
  }
}

function playNote(e) {
  var keyElement = getKeyElement(e);

  if (keyElement) {
    var frequency = Number(keyElement.getAttribute("data-frequency"));
    var volume =
      frequency < 130
        ? 2
        : frequency < 261
        ? 1
        : frequency < 500
        ? 0.4
        : frequency < 1000
        ? 0.2
        : frequency < 2000
        ? 0.07
        : 0.04;
    makeSound(keyElement, frequency, volume);
  }
}

function stopSound(keyElement, gainNode, oscillator) {
  gainNode.gain.cancelScheduledValues(0);
  gainNode.gain.setValueAtTime(gainNode.gain.value, 0.02);
  gainNode.gain.linearRampToValueAtTime(0.0001, 0.04);
  oscillator.stop(0.04);

  keyElement.classList.remove("selected");
}

function toggleComplexity() {
  document.body.classList.toggle("minimal-version");
  focusKey.focus();
  if (!isTouchDevice) {
    toggleFullScreen();
  }
}

function toggleRainbow() {
  document.body.classList.toggle("rainbow");
}

function toggleShortcuts() {
  document.body.classList.toggle("hide-shortcuts");
}

function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  var cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    inputInfo.innerHTML =
      '<span class="message">Entered fullscreen mode</span>';
    requestFullScreen.call(docEl).catch((err) => {
      inputInfo.innerHTML = `<span class="message">Error: ${err.message} (${err.name})</span>`;
    });
  } else {
    inputInfo.innerHTML = '<span class="message">Exited fullscreen mode</span>';
    cancelFullScreen.call(doc);
  }
}
