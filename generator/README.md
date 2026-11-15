# WHY NOW? video generator (v1)

Makes one 1080x1920, 30 fps, voiceless animated Short (text + original cartoon characters + sound effects).

## Files
- lib.js: shared components (background room, `person()` character rig, chart, bubble, helpers). Do not edit casually.
- example_nvidia_scene.js: a full 34 s example. COPY it and rewrite `draw(t)` for a new topic.
- example_sfx_events.json: sound-effect timeline for the example.
- sfx.py, make_video.py: renderer. Run: `python3 -I make_video.py scene.js sfx_events.json out.mp4`
  Add a 4th arg like `0,45,300` to render only those frame numbers for a quick check (prints the frames folder).

## Writing a scene.js
It defines `const DUR = <seconds>;` and `function draw(t)` returning an HTML string. Start with `let h = bg(t);`, add scenes with
`h += fadeWrap(t, start, end, html)`, end with `return h;`.
Helpers: txt(x,y,w,html,size,color,extra) | box(x,y,w,h,style,inner) | layer(svg) | person({...}) | chartPath(...) | bubble(...) | popScale(t,t0) | prog(t,a,b) | eo(x).
person() options: x,y(feet),s,skin,suit,shirt,tie,hair,mood('neutral'|'shock'|'worry'|'smile'),talk,glasses,shades,hood,cap,armL,armR (degrees, 0=down, 165=hands up),t.
OUT is the white-text navy outline style used on all headlines.

## Hard rules
1. Frame 0 must already show the hook (headline + character reaction). First 3 s = hook. Never start on a fade-in.
2. Safe zone: keep text and faces inside x 60-1020 and y 250-1500 (YouTube Shorts UI covers the rest).
3. Layout: top headline (size 80-110), character(s) feet at y 1400-1450, one idea per scene, change scene every 4-8 s.
4. 25-40 s total. Last 4-5 s: loop-back/CTA card ("FOLLOW FOR MORE").
5. Characters are ORIGINAL. Never draw a real person's likeness, a real logo or a known cartoon character. A generic labelled "CEO" is fine.
6. Facts: every number comes from 2+ sources fetched that day. Anything unproven is shown as "ALLEGED" / "REPORTS CLAIM" / "A claim, not a verdict". Show contested sides fairly. No graphic violence.
7. Mark invented charts "ILLUSTRATIVE".
8. After rendering, look at 6+ frames (0, 30, 3 s, each scene start, last frame). Fix overlaps and text outside the safe zone before delivering.

## SFX
Edit the events JSON: kinds are thud, whoosh, pop, tick, ping, alarm, riser. Hit a whoosh just before each scene change, a thud on stamps/impacts, a pop per card.

## Brand
Channel: WHY NOW?  Tagline: One story. Explained fast.  Mascot "Host": red backwards cap, yellow jacket (end-card host in the generator).
Palette: royal blue room #1F6BFF, yellow #FFD84A accent, red #E63946, navy #06163F outlines, white text.
