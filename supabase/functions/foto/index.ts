// GainPilot – Foto-Analyse über einen gemeinsamen Gemini-Schlüssel.
// Der Schlüssel liegt nur hier als Secret GEMINI_API_KEY, nie in der App.
// Begrenzung: FOTO_LIMIT_TAG Analysen pro Gerät und Tag, FOTO_LIMIT_GESAMT für alle zusammen.
const KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const SB_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PRO_GERAET = Number(Deno.env.get("FOTO_LIMIT_TAG") ?? "15");
const GESAMT = Number(Deno.env.get("FOTO_LIMIT_GESAMT") ?? "500");
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const antwort = (status: number, daten: unknown) =>
  new Response(JSON.stringify(daten), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const fehler = (status: number, message: string, art = "") => antwort(status, { error: { message, status: art } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fehler(405, "Nur POST");
  if (!KEY) return fehler(500, "Foto-Analyse ist auf dem Server nicht eingerichtet (API key fehlt).");
  const text = await req.text();
  if (text.length > 2_000_000) return fehler(413, "Das Bild ist zu groß.");
  let anfrage: { model?: string; geraet?: string; body?: unknown };
  try { anfrage = JSON.parse(text); } catch { return fehler(400, "Ungültige Anfrage"); }
  const model = String(anfrage.model ?? "");
  const geraet = String(anfrage.geraet ?? "");
  if (!/^gemini-[a-z0-9.\-]{1,60}$/.test(model)) return fehler(400, "Unbekanntes Modell");
  if (!/^[A-Za-z0-9.\-]{8,64}$/.test(geraet)) return fehler(400, "Ungültige Geräte-Kennung");
  if (!anfrage.body || typeof anfrage.body !== "object") return fehler(400, "Ungültige Anfrage");

  // Zähler in der Datenbank (Funktion foto_zaehlen, siehe supabase/foto.sql)
  const z = await fetch(SB_URL + "/rest/v1/rpc/foto_zaehlen", {
    method: "POST",
    headers: { apikey: SB_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ p_geraet: geraet, p_max: PRO_GERAET, p_gesamt: GESAMT }),
  });
  if (!z.ok) return fehler(503, "Die Foto-Analyse ist gerade nicht verfügbar.");
  const erlaubt = await z.json();
  if (erlaubt !== true) {
    return fehler(429, "Du hast heute alle " + PRO_GERAET + " Foto-Analysen genutzt. Morgen geht es weiter. Bis dahin kannst du die Datenbank nutzen.", "LIMIT");
  }

  const g = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
    { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": KEY }, body: JSON.stringify(anfrage.body) },
  );
  return new Response(await g.text(), { status: g.status, headers: { ...CORS, "Content-Type": "application/json" } });
});
