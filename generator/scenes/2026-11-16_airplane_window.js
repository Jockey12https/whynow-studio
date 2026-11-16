// WHY NOW? 2026-11-16: why airplane windows have a tiny hole (evergreen). Mascot + kit.
const DUR = 34;
const PUNCHES = [{ t0: 0.1, amount: 0.07 }, { t0: 7.9, amount: 0.05 }, { t0: 18.8, amount: 0.05 }];
const PX = { inner: 200, mid: 440, outer: 680 }, PY = 520, PH = 470, PW = 64;     // pane geometry (diagram)
const HOLE = { x: PX.mid + PW / 2, y: PY + PH - 70 };

function pane(x, color, t, t0, extra = '') {
  const k = eo(prog(t, t0, t0 + 0.5)); if (k <= 0) return '';
  return `<g transform="translate(0,${-(1 - k) * 220})" opacity="${k}"><rect x="${x}" y="${PY}" width="${PW}" height="${PH}" rx="14" fill="${color}" stroke="#06163f" stroke-width="8"/>${extra}</g>`;
}
function label(x, w, t, t0, a, b, col = '#fff') {
  const k = eo(prog(t, t0 + 0.2, t0 + 0.6)); if (k <= 0) return '';
  return txt(x, PY + PH + 18, w, `<span style="color:${col}">${a}</span><br><span style="font-size:30px;color:#cfe0ff;text-shadow:none;-webkit-text-stroke:0">${b}</span>`, 40, '#fff', OUT.replace('12px', '8px') + `opacity:${k};`);
}
function holeMark(t, on) {   // the hole in the middle pane
  const k = prog(t, on, on + 0.3); if (k <= 0) return '';
  const r = 20 + 6 * Math.sin(t * 8);
  return `<circle cx="${HOLE.x}" cy="${HOLE.y}" r="9" fill="#06163f"/><circle cx="${HOLE.x}" cy="${HOLE.y}" r="${r + 8}" fill="none" stroke="${RED}" stroke-width="7" opacity="${k}"/>`;
}

