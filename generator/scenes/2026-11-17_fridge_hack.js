// WHY NOW? 2026-11-17: how hackers heated up ~700 French supermarkets' fridges (news). Mascot + kit.
const DUR = 34;
const PUNCHES = [{ t0: 0.1, amount: 0.07 }, { t0: 17.2, amount: 0.06 }, { t0: 23.4, amount: 0.04 }];
function lerpC(a, b, k) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
const SUB = OUT.replace('12px', '8px');
const CARD = (op) => `background:#fff;border:8px solid ${NAVY};border-radius:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:42px;font-weight:900;color:${NAVY};line-height:1.12;padding:0 26px;box-sizing:border-box;opacity:${op}`;

// supermarket display fridge; heat 0..1 turns the glass from icy blue to hot red
function fridge(x, y, w, h, heat = 0, t = 0) {
  const glass = lerpC('#9fe3ff', '#ff7a5c', heat);
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#e9f1fb" stroke="${NAVY}" stroke-width="10"/>
    <rect x="${x + 24}" y="${y + 70}" width="${w - 48}" height="${h - 120}" rx="14" fill="${glass}" stroke="${NAVY}" stroke-width="7"/>
    <rect x="${x + 24}" y="${y + 18}" width="${w - 48}" height="36" rx="10" fill="${NAVY}"/>`;
  for (let i = 1; i <= 3; i++) {            // shelves with food boxes
    const sy = y + 70 + (h - 120) * i / 4;
    s += `<line x1="${x + 30}" y1="${sy}" x2="${x + w - 30}" y2="${sy}" stroke="${NAVY}" stroke-width="6"/>`;
    for (let j = 0; j < 3; j++) {
      const bx = x + 44 + j * (w - 88) / 3, sag = heat * 10 * ((i + j) % 2);
      s += `<rect x="${bx}" y="${sy - 46 + sag}" width="${(w - 88) / 3 - 14}" height="${46 - sag}" rx="6" fill="${['#ffd84a', '#39ff88', '#ff9ec7'][(i + j) % 3]}" stroke="${NAVY}" stroke-width="4"/>`;
    }
  }
  if (heat > 0.3) for (let k = 0; k < 4; k++) {   // drips
    const ph = ((t * 0.9 + k * 0.27) % 1), dx = x + 60 + k * (w - 120) / 3;
    s += `<ellipse cx="${dx}" cy="${y + h - 50 + ph * 70}" rx="9" ry="13" fill="#7ec3ff" stroke="${NAVY}" stroke-width="4" opacity="${(1 - ph) * heat}"/>`;
  }
  return s;
}
function wifi(cx, cy, t, col = ACC) {
  let s = '';
  for (let i = 1; i <= 3; i++) {
    const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 5 - i));
    const r = 26 * i;
    s += `<path d="M ${cx - r * 0.8} ${cy - r * 0.6} A ${r} ${r} 0 0 1 ${cx + r * 0.8} ${cy - r * 0.6}" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round" opacity="${a}"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="10" fill="${col}"/>`;
}
function globe(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#4aa3ff" stroke="${NAVY}" stroke-width="10"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.45}" ry="${r}" fill="none" stroke="${NAVY}" stroke-width="6"/>
    <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${NAVY}" stroke-width="6"/>
    <path d="M ${cx - r * 0.9} ${cy - r * 0.45} H ${cx + r * 0.9} M ${cx - r * 0.9} ${cy + r * 0.45} H ${cx + r * 0.9}" stroke="${NAVY}" stroke-width="5"/>`;
}

function draw(t) {
  let h = bg(t);

  // ===== S1 HOOK 0 - 3.6 =====
  h += fadeWrap(t, -1, 3.6, (() => {
    const sc = 1 + 0.14 * (1 - eo(clamp(t / 0.45)));
    let s = txt(40, 250, 1000, 'HACKERS HEATED UP', 92, WHITE, OUT);
    s += txt(40, 350, 1000, 'THE FRIDGES OF', 72, WHITE, OUT);
    s += txt(40, 440, 1000, '700', 250, RED, OUT + `transform:scale(${sc});`);
    s += txt(40, 720, 1000, 'SUPERMARKETS', 84, YEL, OUT);
    const heat = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 6));
    s += layer(fridge(560, 880, 380, 580, heat, t));
    s += mascot('bust_shock', 250, 1500, 380, { t });
    return s;
  })(), 0.001, 0.3);

  // ===== S2 THE FRIDGES ARE ONLINE 3.6 - 10.0 =====
  h += fadeWrap(t, 3.6, 10.0, (() => {
    let s = txt(40, 250, 1000, 'HOW? THE FRIDGES<br>ARE ONLINE', 88, WHITE, OUT);
    let d = fridge(110, 560, 300, 460, 0, t);
    d += wifi(260, 540, t);
    const k = eo(prog(t, 4.6, 5.6));          // dashed link fridge -> internet
    d += `<path d="M 420 760 C 520 700, 580 700, ${420 + 230 * k} ${760 - 20 * k}" fill="none" stroke="${YEL}" stroke-width="10" stroke-dasharray="22 16" stroke-dashoffset="${-t * 60}" opacity="${k}"/>`;
    const g = popScale(t, 5.4);
    if (g > 0) d += `<g transform="translate(800 760) scale(${g}) translate(-800 -760)">${globe(800, 760, 140)}</g>`;
    s += layer(d);
    s += txt(80, 1035, 360, 'CONTROLLER', 38, YEL, SUB);
    s += txt(620, 925, 360, 'THE INTERNET', 38, YEL, SUB + `opacity:${prog(t, 5.6, 6.0)};`);
    s += box(340, 1150, 680, 190, CARD(prog(t, 6.6, 7.0)), 'Stores put them online so staff can check temperatures remotely');
    s += mascot('bust_think', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S3 WEAK PASSWORDS, OLD SOFTWARE 10.0 - 16.6 =====
  h += fadeWrap(t, 10.0, 16.6, (() => {
    let s = txt(40, 250, 1000, 'WEAK PASSWORDS', 96, RED, OUT);
    s += txt(40, 360, 1000, 'OLD SOFTWARE', 96, RED, OUT + `opacity:${prog(t, 11.6, 11.9)};`);
    const open = eo(prog(t, 12.6, 13.1));
    const cx = 540, cy = 760;
    let d = `<path d="M ${cx - 90} ${cy - 40} V ${cy - 120} A 90 90 0 0 1 ${cx + 90} ${cy - 120} V ${cy - 40}" fill="none" stroke="${NAVY}" stroke-width="34" transform="translate(0 ${-60 * open}) rotate(${-25 * open} ${cx - 90} ${cy - 40})"/>
      <path d="M ${cx - 90} ${cy - 40} V ${cy - 120} A 90 90 0 0 1 ${cx + 90} ${cy - 120} V ${cy - 40}" fill="none" stroke="#c9d6e6" stroke-width="18" transform="translate(0 ${-60 * open}) rotate(${-25 * open} ${cx - 90} ${cy - 40})"/>
      <rect x="${cx - 150}" y="${cy - 50}" width="300" height="240" rx="34" fill="${YEL}" stroke="${NAVY}" stroke-width="10"/>
      <circle cx="${cx}" cy="${cy + 50}" r="26" fill="${NAVY}"/><rect x="${cx - 10}" y="${cy + 60}" width="20" height="60" rx="8" fill="${NAVY}"/>`;
    s += layer(d);
    // password field typing
    const pw = '1234', n = Math.floor(clamp((t - 10.9) / 1.4) * pw.length);
    s += box(300, 1000, 480, 96, `background:#fff;border:8px solid ${NAVY};border-radius:24px;display:flex;align-items:center;padding:0 30px;box-sizing:border-box;font-size:52px;font-weight:900;color:${NAVY};font-family:Inter;opacity:${prog(t, 10.5, 10.8)}`, `<span style="color:#7d8aa3;font-size:36px;margin-right:18px">PASSWORD</span>${pw.slice(0, n)}${Math.floor(t * 3) % 2 ? '|' : ''}`);
    s += box(340, 1170, 680, 170, CARD(prog(t, 13.6, 14.0)), "France's cyber agency pointed to basic security failures");
    s += mascot('bust_worry', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S4 THEY PRESSED DEFROST 16.6 - 22.8 =====
  h += fadeWrap(t, 16.6, 22.8, (() => {
    let s = txt(40, 250, 1000, 'THEN THEY HIT', 80, WHITE, OUT);
    s += txt(40, 345, 1000, 'DEFROST', 170, YEL, OUT + `transform:scale(${1 + 0.12 * (1 - eo(prog(t, 17.2, 17.6)))});`);
    const heat = eo(prog(t, 17.8, 20.6));
    let d = fridge(130, 640, 340, 520, heat, t);
    // thermometer
    const tx = 760, ty = 620, th = 470, lvl = 0.1 + 0.85 * heat;
    d += `<rect x="${tx - 34}" y="${ty}" width="68" height="${th}" rx="34" fill="#fff" stroke="${NAVY}" stroke-width="9"/>
      <rect x="${tx - 18}" y="${ty + th - th * lvl}" width="36" height="${th * lvl}" rx="18" fill="${lerpC('#4aa3ff', RED, heat)}"/>
      <circle cx="${tx}" cy="${ty + th + 40}" r="62" fill="${lerpC('#4aa3ff', RED, heat)}" stroke="${NAVY}" stroke-width="9"/>`;
    s += layer(d);
    const deg = Math.round(3 + 47 * heat);
    s += txt(840, 760, 220, `${deg}°C`, 76, heat > 0.5 ? RED : WHITE, OUT, 'left');
    s += txt(820, 870, 240, 'reportedly', 34, '#cfe0ff', SUB, 'left');
    s += box(340, 1260, 680, 150, CARD(prog(t, 20.8, 21.2)), 'Millions of euros of food spoiled');
    s += mascot('bust_shock', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S5 WHO DID IT? 22.8 - 28.6 =====
  h += fadeWrap(t, 22.8, 28.6, (() => {
    let s = txt(40, 250, 1000, 'WHO DID IT?', 110, WHITE, OUT);
    const a = popScale(t, 23.6), b = popScale(t, 25.6);
    s += box(60, 470, 470, 400, `background:#fff;border:8px solid ${NAVY};border-radius:36px;padding:34px 30px;box-sizing:border-box;transform:scale(${a});transform-origin:50% 50%;color:${NAVY};font-weight:900;text-align:center;line-height:1.12`,
      `<div style="font-size:58px;color:#1d4ed8">FRANCE</div><div style="font-size:46px;margin-top:26px">Blames a hacking unit linked to Iran's Revolutionary Guards</div>`);
    s += box(550, 470, 470, 400, `background:#fff;border:8px solid ${NAVY};border-radius:36px;padding:34px 30px;box-sizing:border-box;transform:scale(${b});transform-origin:50% 50%;color:${NAVY};font-weight:900;text-align:center;line-height:1.12`,
      `<div style="font-size:58px;color:#0f8a4a">IRAN</div><div style="font-size:46px;margin-top:26px">Rejects the claim as "baseless"</div>`);
    s += mascot('bust_think', 540, 1500, 330, { t });
    return s;
  })());

  // ===== S6 END 28.6 - 34 =====
  h += fadeWrap(t, 28.6, 34.01, (() => {
    const bt = popScale(t, 30.4);
    let s = cap(t, 29.0, 100, 260, ['thousands are', '*still* online'], { size: 112, w: 880 });
    s += txt(40, 548, 1000, 'Sources in the description', 52, YEL, OUT.replace('12px', '9px'));
    s += box(250, 650, 580, 130, `background:${ACC};border:10px solid ${NAVY};border-radius:65px;display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:900;color:${NAVY};transform:scale(${bt})`, 'FOLLOW FOR MORE');
    s += txt(40, 810, 1000, '@whynow.explained', 60, WHITE, OUT.replace('12px', '9px') + `opacity:${Math.min(1, Math.max(0, (t - 30.8) * 3))};`);
    s += mascot('bust_think', 540, 1540, 340, { t, pop: 29.4 });
    return s;
  })(), 0.3, 0.001);

  h += box(60, 1568, 960 * (t / DUR), 10, `background:${ACC};border-radius:5px;opacity:.9`);
  return h;
}
