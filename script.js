// Balança de Decisão (wordcloud)
// Base: http://localhost:3900/wordcloud e /clear-chat

const params = new URLSearchParams(window.location.search);

// Config via URL
const domain = params.get("domain") || "http://localhost:3900";
const title = params.get("title") || "Balança de Decisão";
const leftText = params.get("left") || "Opção A";
const rightText = params.get("right") || "Opção B";

// palavras-chave que contam (aceita A/B e também o texto das opções)
const keyA = (params.get("keyA") || "A").toLowerCase();
const keyB = (params.get("keyB") || "B").toLowerCase();

const maxTilt = Number(params.get("maxTilt") || 12); // graus

// Elementos
const elTitle = document.getElementById("title");
const elLeftLabel = document.getElementById("leftLabel");
const elRightLabel = document.getElementById("rightLabel");
const elLeftCount = document.getElementById("leftCount");
const elRightCount = document.getElementById("rightCount");
const elLeftFill = document.getElementById("leftFill");
const elRightFill = document.getElementById("rightFill");
const elBeam = document.getElementById("beam");

elTitle.textContent = title;
elLeftLabel.textContent = leftText;
elRightLabel.textContent = rightText;

const leftKeyText = leftText.toLowerCase();
const rightKeyText = rightText.toLowerCase();

// Helpers
function norm(s){
  // remove acentos e normaliza
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

let lastCounts = { a: 0, b: 0 };

// Atualiza UI (inclinação + barras)
function updateUI(aCount, bCount){
  elLeftCount.textContent = aCount;
  elRightCount.textContent = bCount;

  const total = aCount + bCount;
  const aPct = total ? (aCount / total) : 0.5;
  const bPct = total ? (bCount / total) : 0.5;

  elLeftFill.style.width = `${Math.round(aPct * 100)}%`;
  elRightFill.style.width = `${Math.round(bPct * 100)}%`;

  // Diferença normalizada para inclinação
  // diff = -1..1 (negativo puxa esquerda, positivo puxa direita)
  const diff = total ? (bCount - aCount) / total : 0;

  const tilt = clamp(diff * maxTilt, -maxTilt, maxTilt);

  // roda o feixe
  elBeam.style.transform = `rotate(${tilt}deg)`;

  // Ajusta “altura” dos pratos para dar feeling físico
  // Quando roda para a direita (tilt positivo), prato direito desce (top maior)
  const leftPan = document.querySelector(".pan.left");
  const rightPan = document.querySelector(".pan.right");

  const baseTop = 70;
  const offset = tilt * 1.8; // ajusta sensibilidade visual

  leftPan.style.top = `${baseTop + offset}px`;
  rightPan.style.top = `${baseTop - offset}px`;

  // Pequeno pulse quando há mudança real
  if (aCount !== lastCounts.a || bCount !== lastCounts.b){
    elBeam.classList.remove("pulse");
    void elBeam.offsetWidth; // reflow para reiniciar animação
    elBeam.classList.add("pulse");
    lastCounts = { a: aCount, b: bCount };
  }
}

// Conta ocorrências no wordcloud
function countVotes(list){
  let a = 0, b = 0;
  for (const item of list){
    const w = norm(item);

    // aceita: keyA / keyB (ex: a/b)
    // aceita também: texto das opções (ex: lisboa/porto)
    if (w === norm(keyA) || w === norm(leftKeyText)) a++;
    if (w === norm(keyB) || w === norm(rightKeyText)) b++;
  }
  return { a, b };
}

async function clear(){
  // limpar só as palavras relevantes ajuda a isolar a votação
  const words = encodeURIComponent(`${keyA},${keyB},${leftKeyText},${rightKeyText}`);
  try{
    await fetch(`${domain}/clear-chat?words=${words}`);
  }catch(e){
    // se falhar, tenta sem filtro
    try{ await fetch(`${domain}/clear-chat`); }catch(_){}
  }
}

async function fetchData(){
  try{
    const res = await fetch(`${domain}/wordcloud`, { cache: "no-store" });
    const data = await res.json();

    const raw = (data.wordcloud || "");
    const list = raw.split(",").map(s => s.trim()).filter(Boolean);

    const { a, b } = countVotes(list);

    // evita zeros absolutos para não “morrer” visualmente
    updateUI(a, b);
  }catch(e){
    // se quiseres, podes mostrar algum estado no UI
    // console.error("Erro wordcloud:", e);
  }
}

// arranque
(async function init(){
  await clear();
  updateUI(0, 0);
  setTimeout(() => {
    fetchData();
    setInterval(fetchData, 1000);
  }, 600);
})();
