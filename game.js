// ============================================================
// AI Game Lab — Gioco Bandiere (stile Fruit Ninja)
// ============================================================

// --- DATI BANDIERE PER CONTINENTE ---
const BANDIERE = {
    'Europa': [
        { emoji: '🇮🇹', nome: 'Italia' },
        { emoji: '🇫🇷', nome: 'Francia' },
        { emoji: '🇩🇪', nome: 'Germania' },
        { emoji: '🇪🇸', nome: 'Spagna' },
        { emoji: '🇵🇹', nome: 'Portogallo' },
        { emoji: '🇬🇧', nome: 'Regno Unito' },
        { emoji: '🇳🇱', nome: 'Olanda' },
        { emoji: '🇧🇪', nome: 'Belgio' },
        { emoji: '🇨🇭', nome: 'Svizzera' },
        { emoji: '🇦🇹', nome: 'Austria' },
        { emoji: '🇸🇪', nome: 'Svezia' },
        { emoji: '🇳🇴', nome: 'Norvegia' },
        { emoji: '🇩🇰', nome: 'Danimarca' },
        { emoji: '🇵🇱', nome: 'Polonia' },
        { emoji: '🇬🇷', nome: 'Grecia' },
        { emoji: '🇷🇴', nome: 'Romania' },
        { emoji: '🇨🇿', nome: 'Rep. Ceca' },
        { emoji: '🇭🇺', nome: 'Ungheria' },
    ],
    'Americhe': [
        { emoji: '🇺🇸', nome: 'USA' },
        { emoji: '🇨🇦', nome: 'Canada' },
        { emoji: '🇲🇽', nome: 'Messico' },
        { emoji: '🇧🇷', nome: 'Brasile' },
        { emoji: '🇦🇷', nome: 'Argentina' },
        { emoji: '🇨🇱', nome: 'Cile' },
        { emoji: '🇨🇴', nome: 'Colombia' },
        { emoji: '🇵🇪', nome: 'Perù' },
        { emoji: '🇨🇺', nome: 'Cuba' },
        { emoji: '🇯🇲', nome: 'Giamaica' },
        { emoji: '🇻🇪', nome: 'Venezuela' },
    ],
    'Asia': [
        { emoji: '🇨🇳', nome: 'Cina' },
        { emoji: '🇯🇵', nome: 'Giappone' },
        { emoji: '🇰🇷', nome: 'Corea del Sud' },
        { emoji: '🇮🇳', nome: 'India' },
        { emoji: '🇹🇭', nome: 'Thailandia' },
        { emoji: '🇻🇳', nome: 'Vietnam' },
        { emoji: '🇮🇩', nome: 'Indonesia' },
        { emoji: '🇸🇦', nome: 'Arabia Saudita' },
        { emoji: '🇹🇷', nome: 'Turchia' },
        { emoji: '🇵🇭', nome: 'Filippine' },
        { emoji: '🇲🇾', nome: 'Malesia' },
        { emoji: '🇸🇬', nome: 'Singapore' },
        { emoji: '🇵🇰', nome: 'Pakistan' },
    ],
    'Africa': [
        { emoji: '🇿🇦', nome: 'Sud Africa' },
        { emoji: '🇳🇬', nome: 'Nigeria' },
        { emoji: '🇰🇪', nome: 'Kenya' },
        { emoji: '🇪🇬', nome: 'Egitto' },
        { emoji: '🇲🇦', nome: 'Marocco' },
        { emoji: '🇬🇭', nome: 'Ghana' },
        { emoji: '🇪🇹', nome: 'Etiopia' },
        { emoji: '🇹🇿', nome: 'Tanzania' },
        { emoji: '🇸🇳', nome: 'Senegal' },
        { emoji: '🇨🇮', nome: 'Costa d\'Avorio' },
    ],
    'Oceania': [
        { emoji: '🇦🇺', nome: 'Australia' },
        { emoji: '🇳🇿', nome: 'Nuova Zelanda' },
        { emoji: '🇫🇯', nome: 'Fiji' },
        { emoji: '🇵🇬', nome: 'Papua N.G.' },
        { emoji: '🇼🇸', nome: 'Samoa' },
        { emoji: '🇹🇴', nome: 'Tonga' },
    ],
};

const CONTINENTI = Object.keys(BANDIERE);

