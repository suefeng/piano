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
  var note = keyElement.getAttribute("data-note");
  var octave = keyElement.getAttribute("data-octave");

  inputInfo.innerHTML = `<span>gain: ${gainNode.gain.value.toFixed(
    2
  )}</span><span>${oscillator.frequency.value.toFixed(
    2
  )}Hz</span><span>${note}${octave}</span>`;

  keyElement.classList.add("selected");

  writeToTextarea(`${note}/${octave}`);

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

function writeToTextarea(text) {
  recordedNotesTextarea.value += `${text}, `;
}

function convertToNotes() {
  if (recordedNotesTextarea.value !== "") {
    // get notes from textarea and sanitize them
    var notes = recordedNotesTextarea.value
      .replace(/,\s*$/, "")
      .replace(/♯/g, "#")
      .replace(/♭/g, "b");
    var notesArray = notes.split(", ");

    // Create the notes
    for (let i = 0; i < notesArray.length; i = i + 4) {
      // This approach to importing classes works in CJS contexts
      var { Stave, Accidental, Formatter, Renderer } = Vex;
      var div = document.createElement("div");
      var renderer = new Renderer(div, Renderer.Backends.SVG);

      // Configure the rendering context.
      renderer.resize(250, 150);
      var context = renderer.getContext();

      var notesMeasure = [];
      var currentNotes = notesArray.slice(i, i + 4);

      if (i > 3 && i % 4 === 0) {
        var staveMeasure = new Stave(0, 0, 250);
        staveMeasure.setContext(context).draw();
      } else {
        var staveMeasure = new Stave(0, 0, 250);
        staveMeasure
          .addClef("treble")
          .addTimeSignature("4/4")
          .setContext(context)
          .draw();
      }
      currentNotes.forEach((n) => {
        if (n.indexOf("#") > -1) {
          notesMeasure.push(
            new Vex.Flow.StaveNote({ keys: [n], duration: "q" }).addModifier(
              new Accidental("#")
            )
          );
        } else if (n.indexOf("b") > -1) {
          notesMeasure.push(
            new Vex.Flow.StaveNote({ keys: [n], duration: "q" }).addModifier(
              new Accidental("b")
            )
          );
        } else {
          notesMeasure.push(
            new Vex.Flow.StaveNote({ keys: [n], duration: "q" })
          );
        }
      });
      // Helper function to justify and draw a 4/4 voice
      Formatter.FormatAndDraw(context, staveMeasure, notesMeasure);
      document.getElementById("musicOutput").appendChild(div);
    }
  }
}

/* toggles */

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
