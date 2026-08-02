/* ============================================================
   Friendship Day — shared render engine
   Used identically by editor.html (live preview, in an iframe)
   and viewer.html (the final page opened from a generated link).
   Single source of truth so "preview" always equals "final".
   ============================================================ */

const TEMPLATES = {
  ocean: {
    label: "Ocean",
    vars: {
      "--bg-a": "#e8f6fb",
      "--bg-b": "#cdeaf7",
      "--bg-c": "#a9d8ec",
      "--accent": "#2f7fb0",
      "--accent-2": "#5fb8d6",
      "--card": "rgba(255,255,255,0.55)",
      "--text": "#0f3550",
      "--particle": "#6fc3e0",
    },
    particle: "wave",
  },
  forest: {
    label: "Forest",
    vars: {
      "--bg-a": "#eef7ee",
      "--bg-b": "#d8efe0",
      "--bg-c": "#bfe3cf",
      "--accent": "#2f7d5a",
      "--accent-2": "#5aa06e",
      "--card": "rgba(255,255,255,0.55)",
      "--text": "#123524",
      "--particle": "#6fbf8f",
    },
    particle: "leaf",
  },
  blossom: {
    label: "Blossom",
    vars: {
      "--bg-a": "#f7eefb",
      "--bg-b": "#f6e2ee",
      "--bg-c": "#eccfe6",
      "--accent": "#b0559a",
      "--accent-2": "#d68fc2",
      "--card": "rgba(255,255,255,0.55)",
      "--text": "#4a1b40",
      "--particle": "#e6a6d6",
    },
    particle: "petal",
  },
  sunset: {
    label: "Sunset Coral",
    vars: {
      "--bg-a": "#fff2ec",
      "--bg-b": "#ffe1d6",
      "--bg-c": "#ffc9c2",
      "--accent": "#c85a4a",
      "--accent-2": "#e8896f",
      "--card": "rgba(255,255,255,0.55)",
      "--text": "#4a2016",
      "--particle": "#f0a08a",
    },
    particle: "spark",
  },
};

const DEFAULTS = {
  name: "Bhoomi",
  from: "Pranjal",
  message:
    "Happy Friendship Day! I just wanted to say thank you for being such an amazing friend. Life feels a little brighter because of the people who bring smiles, laughter, and kindness, and you're one of those people.\n\nI hope this Friendship Day brings you happiness, success, good health, and countless beautiful memories. No matter where life takes us, I hope we always remember the moments that made us smile.\n\nStay happy, keep smiling, and keep being the wonderful person you are.",
  quote:
    "True friendship isn't about being together every day. It's about knowing someone will always be there for you.",
  template: "blossom",
  music: true,
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function paragraphize(message) {
  return message
    .split(/\n\s*\n/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/**
 * Renders the full page HTML (everything inside <body>) plus applies
 * the template's CSS variables to the root element.
 * @param {HTMLElement} root - element to render into (e.g. document.body)
 * @param {Object} data - {name, from, message, quote, template, music}
 */
function renderFriendshipPage(root, data) {
  const d = Object.assign({}, DEFAULTS, data);
  const tpl = TEMPLATES[d.template] || TEMPLATES.blossom;

  // Apply CSS variables
  Object.entries(tpl.vars).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });
  root.setAttribute("data-particle", tpl.particle);

  root.innerHTML = `
    <div class="bg-waves" aria-hidden="true">
      <svg class="wave wave1" viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,160 C 320,260 720,60 1440,160 L1440,320 L0,320 Z"></path></svg>
      <svg class="wave wave2" viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,200 C 400,100 900,280 1440,180 L1440,320 L0,320 Z"></path></svg>
    </div>
    <canvas id="particleCanvas" aria-hidden="true"></canvas>
    <div class="mouse-glow" id="mouseGlow" aria-hidden="true"></div>

    <main>
      <section class="hero">
        <div class="knot" aria-hidden="true">
          <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
            <circle cx="24" cy="20" r="15" stroke="var(--accent)" stroke-width="3" fill="none" opacity="0.85"/>
            <circle cx="40" cy="20" r="15" stroke="var(--accent-2)" stroke-width="3" fill="none" opacity="0.85"/>
          </svg>
        </div>
        <h1 class="headline">
          <span class="type-target" id="typeTarget"></span><span class="cursor">|</span>
        </h1>
        <p class="from-line fade-in-up delay-2">From ${escapeHtml(d.from)}</p>
      </section>

      <section class="message-card fade-in-up">
        <div class="glass-card message-glass">
          <p class="salutation">Dear ${escapeHtml(d.name)},</p>
          ${paragraphize(d.message)}
          <p class="signoff">Wishing you an incredible Friendship Day!<br><span>— ${escapeHtml(d.from)}</span></p>
        </div>
      </section>

      <section class="surprise-section">
        <button class="surprise-btn" id="surpriseBtn" type="button">
          <span>Open Your Surprise</span>
        </button>
        <div class="quote-reveal glass-card" id="quoteReveal" hidden>
          <p class="quote-mark" aria-hidden="true">&ldquo;</p>
          <p class="quote-text">${escapeHtml(d.quote)}</p>
        </div>
      </section>

      <section class="timeline">
        <h2 class="timeline-heading">Us, in three chapters</h2>
        <div class="timeline-cards">
          <div class="glass-card tl-card fade-in-up delay-1">
            <span class="tl-emoji">🌸</span>
            <h3>First Hello</h3>
            <p>Where every good story starts.</p>
          </div>
          <div class="glass-card tl-card fade-in-up delay-2">
            <span class="tl-emoji">✨</span>
            <h3>Fun Memories</h3>
            <p>The laughs, the chaos, the inside jokes.</p>
          </div>
          <div class="glass-card tl-card fade-in-up delay-3">
            <span class="tl-emoji">🌈</span>
            <h3>Many More to Come</h3>
            <p>Here's to everything still ahead.</p>
          </div>
        </div>
      </section>

      <footer class="site-footer">
        <p>Made with appreciation by ${escapeHtml(d.from)}</p>
        <p class="footer-sub">Happy Friendship Day 2026</p>
      </footer>
    </main>

    <canvas id="confettiCanvas" aria-hidden="true"></canvas>
  `;

  initInteractions(root, d);
}

/* ---------- Interaction / animation wiring ---------- */

function initInteractions(root, data) {
  typewriter(root.querySelector("#typeTarget"), `Happy Friendship Day, ${data.name}! 💙`);

  const particleCanvas = root.querySelector("#particleCanvas");
  if (particleCanvas) startParticles(particleCanvas, root.getAttribute("data-particle"), getComputedStyle(root).getPropertyValue("--particle").trim());

  const mouseGlow = root.querySelector("#mouseGlow");
  const container = root.ownerDocument.defaultView;
  if (mouseGlow) {
    root.addEventListener("pointermove", (e) => {
      mouseGlow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
      mouseGlow.style.opacity = "1";
    });
    root.addEventListener("pointerleave", () => (mouseGlow.style.opacity = "0"));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.2 }
  );
  root.querySelectorAll(".fade-in-up, .glass-card").forEach((el) => observer.observe(el));

  const btn = root.querySelector("#surpriseBtn");
  const reveal = root.querySelector("#quoteReveal");
  const confettiCanvas = root.querySelector("#confettiCanvas");
  if (btn) {
    btn.addEventListener("click", () => {
      btn.classList.add("clicked");
      reveal.hidden = false;
      requestAnimationFrame(() => reveal.classList.add("in-view"));
      fireConfetti(confettiCanvas);
      if (data.music) {
        playAmbientPad();
      }
      btn.disabled = true;
    });
  }
}

