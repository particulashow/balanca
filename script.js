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

function safeDomain(raw){
  const s = String(raw || "").trim();
  if (!s) return "";
  // aceita http/https e remove trailing slash
  if (!/^https?:\/\//i.test(s)) return "";
  return s.replace(/\/$/, "");
}

// --------------------
// Domain (wordcloud server)
// - prioriza ?domain=
// - fallback: mesma origem (para quando o overlay e o servidor são o mesmo host)
// - fallback final: localhost (dev)
// --------------------
const domain =
  safeDomain(pickParam("domain")) ||
  (window.location.origin ? window.location.origin.replace(/\/$/, "") : "") ||
  "http://localhost:3900";

// --------------------
// Texto/labels
// - compatível com a tua página de testes:
//   question/optionA/optionB
// - compatível com variações antigas:
//   title/left/right e a/b
// --------------------
const title = pickParam("title", "question") || "Balança de Decisão";
const leftText = pickParam("optionA", "left", "a") || "Opção A";
const rightText = pickParam("optionB", "right", "b") || "Opção B";

// --------------------
// Keys de voto
// - por defeito: a / b
// - permite customizar: ?keyA=A&keyB=B ou ?leftKey=a&rightKey=b
// (mantém compatibilidade com outros overlays)
// --------------------
const leftKeyRaw  = pickParam("leftKey", "keyA") || "a";
const rightKeyRaw = pickParam("rightKey", "keyB") || "b";
const leftKey = normalize(leftKeyRaw);
const rightKey = normalize(rightKeyRaw);

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
    // Se o servidor estiver off, não rebenta a overlay
    // (mantém o último estado)
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
// - se houver ?reset=1, limpa
// - caso contrário, não limpa automaticamente (evita “apagar” a live quando abres a overlay)
// --------------------
const shouldReset = pickParam("reset") === "1";
if (shouldReset){
  fetch(`${domain}/clear-chat`).catch(()=>{});
}

// primeira leitura imediata + polling
fetchData();
setInterval(fetchData, 1000);
