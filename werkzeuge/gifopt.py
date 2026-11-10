"""Optimiert ein Übungs-GIF: Bilder aufeinander ausrichten (kein Springen), Zwischenbilder berechnen
(flüssiger), Info-Bild abtrennen, als kleine WebP-Schleife speichern.
Aufruf: python3 gifopt.py eingabe.gif ausgabe-ordner name [--info=letztes|kein] [--zwischen=3]"""
import sys, os, cv2, numpy as np
from PIL import Image
src, outdir, name = sys.argv[1:4]
opt = dict(a.lstrip('-').split('=') for a in sys.argv[4:])
ZW = int(opt.get('zwischen', 3)); INFO = opt.get('info', 'auto')
im = Image.open(src); frames = []
for i in range(im.n_frames):
    im.seek(i); frames.append(cv2.cvtColor(np.array(im.convert('RGB')), cv2.COLOR_RGB2BGR))
# Info-Bild erkennen: weicht stark von allen anderen ab
def klein(f): return cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (64, 64)).astype(np.float32)
info = None
if INFO != 'kein' and len(frames) > 3:
    k = [klein(f) for f in frames]
    d_last = np.mean(np.abs(k[-1] - k[-2])); d_typ = np.median([np.mean(np.abs(k[i] - k[i+1])) for i in range(len(k)-2)])
    if INFO == 'letztes' or d_last > 2.2 * d_typ: info = frames.pop()
h, w = frames[0].shape[:2]
# 1) Ausrichten auf ein mittleres Bild anhand fester Bildteile (Hintergrund, Bank)
orb = cv2.ORB_create(3000); bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
ref = len(frames) // 2; g = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in frames]
kp_r, de_r = orb.detectAndCompute(g[ref], None)
M = []; 
for i, f in enumerate(frames):
    if i == ref: M.append(np.float32([[1,0,0],[0,1,0]])); continue
    kp, de = orb.detectAndCompute(g[i], None); m = bf.match(de, de_r)
    a = np.float32([kp[x.queryIdx].pt for x in m]); b = np.float32([kp_r[x.trainIdx].pt for x in m])
    T, inl = cv2.estimateAffinePartial2D(a, b, method=cv2.RANSAC, ransacReprojThreshold=2.5)
    s = np.hypot(T[0,0], T[0,1]) if T is not None else 0
    ok = T is not None and inl.sum() >= 25 and 0.85 < s < 1.18 and abs(T[0,2]) < w*.2 and abs(T[1,2]) < h*.2
    print(f"Bild {i}: {'ausgerichtet' if ok else 'unverändert'} (Treffer {int(inl.sum()) if T is not None else 0}, Zoom {s:.3f}, dx {T[0,2]:.1f}, dy {T[1,2]:.1f})" if T is not None else f"Bild {i}: unverändert")
    M.append(T.astype(np.float32) if ok else np.float32([[1,0,0],[0,1,0]]))
al = [cv2.warpAffine(f, M[i], (w, h), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE) for i, f in enumerate(frames)]
# gemeinsamer Ausschnitt ohne Ränder
mask = np.ones((h, w), np.uint8) * 255; valid = mask.copy()
for T in M: valid &= cv2.warpAffine(mask, T, (w, h))
ys, xs = np.where(valid > 0); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
# größtes Rechteck grob: Ränder einziehen, bis alles gültig ist
while (valid[y0:y1, x0:x1] == 0).any() and x1 - x0 > w * .7:
    x0 += 1; x1 -= 1; y0 += 1; y1 -= 1
al = [f[y0:y1, x0:x1] for f in al]
# 2) leichte Entrauschung der GIF-Farbraster
al = [cv2.bilateralFilter(f, 5, 28, 5) for f in al]
# 3) Zwischenbilder per Bewegungsfluss (in der Schleife: letztes -> erstes)
def zwischen(a, b, t):
    ga, gb = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM); dis.setFinestScale(1); dis.setVariationalRefinementIterations(12)
    fab = cv2.GaussianBlur(dis.calc(ga, gb, None), (0, 0), 11); fba = cv2.GaussianBlur(dis.calc(gb, ga, None), (0, 0), 11)
    hh, ww = ga.shape; gx, gy = np.meshgrid(np.arange(ww, dtype=np.float32), np.arange(hh, dtype=np.float32))
    wa = cv2.remap(a, gx + fba[...,0]*0 - fab[...,0]*t, gy - fab[...,1]*t, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    wb = cv2.remap(b, gx - fba[...,0]*(1-t), gy - fba[...,1]*(1-t), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return cv2.addWeighted(wa, 1-t, wb, t, 0)
out = []
n = len(al)
for i in range(n):
    a, b = al[i], al[(i+1) % n]; out.append(a)
    for k in range(1, ZW + 1): out.append(zwischen(a, b, k / (ZW + 1)))
dauer = int(round((im.info.get('duration', 350)) / (ZW + 1)))
os.makedirs(outdir, exist_ok=True)
pil = [Image.fromarray(cv2.cvtColor(f, cv2.COLOR_BGR2RGB)) for f in out]
p = os.path.join(outdir, name + '.webp')
pil[0].save(p, save_all=True, append_images=pil[1:], duration=dauer, loop=0, quality=int(opt.get('q', 62)), method=6)
print('Animation:', p, os.path.getsize(p)//1024, 'KB,', len(pil), 'Bilder je', dauer, 'ms,', pil[0].size)
if info is not None:
    pi = os.path.join(outdir, name + '-muskeln.webp'); Image.fromarray(cv2.cvtColor(info, cv2.COLOR_BGR2RGB)).save(pi, quality=78, method=6)
    print('Info-Bild:', pi, os.path.getsize(pi)//1024, 'KB')
