const fs=require('fs');const out={};
for(const f of ['rz-names.json','rz-sent.json','rz-extra.json','rz-neu.json'])if(fs.existsSync(f))Object.assign(out,JSON.parse(fs.readFileSync(f,'utf8')));
fs.writeFileSync('/home/claude/fitplan/rezepte-en.js','// GainPilot – Rezepte auf Englisch (Namen und Zubereitung). Erzeugt aus /i18n.\nwindow.GP_EN_REZ='+JSON.stringify(out)+';\n');
console.log(Object.keys(out).length,'Einträge',fs.statSync('/home/claude/fitplan/rezepte-en.js').size,'Bytes');