function draw(t) {
  let h = bg(t);

  // ===== S1 HOOK 0 - 3.6 =====
  h += fadeWrap(t, -1, 3.6, (() => {
    const sc = 1 + 0.14 * (1 - eo(clamp(t / 0.45)));
    let s = txt(40, 250, 1000, 'THAT TINY HOLE', 104, WHITE, OUT);
    s += txt(40, 365, 1000, 'IN YOUR PLANE WINDOW', 76, WHITE, OUT);
    s += txt(40, 500, 1000, 'DEFECT?', 210, RED, OUT + `transform:scale(${sc});`);
    // plane window with a tiny hole
    const cx = 700, cy = 1010, r = 18 + 6 * Math.sin(t * 9);
    s += layer(`<rect x="${cx - 160}" y="${cy - 220}" width="320" height="440" rx="150" fill="#cfe9ff" stroke="#06163f" stroke-width="14"/>
      <rect x="${cx - 120}" y="${cy - 180}" width="240" height="360" rx="110" fill="#7ec3ff"/>
      <circle cx="${cx}" cy="${cy + 150}" r="7" fill="#06163f"/>
      <circle cx="${cx}" cy="${cy + 150}" r="${r + 10}" fill="none" stroke="${RED}" stroke-width="8"/>`);
    s += mascot('bust_shock', 230, 1500, 360, { t });
    return s;
  })(), 0.001, 0.3);

  // ===== S2 THREE LAYERS 3.6 - 10.4 =====
  h += fadeWrap(t, 3.6, 10.4, (() => {
    let s = txt(40, 250, 1000, '3 LAYERS OF ACRYLIC', 92, WHITE, OUT);
    s += txt(60, 395, 300, 'CABIN', 40, YEL, OUT.replace('12px', '8px'), 'left');
    s += txt(700, 395, 320, 'OUTSIDE', 40, YEL, OUT.replace('12px', '8px'), 'right');
    s += layer(pane(PX.inner, '#bfe3ff', t, 4.2) + pane(PX.mid, '#8fd0ff', t, 5.0, '') + pane(PX.outer, '#4aa3ff', t, 5.8) + holeMark(t, 7.9));
    s += label(PX.inner - 110, 284, t, 4.2, 'INNER', 'scratch pane');
    s += label(PX.mid - 110, 284, t, 5.0, 'MIDDLE', 'has the hole');
    s += label(PX.outer - 110, 284, t, 5.8, 'OUTER', 'takes the pressure');
    s += mascot('bust_think', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S3 THE HOLE EQUALIZES PRESSURE 10.4 - 17.6 =====
  h += fadeWrap(t, 10.4, 17.6, (() => {
    let s = txt(40, 250, 1000, 'THE HOLE LETS<br>PRESSURE EQUALIZE', 84, WHITE, OUT);
    let d = pane(PX.inner, '#bfe3ff', t, -9) + pane(PX.mid, '#8fd0ff', t, -9) + pane(PX.outer, '#4aa3ff', t, -9);
    d += `<circle cx="${HOLE.x}" cy="${HOLE.y}" r="9" fill="#06163f"/>`;
    for (let i = 0; i < 7; i++) {          // cabin air drifting through the hole into the gap
      const ph = ((t - 10.8) * 0.45 + i / 7) % 1; if (t < 10.8) continue;
      const x = ph < 0.55 ? 120 + (HOLE.x - 120) * (ph / 0.55) : HOLE.x + (PX.outer - HOLE.x) * ((ph - 0.55) / 0.45) * 0.85;
      const y = HOLE.y + (ph < 0.55 ? 0 : -(ph - 0.55) * 90 * Math.sin(i));
      d += `<circle cx="${x}" cy="${y}" r="11" fill="${ACC}" stroke="#06163f" stroke-width="4"/>`;
    }
    for (let k = 0; k < 3; k++) { const yy = PY + 110 + k * 120, a = prog(t, 13.4 + k * 0.25, 13.9 + k * 0.25);  // pressure pushes on the OUTER pane
      d += `<path d="M ${PX.outer - 90} ${yy} h 70 l -18 -18 m 18 18 l -18 18" stroke="${RED}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${a}" transform="translate(${PW + 24},0)"/>`; }
    s += layer(d);
    s += txt(60, 465, 330, 'CABIN AIR', 40, ACC, OUT.replace('12px', '8px'), 'left');
    s += label(PX.outer - 110, 284, t, -9, 'OUTER', 'carries the load');
    s += box(340, 1150, 680, 170, `background:#fff;border:8px solid ${NAVY};border-radius:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:44px;font-weight:900;color:${NAVY};line-height:1.1;padding:0 24px;box-sizing:border-box;opacity:${prog(t, 14.6, 15.0)}`, 'So the OUTER pane takes the full pressure');
    s += mascot('bust_think', 150, 1500, 230, { t, flip: true });
    return s;
  })());

  // ===== S4 FAIL-SAFE 17.6 - 23.6 =====
  h += fadeWrap(t, 17.6, 23.6, (() => {
    const crack = prog(t, 19.0, 19.3);
    let s = txt(40, 250, 1000, 'IF THE OUTER PANE<br>EVER FAILED...', 84, WHITE, OUT);
    let d = pane(PX.inner, '#bfe3ff', t, -9) + pane(PX.mid, prog(t, 20.2, 20.6) > 0 ? '#7dffb0' : '#8fd0ff', t, -9) + pane(PX.outer, crack > 0 ? '#ff6b7a' : '#4aa3ff', t, -9);
    if (crack > 0) d += `<path d="M ${PX.outer + 32} ${PY + 40} l -14 90 l 20 60 l -18 80 l 16 70 l -10 60" stroke="#fff" stroke-width="7" fill="none" opacity="${crack}"/>`;
    s += layer(d);
    s += label(PX.mid - 110, 284, t, -9, 'MIDDLE PANE', prog(t, 20.2, 20.6) > 0 ? 'backup holds' : 'backup');
    s += box(340, 1150, 680, 190, `background:#fff;border:8px solid ${NAVY};border-radius:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:42px;font-weight:900;color:${NAVY};line-height:1.1;padding:0 24px;box-sizing:border-box;opacity:${prog(t, 21.0, 21.4)}`, 'Extremely rare. The middle pane is built to be the backup.');
    s += mascot('bust_worry', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S5 BONUS: NO FOG 23.6 - 28.6 =====
  h += fadeWrap(t, 23.6, 28.6, (() => {
    const fog = 1 - eo(prog(t, 25.2, 26.8));
    let s = txt(40, 250, 1000, 'BONUS: NO FOG', 104, WHITE, OUT);
    s += txt(40, 380, 1000, 'Moisture escapes<br>through the hole', 56, YEL, OUT.replace('12px', '9px'));
    const cx = 540, cy = 790;
    s += layer(`<rect x="${cx - 170}" y="${cy - 240}" width="340" height="480" rx="160" fill="#cfe9ff" stroke="#06163f" stroke-width="14"/>
      <rect x="${cx - 130}" y="${cy - 200}" width="260" height="400" rx="120" fill="#7ec3ff"/>
      <rect x="${cx - 130}" y="${cy - 200}" width="260" height="400" rx="120" fill="#e8eef7" opacity="${0.92 * fog}"/>
      <circle cx="${cx}" cy="${cy + 205}" r="7" fill="#06163f"/>`);
    s += mascot('bust_laugh', 540, 1500, 320, { t });
    return s;
  })());

  // ===== S6 END 28.6 - 34 =====
  h += fadeWrap(t, 28.6, 34.01, (() => {
    const bt = popScale(t, 30.4);
    let s = cap(t, 29.0, 148, 260, ['tiny hole.', 'big *job*'], { size: 118, w: 784 });
    s += txt(40, 548, 1000, 'Sources in the description', 52, YEL, OUT.replace('12px', '9px'));
    s += box(250, 650, 580, 130, `background:${ACC};border:10px solid ${NAVY};border-radius:65px;display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:900;color:${NAVY};transform:scale(${bt})`, 'FOLLOW FOR MORE');
    s += txt(40, 810, 1000, '@whynow.explained', 60, WHITE, OUT.replace('12px', '9px') + `opacity:${Math.min(1, Math.max(0, (t - 30.8) * 3))};`);
    s += mascot('bust_laugh', 540, 1530, 440, { t, pop: 29.4 });
    return s;
  })(), 0.3, 0.001);

  h += box(60, 1568, 960 * (t / DUR), 10, `background:${ACC};border-radius:5px;opacity:.9`);
  return h;
}
