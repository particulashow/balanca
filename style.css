:root{
  --txt: rgba(255,255,255,0.95);
  --muted: rgba(255,255,255,0.68);
  --stroke: rgba(255,255,255,0.16);
  --shadow: rgba(0,0,0,0.35);

  --glass: rgba(0,0,0,0.22);

  --A: #22c55e;   /* verde */
  --B: #3b82f6;   /* azul */
}

*{ box-sizing:border-box; }
html, body { height: 100%; }
body{
  margin:0;
  background:transparent;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  color: var(--txt);
  overflow:hidden;
}

.overlay{
  width:100%;
  height:100%;
  padding: 48px 64px;
  display:flex;
  flex-direction:column;
  gap: 24px;
}

.top{
  display:flex;
  justify-content:center;
}

.title-wrap{
  text-align:center;
  padding: 14px 18px;
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, var(--glass), rgba(0,0,0,0.06));
  border-radius: 18px;
  backdrop-filter: blur(10px);
  box-shadow: 0 16px 50px rgba(0,0,0,0.22);
}

.title{
  font-size: 44px;
  font-weight: 900;
  letter-spacing: 0.2px;
  text-shadow: 0 10px 30px var(--shadow);
  line-height: 1.05;
}

.subtitle{
  margin-top: 10px;
  font-size: 16px;
  color: var(--muted);
}

.center{
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;
}

.card{
  width: min(1280px, 92vw);
  height: min(520px, 70vh);
  border-radius: 26px;
  border: 1px solid var(--stroke);
  background: radial-gradient(1200px 500px at 50% 0%, rgba(255,255,255,0.10), rgba(0,0,0,0.0)),
              linear-gradient(180deg, var(--glass), rgba(0,0,0,0.08));
  backdrop-filter: blur(14px);
  box-shadow: 0 26px 90px rgba(0,0,0,0.35);
  position:relative;
  overflow:hidden;
  padding: 34px 34px 28px;
}

.glowline{
  position:absolute;
  left: 10%;
  right: 10%;
  top: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent);
  opacity: 0.7;
}

.scale{
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
}

.scale-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 16px;
}

.pill{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(0,0,0,0.16);
  backdrop-filter: blur(10px);
  max-width: 48%;
}

.pill-text{
  font-weight: 800;
  font-size: 18px;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dot{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255,255,255,0.15);
}

.dot-left{ background: var(--A); }
.dot-right{ background: var(--B); }

.beam-wrap{
  position:relative;
  width:100%;
  height: 290px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.hanger{
  position:absolute;
  top: 24px;
  left:50%;
  transform: translateX(-50%);
  width: 2px;
  height: 80px;
  background: rgba(255,255,255,0.22);
}

.pivot{
  position:absolute;
  top: 74px;
  left:50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 18px 50px rgba(0,0,0,0.35);
}

.beam{
  position:absolute;
  top: 92px;
  left: 7%;
  right: 7%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.20);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 16px 46px rgba(0,0,0,0.25);
  transform-origin: 50% 50%;
  transition: transform 750ms cubic-bezier(.2,.9,.2,1);
}

.endcap{
  position:absolute;
  top: -5px;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: rgba(255,255,255,0.28);
  border: 1px solid rgba(255,255,255,0.18);
}
.endcap.left{ left: -6px; }
.endcap.right{ right: -6px; }

.pans{
  position:absolute;
  top: 130px;
  left:0;
  right:0;
  display:flex;
  justify-content:space-between;
  padding: 0 8%;
  pointer-events:none;
}

.pan{
  width: 320px;
  padding: 18px 18px 16px;
  border-radius: 18px;
  border: 1px solid var(--stroke);
  background: rgba(0,0,0,0.14);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 70px rgba(0,0,0,0.25);
  transition: transform 750ms cubic-bezier(.2,.9,.2,1);
}

.count{
  font-size: 56px;
  font-weight: 950;
  letter-spacing: -1px;
  text-shadow: 0 18px 45px rgba(0,0,0,0.35);
  line-height: 1;
}

.meter{
  margin-top: 14px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  overflow:hidden;
}

.fill{
  height:100%;
  width: 0%;
  border-radius: 999px;
  transition: width 650ms cubic-bezier(.2,.9,.2,1);
}

.fill-left{
  background: linear-gradient(90deg, rgba(34,197,94,0.25), var(--A));
}
.fill-right{
  background: linear-gradient(90deg, rgba(59,130,246,0.25), var(--B));
}

.footer-hint{
  display:flex;
  justify-content:center;
  padding-bottom: 4px;
}

.hint{
  font-size: 14px;
  color: rgba(255,255,255,0.60);
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.10);
}

.pulse{
  animation: pulse 220ms ease-out;
}
@keyframes pulse{
  0%{ filter: brightness(1); }
  50%{ filter: brightness(1.12); }
  100%{ filter: brightness(1); }
}
