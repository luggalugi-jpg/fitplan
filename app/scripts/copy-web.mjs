// Kopiert die Web-App aus dem Repo-Hauptordner nach app/www.
// essensplan.html wird zu index.html (Startseite der App). Der Service Worker
// und die Web-Installationsdateien werden in der App nicht gebraucht.
import { mkdirSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = dirname(dirname(fileURLToPath(import.meta.url)));
const quelle = dirname(app);
const ziel = join(app, "www");
const dateien = [
  ["essensplan.html", "index.html"],
  ["rezepte.js", "rezepte.js"],
  ["trainingssysteme.js", "trainingssysteme.js"],
  ["laufplaene.js", "laufplaene.js"],
  ["uebungen.js", "uebungen.js"],
];

rmSync(ziel, { recursive: true, force: true });
mkdirSync(ziel, { recursive: true });
for (const [von, nach] of dateien) {
  const pfad = join(quelle, von);
  if (!existsSync(pfad)) {
    console.error("Fehlt: " + von + " – liegt die Web-App im Hauptordner des Repos?");
    process.exit(1);
  }
  copyFileSync(pfad, join(ziel, nach));
  console.log("kopiert: " + von + " -> www/" + nach);
}