const DURATA_ROUND = 60;       // secondi
const TAGLI_PER_CAMBIO = 6;    // cambia obiettivo ogni N tagli corretti

// --- STATO DI GIOCO ---
let stato = {
    schermata: 'landing',
    punti: 0,
    vite: 3,
    tempoRimasto: DURATA_ROUND,
    intervalloTimer: null,
    timeoutSpawn: null,
    flagAttive: [],
    effetti: [],
    trailPoints: [],
    obiettivoContinente: '',
    tagliCorrettiObiettivo: 0,
    rafId: null,
    ultimoTimestamp: 0,
};

// --- CANVAS DI GIOCO ---
const gameCanvas = document.getElementById('game-canvas');
const gctx = gameCanvas.getContext('2d');

function ridimensionaCanvas() {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
}

// --- CREAZIONE BANDIERA ---
function nuovaBandiera() {
    // 50% probabilità di essere del continente obiettivo
    const isTarget = Math.random() < 0.5;
    const altriContinenti = CONTINENTI.filter(c => c !== stato.obiettivoContinente);
    const continente = isTarget
        ? stato.obiettivoContinente
        : altriContinenti[Math.floor(Math.random() * altriContinenti.length)];

    const lista = BANDIERE[continente];
    const bandiera = lista[Math.floor(Math.random() * lista.length)];

    // Le bandiere veloci (20%) danno doppi punti
    const veloce = Math.random() < 0.2;
    const velBase = gameCanvas.height * 0.019;
    const vy = -(velBase + Math.random() * velBase * 0.5) * (veloce ? 1.7 : 1);
    const vx = (Math.random() - 0.5) * 5;

    return {
        id: Math.random(),
        emoji: bandiera.emoji,
        nome: bandiera.nome,
        continente,
        x: 80 + Math.random() * (gameCanvas.width - 160),
        y: gameCanvas.height + 60,
        vx,
        vy,
        raggio: veloce ? 28 : 34,
        dimensione: veloce ? 52 : 64,
        veloce,
        tagliata: false,
    };
}

function programmaSpawn() {
    const delay = 700 + Math.random() * 700;
    stato.timeoutSpawn = setTimeout(() => {
        if (stato.schermata === 'gioco') {
            stato.flagAttive.push(nuovaBandiera());
            programmaSpawn();
        }
    }, delay);
}

