/* 
These functions are for toggling checkboxes on the keyboard
*/

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
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  const cancelFullScreen =
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