/* Soft generated ambient pad — layered detuned tones with slow swells.
   Not a "song"; a gentle background texture for the surprise moment. */
let _audioCtx = null;
function playAmbientPad() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    _audioCtx = _audioCtx || new Ctx();
    const ctx = _audioCtx;
    if (ctx.state === "suspended") ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.2);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 9);

    const notes = [261.63, 329.63, 392.0, 523.25];
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    filter.connect(master);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    lfo.stop(ctx.currentTime + 9);

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = (i % 2 === 0 ? -1 : 1) * (4 + i);
      const g = ctx.createGain();
      g.gain.value = 0.22 / notes.length;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      osc.stop(ctx.currentTime + 9);
    });
  } catch (e) {
    /* Web Audio unsupported or blocked — fail silently, visuals still work */
  }
}

function typewriter(el, fullText) {
  if (!el) return;
  el.textContent = "";
  let i = 0;
  function step() {
    if (i <= fullText.length) {
      el.textContent = fullText.slice(0, i);
      i++;
      setTimeout(step, 45);
    }
  }
  step();
}

/* Ambient background particles: shape varies by template */
function startParticles(canvas, shape, color) {
  const ctx = canvas.getContext("2d");
  let w, h, particles;
  const COUNT = 34;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function makeParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 3 + Math.random() * 6,
      speedY: 0.15 + Math.random() * 0.35,
      drift: Math.random() * 0.6 - 0.3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      alpha: 0.25 + Math.random() * 0.45,
    }));
  }

  function drawShape(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = color || "#ffffff";
    if (shape === "leaf") {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 1.7, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "petal") {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 1.3, p.r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "spark") {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate((Math.PI * 2) / 4);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -p.r * 1.6);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    } else {
      // wave / bubble default: soft circle
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.drift;
      p.angle += p.spin;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      drawShape(p);
    });
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener("resize", () => {
    resize();
  });
  tick();
}

function fireConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = (canvas.width = canvas.offsetWidth);
  const h = (canvas.height = canvas.offsetHeight);
  const colors = ["#e6a6d6", "#6fc3e0", "#f0a08a", "#ffe08a", "#a6e6c6"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.3,
    r: 4 + Math.random() * 5,
    c: colors[Math.floor(Math.random() * colors.length)],
    vy: 2 + Math.random() * 3,
    vx: -2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
  }));
  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    frame++;
    if (frame < 160) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, w, h);
  }
  tick();
}

/* ---------- Link encode/decode ---------- */

function encodeDataToParams(data) {
  const params = new URLSearchParams();
  params.set("name", data.name || "");
  params.set("from", data.from || "");
  params.set("message", data.message || "");
  params.set("quote", data.quote || "");
  params.set("template", data.template || "blossom");
  params.set("music", data.music ? "1" : "0");
  return params.toString();
}

function decodeParamsToData(search) {
  const params = new URLSearchParams(search);
  return {
    name: params.get("name") || DEFAULTS.name,
    from: params.get("from") || DEFAULTS.from,
    message: params.get("message") || DEFAULTS.message,
    quote: params.get("quote") || DEFAULTS.quote,
    template: params.get("template") || DEFAULTS.template,
    music: params.get("music") !== "0",
  };
}
