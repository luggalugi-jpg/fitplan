"""Bereitet ein Übungsvideo für die App auf: auf die Figur zuschneiden, Schleifen-Naht weich überblenden,
Tempo anpassen, als animiertes WebP speichern.
Aufruf: python3 videoopt.py eingabe.mp4 ausgabe.webp [--breite=440] [--tempo=0.7] [--q=58] [--rand=0.06]"""
import sys, cv2, numpy as np
from PIL import Image
src, out = sys.argv[1:3]; opt = dict(a.lstrip('-').split('=') for a in sys.argv[3:])
B = int(opt.get('breite', 440)); TEMPO = float(opt.get('tempo', .7)); Q = int(opt.get('q', 58)); RAND = float(opt.get('rand', .06))
c = cv2.VideoCapture(src); fps = c.get(cv2.CAP_PROP_FPS) or 24; fr = []
while True:
    ok, f = c.read()
    if not ok: break
    fr.append(f)
h, w = fr[0].shape[:2]
# Ausschnitt: alles, was deutlich dunkler als der Hintergrund ist (Figur und Gerät, ohne weichen Schatten)
x0 = y0 = 10**9; x1 = y1 = 0
for f in fr:
    ys, xs = np.where(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) < 150)
    if len(xs): x0, x1, y0, y1 = min(x0, xs.min()), max(x1, xs.max()), min(y0, ys.min()), max(y1, ys.max())
bw, bh = x1 - x0, y1 - y0; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
ch = min(h, bh * (1 + 2 * RAND)); cw = min(w, max(bw * (1 + 2 * RAND), ch * 1.0)); ch = min(h, max(ch, cw / 1.25))
X = int(round(min(max(cx - cw / 2, 0), w - cw))); Y = int(round(min(max(cy - ch / 2, 0), h - ch))); cw, ch = int(cw), int(ch)
fr = [f[Y:Y+ch, X:X+cw] for f in fr]
# Naht: die letzten Bilder weich in das erste überblenden
n = len(fr); k = min(5, n // 6)
for i in range(k):
    t = (i + 1) / (k + 1); j = n - k + i
    fr[j] = cv2.addWeighted(fr[j], 1 - t, fr[0], t, 0)
H = int(round(B * ch / cw))
pil = [Image.fromarray(cv2.cvtColor(cv2.resize(f, (B, H), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)) for f in fr]
dauer = int(round(1000 / fps / TEMPO))
pil[0].save(out, save_all=True, append_images=pil[1:], duration=dauer, loop=0, quality=Q, method=6)
import os; print(out, os.path.getsize(out) // 1024, 'KB,', n, 'Bilder je', dauer, 'ms,', (B, H), 'Ausschnitt', (X, Y, cw, ch))
