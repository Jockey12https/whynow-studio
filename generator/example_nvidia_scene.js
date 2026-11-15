const DUR = 34;
const CEO = { suit: '#1b2d73', tie: '#e63946', hair: '#8a8a8a', glasses: true, skin: '#f0b98c', id: 'ceo' };

function draw(t) {
  let h = bg(t);

  // ===== S1 HOOK 0 - 3.6 =====
  h += fadeWrap(t, -1, 3.6, (() => {
    const k = clamp(t / 0.45), sc = 1 + 0.16 * (1 - eo(k));
    const shk = t > 0.45 && t < 0.9 ? Math.sin(t * 90) * 8 * (1 - prog(t, 0.45, 0.9)) : 0;
    const cnt = (3 + 7 * eo(prog(t, 0, 1.0))).toFixed(1);
    let s = txt(40, 250, 1000, 'ONE CEO STORY…', 96, WHITE, OUT);
    s += txt(40, 350, 1000, `-${cnt}%`, 270, RED, OUT + `transform:scale(${sc}) translateX(${shk}px);`);
    s += txt(40, 640, 1000, 'IN 2 DAYS', 100, YEL, OUT);
    s += layer(`<g>${(() => { return chartPath(t, 0.1, 1.8, 90, 820, 300, 230, RED); })()}</g>` + person({ ...CEO, x: 735, y: 1450, s: 1.0, mood: 'shock', t, armL: 40, armR: 150, look: Math.sin(t * 3) }));
    s += mascot('bust_shock', 230, 1500, 360, { t });
    s += box(150, 745, 780, 64, `background:${NAVY};border-radius:42px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:#fff;letter-spacing:1px;opacity:${prog(t, 1.2, 1.6)}`, "WORLD'S BIGGEST AI CHIP MAKER");
    return s;
  })(), 0.001, 0.3);

  // ===== S2 ALLEGATIONS 3.6 - 9.6 =====
  h += fadeWrap(t, 3.6, 9.6, (() => {
    const st = popScale(t, 6.2);
    let s = txt(40, 250, 1000, 'THE ALLEGATIONS', 100, WHITE, OUT);
    s += bubble(70, 400, 940, 330, 250, 'Reports claim a personal relationship that US intelligence reportedly flagged');
    s += layer(person({ ...CEO, x: 810, y: 1420, s: 0.9, mood: 'worry', t, armL: 20, armR: 20 }));
    s += mascot('bust_think', 250, 1500, 400, { t });
    s += `<div style="position:absolute;left:300px;top:800px;width:480px;text-align:center;font-size:92px;font-weight:900;color:${RED};background:rgba(255,255,255,.92);border:12px solid ${RED};border-radius:22px;transform:rotate(-8deg) scale(${st});opacity:${st > 0 ? 1 : 0};letter-spacing:4px;padding:6px 0">ALLEGED</div>`;
    s += txt(470, 1430, 570, 'Under scrutiny.<br>Not proven.', 54, YEL, OUT.replace('12px', '9px'));
    return s;
  })());

  // ===== S3 THE CLAIM 9.6 - 17.6 =====
  h += fadeWrap(t, 9.6, 17.6, (() => {
    let s = txt(40, 250, 1000, 'THE CLAIM', 70, '#cfe2ff', OUT.replace('12px', '9px'));
    s += txt(40, 335, 1000, 'CHIPS ROUTED AROUND<br>EXPORT LIMITS?', 88, WHITE, OUT);
    const b = popScale(t, 11.0);
    s += `<div style="position:absolute;left:230px;top:660px;width:620px;height:140px;display:flex;align-items:center;justify-content:center;background:${YEL};border:10px solid ${NAVY};border-radius:70px;font-size:60px;font-weight:900;color:${NAVY};transform:scale(${b});opacity:${b > 0 ? 1 : 0}">~$7.5B reported</div>`;
    const xs = [190, 540, 890];
    let chars = person({ id: 'nv', x: xs[0], y: 1290, s: 0.9, suit: '#4d8a00', shirt: '#2c5300', tie: null, hair: '#3b2a1a', skin: '#f0b98c', mood: 'neutral', t, armL: 8, armR: 60 }) +
      person({ id: 'mm', x: xs[1], y: 1290, s: 0.9, suit: '#2f2f46', hood: true, shades: true, skin: '#c98d62', hair: '#111', mood: 'smile', t, armL: 55, armR: 55 }) +
      person({ id: 'by', x: xs[2], y: 1290, s: 0.9, suit: '#8c1d2f', tie: '#ffd84a', hair: '#161616', skin: '#e8b48a', mood: 'neutral', t, armL: 60, armR: 8 });
    // crate
    const leg1 = eo(prog(t, 12.0, 13.4)), leg2 = eo(prog(t, 14.6, 16.0));
    let cx = xs[0] + 95; if (t > 12.0) cx = xs[0] + 95 + (xs[1] - xs[0] - 10) * leg1; if (t > 14.6) cx = xs[1] + 85 + (xs[2] - xs[1] - 150) * leg2;
    const cy = 1140 - Math.sin(prog(t, 12, 13.4) * Math.PI) * 60 * (t < 14 ? 1 : 0) - Math.sin(prog(t, 14.6, 16) * Math.PI) * 60 * (t >= 14 ? 1 : 0);
    const crate = t > 11.4 ? `<g transform="translate(${cx},${cy})"><rect x="-48" y="-38" width="96" height="76" rx="10" fill="#76b900" stroke="${NAVY}" stroke-width="7"/><rect x="-22" y="-16" width="44" height="32" rx="6" fill="#06163f"/><line x1="-34" y1="-6" x2="-22" y2="-6" stroke="${NAVY}" stroke-width="5"/><line x1="22" y1="6" x2="34" y2="6" stroke="${NAVY}" stroke-width="5"/></g>` : '';
    s += layer(chars + crate);
    const labs = ['NVIDIA', 'MIDDLEMEN', 'BUYERS (CHINA)'];
    labs.forEach((l, i) => { const sc = popScale(t, 10.2 + i * 0.5); s += box(xs[i] - 170, 1325, 340, 64, `background:${NAVY};border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:#fff;transform:scale(${sc})`, l); });
    s += txt(40, 1415, 1000, 'A claim, not a verdict', 56, YEL, OUT.replace('12px', '9px') + `opacity:${prog(t, 16.4, 17)}`);
    return s;
  })());

  // ===== S4 WHY MARKETS PANIC 17.6 - 23.6 =====
  h += fadeWrap(t, 17.6, 23.6, (() => {
    let s = txt(40, 250, 1000, 'WHY INVESTORS PANIC', 84, WHITE, OUT);
    const items = ['WHO LEADS NVIDIA?', 'CAN IT KEEP SELLING TO CHINA?', 'DO INVESTORS STILL TRUST IT?'];
    items.forEach((it, i) => {
      const sc = popScale(t, 18.3 + i * 1.0);
      s += `<div style="position:absolute;left:100px;top:${360 + i * 140}px;width:880px;height:116px;display:flex;align-items:center;background:#fff;border:8px solid ${NAVY};border-radius:36px;transform:scale(${sc});opacity:${sc > 0 ? 1 : 0}"><div style="width:100px;font-size:70px;font-weight:900;color:${RED};text-align:center">${i + 1}</div><div style="font-size:44px;font-weight:900;color:${NAVY};line-height:1.05;width:760px">${it}</div></div>`;
    });
    let arrows = '';
    for (const ax of [960]) for (let k = 0; k < 3; k++) { const u = (t * 0.7 + k / 3) % 1; arrows += `<path d="M${ax - 40} ${850 + u * 450} l40 50 l40 -50 l0 -36 l-40 50 l-40 -50z" fill="${RED}" stroke="${NAVY}" stroke-width="6" opacity="${1 - u * 0.6}"/>`; }
    s += layer(arrows + person({ id: 'inv', x: 790, y: 1430, s: 0.95, suit: '#5b3b8c', tie: '#ffd84a', hair: '#2a1a10', skin: '#e8b48a', mood: 'shock', t, armL: 165, armR: 165, look: Math.sin(t * 4) }));
    s += mascot('bust_worry', 270, 1500, 420, { t });
    return s;
  })());

  // ===== S5 BUT WAIT 23.6 - 28.6 =====
  h += fadeWrap(t, 23.6, 28.6, (() => {
    const bw = popScale(t, 24.0);
    let s = txt(40, 250, 1000, 'BUT WAIT…', 120, YEL, OUT + `transform:scale(${bw});`);
    const cxs = 120, cw = 840, cy = 520, ch = 270;
    const mk = cxs + cw * 0.62;
    s += layer(chartPath(t, 24.2, 26.2, cxs, cy, cw, ch, RED) + (t > 25.4 ? `<line x1="${mk}" y1="${cy - 24}" x2="${mk}" y2="${cy + ch + 24}" stroke="#fff" stroke-width="6" stroke-dasharray="14 10"/>` : '') +
      '');
    s += mascot('bust_think', 540, 1500, 300, { t, flip: true });
    s += box(mk - 130, cy + ch + 40, 260, 50, `background:#fff;border-radius:25px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:${NAVY};opacity:${prog(t, 25.4, 25.9)}`, 'NEWS BREAKS');
    s += box(cxs - 10, cy + ch + 40, 360, 50, `background:${RED};border-radius:25px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff;opacity:${prog(t, 26.2, 26.7)}`, 'ALREADY FALLING');
    s += txt(40, 885, 1000, 'NVIDIA WAS ALREADY<br>SLIDING BEFORE THIS', 68, WHITE, OUT + `opacity:${prog(t, 26.6, 27.1)}`);
    return s;
  })());

  // ===== S6 END 28.6 - 34 =====
  h += fadeWrap(t, 28.6, 34.01, (() => {
    const s0 = popScale(t, 29.0), bt = popScale(t, 30.4);
    let s = txt(40, 250, 1000, 'ALLEGATIONS<br>&ne; VERDICTS', 118, WHITE, OUT + `transform:scale(${s0});`);
    s += txt(40, 520, 1000, 'Sources in the description', 52, YEL, OUT.replace('12px', '9px'));
    s += box(250, 620, 580, 130, `background:${ACC};border:10px solid ${NAVY};border-radius:65px;display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:900;color:${NAVY};transform:scale(${bt})`, 'FOLLOW FOR MORE');
    s += txt(40, 780, 1000, '@whynow.explained', 60, WHITE, OUT.replace('12px', '9px') + `opacity:${Math.min(1, Math.max(0, (t - 30.8) * 3))};`);
    s += mascot('bust_laugh', 540, 1530, 440, { t, pop: 29.4 });
    return s;
  })(), 0.3, 0.001);

  h += box(60, 1568, 960 * (t / DUR), 10, `background:${ACC};border-radius:5px;opacity:.9`);
  return h;
}
