// Balança de Decisão (OBS overlay)
// Base robusta: wordcloud + clear-chat (como os teus que funcionam)

// URL params
const params = new URLSearchParams(window.location.search);

// IMPORTANT: mantém o default localhost:3900 (como pediste)
const domain = params.get("domain") || "http://localhost:3900";

const title = params.get("title") || "Balança de Decisão";
const leftText = params.get("left") || "Opção A";
const rightText = params.get("right") || "Opção B";

// palavras que contam (por defeito A/B)
const keyA = (params.get("keyA") || "A");
const keyB = (params.get("keyB") || "B");

// inclinação máxima (graus)
const maxTilt = Number(params.get("maxTilt") || 12);

// UI
const elTitle = document.getElementById("title");
const elSub = document.getElementById("sub");

const elLeftLabel = document.getElementById("leftLabel");
const elRightLabel = document.getElementById("rightLabel");

const elLeftCount = document.getElementById("leftCount");
const elRightCount = document.getElementById("rightCount");

const elLeftFill = document.getElementById("leftFill");
const elRightFill = document.getElementById("rightFill");

const elBeam = document.getElementById("beam");
const elLeftPan = document.querySelector(".pan-left");
const elRightPan = document.querySelector(".pan-right");

elTitle.textContent = title;
elLeftLabel.textContent = leftText;
elRightLabel.textContent = rightText;

function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const nKeyA = norm(keyA);
const nKeyB = norm(keyB);
const nLeftText = norm(leftText);
const nRightText = norm(rightText);

let last = { a: 0, b: 0 };

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pulse() {
  elBeam.classList.remove("pulse");
  void elBeam.offsetWidth; // reflow para reiniciar
  elBeam.classList.add("pulse");
}

function updateUI(a, b) {
  elLeftCount.textContent = a;
  elRightCount.textContent = b;

  const total = a + b;
  const aPct = total ? (a / total) : 0.5;
  const bPct = total ? (b / total) : 0.5;

  elLeftFill.style.width = `${Math.round(aPct * 100)}%`;
  elRightFill.style.width = `${Math.round(bPct * 100)}%`;

  // inclinação baseada na diferença (suave e contínua)
  const diff = total ? ((b - a) / total) : 0; // -1..1
  const tilt = clamp(diff * maxTilt, -maxTilt, maxTilt);

  elBeam.style.transform = `rotate(${tilt}deg)`;

  // pratos descem/sobem com translateY (mais elegante que mexer no top)
  const offset = tilt * 1.8; // ajusta "peso" visual
  elLeftPan.style.transform = `translateY(${offset}px)`;
  elRightPan.style.transform = `translateY(${-offset}px)`;

  if (a !== last.a || b !== last.b) {
    pulse();
    last = { a, b };
  }
}

function countVotes(list) {
  let a = 0, b = 0;

  for (const raw of list) {
    const w = norm(raw);
    // aceita A/B e também o texto das opções
    if (w === nKeyA || w === nLeftText) a++;
    if (w === nKeyB || w === nRightText) b++;
  }
  return { a, b };
}

async function clearChat() {
  // limpa só as palavras relevantes (para evitar lixo de outras interações)
  const words = encodeURIComponent([keyA, keyB, leftText, rightText].join(","));
  try {
    await fetch(`${domain}/clear-chat?words=${words}`);
  } catch (e) {
    // fallback
    try { await fetch(`${domain}/clear-chat`); } catch (_) {}
  }
}

async function fetchData() {
  try {
    const res = await fetch(`${domain}/wordcloud`, { cache: "no-store" });
    const data = await res.json();

    const raw = (data.wordcloud || "");
    const list = raw.split(",").map(s => s.trim()).filter(Boolean);

    const { a, b } = countVotes(list);
    updateUI(a, b);
  } catch (e) {
    // se quiseres debug no browser:
    // console.error("Erro a ler wordcloud:", e);
  }
}

// Arranque
(async function init() {
  updateUI(0, 0);
  await clearChat();

  // pequeno delay para garantir reset antes de contar
  setTimeout(() => {
    fetchData();
    setInterval(fetchData, 1000);
  }, 600);
})();
