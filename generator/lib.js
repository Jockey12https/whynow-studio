const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - x, 3);
const popScale = (t, t0) => { const x = t - t0; if (x < 0) return 0; const k = clamp(x / 0.4); return eo(k) * (1 + 0.14 * Math.sin(k * Math.PI)); };
const ACC = '#39ff88', RED = '#ff3b4e', YEL = '#ffd84a', WHITE = '#ffffff', NAVY = '#06163f';
const OUT = '-webkit-text-stroke:12px #06163f;paint-order:stroke fill;text-shadow:0 8px 0 rgba(0,0,0,.28);';

function hex(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
function mix(c, to, k) { const a = hex(c); return '#' + a.map(v => Math.round(v + (to - v) * k).toString(16).padStart(2, '0')).join(''); }
const lighten = (c, k = 0.28) => mix(c, 255, k);
const darken = (c, k = 0.35) => mix(c, 0, k);

function txt(x, y, w, s, size, color, extra = '', align = 'center', weight = 900) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;text-align:${align};font-size:${size}px;font-weight:${weight};color:${color};line-height:1.06;letter-spacing:-1px;${extra}">${s}</div>`;
}
function box(x, y, w, h, style, inner) { return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}">${inner || ''}</div>`; }
const layer = inner => `<svg style="position:absolute;left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920" font-family="Inter">${inner}</svg>`;

// ---------- studio background (ZackD-like blue room, tiled floor) ----------
function bg(t) {
  const H = 1130; let s = '';
  s += `<defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b7bff"/><stop offset="1" stop-color="#0f4fe0"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a6cff"/><stop offset="1" stop-color="#0a2f9c"/></linearGradient>
  <radialGradient id="spot" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="rgba(255,255,255,.28)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient></defs>`;
  s += `<rect width="1080" height="${H}" fill="url(#wall)"/>`;
  for (let x = 0; x <= 1080; x += 90) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(255,255,255,.12)" stroke-width="3"/>`;
  for (let y = 0; y <= H; y += 90) s += `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="rgba(255,255,255,.12)" stroke-width="3"/>`;
  s += `<rect y="${H}" width="1080" height="${1920 - H}" fill="url(#floor)"/>`;
  for (let i = -10; i <= 10; i++) s += `<line x1="${540 + i * 55}" y1="${H}" x2="${540 + i * 330}" y2="1920" stroke="rgba(255,255,255,.2)" stroke-width="3"/>`;
  const sc = (t * 0.25) % 1;
  for (let k = 0; k < 9; k++) { const u = (k + sc) / 9; const y = H + (1920 - H) * u * u; s += `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="rgba(255,255,255,.2)" stroke-width="3"/>`; }
  s += `<rect width="1080" height="1920" fill="url(#spot)"/>`;
  s += `<rect y="${H - 6}" width="1080" height="8" fill="rgba(255,255,255,.35)"/>`;
  return layer(s);
}

