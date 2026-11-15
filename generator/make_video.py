"""Usage: python3 -I make_video.py <scene.js> <sfx_events.json> <out.mp4> [only_frames_csv]
Combines lib.js + scene.js (must define const DUR and function draw(t)), renders 1080x1920@30 with Playwright
(2 workers), makes SFX, muxes with ffmpeg."""
import sys, os, json, subprocess, tempfile, shutil
from concurrent.futures import ProcessPoolExecutor
HERE=os.path.dirname(os.path.abspath(__file__))
scene, sfxj, out = sys.argv[1], sys.argv[2], sys.argv[3]
only = [int(x) for x in sys.argv[4].split(',')] if len(sys.argv)>4 else None
FPS=30
import base64, glob
ASSETS={os.path.splitext(os.path.basename(f))[0]:base64.b64encode(open(f,'rb').read()).decode() for f in glob.glob(os.path.join(HERE,'assets','*.png'))}
PRE="const ASSET_B64="+json.dumps(ASSETS)+";\nconst ASSETS={};\nfor(const k in ASSET_B64){const bin=atob(ASSET_B64[k]);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);ASSETS[k]=URL.createObjectURL(new Blob([u],{type:'image/png'}));}\n"
def _kit():
    for c in [os.environ.get('WHYNOW_KIT'), os.path.join(HERE,'..','kit'), '/home/claude/kit', '/home/claude/assets10k/Claude Edit Asset']:
        if c and os.path.isdir(os.path.join(c,'01 SFX')): return os.path.abspath(c)
    return None
KIT=_kit(); os.environ['WHYNOW_KIT']=KIT or ''
FD=os.path.join(HERE,'fonts')
def _ff(fam,fn,w,style='normal'):
    f=os.path.join(FD,fn)
    if not os.path.exists(f): return ''
    return "@font-face{font-family:'%s';font-weight:%s;font-style:%s;src:url(data:font/ttf;base64,%s)}"%(fam,w,style,base64.b64encode(open(f,'rb').read()).decode())
FONTCSS=''.join([_ff('Inter','Inter-Variable.ttf','400'),_ff('Inter','Inter-Variable.ttf','600'),_ff('Inter','InterDisplay-Medium.ttf','500'),_ff('Inter','InterDisplay-Bold.ttf','700'),_ff('Inter','InterDisplay-ExtraBold.ttf','800'),_ff('Inter','InterDisplay-Black.ttf','900'),_ff('Instrument Serif','InstrumentSerif-Italic.ttf','400','italic')])
POST="\nif (typeof PUNCHES !== 'undefined') { const __d = draw; draw = function (t) { return camera(__d(t), t, PUNCHES); }; }\n"
js=PRE+open(os.path.join(HERE,'lib.js')).read()+"\n"+open(scene).read()+POST
work=tempfile.mkdtemp(prefix='frames_')
HTML='<html><head><style>'+FONTCSS+'</style></head><body style="margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Inter,sans-serif"><div id="s" style="position:relative;width:1080px;height:1920px;overflow:hidden"></div></body></html>'
def run(args):
    idxs=args
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':1080,'height':1920})
        pg.set_content(HTML); pg.add_script_tag(content=js)
        for i in idxs:
            pg.evaluate(f"document.getElementById('s').innerHTML = draw({i/FPS})")
            pg.evaluate("Promise.all([document.fonts.ready, ...[...document.images].map(im=>im.decode().catch(()=>0))])")
            pg.screenshot(path=f'{work}/f{i:04d}.jpg',type='jpeg',quality=88)
        b.close()
    return len(idxs)
if __name__=='__main__':
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(); pg.set_content(HTML); pg.add_script_tag(content=js); DUR=pg.evaluate('DUR'); b.close()
    n=int(DUR*FPS); idx=only if only else list(range(n))
    parts=[idx[0::2],idx[1::2]]
    with ProcessPoolExecutor(2) as ex: list(ex.map(run,parts))
    if only: print('frames in',work); sys.exit(0)
    wav=os.path.join(work,'sfx.wav'); subprocess.run([sys.executable,'-I',os.path.join(HERE,'sfx.py'),sfxj,wav],check=True)
    cfg=json.load(open(sfxj)); ov=[o for o in cfg.get('overlays',[]) if KIT and os.path.isfile(os.path.join(KIT,o['file']))]
    cmd=['ffmpeg','-y','-loglevel','error','-framerate',str(FPS),'-i',f'{work}/f%04d.jpg','-i',wav]
    for o in ov: cmd+=['-i',os.path.join(KIT,o['file'])]
    if ov:
        # white overlays (screen blend): build a black canvas, drop each overlay clip on it at its time, then screen it over the video
        fc=f"color=c=black:s=1080x1920:r={FPS}:d={DUR}[b0];"
        for k,o in enumerate(ov): fc+=f"[{k+2}:v]setpts=PTS-STARTPTS+{o['t']}/TB[o{k}];"
        for k,o in enumerate(ov): fc+=f"[b{k}][o{k}]overlay=eof_action=pass:enable='gte(t,{o['t']})'[b{k+1}];"
        fc+=f"[0:v]format=gbrp[v];[b{len(ov)}]format=gbrp[w];[v][w]blend=all_mode=screen:shortest=1,format=yuv420p[vo]"
        cmd+=['-filter_complex',fc,'-map','[vo]','-map','1:a']
    cmd+=['-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',out]
    subprocess.run(cmd,check=True)
    shutil.rmtree(work); print('done',out)
