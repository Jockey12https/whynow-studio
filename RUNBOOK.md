# WHY NOW? daily Short: runbook

Run once per day (5 AM IST). Make ONE vertical animated Short (30-36 s, 1080x1920, voiceless, English) and publish it PUBLIC to YouTube @whynow.explained (UCS9anNT_AwGf_mL6TqNhRQg) and Instagram @whynow.studio (vidIQ platformAccountId 29609371458753687). The owner pre-approved public auto-publishing for these daily runs. Do not ask questions.

## 0. Guard against duplicates
- `git pull`; if `videos/<today>_*.md` already has "Published", stop and report "already posted".
- `vidiq_social_post_list`: if a post started today (IST) exists, stop.

## 1. Setup (skip what already exists)
- Repo at /home/claude/whynow-studio (push works). Kit at /home/claude/kit (clone Jockey12https/whynow-assets if missing; generator falls back without it).
- `python3 -c "import playwright,numpy,PIL"`, else `pip install --break-system-packages playwright numpy pillow && python3 -m playwright install chromium`. `export WHYNOW_KIT=/home/claude/kit`.

## 2. Topic
Odd day = trending news (global/India/business/tech/politics, neutral), even day = evergreen "why does X work like this". WebSearch for what people are reading; avoid topics in videos/*.md. Every on-screen claim confirmed by 3+ independent sources; hedge allegations ("France blames", "reportedly"); include the other side's response. Generic characters only. If nothing verifies, choose another topic.

## 3. Scene
Copy the structure of `generator/scenes/2026-11-17_fridge_hack.js` (+ .sfx.json): hook on frame 0, one idea per scene, cuts every 4-7 s, mascot host clear of text, text in x 60-1020 / y 250-1500, end card with cap(), Sources line, FOLLOW FOR MORE, @whynow.explained. Note: lib `mix(c, n, k)` blends toward a NUMBER (255/0); to blend two colours use a local lerpC.

## 4. Render
`cd generator && python3 -I make_video.py scenes/X.js scenes/X.sfx.json /home/claude/out/short.mp4 45,240,...` → contact sheet → Read it → fix overlaps. Full render (~70 s). ffprobe 1080x1920 h264+aac 30-36 s; max_volume under -0.5 dB.

## 5. Metadata
`videos/YYYY-MM-DD_slug.md`: YouTube title (<=70, #Shorts), description + Sources URLs + hashtags, 8-12 tags, IG caption (hook in first 125 chars, sources by name, <=5 hashtags), fact sheet.

## 6. Publish
Copy mp4 into videos/, commit, push. `vidiq_video_upload` url = raw.githubusercontent.com/Jockey12https/whynow-studio/main/videos/<file>. One `vidiq_social_post_draft_create` (YOUTUBE public, categoryId 27, title, text, tags; INSTAGRAM caption), `vidiq_social_post_publish`, poll `vidiq_social_post_status`; retry a failed destination once.

## 7. Finish
git rm the mp4, add links to the .md, commit, push. Report title + both links to the owner.

Never use Metricool, Windsor.ai, Google Drive or anything ASCENDIO. Never change account settings, bios, comments or other videos.
