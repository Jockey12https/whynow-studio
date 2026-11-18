// WHY NOW? 2026-11-19: why so many big services went down in one week (news). Mascot + kit.
const DUR = 34;
const PUNCHES = [{ t0: 0.1, amount: 0.07 }, { t0: 11.4, amount: 0.06 }, { t0: 18.6, amount: 0.05 }];
const SUB = OUT.replace('12px', '8px');
const CARD = (op) => `background:#fff;border:8px solid ${NAVY};border-radius:36px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:42px;font-weight:900;color:${NAVY};line-height:1.12;padding:0 26px;box-sizing:border-box;opacity:${op}`;
const NAMES = ['MICROSOFT', 'FAA FLIGHTS', 'JPMORGAN', 'THE NSA', 'APPLE'];

function tile(x, y, w, h, label, down, sc = 1) {
  const col = down ? RED : ACC;
  return box(x, y, w, h, `background:#fff;border:8px solid ${NAVY};border-radius:26px;display:flex;align-items:center;justify-content:space-between;padding:0 30px;box-sizing:border-box;font-size:50px;font-weight:900;color:${NAVY};transform:scale(${sc});transform-origin:50% 50%`,
    `<span>${label}</span><span style="background:${col};border:6px solid ${NAVY};border-radius:999px;padding:4px 22px;font-size:36px">${down ? 'DOWN' : 'OK'}</span>`);
}
function server(x, y, w, h, state, t, old = false) {   // state 0 ok .. 1 broken
  const col = state > 0.5 ? RED : ACC;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${old ? '#b9a98c' : '#dfe8f5'}" stroke="${NAVY}" stroke-width="8"/>`;
  for (let i = 0; i < 3; i++) {
    const yy = y + 18 + i * (h - 30) / 3;
    s += `<rect x="${x + 16}" y="${yy}" width="${w - 32}" height="${(h - 30) / 3 - 12}" rx="8" fill="${NAVY}"/>`;
    const blink = state > 0.5 ? (Math.floor(t * 6 + i) % 2 ? 1 : 0.25) : 1;
    s += `<circle cx="${x + w - 40}" cy="${yy + ((h - 30) / 3 - 12) / 2}" r="9" fill="${col}" opacity="${blink}"/>`;
  }
  return s;
}

