# AI Game Lab — Progetto Live Coding

## Contesto
Questo è un progetto di live coding per una lezione scolastica sull'intelligenza artificiale. Il gioco viene costruito in tempo reale davanti a una classe di studenti, usando Claude Code. Ogni modifica viene pubblicata automaticamente su Vercel.

## Regole del progetto

### Tecnologie
- **HTML5, CSS3, JavaScript vanilla** — niente framework, niente build step, niente dipendenze npm
- Il gioco deve funzionare aprendo direttamente `index.html` in un browser
- Tutto il codice del gioco va in una **singola pagina** (`index.html`) oppure in file separati (`style.css`, `game.js`) nella root del progetto
- **Non** usare TypeScript, React, Vue, Svelte o qualsiasi altro framework
- **Non** aggiungere `package.json`, `node_modules`, o processi di build

### Struttura file
```
/
├── index.html      ← pagina principale del gioco
├── style.css       ← stili (opzionale, può essere inline)
├── game.js         ← logica del gioco (opzionale, può essere inline)
├── CLAUDE.md       ← questo file
└── README.md       ← descrizione del progetto
```

### Design
- Sfondo scuro (#1a1a2e o simile)
- Colori vivaci e moderni per gli elementi di gioco
- Font leggibile (system fonts o Google Fonts via CDN)
- Il gioco deve essere **responsive** e funzionare su mobile
- Aggiungere **controlli touch** (swipe o bottoni su schermo) oltre ai controlli da tastiera
- L'interfaccia deve essere in **italiano**

### Git workflow
- Lavorare sempre sul branch `main`
- Fare commit direttamente su `main`
- Fare push dopo ogni modifica significativa (così Vercel deploya automaticamente)
- Messaggi di commit chiari e in italiano (es. "Aggiunto punteggio e game over")
- **Non** creare branch, **non** aprire pull request — push diretto su main

### Qualità
- Il gioco deve funzionare senza errori nella console del browser
- Testare sempre dopo ogni modifica significativa
- Se qualcosa si rompe, fixare prima di procedere
- Il codice deve essere leggibile e ben commentato in italiano
