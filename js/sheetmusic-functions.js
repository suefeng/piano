function writeToTextarea(text) {
  recordedNotesTextarea.value += `${text}, `;
}

function calculateNotesPerMeasure(notesArray) {
  /* 
  loop through array of objects that contain
  the notes and then calculate which sets
  of notes to put in each measure
  */
  notesArray.forEach((noteObject) => {});
}

function convertToNotes() {
  if (recordedNotesTextarea.value !== "") {
    // get notes from textarea and sanitize them
    const notes = recordedNotesTextarea.value.replace(/,\s*$/, "");
    const notesArray = JSON.parse(`[${notes}]`);

    recordedNotesTextarea.value = "";
    const numBeats = 4;

    // Create the notes
    for (let i = 0; i < notesArray.length; i = i + numBeats) {
      // This approach to importing classes works in CJS contexts
      const { Stave, Accidental, Beam, Formatter, Renderer } = Vex;
      const div = document.createElement("div");
      const renderer = new Renderer(div, Renderer.Backends.SVG);

      // Configure the rendering context.
      renderer.resize(250, 150);
      const context = renderer.getContext();

      const notesMeasure = [];
      const currentNotes = notesArray.slice(i, i + 4);
      const staveMeasure = new Stave(0, 0, 250);

      if (i > 3 && i % numBeats === 0) {
        staveMeasure.setContext(context).draw();
      } else {
        // only draw the staff, key, and time signature in the first measure
        staveMeasure
          .addClef("treble")
          .addTimeSignature("4/4")
          .setContext(context)
          .draw();
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
      const beams = Beam.generateBeams(notesMeasure);
      beams.forEach((b) => {
        b.setContext(context).draw();
      });
      document.getElementById("musicOutput").appendChild(div);
    }
  }
}
