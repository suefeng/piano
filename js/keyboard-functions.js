/* 
These functions help create the keyboard
Map notes to frequencies
Create the sound and stop the sound 
*/
function createKeyboard() {
  const keyboardKeys = document.getElementById("keyboard-keys");

  NOTES_MAP.map((note_map, i) => {
    const note = note_map.note;
    const key = note_map.key;
    const octave = note_map.octave;
    const frequency = getPitch(note, octave);
    const prevKeyIndex = i > 0 ? i - 1 : 0;
    const keyElement = document.createElement("button");

    keyElement.setAttribute("id", `key${i}`);
    keyElement.setAttribute("data-note", note);
    keyElement.setAttribute("data-key", key);
    keyElement.setAttribute("data-octave", octave);
    keyElement.setAttribute("data-frequency", frequency.toFixed(2));

    if (note.includes("♯") || note.includes("♭")) {
      const previousElement = document.getElementById(`key${prevKeyIndex}`);
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
  const step = NOTES.indexOf(note);
  const power = Math.pow(2, (octave * 12 + step - 57) / 12);
  const pitch = 440 * power;

  return pitch;
}

function makeSound(keyElement, frequency, volume) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const note = keyElement.getAttribute("data-note");
  const octave = keyElement.getAttribute("data-octave");

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = "triangle";
  oscillator.start(0);

  inputInfo.innerHTML = `<span>gain: ${gainNode.gain.value.toFixed(
    2
  )}</span><span>${oscillator.frequency.value.toFixed(
    2
  )}Hz</span><span>${note}${octave}</span>`;

  keyElement.classList.add("selected");

  if (isTouchDevice) {
    keyElement.addEventListener("touchend", (e) => {
      stopSound(keyElement, gainNode, oscillator, e);
    });
  } else {
    {
      let fired = false;
      window.addEventListener("keyup", (e) => {
        if (!fired) {
          fired = true;
          stopSound(keyElement, gainNode, oscillator, e);
        }
      });
    }
    {
      let fired = false;
      keyElement.addEventListener("mouseup", (e) => {
        if (!fired) {
          fired = true;
          stopSound(keyElement, gainNode, oscillator, e);
        }
      });
    }
    {
      let fired = false;
      keyElement.addEventListener("focusout", (e) => {
        if (!fired) {
          fired = true;
          stopSound(keyElement, gainNode, oscillator, e);
        }
      });
    }
  }
}

function unmuteForMobile() {
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    hack for ensuring oscillators will work even when
    headphones are plugged in for mobile device
    only play audio file once if it's a touch device
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  if (isTouchDevice) {
    touchCount++;
  }
  if (touchCount === 1) {
    unmuteAudio.play();
  }
}

function playNote(e) {
  const keyElement = getKeyElement(e);
  pressed[e.which] = e.timeStamp; // create a starting timestamp
  unmuteForMobile();

  if (keyElement) {
    const frequency = Number(keyElement.getAttribute("data-frequency"));
    // ensure notes are all able to be heard and not as ear-piercing
    const volume =
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

function stopSound(keyElement, gainNode, oscillator, e) {
  const note = keyElement
    .getAttribute("data-note")
    .replace(/♯/, "#")
    .replace(/♭/, "b");
  const octave = keyElement.getAttribute("data-octave");
  const duration = calculateDuration(e);
  const stemDirection = Number(octave) > 4 ? -1 : 1;

  writeToTextarea(
    `{"keys": ["${note}/${octave}"], "duration": "${duration}", "stem_direction": ${stemDirection}}`
  );

  gainNode.gain.cancelScheduledValues(0);
  gainNode.gain.setValueAtTime(gainNode.gain.value, 0.02);
  gainNode.gain.linearRampToValueAtTime(0.0001, 0.04);
  oscillator.stop(0.04);

  keyElement.classList.remove("selected");
}

function calculateDuration(e) {
  const rawDuration = e.timeStamp - pressed[e.which];
  const duration = rawDuration / 1000 / (beatsPerMin / 60);
  const calculated = DURATION_VALUES.sort(
    (a, b) => Math.abs(duration - a.measure) - Math.abs(duration - b.measure)
  )[0].name;

  return calculated;
}
