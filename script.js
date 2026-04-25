function updatePhysicalTime() {
  const target = document.getElementById("physicalTime");

  if (!target) return;

  const now = new Date();

  const formatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
    timeZoneName: "short"
  }).format(now);

  target.textContent =
    formatted + " // UPENN / PHILADELPHIA CONTEXT // PHYSICAL SIGNAL ONLINE";
}

updatePhysicalTime();
setInterval(updatePhysicalTime, 1000);

const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

let w;
let h;
let particles;

let mouse = {
  x: 0.5,
  y: 0.5
};

function resize() {
  w = canvas.width = window.innerWidth * window.devicePixelRatio;
  h = canvas.height = window.innerHeight * window.devicePixelRatio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  particles = Array.from(
    { length: Math.min(240, Math.floor(window.innerWidth / 5)) },
    () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * Math.PI * 2,
      s: Math.random() * 0.36 + 0.08,
      o: Math.random() * 0.55 + 0.22,
      type: Math.random() > 0.7 ? "line" : "dot"
    })
  );
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  const scroll =
    window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);

  for (const p of particles) {
    p.a += p.s * 0.012;

    p.x += Math.cos(p.a) * (0.24 + scroll * 1.1) + (mouse.x - 0.5) * 0.28;
    p.y += Math.sin(p.a) * (0.24 + scroll * 1.1) + (mouse.y - 0.5) * 0.28;

    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    const hueShift = p.type === "line" ? 310 + scroll * 30 : 185 + scroll * 80;

    ctx.beginPath();

    if (p.type === "line") {
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(
        p.x + Math.cos(p.a) * 26 * window.devicePixelRatio,
        p.y + Math.sin(p.a) * 26 * window.devicePixelRatio
      );
      ctx.strokeStyle = `hsla(${hueShift}, 100%, 68%, ${p.o})`;
      ctx.lineWidth = 0.7 * window.devicePixelRatio;
      ctx.stroke();
    } else {
      ctx.arc(p.x, p.y, p.r * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hueShift}, 100%, 70%, ${p.o})`;
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / window.innerWidth;
  mouse.y = event.clientY / window.innerHeight;
});

window.addEventListener(
  "touchmove",
  (event) => {
    if (!event.touches[0]) return;

    mouse.x = event.touches[0].clientX / window.innerWidth;
    mouse.y = event.touches[0].clientY / window.innerHeight;
  },
  { passive: true }
);

resize();
draw();

const states = {
  stuck: {
    title: "Stuck",
    desc:
      "The system is not failing. The entry point is too large, too cold, or too undefined.",
    intervention:
      "Intervention: 44271 Neural Cuff sends a slow pulse-side tap → reduce task scale → play low-frequency grounding sound → offer one micro-action."
  },

  drifting: {
    title: "Drifting",
    desc:
      "Attention has not disappeared. It has lost its anchor and is searching for another rhythm.",
    intervention:
      "Intervention: spatial sound anchor → soft haptic re-entry pattern → visual field narrows → one return sentence."
  },

  overloaded: {
    title: "Overloaded",
    desc:
      "Too much signal is entering at once. The field needs cooling, not more demand.",
    intervention:
      "Intervention: activate External Anchor Mode → reduce language density → cooling audio → pulse-side slow haptic → one concrete action only."
  },

  numb: {
    title: "Numb",
    desc:
      "The rhythm is not absent. It is protected under low-signal cover.",
    intervention:
      "Intervention: warm textured sound → no-pressure naming → gentle cuff pulse → soft reflective micro-prompt."
  },

  flow: {
    title: "In Flow",
    desc:
      "The rhythm is coherent. The system should protect the state and avoid interruption.",
    intervention:
      "Intervention: maintain ambient support → suppress prompts → minimize haptics → record flow conditions → keep the field open."
  },

  transition: {
    title: "Need Transition",
    desc:
      "One rhythm is ending and another has not yet opened. The bridge is the interface.",
    intervention:
      "Intervention: closure cue → bridge sound → cuff transition pattern → next-state ritual → small threshold action."
  },

  recovery: {
    title: "Need Recovery",
    desc:
      "Recovery is not laziness. Recovery is the body rebuilding rhythm integrity.",
    intervention:
      "Intervention: protect rest → remove output demand → restoration sound → low-frequency haptic breathing cue → rhythm diary reflection."
  }
};

const buttons = document.querySelectorAll(".state-btn");
const title = document.getElementById("stateTitle");
const desc = document.getElementById("stateDesc");
const intervention = document.getElementById("stateIntervention");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const data = states[button.dataset.state];

    title.textContent = data.title;
    desc.textContent = data.desc;
    intervention.textContent = data.intervention;
  });
});
