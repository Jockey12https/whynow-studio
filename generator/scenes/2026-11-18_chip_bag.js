// WHY NOW? 2026-11-18: why chip bags are full of "air" (evergreen). Mascot + kit.
const DUR = 34;
const PUNCHES = [{ t0: 0.1, amount: 0.07 }, { t0: 4.3, amount: 0.05 }, { t0: 19.2, amount: 0.06 }];
const SUB = OUT.replace('12px', '8px');
const CARD = (op) => `background:#fff;border:8px solid ${NAVY};border-radius:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:42px;font-weight:900;color:${NAVY};line-height:1.12;padding:0 26px;box-sizing:border-box;opacity:${op}`;
function lerpC(a, b, k) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); }

// generic snack bag, puff 0 (flat) .. 1 (pillow); fill level of chips 0..1 shown via cutaway
function bag(cx, cy, w, h, puff = 1, cut = false, t = 0) {
  const bw = w * (0.86 + 0.14 * puff), bh = h, x = cx - bw / 2, y = cy - bh / 2;
  const bulge = 40 * puff;
  const zig = (yy) => { let p = `M ${x} ${yy}`; const n = 10; for (let i = 1; i <= n; i++) p += ` L ${x + bw * i / n} ${yy + (i % 2 ? -14 : 0)}`; return p; };
  let s = `<path d="M ${x} ${y} C ${x - bulge} ${y + bh * 0.3}, ${x - bulge} ${y + bh * 0.7}, ${x} ${y + bh} L ${x + bw} ${y + bh} C ${x + bw + bulge} ${y + bh * 0.7}, ${x + bw + bulge} ${y + bh * 0.3}, ${x + bw} ${y} Z" fill="#ff5a3c" stroke="${NAVY}" stroke-width="10"/>`;
  s += `<path d="${zig(y + 6)}" stroke="${NAVY}" stroke-width="7" fill="none"/><path d="${zig(y + bh - 4)}" stroke="${NAVY}" stroke-width="7" fill="none"/>`;
  if (cut) {   // window showing chips at the bottom, gas on top
    s += `<rect x="${x + 40}" y="${y + 60}" width="${bw - 80}" height="${bh - 120}" rx="24" fill="#bfe3ff" stroke="${NAVY}" stroke-width="7"/>`;
    for (let i = 0; i < 9; i++) {
      const px = x + 80 + (i % 3) * (bw - 160) / 2, py = y + bh - 110 - Math.floor(i / 3) * 46;
      s += `<ellipse cx="${px}" cy="${py}" rx="46" ry="24" fill="#ffd84a" stroke="${NAVY}" stroke-width="5" transform="rotate(${(i * 37) % 40 - 20} ${px} ${py})"/>`;
    }
  } else {
    s += `<rect x="${x + 50}" y="${cy - 60}" width="${bw - 100}" height="120" rx="24" fill="#ffd84a" stroke="${NAVY}" stroke-width="7"/>
      <text x="${cx}" y="${cy + 24}" text-anchor="middle" font-size="64" font-weight="900" fill="${NAVY}">CHIPS</text>`;
  }
  return s;
}
function molecule(x, y, label, col, r = 34) {
  return `<circle cx="${x - r * 0.55}" cy="${y}" r="${r}" fill="${col}" stroke="${NAVY}" stroke-width="5"/><circle cx="${x + r * 0.55}" cy="${y}" r="${r}" fill="${col}" stroke="${NAVY}" stroke-width="5"/>
    <text x="${x}" y="${y + 12}" text-anchor="middle" font-size="32" font-weight="900" fill="${NAVY}">${label}</text>`;
}
function chip(cx, cy, s, col, face) {
  let g = `<ellipse cx="${cx}" cy="${cy}" rx="${110 * s}" ry="${70 * s}" fill="${col}" stroke="${NAVY}" stroke-width="8" transform="rotate(-8 ${cx} ${cy})"/>`;
  g += `<circle cx="${cx - 30 * s}" cy="${cy - 10 * s}" r="${9 * s}" fill="${NAVY}"/><circle cx="${cx + 30 * s}" cy="${cy - 10 * s}" r="${9 * s}" fill="${NAVY}"/>`;
  g += face === 'happy' ? `<path d="M ${cx - 30 * s} ${cy + 18 * s} Q ${cx} ${cy + 44 * s} ${cx + 30 * s} ${cy + 18 * s}" stroke="${NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/>`
    : `<path d="M ${cx - 30 * s} ${cy + 36 * s} Q ${cx} ${cy + 12 * s} ${cx + 30 * s} ${cy + 36 * s}" stroke="${NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return g;
}

function draw(t) {
  let h = bg(t);

  // ===== S1 HOOK 0 - 3.6 =====
  h += fadeWrap(t, -1, 3.6, (() => {
    const sc = 1 + 0.14 * (1 - eo(clamp(t / 0.45)));
    let s = txt(40, 250, 1000, 'YOUR CHIP BAG', 100, WHITE, OUT);
    s += txt(40, 360, 1000, 'IS HALF AIR', 100, WHITE, OUT);
    s += txt(40, 480, 1000, 'SCAM?', 220, RED, OUT + `transform:scale(${sc});`);
    const p = 0.9 + 0.1 * Math.sin(t * 5);
    s += layer(bag(740, 1130, 330, 520, p, false, t));
    s += mascot('bust_shock', 250, 1500, 380, { t });
    return s;
  })(), 0.001, 0.3);

  // ===== S2 IT'S NITROGEN 3.6 - 10.0 =====
  h += fadeWrap(t, 3.6, 10.0, (() => {
    let s = txt(40, 250, 1000, "IT'S NOT AIR.", 92, WHITE, OUT);
    s += txt(40, 355, 1000, "IT'S NITROGEN", 104, ACC, OUT + `transform:scale(${1 + 0.12 * (1 - eo(prog(t, 4.3, 4.7)))});`);
    let d = bag(540, 800, 380, 500, 1, true, t);
    // N2 molecules float in the headspace, O2 gets pushed out the top
    for (let i = 0; i < 4; i++) {
      const k = prog(t, 4.8 + i * 0.25, 5.2 + i * 0.25); if (k <= 0) continue;
      d += `<g opacity="${k}">${molecule(430 + (i % 2) * 220, 640 + Math.floor(i / 2) * 110 + 8 * Math.sin(t * 3 + i), 'N₂', ACC)}</g>`;
    }
    for (let i = 0; i < 2; i++) {
      const k = prog(t, 5.6 + i * 0.4, 7.0 + i * 0.4); if (k <= 0 || k >= 1) continue;
      d += `<g opacity="${1 - k}">${molecule(470 + i * 160, 600 - k * 260, 'O₂', RED, 30)}</g>`;
    }
    s += layer(d);
    s += box(340, 1150, 680, 190, CARD(prog(t, 7.0, 7.4)), 'Factories flush the oxygen out before they seal the bag');
    s += mascot('bust_think', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S3 OXYGEN = STALE 10.0 - 16.6 =====
  h += fadeWrap(t, 10.0, 16.6, (() => {
    let s = txt(40, 250, 1000, 'OXYGEN RUINS', 96, WHITE, OUT);
    s += txt(40, 360, 1000, 'THE OIL', 96, RED, OUT);
    const go = eo(prog(t, 11.6, 13.2));
    let d = chip(300, 720, 1.3, lerpC('#ffd84a', '#a8a06a', go), go > 0.5 ? 'sad' : 'happy');
    d += chip(780, 720, 1.3, '#ffd84a', 'happy');
    for (let i = 0; i < 3; i++) { const k = prog(t, 10.8 + i * 0.3, 11.2 + i * 0.3); if (k > 0) d += `<g opacity="${k}">${molecule(180 + i * 120, 540 - i * 20, 'O₂', RED, 26)}</g>`; }
    for (let i = 0; i < 3; i++) { const k = prog(t, 10.8 + i * 0.3, 11.2 + i * 0.3); if (k > 0) d += `<g opacity="${k}">${molecule(660 + i * 120, 540 - i * 20, 'N₂', ACC, 26)}</g>`; }
    s += layer(d);
    s += txt(110, 860, 380, go > 0.5 ? 'STALE' : 'WITH O₂', 50, go > 0.5 ? RED : WHITE, SUB);
    s += txt(590, 860, 380, 'STAYS FRESH', 50, ACC, SUB + `opacity:${prog(t, 13.2, 13.6)};`);
    s += box(340, 1150, 680, 190, CARD(prog(t, 13.8, 14.2)), 'Oxygen reacts with the oil and makes chips taste rancid');
    s += mascot('bust_worry', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S4 IT'S A PILLOW 16.6 - 22.8 =====
  h += fadeWrap(t, 16.6, 22.8, (() => {
    let s = txt(40, 250, 1000, "IT'S ALSO", 80, WHITE, OUT);
    s += txt(40, 345, 1000, 'A PILLOW', 160, YEL, OUT);
    // a box drops on both bags at 19.2: puffy survives, flat one is crushed
    const drop = eo(prog(t, 18.4, 19.2)), hit = t > 19.2;
    const by = 520 + 260 * drop;
    let d = bag(300, 1000, 300, 380, 1, false, t);
    d += bag(780, 1040, 300, hit ? 260 : 300, 0, false, t);
    d += `<rect x="190" y="${by}" width="220" height="${hit ? 190 : 190}" rx="14" fill="#c98a4b" stroke="${NAVY}" stroke-width="9" transform="translate(0 ${hit ? -30 : 0})"/>`;
    d += `<rect x="670" y="${by + (hit ? 50 : 0)}" width="220" height="190" rx="14" fill="#c98a4b" stroke="${NAVY}" stroke-width="9"/>`;
    if (hit) for (let i = 0; i < 7; i++) { const k = prog(t, 19.2, 19.9); d += `<circle cx="${700 + i * 28 + k * (i - 3) * 22}" cy="${1190 + k * 40}" r="9" fill="#ffd84a" stroke="${NAVY}" stroke-width="3" opacity="${1 - k * 0.3}"/>`; }
    s += layer(`<g transform="translate(0 -110)">${d}</g>`);
    s += txt(150, 1115, 300, 'WITH GAS', 40, ACC, SUB + `opacity:${prog(t, 19.6, 20.0)};`);
    s += txt(630, 1115, 300, 'NO GAS', 40, RED, SUB + `opacity:${prog(t, 19.6, 20.0)};`);
    s += box(340, 1220, 680, 140, CARD(prog(t, 20.4, 20.8)), 'It cushions the chips on the trip');
    s += mascot('bust_laugh', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S5 AM I PAYING FOR AIR? 22.8 - 28.6 =====
  h += fadeWrap(t, 22.8, 28.6, (() => {
    let s = txt(40, 250, 1000, 'AM I PAYING<br>FOR AIR?', 96, WHITE, OUT);
    const k = eo(prog(t, 23.6, 24.4));
    let d = `<rect x="330" y="920" width="420" height="60" rx="20" fill="#c9d6e6" stroke="${NAVY}" stroke-width="9"/>
      <rect x="300" y="980" width="480" height="150" rx="26" fill="#e9f1fb" stroke="${NAVY}" stroke-width="9"/>
      <rect x="430" y="1010" width="220" height="90" rx="14" fill="${NAVY}"/>`;
    d += `<g transform="translate(0 ${-200 * (1 - k)})" opacity="${k}">${bag(540, 760, 230, 300, 1, false, t)}</g>`;
    s += layer(d);
    s += txt(430, 1022, 220, 'CHIPS', 52, ACC, `font-family:Inter;opacity:${prog(t, 24.6, 25.0)};`);
    s += box(60, 1180, 740, 170, CARD(prog(t, 25.2, 25.6)), 'No. The weight on the label is the chips, not the gas');
    s += mascot('bust_think', 920, 1500, 200, { t, flip: true });
    return s;
  })());

  // ===== S6 END 28.6 - 34 =====
  h += fadeWrap(t, 28.6, 34.01, (() => {
    const bt = popScale(t, 30.4);
    let s = cap(t, 29.0, 100, 260, ['not a scam.', 'a *pillow*'], { size: 118, w: 880 });
    s += txt(40, 548, 1000, 'Sources in the description', 52, YEL, OUT.replace('12px', '9px'));
    s += box(250, 650, 580, 130, `background:${ACC};border:10px solid ${NAVY};border-radius:65px;display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:900;color:${NAVY};transform:scale(${bt})`, 'FOLLOW FOR MORE');
    s += txt(40, 810, 1000, '@whynow.explained', 60, WHITE, OUT.replace('12px', '9px') + `opacity:${Math.min(1, Math.max(0, (t - 30.8) * 3))};`);
    s += mascot('bust_laugh', 540, 1540, 380, { t, pop: 29.4 });
    return s;
  })(), 0.3, 0.001);

  h += box(60, 1568, 960 * (t / DUR), 10, `background:${ACC};border-radius:5px;opacity:.9`);
  return h;
}
