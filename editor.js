(function () {
  const els = {
    name: document.getElementById("name"),
    from: document.getElementById("from"),
    message: document.getElementById("message"),
    quote: document.getElementById("quote"),
    music: document.getElementById("music"),
    templateGrid: document.getElementById("templateGrid"),
    generateBtn: document.getElementById("generateBtn"),
    linkOutput: document.getElementById("linkOutput"),
    linkField: document.getElementById("linkField"),
    linkHint: document.getElementById("linkHint"),
    copyBtn: document.getElementById("copyBtn"),
    previewFrame: document.getElementById("previewFrame"),
  };

  let selectedTemplate = DEFAULTS.template;

  // Populate defaults
  els.name.value = DEFAULTS.name;
  els.from.value = DEFAULTS.from;
  els.message.value = DEFAULTS.message;
  els.quote.value = DEFAULTS.quote;

  // Build template picker
  Object.entries(TEMPLATES).forEach(([key, tpl]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tpl-option" + (key === selectedTemplate ? " selected" : "");
    btn.dataset.key = key;
    btn.innerHTML = `
      <span class="tpl-swatch" style="background: linear-gradient(135deg, ${tpl.vars["--accent"]}, ${tpl.vars["--accent-2"]})"></span>
      ${tpl.label}
    `;
    btn.addEventListener("click", () => {
      selectedTemplate = key;
      document.querySelectorAll(".tpl-option").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      scheduleRender();
    });
    els.templateGrid.appendChild(btn);
  });

  function currentData() {
    return {
      name: els.name.value.trim() || DEFAULTS.name,
      from: els.from.value.trim() || DEFAULTS.from,
      message: els.message.value.trim() || DEFAULTS.message,
      quote: els.quote.value.trim() || DEFAULTS.quote,
      template: selectedTemplate,
      music: els.music.checked,
    };
  }

  function renderIntoFrame() {
    const doc = els.previewFrame.contentDocument;
    if (!doc.getElementById("page")) {
      doc.open();
      doc.write(`<!DOCTYPE html><html><head>
        <link rel="stylesheet" href="style.css">
      </head><body><div id="page"></div></body></html>`);
      doc.close();
    }
    const pageEl = doc.getElementById("page");
    renderFriendshipPage(pageEl, currentData());
  }

  // iframe needs its own load before we can touch its document
  els.previewFrame.addEventListener("load", renderIntoFrame);
  els.previewFrame.src = "about:blank";
  renderIntoFrame();

  let renderTimer = null;
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderIntoFrame, 250);
  }

  [els.name, els.from, els.message, els.quote].forEach((el) =>
    el.addEventListener("input", scheduleRender)
  );
  els.music.addEventListener("change", scheduleRender);

  els.generateBtn.addEventListener("click", () => {
    const params = encodeDataToParams(currentData());
    const url = new URL("viewer.html", window.location.href);
    url.search = params;
    els.linkField.value = url.toString();
    els.linkOutput.hidden = false;
    els.linkHint.hidden = false;
  });

  els.copyBtn.addEventListener("click", async () => {
    els.linkField.select();
    try {
      await navigator.clipboard.writeText(els.linkField.value);
      els.copyBtn.textContent = "Copied";
      setTimeout(() => (els.copyBtn.textContent = "Copy"), 1500);
    } catch (e) {
      document.execCommand("copy");
    }
  });
})();
