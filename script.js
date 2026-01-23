const params = new URLSearchParams(window.location.search);

// --------------------
// Helpers
// --------------------
function normalize(t){
  return String(t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim();
}

function pickParam(...keys){
  for (const k of keys){
    const v = params.get(k);
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
}

function safeHex(v){
  const s = String(v || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(s) ? s : "";
}

function safeDomain(raw){
  const s = String(raw || "").trim();
  if (!s) return "";
  if (!/^https?:\/\//i.test(s)) return "";
  return s.replace(/\/$/, "");
}

function setCssVar(name, value){
  if (!value) return;
  document.documentElement.style.setProperty(name, value);
}

// --------------------
// Domain (wordcloud server)
// --------------------
const domain =
  safeDomain(pickParam("domain")) ||
  (window.location.origin ? window.location.origin.replace(/\/$/, "") : "") ||
  "http://localhost:3900";

// --------------------
// Texto/labels (compatível com a página de testes)
// --------------------
const title = pickParam("title", "question") || "Balança de Decisão";
const leftText  = pickParam("optionA", "left", "a") || "Opção A";
const rightText = pickParam("optionB", "right", "b") || "Opção B";

// --------------------
// Keys de voto
// --------------------
const leftKeyRaw  = pickParam("leftKey", "keyA") || "a";
const rightKeyRaw = pickParam("rightKey", "keyB") || "b";
const leftKey = normalize(leftKeyRaw);
const rightKey = normalize(rightKeyRaw);

// --------------------
// Cores por querystring
// - aColor / bColor / text
// - fallback: accent (se quiseres usar 1 cor só)
// --------------------
const aColor = safeHex(pickParam("aColor")) || safeHex(pickParam("accent")) || "";
const bColor = safeHex(pickParam("bColor")) || "";
const textColor = safeHex(pickParam("text")) || "";

setCssVar("--A", aColor);
setCssVar("--B", bColor);
setCssVar("--txt", textColor);

// --------------------
// Alinhamento
// - align=bottom|center|top
// --------------------
const align = normalize(pickParam("align")) || "bottom";
document.body.classList.remove("align-bottom","align-center","align-top");
document.body.classList.add(`align-${["top","center","bottom"].includes(align) ? align : "bottom"}`);

// --------------------
// DOM
// --------------------
document.getElementById("title").textContent = title;
document.getElementById("leftLabel").textContent = leftText;
document.getElementById("rightLabel").textContent = rightText;

const elLeft = document.getElementById("leftCount");
const elRight = document.getElementById("rightCount");
const elLeftFill = document.getElementById("leftFill");
const elRightFill = document.getElementById("rightFill");
const elBeam = document.getElementById("beam");
const emojiLeft = document.getElementById("emojiLeft");
const emojiRight = document.getElementById("emojiRight");

// --------------------
// Data
// --------------------
async function fetchData(){
  try{
    const res = await fetch(`${domain}/wordcloud`, { cache:"no-store" });
    const data = await res.json();

    const words = String(data.wordcloud || "")
      .split(",")
      .map(w => normalize(w))
      .filter(Boolean);

    let a = 0, b = 0;
    for (const v of words){
      if (v === leftKey) a++;
      if (v === rightKey) b++;
    }

    updateUI(a,b);
  } catch (e){
    console.warn("Falha a ler wordcloud:", e);
  }
}

function updateUI(a,b){
  elLeft.textContent = a;
  elRight.textContent = b;

  const total = a+b || 1;
  elLeftFill.style.width = `${(a/total)*100}%`;
  elRightFill.style.width = `${(b/total)*100}%`;

  const tilt = ((b-a)/total)*12;
  elBeam.style.transform = `rotate(${tilt}deg)`;

  const scale = Math.min(1 + total/25, 2.2);
  emojiLeft.style.transform = `scale(${scale})`;
  emojiRight.style.transform = `scale(${scale})`;

  if(a>b){ emojiLeft.textContent="🔥"; emojiRight.textContent="🥶"; }
  else if(b>a){ emojiLeft.textContent="🥶"; emojiRight.textContent="🔥"; }
  else{ emojiLeft.textContent="🤝"; emojiRight.textContent="🤝"; }
}

// --------------------
// Boot
// - reset opcional: ?reset=1
// --------------------
const shouldReset = pickParam("reset") === "1";
if (shouldReset){
  fetch(`${domain}/clear-chat`).catch(()=>{});
}

fetchData();
setInterval(fetchData, 1000);
