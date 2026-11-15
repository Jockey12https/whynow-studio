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
js=PRE+open(os.path.join(HERE,'lib.js')).read()+"\n"+open(scene).read()
work=tempfile.mkdtemp(prefix='frames_')
HTML='<html><body style="margin:0;width:1080px;height:1920px;overflow:hidden;font-family:Inter,sans-serif"><div id="s" style="position:relative;width:1080px;height:1920px;overflow:hidden"></div></body></html>'
def run(args):
    idxs=args
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':1080,'height':1920})
        pg.set_content(HTML); pg.add_script_tag(content=js)
        for i in idxs:
            pg.evaluate(f"document.getElementById('s').innerHTML = draw({i/FPS})")
            pg.evaluate("Promise.all([...document.images].map(im=>im.decode().catch(()=>0)))")
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
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(FPS),'-i',f'{work}/f%04d.jpg','-i',wav,'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',out],check=True)
    shutil.rmtree(work); print('done',out)
