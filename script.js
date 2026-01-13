const params = new URLSearchParams(window.location.search);

// Wordcloud server (o teu que funciona)
const domain = params.get("domain") || "http://localhost:3900";

// Textos
const title = params.get("title") || "Balança de Decisão";
const leftText = params.get("left") || "Opção A";
const rightText = params.get("right") || "Opção B";

// Votos
const keyA = params.get("keyA") || "A";
const keyB = params.get("keyB") || "B";

// inclinação máxima
const maxTilt = Number(params.get("maxTilt") || 12);

// UI
document.getElementById("title").textContent = title;
document.getElementById("leftLabel").textContent = leftText;
document.getElementById("rightLabel").textContent = rightText;

const elLeftCount = document.getElementById("leftCount");
const elRightCount = document.getElementById("rightCount");
const elLeftFill = document.getElementById("leftFill");
const elRightFill = document.getElementById("rightFill");
const elBeam = document.getElementById("beam");
const elLeftPan = document.querySelector(".pan-left");
const elRightPan = document.querySelector(".pan-right");
const elEmojiLeft = document.getElementById("emojiLeft");
const elEmojiRight = document.getElementById("emojiRight");

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

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

let last = { a: 0, b: 0 };

function pulse() {
  elBeam.classList.remove("pulse");
  void elBeam.offsetWidth;
  elBeam.classList.add("pulse");
}

function popEmoji(el) {
  el.classList.remove("emoji-pop");
  void el.offsetWidth;
  el.classList.add("emoji-pop");
}

function setEmoji(leftEmoji, rightEmoji) {
  if (elEmojiLeft.textContent !== leftEmoji) {
    elEmojiLeft.textContent = leftEmoji;
    popEmoji(elEmojiLeft);
  }
  if (elEmojiRight.textContent !== rightEmoji) {
    elEmojiRight.textContent = rightEmoji;
    popEmoji(elEmojiRight);
  }
}

function updateUI(a, b) {
  elLeftCount.textContent = a;
  elRightCount.textContent = b;

  const total = a + b;
  const aPct = total ? (a / total) : 0.5;
  const bPct = total ? (b / total) : 0.5;

  elLeftFill.style.width = `${Math.round(aPct * 100)}%`;
  elRightFill.style.width = `${Math.round(bPct * 100)}%`;

  const diff = total ? ((b - a) / total) : 0; // -1..1
  const tilt = clamp(diff * maxTilt, -maxTilt, maxTilt);

  elBeam.style.transform = `rotate(${tilt}deg)`;

  const offset = tilt * 1.8;
  elLeftPan.style.transform = `translateY(${offset}px)`;
  elRightPan.style.transform = `translateY(${-offset}px)`;

  // Emojis conforme resultados
  if (a === 0 && b === 0) {
    setEmoji("😴", "😴");
  } else if (a === b) {
    setEmoji("🤝", "🤝");
  } else if (a > b) {
    setEmoji("🔥", "🥶");
  } else {
    setEmoji("🥶", "🔥");
  }

  if (a !== last.a || b !== last.b) {
    pulse();
    last = { a, b };
  }
}

function countVotes(list) {
  let a = 0, b = 0;

  for (const raw of list) {
    const w = norm(raw);
    if (w === nKeyA || w === nLeftText) a++;
    if (w === nKeyB || w === nRightText) b++;
  }
  return { a, b };
}

async function clearChat() {
  const words = encodeURIComponent([keyA, keyB, leftText, rightText].join(","));
  try {
    await fetch(`${domain}/clear-chat?words=${words}`);
  } catch {
    try { await fetch(`${domain}/clear-chat`); } catch {}
  }
}

async function fetchData() {
  try {
    const res = await fetch(`${domain}/wordcloud`, { cache: "no-store" });
    const data = await res.json();

    const raw = data.wordcloud || "";
    const list = raw.split(",").map(s => s.trim()).filter(Boolean);

    const { a, b } = countVotes(list);
    updateUI(a, b);
  } catch {
    // overlay não deve falhar por erros temporários
  }
}

(async function init() {
  updateUI(0, 0);
  await clearChat();

  setTimeout(() => {
    fetchData();
    setInterval(fetchData, 1000);
  }, 600);
})();