function draw(t) {
  let h = bg(t);

  // ===== S1 HOOK 0 - 3.6 =====
  h += fadeWrap(t, -1, 3.6, (() => {
    const sc = 1 + 0.14 * (1 - eo(clamp(t / 0.45)));
    let s = txt(40, 250, 1000, '5 GIANTS', 200, RED, OUT + `transform:scale(${sc});`);
    s += txt(40, 470, 1000, 'WENT DOWN', 110, WHITE, OUT);
    s += txt(40, 590, 1000, 'IN ONE WEEK', 110, YEL, OUT);
    let d = '';
    for (let i = 0; i < 5; i++) d += server(520 + (i % 3) * 160, 820 + Math.floor(i / 3) * 300 + (i >= 3 ? 0 : 0) + (i >= 3 ? 0 : 0), 140, 260, t > 0.6 + i * 0.35 ? 1 : 0, t);
    s += layer(d);
    s += mascot('bust_shock', 250, 1500, 380, { t });
    return s;
  })(), 0.001, 0.3);

  // ===== S2 THE LIST 3.6 - 10.0 =====
  h += fadeWrap(t, 3.6, 10.0, (() => {
    let s = txt(40, 250, 1000, 'IN JUST DAYS:', 96, WHITE, OUT);
    for (let i = 0; i < 5; i++) {
      const a = popScale(t, 4.2 + i * 0.7);
      if (a <= 0) continue;
      s += tile(140, 400 + i * 150, 820, 120, NAMES[i], t > 4.6 + i * 0.7, a);
    }
    s += txt(140, 1170, 820, 'Apple: iCloud, Apple Pay, App Store', 40, '#cfe0ff', SUB + `opacity:${prog(t, 7.6, 8.0)};`);
    s += mascot('bust_worry', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S3 CYBERATTACK? 10.0 - 16.6 =====
  h += fadeWrap(t, 10.0, 16.6, (() => {
    let s = txt(40, 250, 1000, 'A CYBERATTACK?', 104, WHITE, OUT);
    const st = popScale(t, 11.4);
    if (st > 0) s += box(160, 480, 760, 220, `border:14px solid ${ACC};border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:96px;font-weight:900;color:${ACC};transform:rotate(-6deg) scale(${st});font-family:Inter;text-shadow:0 0 1px ${NAVY}`, 'NO EVIDENCE');
    s += txt(160, 730, 760, 'says US intelligence chief', 46, YEL, SUB + `opacity:${prog(t, 12.0, 12.4)};`);
    s += box(340, 1110, 680, 230, CARD(prog(t, 12.8, 13.2)), 'Officials say they were separate failures tied to maintenance and updates');
    s += mascot('bust_think', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S4 ONE BAD UPDATE 16.6 - 22.8 =====
  h += fadeWrap(t, 16.6, 22.8, (() => {
    let s = txt(40, 250, 1000, 'ONE BAD UPDATE', 96, YEL, OUT);
    s += txt(40, 360, 1000, 'HITS EVERYTHING', 80, WHITE, OUT);
    const k = eo(prog(t, 17.4, 18.6));
    let d = `<rect x="440" y="500" width="200" height="120" rx="22" fill="${YEL}" stroke="${NAVY}" stroke-width="9"/>
      <text x="540" y="578" text-anchor="middle" font-size="44" font-weight="900" fill="${NAVY}">v2.1</text>`;
    for (let i = 0; i < 6; i++) {
      const sx = 100 + i * 150, sy = 820;
      d += `<path d="M 540 620 L ${540 + (sx + 60 - 540) * k} ${620 + (sy - 620) * k}" stroke="${YEL}" stroke-width="8" stroke-dasharray="18 12" stroke-dashoffset="${-t * 60}" fill="none"/>`;
      d += server(sx, sy, 120, 200, t > 18.6 + i * 0.12 ? 1 : 0, t);
    }
    s += layer(d);
    s += box(340, 1110, 680, 230, CARD(prog(t, 19.6, 20.0)), 'Big services push one change to huge numbers of machines at once');
    s += mascot('bust_shock', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S5 OLD SYSTEMS 22.8 - 28.6 =====
  h += fadeWrap(t, 22.8, 28.6, (() => {
    let s = txt(40, 250, 1000, 'OLD SYSTEMS', 104, WHITE, OUT);
    s += txt(40, 365, 1000, '+ FASTER PATCHES', 84, RED, OUT + `opacity:${prog(t, 23.8, 24.1)};`);
    const wob = Math.sin(t * 9) * 3;
    let d = `<g transform="rotate(${wob} 360 900)">${server(250, 620, 220, 460, 0.6 + 0.4 * Math.sin(t * 4), t, true)}</g>`;
    d += `<circle cx="760" cy="820" r="150" fill="#fff" stroke="${NAVY}" stroke-width="10"/>
      <line x1="760" y1="820" x2="760" y2="700" stroke="${NAVY}" stroke-width="12" stroke-linecap="round" transform="rotate(${t * 240} 760 820)"/>
      <line x1="760" y1="820" x2="840" y2="820" stroke="${RED}" stroke-width="10" stroke-linecap="round" transform="rotate(${t * 40} 760 820)"/>`;
    s += layer(d);
    s += txt(640, 990, 240, 'PATCH NOW', 40, YEL, SUB + `opacity:${prog(t, 24.4, 24.8)};`);
    s += box(340, 1110, 680, 230, CARD(prog(t, 25.0, 25.4)), 'Experts point to aging systems, and AI finding bugs faster');
    s += mascot('bust_worry', 150, 1500, 230, { t });
    return s;
  })());

  // ===== S6 END 28.6 - 34 =====
  h += fadeWrap(t, 28.6, 34.01, (() => {
    const bt = popScale(t, 30.4);
    let s = cap(t, 29.0, 100, 260, ['no hack found.', 'just *fragile*'], { size: 112, w: 880 });
    s += txt(40, 548, 1000, 'Sources in the description', 52, YEL, OUT.replace('12px', '9px'));
    s += box(250, 650, 580, 130, `background:${ACC};border:10px solid ${NAVY};border-radius:65px;display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:900;color:${NAVY};transform:scale(${bt})`, 'FOLLOW FOR MORE');
    s += txt(40, 810, 1000, '@whynow.explained', 60, WHITE, OUT.replace('12px', '9px') + `opacity:${Math.min(1, Math.max(0, (t - 30.8) * 3))};`);
    s += mascot('bust_think', 540, 1540, 340, { t, pop: 29.4 });
    return s;
  })(), 0.3, 0.001);

  h += box(60, 1568, 960 * (t / DUR), 10, `background:${ACC};border-radius:5px;opacity:.9`);
  return h;
}
