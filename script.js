const params = new URLSearchParams(window.location.search);
const domain = "http://localhost:3900";

const leftKey = "a";
const rightKey = "b";

const title = params.get("title") || "Balança de Decisão";
const leftText = params.get("left") || "Opção A";
const rightText = params.get("right") || "Opção B";

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

function normalize(t){
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}

async function fetchData(){
  const res = await fetch(`${domain}/wordcloud`, { cache:"no-store" });
  const data = await res.json();

  const words = (data.wordcloud || "").split(",");
  let a = 0, b = 0;

  words.forEach(w=>{
    const v = normalize(w);
    if(v === leftKey) a++;
    if(v === rightKey) b++;
  });

  updateUI(a,b);
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

fetch(`${domain}/clear-chat`);
setInterval(fetchData, 1000);
