# Alejandro Ruiz — Acupuntura y Osteopatía

Site static de prezentare + sistem de programări. Fără build, fără dependințe de instalat:
sunt fișiere HTML/CSS/JS care merg direct pe GitHub Pages.

```
index.html        pagina principală (hero, servicii, metodă, despre, recenzii, formular, FAQ)
agenda.html       zona privată a lui Alejandro: vede/confirmă/anulează programări
legal.html        aviso legal + politică de confidențialitate (șablon RGPD/LOPDGDD)
js/config.js      ⇦ SINGURUL fișier de editat: telefon, adresă, orar, servicii, prețuri
js/main.js        logica paginii publice + formularul de programare
js/agenda.js      logica agendei private
js/db.js          conexiunea la baza de date (opțională)
css/styles.css    tot designul
assets/           logo, monogramă, banner (copiate din SVG-urile originale)
supabase/schema.sql  scriptul de bază de date
```

---

## 1. Vizualizare locală

```bash
cd SALON_ALEX
python3 -m http.server 8000
# deschide http://localhost:8000
```

(Deschis direct cu dublu-click pe `index.html` merge și el, dar serverul e mai fidel.)

---

## 2. Publicare pe GitHub Pages

```bash
cd SALON_ALEX
git init
git add .
git commit -m "Sitio web Alejandro Ruiz"
git branch -M main
git remote add origin https://github.com/USUARIO/REPO.git
git push -u origin main
```

Apoi în repo: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
În ~1 minut site-ul e live la `https://USUARIO.github.io/REPO/`.

Fișierul `.nojekyll` e deja inclus (evită probleme cu procesarea Jekyll).

---

## 3. Ce trebuie completat înainte de publicare

Totul e în [js/config.js](js/config.js):

| Câmp | Stare |
|---|---|
| `telefono` / `telefonoLink` / `whatsapp` | ✅ **+34 664 49 38 38** (real) |
| `email` | ⚠️ placeholder |
| `direccion`, `codigoPostal`, `mapsQuery`, `ciudad` | ⚠️ placeholder |
| `instagram` | gol = butonul e ascuns |
| `servicios` (prețuri, durate, descrieri) | ⚠️ estimative — de confirmat cu el |
| `horario` + `franjas` | ⚠️ presupuse L–V 9–14 / 16–20, S 9–14 |
| `testimonios` | ⚠️ exemple — de înlocuit cu recenzii reale |
| datele din `legal.html` (NIF, adresă) | ⚠️ între paranteze drepte |

Textele „+12 años de práctica” din hero și lista de formări din secțiunea *Sobre mí*
sunt tot presupuneri — se editează direct în `index.html`.

---

## 4. Programări online (opțional, gratuit)

**Fără configurare** site-ul funcționează deja: formularul validează datele și trimite
cererea pre-completată pe WhatsApp la numărul din config. Zero date stocate.

**Cu Supabase** (plan gratuit) cererile se salvează într-o agendă pe care doar Alejandro
o vede, orele deja ocupate dispar automat din formular, iar el poate adăuga manual
programările primite prin telefon.

Pași:

1. Cont pe [supabase.com](https://supabase.com) → **New project** → regiune **EU (Frankfurt / Ireland)**
   — important pentru RGPD.
2. **SQL Editor** → lipește tot conținutul din [supabase/schema.sql](supabase/schema.sql) → **Run**.
3. **Authentication → Users → Add user**: creează contul lui Alejandro (email + parolă).
   Acesta e login-ul pentru `agenda.html`.
4. **Authentication → Providers → Email**: dezactivează *Enable signup*, ca să nu se poată
   înregistra altcineva.
5. **Project Settings → API**: copiază `Project URL` și cheia `anon public` în `js/config.js`:

```js
supabase: {
  url: "https://xxxxxxxx.supabase.co",
  anonKey: "eyJhbGciOi..."
}
```

Cheia `anon` e publică prin design — nu e o parolă. Accesul e limitat de politicile din
`schema.sql`: publicul **nu poate citi** niciun rând din tabel, poate doar să insereze o
cerere printr-o funcție validată, iar lista orelor ocupate returnează exclusiv data și ora,
fără nume sau telefon.

> Notă: proiectele Supabase gratuite se suspendă după ~7 zile de inactivitate totală și se
> reactivează din dashboard cu un click. Pentru o consultă activă zilnic nu e o problemă.

---

## 5. Legal (Spania)

- `legal.html` e un **șablon** cu aviso legal, politică de confidențialitate și cookies,
  aliniat la RGPD, LOPDGDD și LSSI. Trebuie completate NIF-ul și adresa reală.
- Formularul cere consimțământ explicit bifat, nu are casete pre-bifate, și avertizează
  să nu se scrie detalii clinice în câmpul de observații.
- Site-ul **nu** folosește cookies de analiză sau publicitate, deci nu are nevoie de banner
  de cookies. Dacă mai târziu se adaugă Google Analytics, va fi nevoie de unul.
- Textele evită promisiuni de vindecare și includ avertisment sanitar — cerință a
  reglementărilor spaniole de publicitate sanitară.
- Dacă are număr de colegiat / autorizație sanitară a centrului, e recomandat să apară în
  footer și în aviso legal.
