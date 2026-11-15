import sys, json, numpy as np, wave
cfg=json.load(open(sys.argv[1])); out=sys.argv[2]
sr=44100; D=cfg['duration']; a=np.zeros(int(sr*D)+sr); rng=np.random.default_rng(1)
def env(n,att=0.01,dec=None):
    t=np.arange(n)/sr; return np.minimum(t/att,1)*np.exp(-t/(dec or n/sr/4))
def whoosh(d=0.5):
    n=int(sr*d); x=rng.standard_normal(n); o=np.zeros(n); y=0
    for i in range(n):
        k=0.02+0.5*(i/n)**2; y+=k*(x[i]-y); o[i]=y
    return o*np.sin(np.pi*np.linspace(0,1,n))**1.5*3
def pop(f=520):
    n=int(sr*0.18); t=np.arange(n)/sr; return np.sin(2*np.pi*(f+400*np.exp(-t*30))*t)*env(n,0.002,0.05)
def thud(f=70):
    n=int(sr*0.6); t=np.arange(n)/sr; return np.sin(2*np.pi*(f+80*np.exp(-t*20))*t)*env(n,0.002,0.15)+0.3*rng.standard_normal(n)*env(n,0.001,0.03)
def tick():
    n=int(sr*0.04); t=np.arange(n)/sr; return np.sin(2*np.pi*1800*t)*env(n,0.001,0.01)
def ping(f=1320):
    n=int(sr*0.8); t=np.arange(n)/sr; return np.sin(2*np.pi*f*t)*env(n,0.002,0.25)
def alarm():
    n=int(sr*0.9); t=np.arange(n)/sr; f=np.where((t*6)%1<0.5,880,660); return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-t*2.5)*0.4
def riser(d=2.6):
    n=int(sr*d); t=np.arange(n)/sr; f=200+900*(t/d)**2; return np.sin(2*np.pi*np.cumsum(f)/sr)*(t/d)**2*0.5
K={'thud':thud,'whoosh':whoosh,'pop':pop,'tick':tick,'ping':ping,'alarm':alarm,'riser':riser}
for e in cfg['events']:
    x=K[e['kind']](*e.get('args',[])); i=int(e['t']*sr)
    if i<len(a): a[i:i+len(x)]+=x[:len(a)-i]*e.get('gain',0.5)
a=a[:int(sr*D)]; a=a/max(np.max(np.abs(a)),1e-6)*0.85
w=wave.open(out,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((a*32767).astype(np.int16).tobytes()); w.close()
