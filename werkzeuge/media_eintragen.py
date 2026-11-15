#!/usr/bin/env python3
"""Trägt alle Videos aus uebungen/*.mp4 in UEB_MEDIA (uebungen.js) und die
Vorschaubilder in die Cache-Liste von sw.js ein.

Aufruf:  python3 werkzeuge/media_eintragen.py [neue_version]
Mit neue_version (z. B. 3.29) werden außerdem PUBLIC_V, uebungen.js?v= und die
Service-Worker-Cache-Version hochgezählt.
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UEB = os.path.join(ROOT, "uebungen")

def namen():
    d = json.loads(subprocess.check_output(
        [sys.executable, os.path.join(ROOT, "werkzeuge", "video_prompts.py"), "video", "0", "999"]))
    m = {x["datei"]: x["name"] for x in d}
    m["bankdruecken"] = "Bankdrücken"
    return m

def main():
    m = namen()
    eintraege, poster = [], []
    for datei, name in sorted(m.items(), key=lambda kv: kv[1]):
        mp4 = os.path.join(UEB, datei + ".mp4")
        if os.path.exists(mp4):
            e = {"v": f"uebungen/{datei}.mp4"}
            if os.path.exists(os.path.join(UEB, datei + ".jpg")):
                e["p"] = f"uebungen/{datei}.jpg"
                poster.append(f"./uebungen/{datei}.jpg")
            eintraege.append((name, e))
        elif os.path.exists(os.path.join(UEB, datei + ".webp")):
            eintraege.append((name, {"a": f"uebungen/{datei}.webp"}))
            poster.append(f"./uebungen/{datei}.webp")
    block = "window.UEB_MEDIA={\n" + ",\n".join(
        json.dumps(n, ensure_ascii=False) + ":" + "{" + ",".join(f'{k}:"{v}"' for k, v in e.items()) + "}"
        for n, e in eintraege) + "\n};"

    p = os.path.join(ROOT, "uebungen.js")
    s = open(p, encoding="utf-8").read()
    s = re.sub(r"window\.UEB_MEDIA=\{.*?\n\};", lambda _: block, s, flags=re.S)
    open(p, "w", encoding="utf-8").write(s)

    p = os.path.join(ROOT, "sw.js")
    s = open(p, encoding="utf-8").read()
    s = re.sub(r'\s*"\./uebungen/[^"]+",?', "", s)          # alte Medien-Einträge raus
    neu = "".join(f'"{x}",' for x in poster)
    s = s.replace('"./manifest.json"', neu + '"./manifest.json"', 1)

    if len(sys.argv) > 1:
        v = sys.argv[1]
        s = re.sub(r"uebungen\.js\?v=[\d.]+", f"uebungen.js?v={v}", s)
        s = re.sub(r'const CACHE = "fitplan-v(\d+)"', lambda mm: f'const CACHE = "fitplan-v{int(mm.group(1)) + 1}"', s)
        h = os.path.join(ROOT, "essensplan.html")
        t = open(h, encoding="utf-8").read()
        t = re.sub(r"uebungen\.js\?v=[\d.]+", f"uebungen.js?v={v}", t)
        t = re.sub(r'const PUBLIC_V="[0-9.]+"', f'const PUBLIC_V="{v}"', t)
        open(h, "w", encoding="utf-8").write(t)
    open(p, "w", encoding="utf-8").write(s)
    print(f"{len(eintraege)} Übungen mit Medien eingetragen")

if __name__ == "__main__":
    main()