// --- RILEVAMENTO SLASH ---
// Controlla se il segmento (x1,y1)→(x2,y2) interseca il cerchio della bandiera
function segmentoColpisce(x1, y1, x2, y2, flag) {
    const dx = x2 - x1, dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(flag.x - x1, flag.y - y1) < flag.raggio;
    let t = ((flag.x - x1) * dx + (flag.y - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const px = x1 + t * dx, py = y1 + t * dy;
    return Math.hypot(flag.x - px, flag.y - py) < flag.raggio;
}

function controllaTagli(x1, y1, x2, y2) {
    stato.flagAttive.forEach(flag => {
        if (!flag.tagliata && segmentoColpisce(x1, y1, x2, y2, flag)) {
            tagliaFlag(flag);
        }
    });
}

function tagliaFlag(flag) {
    flag.tagliata = true;
    const corretta = flag.continente === stato.obiettivoContinente;

    if (corretta) {
        const pt = flag.veloce ? 20 : 10;
        stato.punti += pt;
        stato.tagliCorrettiObiettivo++;
        creaEffettoTesto(flag.x, flag.y, `+${pt}`, '#00ff88', flag.nome);
        if (stato.tagliCorrettiObiettivo >= TAGLI_PER_CAMBIO) cambiaObiettivo();
    } else {
        stato.vite--;
        creaEffettoTesto(flag.x, flag.y, '-1 ❤️', '#ff4444', flag.nome);
        aggiornaVite();
        if (stato.vite <= 0) setTimeout(fineGioco, 400);
    }

    // Particella esplosione
    stato.effetti.push({
        tipo: 'esplosione',
        x: flag.x, y: flag.y,
        emoji: flag.emoji,
        corretto: corretta,
        alpha: 1,
        scala: 0.8,
    });

    aggiornaUI();
}

function cambiaObiettivo() {
    const altri = CONTINENTI.filter(c => c !== stato.obiettivoContinente);
    stato.obiettivoContinente = altri[Math.floor(Math.random() * altri.length)];
    stato.tagliCorrettiObiettivo = 0;
    aggiornaObiettivo();
}

// --- EFFETTI TESTO ---
function creaEffettoTesto(x, y, testo, colore, nome) {
    stato.effetti.push({ tipo: 'testo', x, y, testo, colore, nome, alpha: 1 });
}

// --- AGGIORNAMENTO UI HTML ---
function aggiornaUI() {
    document.getElementById('punti-display').textContent = stato.punti;
}

function aggiornaVite() {
    const vite = Math.max(0, stato.vite);
    document.getElementById('vite-display').textContent =
        '❤️'.repeat(vite) + '🖤'.repeat(3 - vite);
}

function aggiornaTimer() {
    const m = Math.floor(stato.tempoRimasto / 60);
    const s = String(stato.tempoRimasto % 60).padStart(2, '0');
    document.getElementById('timer-display').textContent = `${m}:${s}`;
    if (stato.tempoRimasto <= 10) {
        document.getElementById('timer-display').style.color = '#ff4444';
    }
}

function aggiornaObiettivo() {
    const el = document.getElementById('obiettivo-testo');
    if (!el) return;
    el.textContent = `✂️ Taglia: ${stato.obiettivoContinente}`;
    el.classList.remove('flash');
    void el.offsetWidth; // forza reflow per riattivare animazione
    el.classList.add('flash');
}

// --- GAME LOOP ---
function gameLoop(timestamp) {
    if (stato.schermata !== 'gioco') return;

    const dt = Math.min((timestamp - stato.ultimoTimestamp) / 16.67, 3);
    stato.ultimoTimestamp = timestamp;

    const gravita = 0.28 * dt;

    // Aggiorna fisica bandiere
    stato.flagAttive.forEach(flag => {
        flag.vy += gravita;
        flag.x += flag.vx * dt;
        flag.y += flag.vy * dt;
    });

    // Rimuovi bandiere fuori schermo o tagliate
    stato.flagAttive = stato.flagAttive.filter(
        f => !f.tagliata && f.y < gameCanvas.height + 120
    );

    // Aggiorna effetti
    stato.effetti.forEach(e => {
        e.alpha -= 0.025 * dt;
        e.y -= 1.5 * dt;
        if (e.tipo === 'esplosione') e.scala += 0.05 * dt;
    });
    stato.effetti = stato.effetti.filter(e => e.alpha > 0);

    disegna();
    stato.rafId = requestAnimationFrame(gameLoop);
}

// --- RENDERING ---
function disegna() {
    gctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Trail (scia del dito/mouse)
    const trail = stato.trailPoints;
    if (trail.length > 1) {
        gctx.save();
        for (let i = 1; i < trail.length; i++) {
            const a = i / trail.length;
            gctx.beginPath();
            gctx.moveTo(trail[i - 1].x, trail[i - 1].y);
            gctx.lineTo(trail[i].x, trail[i].y);
            gctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.9})`;
            gctx.lineWidth = a * 7;
            gctx.lineCap = 'round';
            gctx.stroke();
        }
        gctx.restore();
    }

    // Bandiere
    stato.flagAttive.forEach(flag => {
        gctx.save();
        if (flag.veloce) {
            gctx.shadowColor = '#f5c518';
            gctx.shadowBlur = 24;
        }
        gctx.font = `${flag.dimensione}px serif`;
        gctx.textAlign = 'center';
        gctx.textBaseline = 'middle';
        gctx.fillText(flag.emoji, flag.x, flag.y);
        gctx.restore();
    });

    // Effetti
    stato.effetti.forEach(e => {
        gctx.save();
        gctx.globalAlpha = Math.max(0, e.alpha);
        if (e.tipo === 'testo') {
            gctx.textAlign = 'center';
            gctx.font = 'bold 22px Inter, sans-serif';
            gctx.shadowColor = e.colore;
            gctx.shadowBlur = 12;
            gctx.fillStyle = e.colore;
            gctx.fillText(e.testo, e.x, e.y);
            gctx.font = '13px Inter, sans-serif';
            gctx.fillStyle = 'rgba(255,255,255,0.85)';
            gctx.shadowBlur = 0;
            gctx.fillText(e.nome, e.x, e.y + 20);
        } else if (e.tipo === 'esplosione') {
            const sz = Math.round(56 * e.scala);
            gctx.font = `${sz}px serif`;
            gctx.textAlign = 'center';
            gctx.textBaseline = 'middle';
            // Cerchio colorato dietro
            gctx.beginPath();
            gctx.arc(e.x, e.y, sz * 0.6, 0, Math.PI * 2);
            gctx.fillStyle = e.corretto
                ? `rgba(0, 255, 136, ${e.alpha * 0.25})`
                : `rgba(255, 68, 68, ${e.alpha * 0.25})`;
            gctx.fill();
            gctx.fillText(e.emoji, e.x, e.y);
        }
        gctx.restore();
    });
}

// --- EVENTI MOUSE / TOUCH ---
let inTrascinamento = false;
let ultimoPunto = null;

function iniziaDrag(x, y) {
    if (stato.schermata !== 'gioco') return;
    inTrascinamento = true;
    ultimoPunto = { x, y };
    stato.trailPoints = [{ x, y }];
}

function muoviDrag(x, y) {
    if (!inTrascinamento || stato.schermata !== 'gioco') return;
    if (ultimoPunto) controllaTagli(ultimoPunto.x, ultimoPunto.y, x, y);
    stato.trailPoints.push({ x, y });
    if (stato.trailPoints.length > 18) stato.trailPoints.shift();
    ultimoPunto = { x, y };
}

function fineDrag() {
    inTrascinamento = false;
    ultimoPunto = null;
    setTimeout(() => { stato.trailPoints = []; }, 80);
}

gameCanvas.addEventListener('mousedown',  e => { e.preventDefault(); iniziaDrag(e.clientX, e.clientY); });
gameCanvas.addEventListener('mousemove',  e => { e.preventDefault(); muoviDrag(e.clientX, e.clientY); });
gameCanvas.addEventListener('mouseup',    () => fineDrag());
gameCanvas.addEventListener('mouseleave', () => fineDrag());

gameCanvas.addEventListener('touchstart', e => { e.preventDefault(); const t = e.touches[0]; iniziaDrag(t.clientX, t.clientY); }, { passive: false });
gameCanvas.addEventListener('touchmove',  e => { e.preventDefault(); const t = e.touches[0]; muoviDrag(t.clientX, t.clientY); }, { passive: false });
gameCanvas.addEventListener('touchend',   () => fineDrag());

// --- AVVIO GIOCO ---
function iniziaGioco() {
    ridimensionaCanvas();

    stato.punti = 0;
    stato.vite = 3;
    stato.tempoRimasto = DURATA_ROUND;
    stato.flagAttive = [];
    stato.effetti = [];
    stato.trailPoints = [];
    stato.tagliCorrettiObiettivo = 0;
    stato.obiettivoContinente = CONTINENTI[Math.floor(Math.random() * CONTINENTI.length)];

    document.getElementById('landing').style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'flex';
    gameCanvas.style.display = 'block';
    document.getElementById('timer-display').style.color = '';
    stato.schermata = 'gioco';

    aggiornaUI();
    aggiornaVite();
    aggiornaObiettivo();
    aggiornaTimer();

    stato.intervalloTimer = setInterval(() => {
        if (stato.schermata !== 'gioco') return;
        stato.tempoRimasto--;
        aggiornaTimer();
        if (stato.tempoRimasto <= 0) fineGioco();
    }, 1000);

    programmaSpawn();
    stato.ultimoTimestamp = performance.now();
    stato.rafId = requestAnimationFrame(gameLoop);
}

// --- FINE GIOCO ---
function fineGioco() {
    if (stato.schermata !== 'gioco') return;
    stato.schermata = 'gameover';

    clearInterval(stato.intervalloTimer);
    clearTimeout(stato.timeoutSpawn);
    cancelAnimationFrame(stato.rafId);

    document.getElementById('game-ui').style.display = 'none';
    gameCanvas.style.display = 'none';
    document.getElementById('gameover-screen').style.display = 'flex';
    document.getElementById('punti-finali').textContent = stato.punti;

    let msg;
    if (stato.punti >= 200) msg = '🏆 Geografo esperto!';
    else if (stato.punti >= 100) msg = '🌍 Bravo esploratore!';
    else if (stato.punti >= 40)  msg = '✈️ Viaggiatore in erba';
    else msg = '📚 Studia ancora un po\'!';
    document.getElementById('punti-messaggio').textContent = msg;
}

window.addEventListener('resize', ridimensionaCanvas);

console.log('🎮 AI Game Lab — Bandiere caricato!');