// ---------- character rig ----------
function person(o) {
  const { x, y, s = 1, skin = '#f2bd8f', suit = '#223a94', shirt = '#ffffff', tie = null, hair = '#2a1a10', mood = 'neutral', t = 0, glasses = false, shades = false, hood = false, cap = null, armL = 8, armR = 8, talk = false, id = 'p', look = 0, bald = false } = o;
  const bob = Math.abs(Math.sin(t * 4 + x * 0.01)) * -6 * (o.bob === undefined ? 1 : o.bob);
  const shake = (mood === 'shock') ? Math.sin(t * 55) * 3 : 0;
  const blink = ((t + x * 0.002) % 3.2) < 0.13 ? 0.1 : 1;
  const mo = talk ? 0.5 + 0.5 * Math.sin(t * 17) : 0;
  const pants = darken(suit, 0.4);
  let g = `<defs><radialGradient id="h${id}" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="${lighten(skin, .35)}"/><stop offset="1" stop-color="${darken(skin, .12)}"/></radialGradient>
  <linearGradient id="b${id}" x1="0" x2="1"><stop offset="0" stop-color="${lighten(suit, .3)}"/><stop offset="1" stop-color="${darken(suit, .25)}"/></linearGradient></defs>`;
  g += `<ellipse cx="0" cy="6" rx="150" ry="26" fill="rgba(0,10,60,.45)"/>`;
  // legs + shoes
  g += `<rect x="-64" y="-130" width="46" height="110" rx="14" fill="${pants}"/><rect x="18" y="-130" width="46" height="110" rx="14" fill="${pants}"/>`;
  g += `<ellipse cx="-46" cy="-14" rx="48" ry="21" fill="#10131f"/><ellipse cx="46" cy="-14" rx="48" ry="21" fill="#10131f"/>`;
  if (hood) g += `<circle cx="0" cy="-360" r="98" fill="${darken(suit, .15)}"/>`;
  // torso
  g += `<rect x="-98" y="-345" width="196" height="225" rx="60" fill="url(#b${id})"/>`;
  g += `<path d="M-34 -345 L34 -345 L0 -265 Z" fill="${shirt}"/>`;
  if (tie) g += `<path d="M-13 -310 L13 -310 L20 -205 L0 -178 L-20 -205 Z" fill="${tie}"/><path d="M-14 -318 L14 -318 L10 -300 L-10 -300 Z" fill="${darken(tie, .2)}"/>`;
  // arms
  g += `<g transform="translate(-96,-316) rotate(${armL})"><rect x="-20" y="-6" width="40" height="150" rx="20" fill="${suit}"/><circle cx="0" cy="150" r="27" fill="${skin}"/></g>`;
  g += `<g transform="translate(96,-316) rotate(${-armR})"><rect x="-20" y="-6" width="40" height="150" rx="20" fill="${suit}"/><circle cx="0" cy="150" r="27" fill="${skin}"/></g>`;
  // neck + head
  g += `<rect x="-26" y="-385" width="52" height="50" rx="14" fill="${darken(skin, .15)}"/>`;
  g += `<circle cx="-104" cy="-450" r="23" fill="${skin}"/><circle cx="104" cy="-450" r="23" fill="${skin}"/>`;
  g += `<circle cx="0" cy="-455" r="108" fill="url(#h${id})"/>`;
  if (!bald && !cap) g += `<path d="M-108 -452 A108 108 0 0 1 108 -452 Q72 -506 0 -497 Q-72 -506 -108 -452 Z" fill="${hair}"/>`;
  if (cap) g += `<path d="M-102 -492 A108 108 0 0 1 102 -492 Z" fill="${cap}"/><rect x="-14" y="-508" width="150" height="22" rx="11" fill="${darken(cap, .25)}"/>`;
  // eyes
  const wide = mood === 'shock' ? 1.18 : 1;
  for (const ex of [-42, 42]) {
    if (shades) continue;
    g += `<ellipse cx="${ex}" cy="-458" rx="${27 * wide}" ry="${31 * wide * blink}" fill="#fff"/>`;
    if (blink > 0.5) g += `<circle cx="${ex + look * 8}" cy="-456" r="${mood === 'shock' ? 8 : 12}" fill="#111"/><circle cx="${ex + look * 8 - 4}" cy="-461" r="4" fill="#fff"/>`;
  }
  if (shades) g += `<rect x="-78" y="-482" width="156" height="44" rx="20" fill="#0b0b12"/><rect x="-66" y="-476" width="50" height="8" rx="4" fill="rgba(255,255,255,.35)"/>`;
  if (glasses) g += `<circle cx="-42" cy="-458" r="38" fill="rgba(255,255,255,.12)" stroke="#161616" stroke-width="7"/><circle cx="42" cy="-458" r="38" fill="rgba(255,255,255,.12)" stroke="#161616" stroke-width="7"/><line x1="-6" y1="-460" x2="6" y2="-460" stroke="#161616" stroke-width="7"/>`;
  // brows
  const bc = hair === '#8a8a8a' || bald ? '#555' : hair;
  if (!shades && !cap) {
    if (mood === 'shock') g += `<path d="M-72 -512 Q-42 -532 -14 -512" stroke="${bc}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M14 -512 Q42 -532 72 -512" stroke="${bc}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    else if (mood === 'worry') g += `<path d="M-72 -498 L-16 -520" stroke="${bc}" stroke-width="9" stroke-linecap="round"/><path d="M72 -498 L16 -520" stroke="${bc}" stroke-width="9" stroke-linecap="round"/>`;
    else g += `<path d="M-70 -508 Q-42 -520 -16 -508" stroke="${bc}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M16 -508 Q42 -520 70 -508" stroke="${bc}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  }
  g += `<ellipse cx="0" cy="-430" rx="10" ry="14" fill="${darken(skin, .1)}"/>`;
  // mouth
  if (mood === 'shock') g += `<ellipse cx="0" cy="-384" rx="26" ry="34" fill="#5a1220"/><ellipse cx="0" cy="-370" rx="16" ry="12" fill="#ff7a90"/>`;
  else if (mood === 'worry') g += `<path d="M-32 -386 Q-16 -402 0 -386 Q16 -370 32 -386" stroke="#5a1220" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  else if (mood === 'smile') g += `<path d="M-40 -400 Q0 -352 40 -400 Z" fill="#5a1220" stroke="#5a1220" stroke-width="6" stroke-linejoin="round"/><path d="M-30 -397 Q0 -380 30 -397 Z" fill="#fff"/>`;
  else g += `<ellipse cx="0" cy="-388" rx="${22 + mo * 4}" ry="${5 + mo * 18}" fill="#5a1220"/>`;
  if (mood === 'smile') g += `<circle cx="-70" cy="-420" r="16" fill="rgba(255,100,120,.35)"/><circle cx="70" cy="-420" r="16" fill="rgba(255,100,120,.35)"/>`;
  if (mood === 'shock' || mood === 'worry') for (let i = 0; i < 3; i++) { const u = (t * 1.4 + i / 3) % 1; const sx = (i % 2 ? 1 : -1) * (122 + i * 8); g += `<path d="M${sx} ${-560 + u * 150} q-14 22 0 34 q14 -12 0 -34z" fill="#bfe6ff" stroke="#6bb7ff" stroke-width="3" opacity="${1 - u * 0.5}"/>`; }
  return `<g transform="translate(${x + shake},${y + bob}) scale(${s})">${g}</g>`;
}

const PTS = (() => { const a = []; for (let i = 0; i <= 40; i++) { const x = i / 40; a.push(100 - (x < .35 ? x * 8 : 2.8 + (x - .35) * 11.2) + Math.sin(i * 1.7) * 0.5); } return a; })();
function chartPath(t, t0, t1, x, y, w, h, color) {
  const p = prog(t, t0, t1), n = PTS.length - 1, upto = p * n, lo = 88, hi = 101;
  let d = '', last = null;
  for (let i = 0; i <= Math.floor(upto); i++) { const px = x + (i / n) * w, py = y + (1 - (PTS[i] - lo) / (hi - lo)) * h; d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); last = [px, py]; }
  if (Math.floor(upto) < n) { const i = Math.floor(upto), f = upto - i; const v = PTS[i] + (PTS[i + 1] - PTS[i]) * f; const px = x + (upto / n) * w, py = y + (1 - (v - lo) / (hi - lo)) * h; d += 'L' + px.toFixed(1) + ' ' + py.toFixed(1); last = [px, py]; }
  return `<rect x="${x - 24}" y="${y - 24}" width="${w + 48}" height="${h + 48}" rx="30" fill="rgba(5,20,70,.78)" stroke="rgba(255,255,255,.45)" stroke-width="4"/>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>${last ? `<circle cx="${last[0]}" cy="${last[1]}" r="18" fill="${color}"/>` : ''}`;
}
function fadeWrap(t, a, b, html, inDur = 0.3, outDur = 0.3) {
  if (t < a || t > b) return '';
  const o = Math.min(prog(t, a, a + inDur), 1 - prog(t, b - outDur, b));
  return `<div style="position:absolute;inset:0;opacity:${o}">${html}</div>`;
}
function bubble(x, y, w, h, tailX, inner) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:#fff;border:8px solid ${NAVY};border-radius:44px;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 30px;box-sizing:border-box;font-size:52px;font-weight:900;color:${NAVY};line-height:1.1">${inner}</div>
  <div style="position:absolute;left:${tailX}px;top:${y + h - 10}px;width:0;height:0;border-left:34px solid transparent;border-right:34px solid transparent;border-top:56px solid ${NAVY}"></div>
  <div style="position:absolute;left:${tailX + 8}px;top:${y + h - 14}px;width:0;height:0;border-left:26px solid transparent;border-right:26px solid transparent;border-top:44px solid #fff"></div>`;
}


// ===== MASCOT (WHY NOW? host, real brand art) =====
// name: full_front | bust_laugh | bust_shock | bust_worry | bust_think
// (x,y) = bottom-centre anchor, w = display width px. o: {t, pop (time it pops in), tilt, bob, flip}
const MASCOT_AR = { full_front: 816/281, bust_laugh: 378/258, bust_shock: 377/291, bust_worry: 406/296, bust_think: 409/254 };
function mascot(name, x, y, w, o = {}) {
  const t = o.t || 0, h = w * MASCOT_AR[name];
  const k = o.pop === undefined ? 1 : popScale(t, o.pop);
  if (k <= 0) return '';
  const bob = (o.bob === undefined ? 10 : o.bob) * Math.sin(t * 5.2);
  const sq = 1 + 0.018 * Math.sin(t * 5.2 + 1.2);
  const tilt = (o.tilt || 0) + 2.2 * Math.sin(t * 2.6);
  const fl = o.flip ? -1 : 1;
  return `<img src="${ASSETS[name]}" style="position:absolute;left:${x - w / 2}px;top:${y - h + bob}px;width:${w}px;height:${h}px;transform-origin:50% 100%;transform:rotate(${tilt}deg) scale(${fl * k},${k * sq});filter:drop-shadow(0 14px 18px rgba(0,10,60,.45))"/>`;
}

// ===== CREATOR EDIT KIT helpers =====
// Caption recipe from the kit: lowercase Inter Display Black, ONE italic serif accent word marked *like this*,
// per-character slide + fade + blur(0.3em -> 0), 28 frames per char, 1.8 frames apart. Keep inside x 136-920.
// lines: array of strings, e.g. ['one ceo story', 'is moving *markets*'].  size ~112 for 3 lines.
function cap(t, t0, x, y, lines, o = {}) {
  const size = o.size || 96, W = o.w || 784, align = o.align || 'center', col = o.color || '#ffffff';
  let n = 0, html = '';
  for (const line of lines) {
    let row = '';
    for (const part of line.split(/(\*[^*]+\*)/)) {
      const acc = part.startsWith('*'); const s = acc ? part.slice(1, -1) : part;
      for (const ch of s) {
        const d = t0 + (n++) * (1.8 / 30), p = eo(prog(t, d, d + 28 / 30));
        const st = `display:inline-block;white-space:pre;opacity:${p};transform:translateY(${(1 - p) * 0.35}em);filter:blur(${(1 - p) * 0.3}em);`;
        row += acc
          ? `<span style="${st}font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;font-size:1.21em;letter-spacing:0;text-transform:none">${ch}</span>`
          : `<span style="${st}">${ch}</span>`;
      }
    }
    html += `<div style="line-height:.9;margin-bottom:.12em">${row}</div>`;
  }
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${W}px;text-align:${align};font-family:'Inter';font-weight:900;font-size:${size}px;letter-spacing:-.025em;text-transform:lowercase;color:${col};text-shadow:0 .04em .14em rgba(0,0,0,.4)">${html}</div>`;
}
// Smooth punch-in (kit zoom curve): ease in 0.9 s, hold 1 s, ease out 2 s. Scene sets  const PUNCHES = [{t0: 0.2, amount: .08}, ...]
const _smoother = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
function _punch(t, t0, a, i = 0.9, h = 1.0, o = 2.0) {
  if (t < t0) return 0; if (t < t0 + i) return a * _smoother((t - t0) / i);
  if (t < t0 + i + h) return a; return a * (1 - _smoother((t - t0 - i - h) / o));
}
function zoomAt(t, punches, p = 4) { return 1 + Math.pow(punches.reduce((s, k) => s + Math.pow(_punch(t, k.t0, k.amount), p), 0), 1 / p); }
function camera(html, t, punches, origin = '50% 55%') {
  const k = zoomAt(t, punches);
  return k === 1 ? html : `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:${origin};transform:scale(${k})">${html}</div>`;
}
