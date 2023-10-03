function writeToTextarea(text) {
  recordedNotesTextarea.value += `${text}, `;
}

function calculateNotesPerMeasure(notesArray) {
  /* 
  loop through array of objects that contain
  the notes and then calculate which sets
  of notes to put in each measure
  */
  let notesByMeasure = [];
  let noteValues = [];
  let sum = 0;

  notesArray.forEach((noteObject, i) => {
    let durationValue = DURATION_VALUES.find(
      (duration) => duration.name === noteObject.duration
    ).measure;
    let lastSumIndex = 0;

    noteValues.push(noteObject);

    sum += durationValue;

    if (sum >= 1) {
      lastSumIndex = i;
      notesByMeasure.push(noteValues);
      noteDurations = [];
      sum = 0;
      noteValues = [];
    }
  });

  const notesByMeasureSize = notesByMeasure.flat(1).length;
  const numLeftOver = notesArray.length - notesByMeasureSize;
  notesByMeasure.push(notesArray.slice(-numLeftOver));
  return notesByMeasure;
}

function convertToNotes() {
  if (recordedNotesTextarea.value !== "") {
    // get notes from textarea and sanitize them
    const notes = recordedNotesTextarea.value.replace(/,\s*$/, "");
    const notesArray = JSON.parse(`[${notes}]`);
    let firstIndex = true;

    const notesPerMeasure = calculateNotesPerMeasure(notesArray);

    recordedNotesTextarea.value = "";

    // Create the notes
    notesPerMeasure.forEach((currentNotes, i) => {
      // This approach to importing classes works in CJS contexts
      const { Stave, Accidental, Formatter, Renderer } = Vex;
      const div = document.createElement("div");
      const renderer = new Renderer(div, Renderer.Backends.SVG);

      // Configure the rendering context.
      renderer.resize(250, 150);
      const context = renderer.getContext();

      const notesMeasure = [];
      const staveMeasure = new Stave(0, 0, 250);

      if (!firstIndex) {
        staveMeasure.setContext(context).draw();
      } else {
        // only draw the staff, key, and time signature in the first measure
        staveMeasure
          .addClef("treble")
          .addTimeSignature("4/4")
          .setContext(context)
          .draw();
        firstIndex = false;
      }
      currentNotes.forEach((n) => {
        const accidental = n.keys.includes("#")
          ? "#"
          : n.keys.includes("b")
          ? "b"
          : false;
        const generatedNote = new Vex.Flow.StaveNote(n);
        if (accidental) {
          generatedNote.addModifier(new Accidental(accidental));
        }
        notesMeasure.push(generatedNote);
      });
      // format and draw the notes, and then append them to the div
      Formatter.FormatAndDraw(context, staveMeasure, notesMeasure);
      document.getElementById("musicOutput").appendChild(div);
    });
  }
}
