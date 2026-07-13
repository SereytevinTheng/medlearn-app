// MedLearn - Features Module
// Flashcards, Favorites, Compare, High Alert, Labs, Progress, NCLEX, Interactions

(function() {
'use strict';

const mainContent = document.getElementById('mainContent');
const breadcrumb = document.getElementById('breadcrumb');

// ===== UTILITY =====
function getAllMeds() {
    const meds = [];
    for (const [catKey, cat] of Object.entries(medicationDatabase)) {
        for (const [clsKey, cls] of Object.entries(cat.classes)) {
            cls.medications.forEach(med => {
                meds.push({ ...med, category: catKey, categoryName: cat.name, classKey: clsKey, className: cls.name });
            });
        }
    }
    return meds;
}

function setActiveNav(feature) {
    document.querySelectorAll('.feature-nav-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`[data-feature="${feature}"]`);
    if (btn) btn.classList.add('active');
}

// ===== DARK MODE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('medlearn_darkmode', isDark ? '1' : '0');
    const btn = document.getElementById('darkModeToggle');
    if (btn) btn.innerHTML = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
}

function applyDarkModeOnLoad() {
    if (localStorage.getItem('medlearn_darkmode') === '1') {
        document.body.classList.add('dark');
        const btn = document.getElementById('darkModeToggle');
        if (btn) btn.innerHTML = '\u2600\uFE0F';
    }
}
applyDarkModeOnLoad();

// ===== DISCLAIMER BANNER =====
function dismissDisclaimer() {
    const banner = document.getElementById('disclaimerBanner');
    if (banner) banner.classList.add('hidden');
    localStorage.setItem('medlearn_disclaimer_dismissed', '1');
}

function applyDisclaimerOnLoad() {
    if (localStorage.getItem('medlearn_disclaimer_dismissed') === '1') {
        const banner = document.getElementById('disclaimerBanner');
        if (banner) banner.classList.add('hidden');
    }
}
applyDisclaimerOnLoad();


// ===== 1. FLASHCARD MODE =====
let fcDeck = [];
let fcIndex = 0;
let fcKnown = 0;
let fcUnknown = 0;

function openFlashcards() {
    setActiveNav('flashcards');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Flashcards</span>';

    let html = '<div class="section-header"><div><h2>&#x1F0CF; Flashcard Mode</h2>';
    html += '<p class="section-description">Tap card to flip. Mark if you know it or not.</p></div></div>';
    html += '<div style="margin-bottom:1rem;"><select id="fcCategorySelect" onchange="features.startFlashcardDeck()" style="padding:0.5rem;border:1px solid #e2e8f0;border-radius:8px;font-size:0.9rem;"><option value="all">All Categories</option>';
    for (const [key, cat] of Object.entries(medicationDatabase)) {
        html += `<option value="${key}">${cat.icon} ${cat.name}</option>`;
    }
    html += '</select>';
    html += '<label style="margin-left:1rem;font-size:0.9rem;cursor:pointer;"><input type="checkbox" id="fcSrsMode" onchange="features.startFlashcardDeck()"> &#x1F9E0; Smart Review (spaced repetition)</label>';
    html += '</div><div id="flashcardArea"></div>';
    mainContent.innerHTML = html;
    startFlashcardDeck();
}

// Spaced Repetition (Leitner system) storage
function getSRS() { return JSON.parse(localStorage.getItem('medlearn_srs') || '{}'); }
function saveSRS(srs) { localStorage.setItem('medlearn_srs', JSON.stringify(srs)); }
// Box intervals in days: box 1 = same day, up to box 5 = 14 days
const SRS_INTERVALS = [0, 1, 3, 7, 14];

function updateSRS(generic, known) {
    const srs = getSRS();
    let card = srs[generic] || { box: 0 };
    if (known === true) card.box = Math.min(card.box + 1, 4);
    else if (known === false) card.box = 0;
    const intervalDays = SRS_INTERVALS[card.box];
    card.due = Date.now() + intervalDays * 24 * 60 * 60 * 1000;
    srs[generic] = card;
    saveSRS(srs);
}

function isDue(generic) {
    const srs = getSRS();
    const card = srs[generic];
    if (!card) return true; // never studied = due
    return card.due <= Date.now();
}

function startFlashcardDeck() {
    const sel = document.getElementById('fcCategorySelect');
    const catKey = sel ? sel.value : 'all';
    const srsToggle = document.getElementById('fcSrsMode');
    const useSrs = srsToggle ? srsToggle.checked : false;
    const allMeds = getAllMeds();
    fcDeck = catKey === 'all' ? allMeds : allMeds.filter(m => m.category === catKey);

    if (useSrs) {
        // Only show cards that are "due", prioritize never-studied and lapsed
        const srs = getSRS();
        fcDeck = fcDeck.filter(m => isDue(m.generic));
        fcDeck.sort((a, b) => {
            const boxA = srs[a.generic] ? srs[a.generic].box : -1;
            const boxB = srs[b.generic] ? srs[b.generic].box : -1;
            return boxA - boxB; // lower box (weaker) first
        });
        if (fcDeck.length === 0) {
            document.getElementById('flashcardArea').innerHTML = '<div class="flashcard-container"><h3>&#x1F389; All caught up!</h3><p style="color:var(--text-light);margin-top:0.5rem;">No cards are due for review right now. Come back later or turn off Smart Review to study all cards.</p></div>';
            return;
        }
    } else {
        fcDeck = fcDeck.sort(() => Math.random() - 0.5);
    }
    fcIndex = 0; fcKnown = 0; fcUnknown = 0;
    renderFlashcard();
}

function renderFlashcard() {
    const area = document.getElementById('flashcardArea');
    if (fcIndex >= fcDeck.length) {
        area.innerHTML = `<div class="flashcard-container"><h3>Deck Complete!</h3><p style="margin:1rem 0;font-size:1.2rem;">&#x2705; Known: ${fcKnown} | &#x274C; Review: ${fcUnknown}</p><p style="color:var(--text-light);">${Math.round((fcKnown/fcDeck.length)*100)}% mastery</p><button class="fc-btn fc-btn-right" onclick="features.startFlashcardDeck()" style="margin-top:1rem;max-width:200px;">Restart Deck</button></div>`;
        saveProgress('flashcard', {known: fcKnown, total: fcDeck.length, date: new Date().toISOString()});
        awardXP(fcKnown * 2 + 5, 'flashcards');
        return;
    }
    const med = fcDeck[fcIndex];
    area.innerHTML = `
    <div class="flashcard-container">
        <div class="flashcard-progress">Card ${fcIndex+1} of ${fcDeck.length} | &#x2705; ${fcKnown} &#x274C; ${fcUnknown}</div>
        <div class="flashcard" id="currentCard" onclick="this.classList.toggle('flipped')">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <div class="fc-generic">${med.generic}</div>
                    <div class="fc-hint">Tap to reveal details</div>
                </div>
                <div class="flashcard-back">
                    <h3>${med.generic}</h3>
                    <div class="fc-brand">${med.brand}</div>
                    <div class="fc-label">Mechanism</div>
                    <div class="fc-detail">${med.mechanism}</div>
                    <div class="fc-label">Key Indications</div>
                    <div class="fc-detail">${med.indications.slice(0,3).join(', ')}</div>
                    <div class="fc-label">Nursing Alert</div>
                    <div class="fc-detail">${med.nursingConsiderations.substring(0,120)}...</div>
                </div>
            </div>
        </div>
        <div class="flashcard-controls">
            <button class="fc-btn fc-btn-wrong" onclick="features.fcAnswer(false)">&#x274C; Don't Know</button>
            <button class="fc-btn fc-btn-skip" onclick="features.fcAnswer(null)">Skip</button>
            <button class="fc-btn fc-btn-right" onclick="features.fcAnswer(true)">&#x2705; Know It</button>
        </div>
    </div>`;
}

function fcAnswer(known) {
    const med = fcDeck[fcIndex];
    if (known === true) fcKnown++;
    else if (known === false) fcUnknown++;
    if (med && known !== null) {
        updateSRS(med.generic, known);
        if (known === false) addWeakSpot(med.generic);
        else if (known === true) removeWeakSpot(med.generic);
    }
    fcIndex++;
    renderFlashcard();
}

// ===== WEAK SPOTS =====
function getWeakSpots() { try { return JSON.parse(localStorage.getItem('medlearn_weakspots') || '[]'); } catch(e) { return []; } }
function saveWeakSpots(w) { localStorage.setItem('medlearn_weakspots', JSON.stringify(w)); }
function addWeakSpot(generic) { const w = getWeakSpots(); if (!w.includes(generic)) { w.push(generic); saveWeakSpots(w); } }
function removeWeakSpot(generic) { let w = getWeakSpots(); if (w.includes(generic)) { w = w.filter(x => x !== generic); saveWeakSpots(w); } }

function openWeakSpots() {
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Weak Spots</span>';
    const weak = getWeakSpots();
    const allMeds = getAllMeds();
    fcDeck = allMeds.filter(m => weak.includes(m.generic)).sort(() => Math.random() - 0.5);
    let html = '<div class="section-header"><div><h2>&#x1F3AF; Weak Spots</h2>';
    html += `<p class="section-description">Flashcards you marked "Don't Know" collect here. Get one right to clear it. ${fcDeck.length} to review.</p></div></div>`;
    if (fcDeck.length === 0) {
        html += '<div class="favorites-empty"><div class="empty-icon">&#x1F389;</div><h3>No weak spots!</h3><p>When you mark a flashcard "Don\'t Know", it appears here for focused review. Nothing to review right now - great work!</p></div>';
        mainContent.innerHTML = html;
        return;
    }
    html += '<div id="flashcardArea"></div>';
    mainContent.innerHTML = html;
    fcIndex = 0; fcKnown = 0; fcUnknown = 0;
    renderFlashcard();
}


// ===== 2. FAVORITES / STUDY LIST =====
function getFavorites() {
    return JSON.parse(localStorage.getItem('medlearn_favorites') || '[]');
}
function saveFavorites(favs) {
    localStorage.setItem('medlearn_favorites', JSON.stringify(favs));
}
function toggleFavorite(generic) {
    let favs = getFavorites();
    if (favs.includes(generic)) { favs = favs.filter(f => f !== generic); }
    else { favs.push(generic); }
    saveFavorites(favs);
    // Re-render star if visible
    const star = document.getElementById('star-' + generic.replace(/[^a-z]/g,''));
    if (star) star.textContent = favs.includes(generic) ? '\u2B50' : '\u2606';
}

function isFavorite(generic) { return getFavorites().includes(generic); }

function openFavorites() {
    setActiveNav('favorites');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Favorites</span>';
    const favs = getFavorites();
    const allMeds = getAllMeds();
    const favMeds = allMeds.filter(m => favs.includes(m.generic));

    let html = '<div class="section-header"><div><h2>&#x2B50; My Study List</h2>';
    html += `<p class="section-description">${favMeds.length} medications saved for review</p></div></div>`;

    if (favMeds.length === 0) {
        html += '<div class="favorites-empty"><div class="empty-icon">&#x2B50;</div><h3>No favorites yet!</h3><p>Click the star icon on any medication to add it here.</p></div>';
    } else {
        html += '<div class="medications-grid">';
        favMeds.forEach(med => {
            html += `<div class="med-card med-card-fav" onclick="app.showMedDetail('${med.category}','${med.classKey}',${medicationDatabase[med.category].classes[med.classKey].medications.findIndex(m=>m.generic===med.generic)})">
                <span class="fav-star" id="star-${med.generic.replace(/[^a-z]/g,'')}" onclick="event.stopPropagation();features.toggleFavorite('${med.generic}');features.openFavorites();">&#x2B50;</span>
                <div class="med-generic">${med.generic}</div>
                <div class="med-brand">${med.brand}</div>
                <div class="med-quick-info"><span class="med-tag">${med.className}</span><span class="med-tag">${med.indications[0]}</span></div>
            </div>`;
        });
        html += '</div>';
    }
    mainContent.innerHTML = html;
}


// ===== 3. DRUG COMPARISON TOOL =====
function openCompare() {
    setActiveNav('compare');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Compare</span>';
    const allMeds = getAllMeds();

    let options = allMeds.map(m => `<option value="${m.generic}">${m.generic} (${m.brand})</option>`).join('');

    let html = '<div class="section-header"><div><h2>&#x2696;&#xFE0F; Drug Comparison</h2>';
    html += '<p class="section-description">Select two medications to compare side by side</p></div></div>';
    html += `<div class="compare-selectors">
        <div class="compare-select-group"><label style="font-weight:600;font-size:0.85rem;margin-bottom:0.3rem;display:block;">Drug 1</label><select id="compare1" onchange="features.renderComparison()"><option value="">-- Select --</option>${options}</select></div>
        <div class="compare-select-group"><label style="font-weight:600;font-size:0.85rem;margin-bottom:0.3rem;display:block;">Drug 2</label><select id="compare2" onchange="features.renderComparison()"><option value="">-- Select --</option>${options}</select></div>
    </div>`;
    html += '<div id="compareResult"></div>';
    mainContent.innerHTML = html;
}

function renderComparison() {
    const allMeds = getAllMeds();
    const g1 = document.getElementById('compare1').value;
    const g2 = document.getElementById('compare2').value;
    const result = document.getElementById('compareResult');
    if (!g1 || !g2) { result.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">Select two medications above to compare.</p>'; return; }
    const m1 = allMeds.find(m => m.generic === g1);
    const m2 = allMeds.find(m => m.generic === g2);
    if (!m1 || !m2) return;

    result.innerHTML = `<div style="overflow-x:auto;"><table class="compare-table">
        <tr><th></th><th>${m1.generic} (${m1.brand})</th><th>${m2.generic} (${m2.brand})</th></tr>
        <tr><td class="row-label">Class</td><td>${m1.className}</td><td>${m2.className}</td></tr>
        <tr><td class="row-label">Mechanism</td><td>${m1.mechanism}</td><td>${m2.mechanism}</td></tr>
        <tr><td class="row-label">Indications</td><td>${m1.indications.join(', ')}</td><td>${m2.indications.join(', ')}</td></tr>
        <tr><td class="row-label">Side Effects</td><td>${m1.sideEffects.join(', ')}</td><td>${m2.sideEffects.join(', ')}</td></tr>
        <tr><td class="row-label">Dosage</td><td>${m1.dosageRange}</td><td>${m2.dosageRange}</td></tr>
        <tr><td class="row-label">Nursing</td><td>${m1.nursingConsiderations}</td><td>${m2.nursingConsiderations}</td></tr>
    </table></div>`;
}


// ===== 4. HIGH ALERT MEDICATIONS =====
const highAlertMeds = [
    { generic: "heparin (unfractionated)", reason: "Narrow therapeutic index. Risk of fatal bleeding and HIT. Requires continuous aPTT monitoring." },
    { generic: "warfarin", reason: "Narrow therapeutic index. Numerous drug/food interactions. Haemorrhage risk. INR monitoring essential." },
    { generic: "insulin lispro", reason: "High-alert: wrong dose can cause fatal hypoglycaemia. Always double-check units. Never abbreviate 'U'." },
    { generic: "insulin glargine", reason: "Often confused with other insulins. CLEAR solution (unlike NPH). Cannot mix. Wrong insulin = fatal." },
    { generic: "morphine", reason: "Respiratory depression risk. Dose-dependent. Monitor RR<12. Keep naloxone available." },
    { generic: "hydromorphone", reason: "5-7x more potent than morphine. Fatal if dose confused with morphine doses. HIGH ALERT." },
    { generic: "fentanyl", reason: "80-100x potent than morphine. Patch only for opioid-tolerant. Heat increases absorption = overdose." },
    { generic: "methotrexate", reason: "Fatal if given daily instead of weekly. Immunosuppressant. Requires folate supplementation." },
    { generic: "digoxin", reason: "Narrow therapeutic index (0.5-2.0). Check apical pulse. Hypokalaemia increases toxicity." },
    { generic: "potassium chloride", reason: "NEVER give IV push (fatal cardiac arrest). Must dilute. Max rate 10 mEq/hr peripherally." },
    { generic: "amiodarone", reason: "Extremely long half-life. Pulmonary/thyroid/liver toxicity. Numerous drug interactions." },
    { generic: "phenytoin", reason: "Narrow therapeutic index. IV max rate 50mg/min (cardiac arrest risk). Purple glove syndrome." },
    { generic: "clozapine", reason: "Risk of fatal agranulocytosis (~1%). Requires mandatory ANC monitoring via REMS program." },
    { generic: "colchicine", reason: "Narrow margin between therapeutic and toxic doses. GI toxicity precedes fatal multi-organ failure." },
    { generic: "nitroprusside", reason: "Cyanide toxicity risk with prolonged use. Wrap in foil (light-sensitive). ICU monitoring only." }
];

function openHighAlert() {
    setActiveNav('highalert');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">High Alert</span>';
    const allMeds = getAllMeds();

    let html = '<div class="section-header"><div><h2>&#x1F6A8; High-Risk Medicines</h2>';
    html += '<p class="section-description">Medicines with a heightened risk of causing significant harm. Essential knowledge for safe clinical practice.</p></div></div>';
    html += '<div class="apinch-box"><strong>&#x1F4CC; Remember A PINCH</strong> - the Australian high-risk medicines mnemonic (ACSQHC):<br>' +
        '<b>A</b>nti-infectives &bull; <b>P</b>otassium &amp; other electrolytes &bull; <b>I</b>nsulin &bull; ' +
        '<b>N</b>arcotics (opioids) &amp; sedatives &bull; <b>C</b>hemotherapeutic agents &bull; <b>H</b>eparin &amp; anticoagulants</div>';

    highAlertMeds.forEach(ha => {
        const med = allMeds.find(m => m.generic === ha.generic);
        const brand = med ? med.brand : '';
        html += `<div class="high-alert-card">
            <div class="ha-name">${ha.generic}</div>
            ${brand ? `<div class="ha-brand">${brand}</div>` : ''}
            <div class="ha-reason">&#x26A0;&#xFE0F; ${ha.reason}</div>
        </div>`;
    });
    mainContent.innerHTML = html;
}


// ===== 5. LAB VALUES & ANTIDOTES =====
const labData = [
    { drug: "digoxin", range: "0.5 - 2.0 ng/mL", toxic: ">2.0 ng/mL", antidote: "Digoxin Immune Fab (Digibind)", monitoring: "Check K+ (hypokalaemia increases toxicity). Check apical pulse." },
    { drug: "phenytoin", range: "10 - 20 mcg/mL", toxic: ">20 mcg/mL (free >2.0)", antidote: "No specific antidote. Supportive care.", monitoring: "Monitor free levels in hypoalbuminemia. Check albumin." },
    { drug: "lithium", range: "0.6 - 1.2 mEq/L", toxic: ">1.5 mEq/L", antidote: "Haemodialysis for severe toxicity", monitoring: "Monitor Na+, thyroid, renal function. Maintain hydration." },
    { drug: "theophylline", range: "5 - 15 mcg/mL", toxic: ">20 mcg/mL", antidote: "Charcoal haemoperfusion. Supportive.", monitoring: "Many drug interactions. Smoking affects levels. Monitor HR." },
    { drug: "vancomycin", range: "Trough: 15-20 mcg/mL (serious infections)", toxic: "Trough >20 mcg/mL", antidote: "No antidote. Adjust dose/interval.", monitoring: "Monitor renal function (nephrotoxic). Red man syndrome if infused too fast." },
    { drug: "gentamicin", range: "Peak: 5-10; Trough: <2 mcg/mL", toxic: "Peak >12; Trough >2", antidote: "Haemodialysis in severe cases", monitoring: "Monitor renal function and hearing (ototoxic + nephrotoxic)." },
    { drug: "warfarin", range: "INR 2.0 - 3.0 (most indications)", toxic: "INR >4.0 (bleeding risk)", antidote: "Vitamin K (phytonadione); FFP/PCC for emergency", monitoring: "Weekly INR initially. Watch for bleeding. Diet counseling (vitamin K foods)." },
    { drug: "heparin", range: "aPTT 1.5-2.5x control (60-80 sec)", toxic: "aPTT >100 sec", antidote: "Protamine sulfate (1 mg per 100 units heparin)", monitoring: "Check aPTT q6h. Monitor platelets for HIT. Watch for bleeding." },
    { drug: "valproic acid", range: "50 - 100 mcg/mL", toxic: ">100 mcg/mL", antidote: "L-carnitine for hepatotoxicity. Supportive.", monitoring: "Monitor LFTs, FBC, ammonia. Teratogenic - pregnancy test." },
    { drug: "carbamazepine", range: "4 - 12 mcg/mL", toxic: ">12 mcg/mL", antidote: "No specific antidote. Supportive.", monitoring: "Monitor FBC (aplastic anaemia). Check Na+ (SIADH). HLA-B*1502 testing." },
    { drug: "metformin", range: "N/A (no routine monitoring)", toxic: "Lactic acidosis (lactate >5)", antidote: "Haemodialysis. Bicarbonate for acidosis.", monitoring: "Monitor renal function (Cr/GFR). Hold before contrast. Monitor B12 annually." },
    { drug: "paracetamol", range: "Therapeutic dosing (no routine level)", toxic: ">150 mg/L at 4hr post-ingestion (use nomogram)", antidote: "Acetylcysteine (NAC)", monitoring: "Max 4g/day (lower in liver disease/low weight). Check LFTs and paracetamol level. Use the paracetamol treatment nomogram (per eTG)." }
];

function openLabValues() {
    setActiveNav('labs');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Lab Values</span>';

    let html = '<div class="section-header"><div><h2>&#x1F52C; Lab Values, Therapeutic Ranges & Antidotes</h2>';
    html += '<p class="section-description">Critical values every nurse must know</p></div></div>';

    labData.forEach(lab => {
        html += `<div class="lab-card">
            <div class="lab-drug">${lab.drug}</div>
            <div class="lab-range">&#x2705; Therapeutic: ${lab.range}</div>
            <div class="lab-toxic">&#x26A0;&#xFE0F; Toxic: ${lab.toxic}</div>
            <div class="lab-antidote">&#x1F48A; Antidote: ${lab.antidote}</div>
            <div class="lab-monitoring">&#x1F469;&#x200D;&#x2695;&#xFE0F; ${lab.monitoring}</div>
        </div>`;
    });
    mainContent.innerHTML = html;
}


// ===== 6. PROGRESS TRACKER =====
function saveProgress(type, data) {
    const history = JSON.parse(localStorage.getItem('medlearn_progress') || '[]');
    history.push({ type, ...data });
    localStorage.setItem('medlearn_progress', JSON.stringify(history));
}

function getProgress() {
    return JSON.parse(localStorage.getItem('medlearn_progress') || '[]');
}

function openProgress() {
    setActiveNav('progress');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Progress</span>';
    const history = getProgress();
    const favs = getFavorites();
    const allMeds = getAllMeds();
    const quizzes = history.filter(h => h.type === 'quiz' || h.type === 'flashcard' || h.type === 'nclex');

    let totalCorrect = 0, totalQuestions = 0;
    quizzes.forEach(q => {
        if (q.known !== undefined) { totalCorrect += q.known; totalQuestions += q.total; }
        else if (q.score !== undefined) { totalCorrect += q.score; totalQuestions += q.total; }
    });

    const avgScore = totalQuestions > 0 ? Math.round((totalCorrect/totalQuestions)*100) : 0;

    let html = '<div class="section-header"><div><h2>&#x1F4CA; Your Progress</h2>';
    html += '<p class="section-description">Track your study journey</p></div></div>';

    html += '<div class="progress-overview">';
    html += `<div class="progress-stat-card"><div class="stat-number">${allMeds.length}</div><div class="stat-label">Total Medications</div></div>`;
    html += `<div class="progress-stat-card"><div class="stat-number">${favs.length}</div><div class="stat-label">Favorited</div></div>`;
    html += `<div class="progress-stat-card"><div class="stat-number">${quizzes.length}</div><div class="stat-label">Sessions Completed</div></div>`;
    html += `<div class="progress-stat-card"><div class="stat-number">${avgScore}%</div><div class="stat-label">Avg Score</div></div>`;
    html += '</div>';

    // Progress bar
    html += '<div class="card" style="background:white;border-radius:12px;padding:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);margin-bottom:1.5rem;">';
    html += `<h3 style="font-size:1rem;margin-bottom:0.5rem;">Overall Mastery</h3>`;
    html += `<div class="progress-bar-container"><div class="progress-bar-fill" style="width:${avgScore}%"></div></div>`;
    html += `<p style="font-size:0.8rem;color:var(--text-light);margin-top:0.25rem;">${avgScore}% average across all study sessions</p></div>`;

    // Recent history
    html += '<div class="card" style="background:white;border-radius:12px;padding:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);">';
    html += '<h3 style="font-size:1rem;margin-bottom:0.75rem;">Recent Activity</h3>';
    if (quizzes.length === 0) {
        html += '<p style="color:var(--text-light);text-align:center;padding:1rem;">No activity yet. Start studying to track your progress!</p>';
    } else {
        const recent = quizzes.slice(-10).reverse();
        recent.forEach(q => {
            const date = q.date ? new Date(q.date).toLocaleDateString() : 'Recent';
            const score = q.known !== undefined ? `${q.known}/${q.total}` : `${q.score}/${q.total}`;
            const pct = q.known !== undefined ? Math.round((q.known/q.total)*100) : Math.round((q.score/q.total)*100);
            html += `<div class="quiz-history-item"><span>${q.type === 'flashcard' ? '&#x1F0CF;' : q.type === 'nclex' ? '&#x1F4DD;' : '&#x1F4DD;'} ${q.type.charAt(0).toUpperCase()+q.type.slice(1)} - ${date}</span><span class="qh-score">${score} (${pct}%)</span></div>`;
        });
    }
    html += '</div>';

    // Clear button
    html += '<div style="text-align:center;margin-top:1.5rem;"><button onclick="if(confirm(\'Clear all progress data?\')){localStorage.removeItem(\'medlearn_progress\');features.openProgress();}" style="padding:0.5rem 1rem;border:1px solid var(--danger);color:var(--danger);background:white;border-radius:8px;cursor:pointer;font-size:0.85rem;">Clear Progress History</button></div>';

    mainContent.innerHTML = html;
}


// ===== 7. NCLEX-STYLE QUESTIONS =====
const nclexQuestions = [
    { type: "SATA", stem: "A nurse is administering digoxin. Which findings should the nurse report to the provider? (Select all that apply)", options: ["Apical pulse of 58 bpm","Serum potassium of 3.2 mEq/L","Patient reports seeing yellow halos","Blood pressure 128/78","Serum digoxin level 1.8 ng/mL"], correct: [0,1,2], rationale: "Hold digoxin if HR<60. Hypokalaemia (K<3.5) increases digoxin toxicity. Yellow/green visual changes indicate toxicity. BP is normal. Digoxin 1.8 is within range (0.5-2.0)." },
    { type: "SATA", stem: "Which nursing interventions are appropriate for a patient receiving heparin IV infusion? (Select all that apply)", options: ["Monitor aPTT every 6 hours","Use an infusion pump","Apply firm pressure to injection sites for 5 minutes","Administer vitamin K as antidote","Monitor platelet count"], correct: [0,1,2,4], rationale: "aPTT monitors heparin effectiveness. Infusion pump ensures accurate dosing. Firm pressure prevents bleeding. Protamine (not vitamin K) is the heparin antidote. Platelets monitor for HIT." },
    { type: "Priority", stem: "A nurse is caring for 4 patients. Which patient should the nurse assess FIRST?", options: ["Patient on morphine with respiratory rate of 10","Patient on furosemide with potassium of 3.4","Patient on metformin reporting nausea","Patient on lisinopril with dry cough"], correct: [0], rationale: "Respiratory rate of 10 with opioid use indicates respiratory depression — life-threatening emergency requiring immediate assessment and possible naloxone. Other findings require attention but are not immediately life-threatening." },
    { type: "SATA", stem: "A patient is prescribed warfarin. Which patient statements indicate effective teaching? (Select all that apply)", options: ["I will eat consistent amounts of green vegetables","I will use an electric razor for shaving","I will take ibuprofen for headaches","I will get my blood tested regularly","I should avoid contact sports"], correct: [0,1,3,4], rationale: "Consistent vitamin K intake (not elimination) is correct. Electric razor prevents cuts. NSAIDs increase bleeding risk with warfarin - should use paracetamol. Regular INR monitoring is essential. Avoiding contact sports prevents injury/bleeding." },
    { type: "Priority", stem: "Which patient taking antihypertensives should the nurse see FIRST?", options: ["Patient on atenolol with HR 56 and dizziness","Patient on amlodipine with ankle oedema","Patient on losartan with potassium 5.1","Patient on HCTZ with sodium 134"], correct: [0], rationale: "HR 56 with dizziness on a beta-blocker indicates symptomatic bradycardia requiring immediate assessment. Ankle oedema is expected with CCBs. K+ 5.1 and Na 134 are slightly abnormal but not emergent." },
    { type: "SATA", stem: "A nurse is caring for a patient with a fentanyl transdermal patch. Which interventions are appropriate? (Select all that apply)", options: ["Apply patch to a hairless area","Cut the patch in half if dose seems too high","Avoid applying heat to the patch area","Monitor respiratory rate regularly","Remove old patch before applying new one"], correct: [0,2,3,4], rationale: "Apply to hairless, non-irritated skin. NEVER cut patches (causes dose dumping). Heat increases absorption dangerously. Monitor RR for respiratory depression. Always remove old patch to prevent overdose." },
    { type: "Priority", stem: "A nurse is reviewing labs for patients on medications. Which result requires immediate notification of the provider?", options: ["Phenytoin level 22 mcg/mL","Digoxin level 1.6 ng/mL","INR 2.5 on warfarin","Lithium level 1.0 mEq/L"], correct: [0], rationale: "Phenytoin therapeutic range is 10-20. Level of 22 is toxic and can cause ataxia, nystagmus, seizures. Digoxin 1.6 is therapeutic (0.5-2.0). INR 2.5 is goal range (2-3). Lithium 1.0 is therapeutic (0.6-1.2)." },
    { type: "SATA", cat: "Cardiovascular", stem: "Which medications require the nurse to check an apical pulse for one full minute before administration? (Select all that apply)", options: ["Digoxin","Metoprolol","Lisinopril","Diltiazem","Furosemide"], correct: [0,1,3], rationale: "Digoxin, beta-blockers (metoprolol), and non-dihydropyridine CCBs (diltiazem) can cause bradycardia. Hold if HR<60. Lisinopril and furosemide don't typically require pulse check before admin." },
    { type: "Priority", cat: "Endocrine", stem: "A patient with type 1 diabetes has a blood glucose of 45 mg/dL and is alert. What should the nurse do FIRST?", options: ["Give 15 g of fast-acting carbohydrate","Administer IV insulin","Call the provider","Recheck glucose in 1 hour"], correct: [0], rationale: "For conscious hypoglycaemia, follow the rule of 15: give 15g fast-acting carb (juice, glucose tabs), recheck in 15 min. Never give insulin when glucose is low. Act before calling provider." },
    { type: "SATA", cat: "Endocrine", stem: "Which statements about insulin administration are correct? (Select all that apply)", options: ["Regular insulin is the only insulin given IV","Rotate injection sites to prevent lipodystrophy","NPH insulin is clear","Roll (don't shake) cloudy insulin","Rapid-acting insulin is given with meals"], correct: [0,1,3,4], rationale: "Regular insulin is the only IV insulin. Rotate sites. NPH is CLOUDY (not clear). Roll cloudy insulin gently. Rapid-acting (lispro/aspart) given with meals." },
    { type: "Priority", cat: "Respiratory", stem: "A patient using a salbutamol inhaler and a fluticasone inhaler asks which to use first. What should the nurse teach?", options: ["Use salbutamol first, then fluticasone","Use fluticasone first, then salbutamol","Use them at the same time","Order does not matter"], correct: [0], rationale: "Use the bronchodilator (salbutamol) FIRST to open airways, then the corticosteroid (fluticasone) can reach deeper. Always rinse mouth after the steroid to prevent thrush." },
    { type: "SATA", cat: "Anticoagulants", stem: "A patient on enoxaparin (Lovenox). Which nursing actions are correct? (Select all that apply)", options: ["Give subcutaneously in the abdomen","Do not expel the air bubble in the syringe","Aspirate before injecting","Do not rub the site after injection","Rotate injection sites"], correct: [0,1,3,4], rationale: "Give SubQ in the abdomen (love handles). Do NOT expel air bubble. Do NOT aspirate. Do NOT rub (causes bruising). Rotate sites." },
    { type: "Priority", cat: "Safety", stem: "The nurse prepares to give IV potassium chloride. Which action is essential for safety?", options: ["Always dilute and infuse via pump - never IV push","Give rapid IV push for faster effect","Give undiluted for accuracy","Push over 1 minute"], correct: [0], rationale: "IV potassium is NEVER given by IV push (causes fatal cardiac arrest). Always dilute and infuse slowly via pump, max 10 mEq/hr peripherally. A high-alert medication." },
    { type: "SATA", cat: "Pain/Opioids", stem: "A patient is receiving morphine for pain. Which findings require the nurse to hold the dose and notify the provider? (Select all that apply)", options: ["Respiratory rate of 8","Sedation level - difficult to arouse","Pain rating of 6/10","Respiratory rate of 18","Oxygen saturation of 85%"], correct: [0,1,4], rationale: "Hold opioids for RR<12, excessive sedation, and low O2 sat (respiratory depression signs). Pain 6/10 and RR 18 are acceptable to medicate." },
    { type: "Priority", cat: "Antibiotics", stem: "A patient receiving IV vancomycin develops flushing and redness of the face and neck during infusion. What is the nurse's priority action?", options: ["Slow or stop the infusion","Continue - this is a normal reaction","Increase the infusion rate","Give the next dose early"], correct: [0], rationale: "This is 'Red Man Syndrome' caused by infusing vancomycin too fast. Slow or stop the infusion. Prevent by infusing over at least 60 minutes. Not a true allergy but requires slower rate." },
    { type: "SATA", cat: "Psychiatric", stem: "A patient is starting an SSRI (sertraline). Which teaching points should the nurse include? (Select all that apply)", options: ["Full effect may take 4-6 weeks","Do not stop abruptly","Report thoughts of self-harm immediately","You can combine it freely with MAOIs","Watch for signs of serotonin syndrome"], correct: [0,1,2,4], rationale: "SSRIs take 4-6 weeks. Do not stop abruptly (discontinuation syndrome). Report suicidal thoughts (black box warning). NEVER combine with MAOIs (serotonin syndrome). Watch for serotonin syndrome." },
    { type: "Priority", cat: "Endocrine", stem: "A patient on levothyroxine reports palpitations, weight loss, and feeling hot. What does the nurse suspect?", options: ["Dose too high (hyperthyroid symptoms)","Dose too low","Normal response","Allergic reaction"], correct: [0], rationale: "Palpitations, weight loss, heat intolerance = signs of too much thyroid hormone (hyperthyroidism). The dose is likely too high and needs adjustment. Report to provider." },
    { type: "SATA", cat: "Antibiotics", stem: "Which teaching points apply to a patient taking ciprofloxacin? (Select all that apply)", options: ["Report tendon pain immediately","Avoid taking with antacids or dairy","Increase fluid intake","Use sunscreen (photosensitivity)","Take with calcium for better absorption"], correct: [0,1,2,3], rationale: "Fluoroquinolones cause tendon rupture (report pain). Antacids/dairy/calcium reduce absorption (separate by 2h). Hydrate well. Causes photosensitivity - use sunscreen." },
    { type: "Priority", cat: "Cardiovascular", stem: "A patient started on lisinopril develops swelling of the lips and tongue. What is the nurse's priority?", options: ["Assess airway and prepare for emergency - this is angiooedema","Document as a mild side effect","Give the next dose with food","Reassure the patient it will pass"], correct: [0], rationale: "Lip/tongue swelling = angiooedema, a life-threatening emergency with ACE inhibitors. Priority is airway assessment and emergency intervention. Stop the drug and notify provider immediately." },
    { type: "SATA", cat: "Cardiovascular", stem: "Which are signs of digoxin toxicity the nurse should monitor for? (Select all that apply)", options: ["Nausea and vomiting","Yellow-green vision changes","Bradycardia","Increased appetite","Confusion"], correct: [0,1,2,4], rationale: "Digoxin toxicity: N/V, visual disturbances (yellow-green halos), bradycardia, and confusion. Anorexia (loss of appetite), NOT increased appetite, is an early sign." },
    { type: "Priority", cat: "Safety", stem: "A patient receiving IV magnesium sulfate has absent deep tendon reflexes. What should the nurse do FIRST?", options: ["Stop the infusion","Increase the rate","Continue and document","Give more magnesium"], correct: [0], rationale: "Absent deep tendon reflexes indicate magnesium toxicity. STOP the infusion first, then notify provider. Antidote is calcium gluconate. Monitor respirations and reflexes." },
    { type: "SATA", cat: "Endocrine", stem: "Which patient teaching is correct for oral corticosteroids like prednisone? (Select all that apply)", options: ["Take with food","Do not stop abruptly","Monitor blood glucose","Report signs of infection","Take on an empty stomach at bedtime"], correct: [0,1,2,3], rationale: "Take prednisone with food (GI irritation), in the morning (mimics cortisol). Never stop abruptly (adrenal crisis). Monitor glucose (hyperglycaemia) and watch for infection (immunosuppression)." },
    { type: "Priority", cat: "Respiratory", stem: "A patient on theophylline has a level of 22 mcg/mL and reports nausea and palpitations. What is the priority?", options: ["Hold the drug and notify the provider - level is toxic","Give the next dose","Encourage more fluids only","Document as therapeutic"], correct: [0], rationale: "Theophylline therapeutic range is 5-15 mcg/mL. A level of 22 is toxic; nausea and palpitations are toxicity signs. Hold the drug and notify the provider." },
    { type: "SATA", cat: "Pain/Opioids", stem: "Which interventions help prevent opioid-induced constipation? (Select all that apply)", options: ["Increase fluid intake","Start a bowel regimen (stool softener/laxative)","Increase dietary fibre","Encourage ambulation","Restrict fluids"], correct: [0,1,2,3], rationale: "Opioids commonly cause constipation. Prevent with fluids, prophylactic bowel regimen, fibre, and activity. Restricting fluids would worsen constipation." },
    { type: "Priority", cat: "Anticoagulants", stem: "A patient on warfarin has an INR of 5.5 with no active bleeding. What does the nurse anticipate?", options: ["Holding warfarin and possibly giving vitamin K","Increasing the warfarin dose","Giving protamine sulfate","No change needed"], correct: [0], rationale: "INR 5.5 is above therapeutic range (2-3) - high bleeding risk. Anticipate holding warfarin and possibly vitamin K. Protamine is for heparin, not warfarin." },
    { type: "SATA", cat: "Antibiotics", stem: "Which are appropriate when administering IV vancomycin? (Select all that apply)", options: ["Infuse over at least 60 minutes","Monitor trough levels","Monitor renal function","Give rapid IV push","Monitor for ototoxicity"], correct: [0,1,2,4], rationale: "Infuse slowly (>=60 min) to prevent Red Man Syndrome. Monitor troughs, renal function (nephrotoxic), and hearing (ototoxic). Never IV push." },
    { type: "Priority", cat: "Psychiatric", stem: "A patient on lithium reports vomiting, diarrhoea, and coarse tremors. What should the nurse suspect?", options: ["Lithium toxicity","Normal side effects","Underdosing","Allergic reaction"], correct: [0], rationale: "Vomiting, diarrhoea, and coarse tremor are signs of lithium toxicity. Therapeutic range is narrow (0.6-1.2 mEq/L). Hold the dose, check level, and ensure hydration." },
    { type: "SATA", cat: "Safety", stem: "Which are considered high-alert medications requiring extra safety checks? (Select all that apply)", options: ["Insulin","Heparin","IV potassium chloride","Oral paracetamol","Opioids"], correct: [0,1,2,4], rationale: "Insulin, heparin, concentrated electrolytes (KCl), and opioids are high-alert medicines. Routine oral paracetamol is not typically high-alert (though the maximum daily dose still matters)." },
    { type: "Priority", cat: "Cardiovascular", stem: "A patient on furosemide has a potassium of 2.9 mEq/L. What is the nurse's priority concern?", options: ["Risk of cardiac dysrhythmias","Increased urine output","Mild headache","Weight loss"], correct: [0], rationale: "K+ 2.9 is hypokalaemia (normal 3.5-5.0). Loop diuretics waste potassium. Low K+ increases risk of life-threatening cardiac dysrhythmias, especially dangerous with digoxin." },
    { type: "SATA", cat: "Respiratory", stem: "Which teaching points are correct for a patient using an inhaled corticosteroid? (Select all that apply)", options: ["Rinse mouth after each use","Use a spacer if prescribed","This is a reliever inhaler for attacks","Use it regularly even when feeling well","Watch for oral thrush"], correct: [0,1,3,4], rationale: "Rinse mouth (prevents thrush), use spacer, use regularly (preventer, NOT reliever), and watch for thrush. Inhaled steroids are preventers - salbutamol is the reliever." }
];

let nclexIndex = 0;
let nclexScore = 0;
let nclexAnswered = false;
let nclexActive = [];

function openNCLEX() {
    setActiveNav('nclex');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">NCLEX Prep</span>';
    // Build category list
    const cats = [...new Set(nclexQuestions.map(q => q.cat || 'General'))].sort();
    let html = '<div class="section-header"><div><h2>&#x1F4DD; Practice Questions</h2>';
    html += `<p class="section-description">Scenario-style questions for Australian nursing students (aligned to NMBA registered nurse standards). ${nclexQuestions.length} questions available - choose a category.</p>`;
    html += '<p style="font-size:0.8rem;color:var(--text-light);margin-top:0.5rem;">Note: Australia uses active-ingredient (generic) prescribing. Always verify against Therapeutic Guidelines (eTG) and AMH.</p></div></div>';
    html += '<div class="nclex-cat-grid">';
    html += `<div class="nclex-cat-card" onclick="features.startNCLEX('all')"><div class="ncc-title">&#x1F3AF; All Categories</div><div class="ncc-count">${nclexQuestions.length} questions</div></div>`;
    cats.forEach(c => {
        const count = nclexQuestions.filter(q => (q.cat||'General') === c).length;
        html += `<div class="nclex-cat-card" onclick="features.startNCLEX('${c}')"><div class="ncc-title">${c}</div><div class="ncc-count">${count} questions</div></div>`;
    });
    html += '</div>';
    mainContent.innerHTML = html;
}

function startNCLEX(cat) {
    nclexActive = cat === 'all' ? [...nclexQuestions] : nclexQuestions.filter(q => (q.cat||'General') === cat);
    nclexActive = nclexActive.sort(() => Math.random() - 0.5);
    nclexIndex = 0; nclexScore = 0;
    renderNCLEXQuestion();
}

function renderNCLEXQuestion() {
    if (nclexIndex >= nclexActive.length) {
        mainContent.innerHTML = `<div style="text-align:center;padding:3rem 1rem;"><h2>Practice Complete!</h2><p style="font-size:2rem;font-weight:700;color:var(--primary);margin:1rem 0;">${nclexScore}/${nclexActive.length}</p><p style="color:var(--text-light);">${Math.round((nclexScore/nclexActive.length)*100)}%</p><button onclick="features.openNCLEX()" style="margin-top:1rem;padding:0.7rem 1.5rem;background:var(--primary);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Choose Another Category</button></div>`;
        saveProgress('nclex', {score: nclexScore, total: nclexActive.length, date: new Date().toISOString()});
        awardXP(nclexScore * 5 + 5, 'practice questions');
        return;
    }
    nclexAnswered = false;
    const q = nclexActive[nclexIndex];
    const isSATA = q.type === 'SATA';

    let html = '<div class="section-header"><div><h2>&#x1F4DD; Practice Question</h2>';
    html += `<p class="section-description">Question ${nclexIndex+1} of ${nclexActive.length} ${q.cat ? '&bull; '+q.cat : ''}</p></div></div>`;
    html += `<div class="nclex-question-card"><span class="nclex-type">${q.type}</span>`;
    html += `<div class="nclex-stem">${q.stem}</div>`;
    html += '<div id="nclexOptions">';
    q.options.forEach((opt, i) => {
        if (isSATA) {
            html += `<div class="nclex-option" id="nopt${i}" onclick="features.toggleNCLEXOption(${i})"><input type="checkbox" id="ncb${i}" onclick="event.stopPropagation();features.toggleNCLEXOption(${i})"> ${opt}</div>`;
        } else {
            html += `<div class="nclex-option" id="nopt${i}" onclick="features.selectNCLEXOption(${i})">${opt}</div>`;
        }
    });
    html += '</div>';
    if (isSATA) html += `<button id="nclexSubmitBtn" onclick="features.submitNCLEX()" style="margin-top:1rem;padding:0.6rem 1.25rem;background:var(--primary);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Submit Answer</button>`;
    html += `<div class="nclex-rationale" id="nclexRationale"><strong>Rationale:</strong> ${q.rationale}</div>`;
    html += `<button id="nclexNextBtn" style="display:none;margin-top:1rem;padding:0.6rem 1.25rem;background:var(--success);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;" onclick="features.nextNCLEX()">Next Question &#x2192;</button>`;
    html += '</div>';
    mainContent.innerHTML = html;
}


function toggleNCLEXOption(i) {
    if (nclexAnswered) return;
    const el = document.getElementById('nopt'+i);
    const cb = document.getElementById('ncb'+i);
    el.classList.toggle('selected');
    cb.checked = el.classList.contains('selected');
}

function selectNCLEXOption(i) {
    if (nclexAnswered) return;
    nclexAnswered = true;
    const q = nclexActive[nclexIndex];
    const isCorrect = q.correct.includes(i);
    document.querySelectorAll('.nclex-option').forEach((el, idx) => {
        el.classList.add('disabled');
        if (q.correct.includes(idx)) el.classList.add('correct-answer');
        else if (idx === i) el.classList.add('wrong-answer');
    });
    if (isCorrect) nclexScore++;
    document.getElementById('nclexRationale').classList.add('visible');
    document.getElementById('nclexNextBtn').style.display = 'inline-block';
}

function submitNCLEX() {
    if (nclexAnswered) return;
    nclexAnswered = true;
    const q = nclexActive[nclexIndex];
    const selected = [];
    q.options.forEach((_, i) => {
        if (document.getElementById('nopt'+i).classList.contains('selected')) selected.push(i);
    });
    const isCorrect = JSON.stringify(selected.sort()) === JSON.stringify([...q.correct].sort());
    document.querySelectorAll('.nclex-option').forEach((el, idx) => {
        el.classList.add('disabled');
        if (q.correct.includes(idx)) el.classList.add('correct-answer');
        else if (selected.includes(idx)) el.classList.add('wrong-answer');
    });
    if (isCorrect) nclexScore++;
    document.getElementById('nclexRationale').classList.add('visible');
    document.getElementById('nclexSubmitBtn').style.display = 'none';
    document.getElementById('nclexNextBtn').style.display = 'inline-block';
}

function nextNCLEX() { nclexIndex++; renderNCLEXQuestion(); }


// ===== 8. DRUG INTERACTION CHECKER =====
const drugInteractions = [
    { drugs: ["warfarin","aspirin"], severity: "severe", effect: "Greatly increased bleeding risk. Both affect haemostasis through different mechanisms.", nursing: "Avoid combination unless specifically ordered. Monitor for signs of bleeding." },
    { drugs: ["warfarin","ibuprofen"], severity: "severe", effect: "NSAIDs increase bleeding risk and can displace warfarin from protein binding.", nursing: "Use paracetamol instead. If NSAID required, monitor INR closely." },
    { drugs: ["metformin","contrast dye"], severity: "severe", effect: "Risk of lactic acidosis. Contrast can impair renal function needed to clear metformin.", nursing: "Hold metformin 48hrs before and after contrast. Check renal function before restarting." },
    { drugs: ["digoxin","furosemide"], severity: "moderate", effect: "Furosemide causes hypokalaemia which increases digoxin toxicity.", nursing: "Monitor potassium closely. May need K+ supplementation. Watch for digoxin toxicity signs." },
    { drugs: ["digoxin","amiodarone"], severity: "severe", effect: "Amiodarone increases digoxin levels by 70-100%. Risk of toxicity.", nursing: "Reduce digoxin dose by 50% when starting amiodarone. Monitor digoxin levels." },
    { drugs: ["ACE inhibitor","potassium"], severity: "severe", effect: "Both increase serum potassium. Risk of fatal hyperkalaemia.", nursing: "Avoid K+ supplements with ACE inhibitors unless specifically ordered. Monitor K+ levels." },
    { drugs: ["SSRI","tramadol"], severity: "severe", effect: "Both increase serotonin. Risk of serotonin syndrome (hyperthermia, rigidity, clonus).", nursing: "Monitor for serotonin syndrome: agitation, tremor, hyperthermia, hyperreflexia. Avoid combination." },
    { drugs: ["SSRI","MAOI"], severity: "severe", effect: "Serotonin syndrome - potentially fatal. Hypertensive crisis possible.", nursing: "NEVER combine. Must wait 14 days after stopping MAOI (5 weeks for fluoxetine) before starting SSRI." },
    { drugs: ["metoprolol","verapamil"], severity: "severe", effect: "Both slow heart rate. Risk of severe bradycardia, heart block, or asystole.", nursing: "Avoid combination. Monitor HR and ECG closely if both necessary. Watch for hypotension." },
    { drugs: ["ciprofloxacin","antacids"], severity: "moderate", effect: "Antacids bind ciprofloxacin in GI tract, reducing absorption by up to 90%.", nursing: "Separate administration by at least 2 hours. Give cipro first." },
    { drugs: ["warfarin","vitamin K foods"], severity: "moderate", effect: "Vitamin K counteracts warfarin. Inconsistent intake causes INR fluctuations.", nursing: "Teach consistent (not zero) vitamin K intake. Monitor INR with diet changes." },
    { drugs: ["lithium","NSAIDs"], severity: "severe", effect: "NSAIDs reduce lithium excretion, increasing levels to toxic range.", nursing: "Avoid NSAIDs. Use paracetamol for pain. If NSAID needed, check lithium level in 5 days." },
    { drugs: ["opioids","benzodiazepines"], severity: "severe", effect: "Additive CNS and respiratory depression. FDA black box warning.", nursing: "Avoid combination. If both necessary, use lowest doses and monitor respirations continuously." },
    { drugs: ["levothyroxine","calcium"], severity: "moderate", effect: "Calcium binds levothyroxine reducing absorption significantly.", nursing: "Separate by at least 4 hours. Take levothyroxine on empty stomach in morning." },
    { drugs: ["spironolactone","ACE inhibitor"], severity: "moderate", effect: "Both increase potassium. Risk of hyperkalaemia especially in renal impairment.", nursing: "Monitor potassium closely (within 1 week of starting). Avoid K+ supplements." }
];

let interactionSelected = [];

function openInteractions() {
    setActiveNav('interactions');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Interactions</span>';

    let html = '<div class="section-header"><div><h2>&#x26A0;&#xFE0F; Drug Interaction Checker</h2>';
    html += '<p class="section-description">Add medications to check for interactions</p></div></div>';
    html += `<div class="interaction-search"><input type="text" id="interactionInput" placeholder="Type a drug name..." onkeydown="if(event.key==='Enter')features.addInteractionDrug()"><button onclick="features.addInteractionDrug()">+ Add</button></div>`;
    html += '<div class="interaction-tags" id="interactionTags"></div>';
    html += '<div id="interactionResults"></div>';

    // Show all known interactions below
    html += '<h3 style="margin-top:2rem;margin-bottom:1rem;">All Known Interactions in Database:</h3>';
    drugInteractions.forEach(di => {
        html += `<div class="interaction-result">
            <div class="ir-drugs">${di.drugs.join(' + ')} <span class="ir-severity ${di.severity}">${di.severity.toUpperCase()}</span></div>
            <div class="ir-effect">${di.effect}</div>
            <div class="ir-nursing">Nursing: ${di.nursing}</div>
        </div>`;
    });
    mainContent.innerHTML = html;
    interactionSelected = [];
}


function addInteractionDrug() {
    const input = document.getElementById('interactionInput');
    const drug = input.value.trim().toLowerCase();
    if (!drug || interactionSelected.includes(drug)) { input.value = ''; return; }
    interactionSelected.push(drug);
    input.value = '';
    renderInteractionTags();
    checkInteractions();
}

function removeInteractionDrug(drug) {
    interactionSelected = interactionSelected.filter(d => d !== drug);
    renderInteractionTags();
    checkInteractions();
}

function renderInteractionTags() {
    const container = document.getElementById('interactionTags');
    container.innerHTML = interactionSelected.map(d => 
        `<span class="interaction-tag">${d} <span class="remove-tag" onclick="features.removeInteractionDrug('${d}')">&times;</span></span>`
    ).join('');
}

function checkInteractions() {
    const results = document.getElementById('interactionResults');
    if (interactionSelected.length < 2) { results.innerHTML = '<p style="color:var(--text-light);">Add at least 2 medications to check interactions.</p>'; return; }

    const found = drugInteractions.filter(di => {
        const diLower = di.drugs.map(d => d.toLowerCase());
        let matches = 0;
        interactionSelected.forEach(sel => {
            if (diLower.some(d => d.includes(sel) || sel.includes(d))) matches++;
        });
        return matches >= 2;
    });

    if (found.length === 0) {
        results.innerHTML = '<div style="background:#d1fae5;padding:1rem;border-radius:8px;color:#065f46;font-weight:600;">&#x2705; No known interactions found between these medications in our database.</div>';
    } else {
        results.innerHTML = found.map(di => `<div class="interaction-result">
            <div class="ir-drugs">${di.drugs.join(' + ')} <span class="ir-severity ${di.severity}">${di.severity.toUpperCase()}</span></div>
            <div class="ir-effect">${di.effect}</div>
            <div class="ir-nursing">Nursing: ${di.nursing}</div>
        </div>`).join('');
    }
}

// ===== TIMED QUIZ MODE =====
let tqQuestions = [];
let tqIndex = 0;
let tqScore = 0;
let tqTimer = null;
let tqTimeLeft = 0;
let tqStartTime = 0;
const TQ_SECONDS = 15;

function openTimedQuiz() {
    setActiveNav('timedquiz');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Timed Quiz</span>';
    let html = '<div class="section-header"><div><h2>&#x23F1;&#xFE0F; Timed Quiz Challenge</h2>';
    html += '<p class="section-description">10 questions, 15 seconds each. Beat the clock!</p></div></div>';
    html += '<div style="text-align:center;padding:2rem 1rem;">';
    html += '<div style="margin-bottom:1rem;"><label style="font-size:0.9rem;">Category: </label><select id="tqCategory" style="padding:0.5rem;border:1px solid var(--border);border-radius:8px;"><option value="all">All Medications</option>';
    for (const [key, cat] of Object.entries(medicationDatabase)) {
        html += `<option value="${key}">${cat.icon} ${cat.name}</option>`;
    }
    html += '</select></div>';
    html += '<button onclick="features.startTimedQuiz()" style="padding:0.8rem 2rem;background:var(--warning);color:white;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;">&#x1F680; Start Challenge</button>';
    html += '</div>';
    mainContent.innerHTML = html;
}

function startTimedQuiz() {
    const catKey = document.getElementById('tqCategory') ? document.getElementById('tqCategory').value : 'all';
    let pool = getAllMeds();
    if (catKey !== 'all') pool = pool.filter(m => m.category === catKey);
    if (pool.length < 4) { alert('Not enough medications in this category for a quiz.'); return; }

    tqQuestions = buildTimedQuestions(pool, 10);
    tqIndex = 0; tqScore = 0; tqStartTime = Date.now();
    renderTimedQuestion();
}

function buildTimedQuestions(pool, count) {
    const questions = [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    const qTypes = ['brand', 'mechanism', 'sideEffect', 'indication'];
    shuffled.forEach(med => {
        const others = pool.filter(m => m.generic !== med.generic).sort(() => Math.random() - 0.5).slice(0, 3);
        const t = qTypes[Math.floor(Math.random() * qTypes.length)];
        let q = {};
        if (t === 'brand') q = { text: `Brand name for "${med.generic}"?`, correct: med.brand, options: shuffle([med.brand, ...others.map(m => m.brand)]) };
        else if (t === 'mechanism') q = { text: `Which drug: "${med.mechanism.substring(0,70)}..."?`, correct: med.generic, options: shuffle([med.generic, ...others.map(m => m.generic)]) };
        else if (t === 'sideEffect') q = { text: `A side effect of ${med.generic}?`, correct: med.sideEffects[0], options: shuffle([med.sideEffects[0], ...others.map(m => m.sideEffects[0])]) };
        else q = { text: `An indication for ${med.generic}?`, correct: med.indications[0], options: shuffle([med.indications[0], ...others.map(m => m.indications[0])]) };
        questions.push(q);
    });
    return questions;
}

function renderTimedQuestion() {
    if (tqTimer) { clearInterval(tqTimer); tqTimer = null; }
    if (tqIndex >= tqQuestions.length) {
        const totalTime = Math.round((Date.now() - tqStartTime) / 1000);
        mainContent.innerHTML = `<div style="text-align:center;padding:3rem 1rem;"><h2>&#x23F1;&#xFE0F; Challenge Complete!</h2><p style="font-size:2.5rem;font-weight:700;color:var(--primary);margin:1rem 0;">${tqScore}/${tqQuestions.length}</p><p style="color:var(--text-light);">${Math.round((tqScore/tqQuestions.length)*100)}% correct &bull; ${totalTime}s total</p><button onclick="features.openTimedQuiz()" style="margin-top:1.5rem;padding:0.7rem 1.5rem;background:var(--warning);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Play Again</button></div>`;
        saveProgress('timed', {score: tqScore, total: tqQuestions.length, date: new Date().toISOString()});
        awardXP(tqScore * 3 + 5, 'timed quiz');
        return;
    }
    const q = tqQuestions[tqIndex];
    tqTimeLeft = TQ_SECONDS;
    let html = '<div class="section-header"><div><h2>&#x23F1;&#xFE0F; Timed Quiz</h2>';
    html += `<p class="section-description">Question ${tqIndex+1} of ${tqQuestions.length} &bull; Score: ${tqScore}</p></div></div>`;
    html += `<div class="tq-timer-bar"><div class="tq-timer-fill" id="tqTimerFill"></div></div>`;
    html += `<div class="tq-timer-text" id="tqTimerText">${tqTimeLeft}s</div>`;
    html += `<div class="nclex-question-card"><div class="nclex-stem">${q.text}</div>`;
    q.options.forEach((opt, i) => {
        html += `<div class="nclex-option" id="tqopt${i}" onclick="features.answerTimed(${i})">${opt}</div>`;
    });
    html += '</div>';
    mainContent.innerHTML = html;

    tqTimer = setInterval(() => {
        tqTimeLeft--;
        const fill = document.getElementById('tqTimerFill');
        const txt = document.getElementById('tqTimerText');
        if (fill) fill.style.width = (tqTimeLeft / TQ_SECONDS * 100) + '%';
        if (txt) txt.textContent = tqTimeLeft + 's';
        if (tqTimeLeft <= 0) { answerTimed(-1); }
    }, 1000);
}

function answerTimed(i) {
    if (tqTimer) { clearInterval(tqTimer); tqTimer = null; }
    const q = tqQuestions[tqIndex];
    document.querySelectorAll('.nclex-option').forEach((el, idx) => {
        el.classList.add('disabled');
        if (q.options[idx] === q.correct) el.classList.add('correct-answer');
        else if (idx === i) el.classList.add('wrong-answer');
    });
    if (i >= 0 && q.options[i] === q.correct) tqScore++;
    setTimeout(() => { tqIndex++; renderTimedQuestion(); }, 1200);
}

const mnemonicsData = [
    { category: "Drug Suffix Patterns", items: [
        { trick: "-pril", meaning: "ACE Inhibitors", example: "lisinoPRIL, enalaPRIL, ramiPRIL - watch for cough & angiooedema" },
        { trick: "-sartan", meaning: "ARBs (Angiotensin Receptor Blockers)", example: "loSARTAN, valSARTAN - like ACE but no cough" },
        { trick: "-olol", meaning: "Beta Blockers", example: "metoprOLOL, atenOLOL, propranOLOL - lower HR & BP" },
        { trick: "-dipine", meaning: "Calcium Channel Blockers (dihydropyridines)", example: "amloDIPINE, nifeDIPINE - watch for oedema" },
        { trick: "-statin", meaning: "HMG-CoA Reductase Inhibitors (cholesterol)", example: "atorvaSTATIN, simvaSTATIN - watch for muscle pain" },
        { trick: "-prazole", meaning: "Proton Pump Inhibitors", example: "omePRAZOLE, pantoPRAZOLE - reduce stomach acid" },
        { trick: "-tidine", meaning: "H2 Blockers", example: "famoTIDINE, cimeTIDINE - reduce stomach acid" },
        { trick: "-cillin", meaning: "Penicillin Antibiotics", example: "amoxiCILLIN, ampiCILLIN - ask about allergy" },
        { trick: "-floxacin", meaning: "Fluoroquinolone Antibiotics", example: "ciproFLOXACIN, levoFLOXACIN - tendon rupture risk" },
        { trick: "-cycline", meaning: "Tetracycline Antibiotics", example: "doxyCYCLINE - avoid dairy, sun sensitivity" },
        { trick: "-mycin/-micin", meaning: "Aminoglycosides / Macrolides", example: "genta-MICIN (nephro/ototoxic); azithro-MYCIN (macrolide)" },
        { trick: "-pam/-lam", meaning: "Benzodiazepines", example: "loraze-PAM, alprazo-LAM, midazo-LAM - sedation" },
        { trick: "-ine (SSRIs vary)", meaning: "Many antidepressants", example: "fluoxetine, sertraline, paroxetine - 4-6 wks to work" },
        { trick: "-vir", meaning: "Antivirals", example: "acyclo-VIR, oseltami-VIR (Tamiflu), tenofo-VIR" },
        { trick: "-azole", meaning: "Antifungals (and some PPIs)", example: "flucon-AZOLE, ketocon-AZOLE - check LFTs" }
    ]},
    { category: "Classic Memory Devices", items: [
        { trick: "A PINCH", meaning: "Australian high-risk medicines (ACSQHC)", example: "Anti-infectives, Potassium/electrolytes, Insulin, Narcotics/opioids, Chemo, Heparin/anticoagulants" },
        { trick: "RIPE", meaning: "TB drugs", example: "Rifampicin, Isoniazid, Pyrazinamide, Ethambutol" },
        { trick: "LOT (safe in liver disease)", meaning: "Benzos with no active metabolites", example: "Lorazepam, Oxazepam, Temazepam" },
        { trick: "'Red devil'", meaning: "Doxorubicin", example: "Red-orange urine + cardiotoxicity" },
        { trick: "MURDER (aspirin toxicity)", meaning: "Salicylate overdose signs", example: "Metabolic acidosis, Uraemia, Respiratory alkalosis, Dizziness, Epigastric pain, Rhabdomyolysis" },
        { trick: "'A' insulins are Aspart/Analog rapid", meaning: "Rapid-acting insulin", example: "Aspart (NovoLog), lispro - give with meals" },
        { trick: "Digoxin: 'SALT'", meaning: "Digoxin toxicity signs", example: "See halos, Arrhythmias, Loss of appetite, Throwing up" },
        { trick: "Warfarin antidote = Vitamin K", meaning: "Reversal agents", example: "Heparin antidote = Protamine sulfate" },
        { trick: "'Mag' = calm", meaning: "Magnesium sulfate", example: "Loss of deep tendon reflexes = toxicity; antidote = calcium gluconate" }
    ]}
];

function openMnemonics() {
    setActiveNav('mnemonics');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Mnemonics</span>';
    let html = '<div class="section-header"><div><h2>&#x1F9E0; Mnemonics & Memory Aids</h2>';
    html += '<p class="section-description">Suffix patterns and memory tricks to master pharmacology fast</p></div></div>';
    mnemonicsData.forEach(group => {
        html += `<h3 style="margin:1.25rem 0 0.75rem;color:var(--secondary);">${group.category}</h3>`;
        group.items.forEach(item => {
            html += `<div class="mnemonic-card">
                <div class="mnemonic-trick">${item.trick}</div>
                <div class="mnemonic-meaning">${item.meaning}</div>
                <div class="mnemonic-example">${item.example}</div>
            </div>`;
        });
    });
    mainContent.innerHTML = html;
}

// ===== EXTERNAL REFERENCES & RESOURCES =====
// Curated authoritative Australian drug & clinical references.
// access: 'free' | 'sub' (subscription) | 'login' (institutional/personal login)
const referenceGroups = [
    {
        group: 'Core Drug References',
        icon: '\uD83D\uDCD8',
        items: [
            { name: 'Australian Medicines Handbook (AMH)', desc: 'Independent, evidence-based national drug reference for quality use of medicines.', url: 'https://amhonline.amh.net.au/', access: 'sub' },
            { name: 'Therapeutic Guidelines (eTG complete)', desc: 'Trusted, expert, evidence-based treatment guidelines across conditions.', url: 'https://www.tg.org.au/', access: 'sub' },
            { name: 'Australian Injectable Drugs Handbook (AIDH)', desc: 'Preparation & administration info for 500+ injectable medicines. The "yellow book".', url: 'https://www.tg.org.au/products/australianinjectabledrugshandbook/', access: 'sub' },
            { name: 'AMH Children\u2019s Dosing Companion', desc: 'Paediatric dosing guidance (birth to 18 years), aligned with AMH.', url: 'https://shop.amh.net.au/cdc', access: 'sub' },
            { name: 'MIMS Online', desc: 'Comprehensive prescribing and product information database.', url: 'https://www.mimsonline.com.au/', access: 'sub' }
        ]
    },
    {
        group: 'Government & Regulatory',
        icon: '\uD83C\uDFDB\uFE0F',
        items: [
            { name: 'TGA \u2013 PI & CMI Search', desc: 'Official Product Information and Consumer Medicine Information documents (ARTG).', url: 'https://www.tga.gov.au/', access: 'free' },
            { name: 'PBS \u2013 Pharmaceutical Benefits Scheme', desc: 'Subsidised medicines, restrictions, authority requirements and pricing.', url: 'https://www.pbs.gov.au/', access: 'free' },
            { name: 'TGA Medicine Shortages', desc: 'Current and anticipated medicine shortage information.', url: 'https://apps.tga.gov.au/prod/MSI/search', access: 'free' }
        ]
    },
    {
        group: 'Consumer & Professional Information',
        icon: '\uD83D\uDCF0',
        items: [
            { name: 'healthdirect \u2013 Medicines', desc: 'Government-funded, plain-language consumer medicine information.', url: 'https://www.healthdirect.gov.au/medicines', access: 'free' },
            { name: 'Australian Prescriber', desc: 'Free, independent, peer-reviewed journal of drugs and therapeutics.', url: 'https://australianprescriber.tg.org.au/', access: 'free' }
        ]
    },
    {
        group: 'Standards & Medication Safety',
        icon: '\u2705',
        items: [
            { name: 'NMBA \u2013 Standards for Practice', desc: 'Registered Nurse standards, decision-making framework and codes.', url: 'https://www.nursingmidwiferyboard.gov.au/', access: 'free' },
            { name: 'ACSQHC \u2013 Medication Safety', desc: 'National standards, high-risk medicines (A PINCH) and safety resources.', url: 'https://www.safetyandquality.gov.au/our-work/medication-safety', access: 'free' }
        ]
    }
];

const ACCESS_LABELS = {
    free: { text: 'Free', cls: 'free' },
    sub: { text: 'Subscription', cls: 'sub' },
    login: { text: 'Institutional login', cls: 'login' }
};

function openReferences() {
    setActiveNav('references');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">References</span>';

    let html = '<div class="section-header"><div><h2>&#x1F517; References & Resources</h2>';
    html += '<p class="section-description">Authoritative Australian drug and clinical references. Always verify medicines against these primary sources before clinical practice.</p></div></div>';

    html += '<div class="ref-note">&#x2139;&#xFE0F; Links open the official sites in a new tab. Resources marked <span class="ref-badge sub">Subscription</span> or <span class="ref-badge login">Institutional login</span> usually require a personal subscription or access through your hospital, university or library (e.g. CIAP in NSW, or an OpenAthens/library login).</div>';

    referenceGroups.forEach(group => {
        html += `<h3 class="ref-group-title">${group.icon} ${group.group}</h3>`;
        html += '<div class="ref-grid">';
        group.items.forEach(item => {
            const badge = ACCESS_LABELS[item.access] || ACCESS_LABELS.free;
            html += `<a class="ref-card" href="${item.url}" target="_blank" rel="noopener noreferrer">
                <div class="ref-card-top">
                    <span class="ref-name">${item.name}</span>
                    <span class="ref-badge ${badge.cls}">${badge.text}</span>
                </div>
                <div class="ref-desc">${item.desc}</div>
                <div class="ref-link">Open resource <span class="ref-arrow">&#x2197;</span></div>
            </a>`;
        });
        html += '</div>';
    });

    mainContent.innerHTML = html;
}

// ===== LOOK-ALIKE / SOUND-ALIKE (LASA) DRUGS =====
const lasaPairs = [
    { a: "hydralazine", b: "hydroxyzine", note: "Hydralazine = vasodilator (BP). Hydroxyzine = antihistamine/anxiety. Very commonly confused!" },
    { a: "hydromorphone", b: "morphine", note: "Hydromorphone (Dilaudid) is ~7x more potent than morphine. Dose errors can be fatal." },
    { a: "clonidine", b: "klonopin (clonazepam)", note: "Clonidine = antihypertensive. Clonazepam = benzodiazepine. Sound-alike names." },
    { a: "metformin", b: "metronidazole", note: "Metformin = diabetes. Metronidazole (Flagyl) = antibiotic. Both start with 'metro/metf'." },
    { a: "prednisone", b: "prednisolone", note: "Both corticosteroids but different potency/forms. Verify carefully." },
    { a: "Losec (omeprazole)", b: "Lasix (frusemide/furosemide)", note: "Losec = proton pump inhibitor. Lasix = loop diuretic. A classic Australian sound-alike/look-alike error." },
    { a: "Lamictal (lamotrigine)", b: "Lamisil (terbinafine)", note: "Lamictal = anticonvulsant/mood stabiliser. Lamisil = antifungal. Look-alike names, both available in Australia." },
    { a: "NovoRapid (aspart)", b: "Protaphane (NPH)", note: "NovoRapid = rapid-acting. Protaphane = intermediate NPH. Insulin mix-ups are high-alert errors - always double-check." },
    { a: "humalog (lispro)", b: "humulin", note: "Humalog = rapid-acting analog. Humulin = human insulin (R or N). Verify insulin type." },
    { a: "cefazolin", b: "cefotetan", note: "Both cephalosporins with similar names - different spectrum/uses." },
    { a: "vinblastine", b: "vincristine", note: "Both vinca alkaloid chemo. Different toxicity profiles. Fatal if confused." },
    { a: "chlorpromazine", b: "chlorpropamide", note: "Chlorpromazine = antipsychotic. Chlorpropamide = sulfonylurea (diabetes)." },
    { a: "tramadol", b: "trazodone", note: "Tramadol = opioid analgesic. Trazodone = antidepressant/sleep. Sound-alike." },
    { a: "sitagliptin", b: "sumatriptan", note: "Sitagliptin = diabetes (DPP-4). Sumatriptan = migraine (triptan)." },
    { a: "fentanyl", b: "sufentanil", note: "Both potent opioids; sufentanil is even more potent. Verify concentration/dose." }
];

function openLookAlike() {
    setActiveNav('lookalike');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Look-Alike/Sound-Alike</span>';
    let html = '<div class="section-header"><div><h2>&#x1F440; Look-Alike / Sound-Alike (LASA) Drugs</h2>';
    html += '<p class="section-description">Commonly confused medication pairs. Always verify with two identifiers to prevent errors.</p></div></div>';
    lasaPairs.forEach(p => {
        html += `<div class="lasa-card">
            <div class="lasa-pair"><span class="lasa-drug">${p.a}</span><span class="lasa-vs">vs</span><span class="lasa-drug">${p.b}</span></div>
            <div class="lasa-note">&#x26A0;&#xFE0F; ${p.note}</div>
        </div>`;
    });
    mainContent.innerHTML = html;
}

// ===== RIGHTS OF MEDICATION ADMINISTRATION =====
function openRights() {
    setActiveNav('rights');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Rights</span>';
    const rights = [
        ['Right Patient', 'Use 2 identifiers (full name + date of birth). Check the ID band against the chart.'],
        ['Right Medication', 'Check the medication name against the chart. Beware look-alike/sound-alike names.'],
        ['Right Dose', 'Confirm the dose and calculation. Have a second nurse check high-risk medicines.'],
        ['Right Route', 'Confirm the route (PO, IV, IM, SubCut, topical). Never assume.'],
        ['Right Time', 'Give within the correct time frame. Check frequency and last dose given.'],
        ['Right Documentation', 'Sign the chart immediately AFTER administration - never before.'],
        ['Right Reason / Indication', 'Understand why the patient is receiving this medicine.'],
        ['Right Response', 'Evaluate the effect - did it work? Any adverse reaction?'],
        ['Right to Refuse', 'A competent patient may refuse. Educate, document, and notify as needed.'],
        ['Right Education', 'Teach the patient about the medicine, its purpose and side effects.']
    ];
    let html = '<div class="section-header"><div><h2>&#x2705; Rights of Medication Administration</h2>';
    html += '<p class="section-description">The safety framework every nurse follows. Combine with the 3 checks below.</p></div></div>';
    html += '<div class="rights-3checks"><strong>&#x1F50D; The 3 Checks</strong> - check the medication label: (1) when taking it from storage, (2) when preparing/pouring it, and (3) at the bedside before giving it.</div>';
    rights.forEach((r, i) => {
        html += `<div class="right-card"><div class="right-num">${i+1}</div><div class="right-body"><div class="right-title">${r[0]}</div><div class="right-desc">${r[1]}</div></div></div>`;
    });
    html += '<div class="apinch-box" style="margin-top:1.5rem;"><strong>Before &amp; after giving, also assess:</strong> relevant vital signs (e.g. BP before antihypertensives, HR before beta-blockers/digoxin, blood glucose before insulin, respiratory rate before opioids), allergies, and relevant pathology (e.g. potassium, INR, drug levels).</div>';
    mainContent.innerHTML = html;
}

// ===== CASE STUDIES =====
const caseStudies = [
    { title: "Heart failure - fluid overload", system: "Cardiovascular", scenario: "Mrs Patel, 72, is admitted with worsening heart failure. She is short of breath with pitting oedema and crackles at the lung bases. She is charted frusemide (Lasix) 40 mg IV and takes digoxin daily. Her latest potassium is 3.1 mmol/L.", questions: [
        { q: "What is the priority concern before giving digoxin?", options: ["The low potassium (hypokalaemia increases digoxin toxicity)","Her oedema","Her shortness of breath","Her age"], correct: 0, rationale: "Hypokalaemia (K 3.1) potentiates digoxin and increases the risk of toxicity and arrhythmias. Check the potassium and apical pulse before giving digoxin; report the low K+." },
        { q: "The frusemide is likely to worsen which electrolyte problem?", options: ["Hypokalaemia","Hyperkalaemia","Hypercalcaemia","Hypernatraemia"], correct: 0, rationale: "Loop diuretics like frusemide cause potassium loss, which can worsen her already low potassium - monitor closely and anticipate replacement." }
    ]},
    { title: "Asthma exacerbation", system: "Respiratory", scenario: "Jack, 19, presents to ED with an acute asthma attack. He is wheezing and using accessory muscles. He is charted salbutamol (Ventolin) via nebuliser and IV hydrocortisone.", questions: [
        { q: "What is the expected immediate effect of salbutamol?", options: ["Bronchodilation and easier breathing","Reduced inflammation over days","Lowered blood pressure","Sedation"], correct: 0, rationale: "Salbutamol is a short-acting beta-2 agonist (reliever) - it relaxes bronchial smooth muscle for rapid bronchodilation. Steroids work on inflammation over hours to days." },
        { q: "Which side effect of salbutamol should you monitor?", options: ["Tachycardia and tremor","Bradycardia","Constipation","Hyperkalaemia"], correct: 0, rationale: "Salbutamol commonly causes tachycardia, tremor and can lower potassium. Monitor heart rate and for tremor, especially with repeated dosing." }
    ]},
    { title: "Post-op pain and opioids", system: "CNS", scenario: "Mr Nguyen, 68, is day 1 post-op. He is charted oxycodone (Endone) for pain. On assessment his respiratory rate is 8 and he is difficult to rouse.", questions: [
        { q: "What is your priority action?", options: ["Withhold the opioid and assess/escalate - possible respiratory depression","Give the next dose to keep him comfortable","Document and reassess in 4 hours","Encourage him to mobilise"], correct: 0, rationale: "RR of 8 with sedation suggests opioid-induced respiratory depression. Withhold the opioid, stimulate/assess the patient, apply oxygen, escalate, and have naloxone available." },
        { q: "Oxycodone is what schedule in Australia?", options: ["Schedule 8 (controlled drug)","Schedule 2","Schedule 4","Unscheduled"], correct: 0, rationale: "Oxycodone is a Schedule 8 (S8) controlled drug - it requires drug register checks and two-nurse checking per local policy." }
    ]},
    { title: "New warfarin patient", system: "Cardiovascular", scenario: "Mrs Lee, 65, is started on warfarin (Marevan) for atrial fibrillation. Her INR today is 3.8. She asks about her diet and pain relief for a headache.", questions: [
        { q: "Her INR of 3.8 (target 2-3) means:", options: ["She is over-anticoagulated - increased bleeding risk","She needs a higher dose","The warfarin isn't working","This is the ideal range"], correct: 0, rationale: "An INR of 3.8 is above the usual target range of 2-3, indicating over-anticoagulation and increased bleeding risk. Anticipate withholding/adjusting the dose per orders." },
        { q: "What should you advise for her headache?", options: ["Paracetamol (avoid NSAIDs like ibuprofen)","Ibuprofen","Aspirin","Naproxen"], correct: 0, rationale: "NSAIDs and aspirin increase bleeding risk with warfarin. Paracetamol is the preferred simple analgesic." }
    ]},
    { title: "Seizure management - phenytoin", system: "CNS", scenario: "Mr Brown, 45, is on IV phenytoin (Dilantin) for status epilepticus. His latest phenytoin level is 25 mg/L. You notice he has nystagmus, slurred speech and unsteadiness.", questions: [
        { q: "What do these findings most likely indicate?", options: ["Phenytoin toxicity (level is above the therapeutic range)","A new stroke","Normal post-seizure state","Alcohol intoxication"], correct: 0, rationale: "The therapeutic range is 10-20 mg/L. A level of 25 with nystagmus, ataxia and slurred speech are classic signs of phenytoin toxicity. Withhold the dose and notify the prescriber." },
        { q: "Which is essential when giving IV phenytoin?", options: ["Give slowly with cardiac monitoring (max 50 mg/min) and flush with saline","Give as a rapid bolus","Mix with glucose (dextrose) solution","Give IM for faster effect"], correct: 0, rationale: "IV phenytoin must be given slowly (max 50 mg/min) with cardiac monitoring due to risk of hypotension and arrhythmias. It is incompatible with glucose solutions - flush the line with normal saline." }
    ]},
    { title: "Hypoglycaemia - insulin", system: "Endocrine", scenario: "Sophie, 24, has type 1 diabetes. Before lunch she is sweaty, shaky and confused. Her blood glucose is 2.8 mmol/L. She is conscious and able to swallow.", questions: [
        { q: "What is your first action?", options: ["Give 15 g of fast-acting carbohydrate and recheck in 15 minutes","Give her rapid-acting insulin","Call a code and start CPR","Withhold all food until the doctor reviews"], correct: 0, rationale: "For conscious hypoglycaemia, follow the rule of 15: give 15 g fast-acting carbohydrate (e.g. juice or glucose tablets), recheck BGL in 15 minutes. Never give insulin when the glucose is low." },
        { q: "Which insulin is given WITH meals to cover carbohydrate?", options: ["Rapid-acting (e.g. aspart / NovoRapid)","Long-acting (e.g. glargine / Lantus)","Isophane / NPH only","No insulin is given with meals"], correct: 0, rationale: "Rapid-acting insulins (aspart, lispro) are given with meals to cover carbohydrate intake. Long-acting insulins provide background (basal) cover and are not meal-dependent." }
    ]},
    { title: "Hypothyroidism - levothyroxine", system: "Endocrine", scenario: "Mrs Kelly, 58, is newly prescribed levothyroxine (Oroxine) for hypothyroidism. She takes a calcium supplement and an iron tablet each morning with breakfast.", questions: [
        { q: "What is the best administration advice?", options: ["Take on an empty stomach 30-60 min before breakfast, separate from calcium/iron by 4 hours","Take it with the calcium and iron for convenience","Take it at night with food","It does not matter when it is taken"], correct: 0, rationale: "Levothyroxine is best absorbed on an empty stomach 30-60 minutes before food. Calcium and iron significantly reduce its absorption, so separate them by about 4 hours." },
        { q: "Which finding suggests the dose may be too high?", options: ["Palpitations, tremor, weight loss and heat intolerance","Fatigue, weight gain and cold intolerance","Constipation and dry skin","No symptoms at all"], correct: 0, rationale: "Signs of over-replacement mimic hyperthyroidism: palpitations, tremor, weight loss, heat intolerance. Report these - the dose likely needs reducing. TSH is monitored to guide dosing." }
    ]},
    { title: "Lithium monitoring", system: "Psychiatric", scenario: "Mr Adams, 40, takes lithium for bipolar disorder. He presents with vomiting, diarrhoea, a coarse tremor and slurred speech after a recent gastro illness. His lithium level is 1.8 mmol/L.", questions: [
        { q: "What do these findings indicate?", options: ["Lithium toxicity (level above the narrow therapeutic range)","Normal side effects","The dose is too low","A viral illness only"], correct: 0, rationale: "The therapeutic range is narrow (0.6-1.2 mmol/L). A level of 1.8 with GI upset, coarse tremor and slurred speech signals toxicity. Dehydration from gastro raises lithium levels. Withhold and escalate." },
        { q: "Which advice helps prevent lithium toxicity?", options: ["Maintain consistent fluid and salt intake; avoid dehydration and NSAIDs","Restrict all fluids","Take extra doses when feeling unwell","Add ibuprofen for aches"], correct: 0, rationale: "Lithium levels rise with dehydration, low sodium, and NSAIDs. Teach consistent hydration and salt intake, and to avoid NSAIDs. Regular level monitoring is essential." }
    ]},
    { title: "Serotonin syndrome risk", system: "Psychiatric", scenario: "Ms Taylor, 33, takes sertraline (an SSRI). She is given tramadol for back pain. Hours later she is agitated, sweaty, with tremor, hyperreflexia and a temperature of 38.9 degrees C.", questions: [
        { q: "What is the most likely cause?", options: ["Serotonin syndrome from combining an SSRI with tramadol","A simple fever","Opioid overdose","An allergic reaction"], correct: 0, rationale: "SSRIs plus other serotonergic drugs (tramadol) can cause serotonin syndrome: agitation, tremor, hyperreflexia, hyperthermia, sweating. Stop the serotonergic agents and escalate urgently." },
        { q: "SSRIs typically take how long for full antidepressant effect?", options: ["4-6 weeks","Within a few hours","24 hours","6 months"], correct: 0, rationale: "SSRIs take about 4-6 weeks for full effect. Teach patients not to stop abruptly (discontinuation syndrome) and to report worsening mood or suicidal thoughts early in treatment." }
    ]},
    { title: "NSAID risks & gout", system: "Musculoskeletal", scenario: "Mr Rossi, 62, has an acute gout flare and is charted indometacin (Indocid). He has a history of a peptic ulcer, hypertension and stage 3 chronic kidney disease.", questions: [
        { q: "What is the main concern with an NSAID for this patient?", options: ["GI bleeding, worsening renal function and fluid retention/raised BP","Sedation","Bradycardia","Hypoglycaemia"], correct: 0, rationale: "NSAIDs increase the risk of GI bleeding (especially with a prior ulcer), can worsen renal function, and cause fluid retention that raises blood pressure. Use with caution - report concerns to the prescriber." },
        { q: "What advice reduces NSAID GI risk?", options: ["Take with food; a PPI may be prescribed for protection","Take on an empty stomach","Crush and take without water","Double the dose for faster relief"], correct: 0, rationale: "Taking NSAIDs with food and co-prescribing a proton pump inhibitor (e.g. pantoprazole) reduces GI irritation and ulcer risk. Use the lowest effective dose for the shortest time." }
    ]},
    { title: "Long-term corticosteroids", system: "Musculoskeletal", scenario: "Mrs Osei, 70, has taken prednisolone daily for 6 months for polymyalgia rheumatica. She asks if she can just stop it now that she feels better.", questions: [
        { q: "What is the key teaching point?", options: ["Never stop abruptly - it must be tapered to avoid adrenal crisis","Stop immediately once symptoms improve","Double the dose then stop","Only take it when in pain"], correct: 0, rationale: "Long-term corticosteroids suppress the adrenal axis. Abrupt cessation can cause acute adrenal insufficiency (adrenal crisis). The dose must be tapered slowly under medical guidance." },
        { q: "Which long-term effect should be monitored?", options: ["Hyperglycaemia, osteoporosis, infection risk and weight gain","Bradycardia","Low blood glucose","Hair loss only"], correct: 0, rationale: "Long-term steroids cause hyperglycaemia, osteoporosis, immunosuppression (infection risk), weight gain, and Cushingoid features. Monitor glucose, bone health, and signs of infection." }
    ]}
];

let caseIndex = 0;
let caseQ = 0;

let caseFilter = 'All';

function openCaseStudies(filter) {
    setActiveNav('cases');
    if (filter) caseFilter = filter;
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Case Studies</span>';
    const systems = ['All', ...[...new Set(caseStudies.map(c => c.system || 'Other'))].sort()];
    let html = '<div class="section-header"><div><h2>&#x1F4CB; Clinical Case Studies</h2>';
    html += '<p class="section-description">Apply your knowledge to realistic scenarios. Filter by body system, then choose a case.</p></div></div>';
    html += '<div class="case-filter-row">';
    systems.forEach(s => {
        html += `<button class="case-filter-btn ${caseFilter === s ? 'active' : ''}" onclick="features.openCaseStudies('${s}')">${s}</button>`;
    });
    html += '</div>';
    html += '<div class="classes-grid">';
    caseStudies.forEach((c, i) => {
        if (caseFilter !== 'All' && (c.system || 'Other') !== caseFilter) return;
        html += `<div class="class-card" onclick="features.startCase(${i})"><div class="class-title">${c.title}</div><div class="class-description"><span class="case-system-badge">${c.system || 'Other'}</span></div><div class="class-med-count">${c.questions.length} questions</div></div>`;
    });
    html += '</div>';
    mainContent.innerHTML = html;
}

function startCase(i) { caseIndex = i; caseQ = 0; renderCase(); }

function renderCase() {
    const c = caseStudies[caseIndex];
    let html = '<div class="section-header"><div><h2>&#x1F4CB; ' + c.title + '</h2></div></div>';
    html += `<div class="case-scenario">${c.scenario}</div>`;
    const q = c.questions[caseQ];
    html += `<div class="nclex-question-card"><div class="nclex-stem">Q${caseQ+1}: ${q.q}</div>`;
    q.options.forEach((opt, idx) => {
        html += `<div class="nclex-option" id="copt${idx}" onclick="features.answerCase(${idx})">${opt}</div>`;
    });
    html += `<div class="nclex-rationale" id="caseRationale"><strong>Rationale:</strong> ${q.rationale}</div>`;
    html += `<button id="caseNext" style="display:none;margin-top:1rem;padding:0.6rem 1.25rem;background:var(--success);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;" onclick="features.nextCase()">${caseQ < c.questions.length-1 ? 'Next Question &#x2192;' : 'Back to Cases'}</button>`;
    html += '</div>';
    mainContent.innerHTML = html;
}

function answerCase(idx) {
    const c = caseStudies[caseIndex];
    const q = c.questions[caseQ];
    document.querySelectorAll('.nclex-option').forEach((el, i) => {
        el.classList.add('disabled');
        if (i === q.correct) el.classList.add('correct-answer');
        else if (i === idx) el.classList.add('wrong-answer');
    });
    document.getElementById('caseRationale').classList.add('visible');
    document.getElementById('caseNext').style.display = 'inline-block';
}

function nextCase() {
    const c = caseStudies[caseIndex];
    if (caseQ < c.questions.length - 1) { caseQ++; renderCase(); }
    else { awardXP(15, 'case study'); openCaseStudies(); }
}

// ===== DRUG CALCULATIONS PRACTICE =====
let calcCurrent = null;
let calcScore = 0;
let calcAttempts = 0;

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildCalcProblem(type) {
    if (type === 'tablet') {
        const per = [25, 50, 100, 250, 500][randInt(0,4)];
        const mult = randInt(1,4) * 0.5;
        const order = +(per * mult);
        return { q: `Order: ${order} mg. Stock: ${per} mg tablets. How many tablets do you give?`, a: order/per, unit: 'tablet(s)', work: `Dose \u00F7 stock = ${order} \u00F7 ${per} = ${order/per} tablet(s)` };
    }
    if (type === 'liquid') {
        const strength = [5, 10, 25, 50][randInt(0,3)];
        const vol = [5, 1][randInt(0,1)];
        const mult = randInt(2,6);
        const order = strength * mult;
        return { q: `Order: ${order} mg. Stock: ${strength} mg/${vol} mL. How many mL do you give?`, a: (order/strength)*vol, unit: 'mL', work: `(Dose \u00F7 stock) \u00D7 volume = (${order} \u00F7 ${strength}) \u00D7 ${vol} = ${(order/strength)*vol} mL` };
    }
    if (type === 'ivrate') {
        const vol = [500, 1000, 250, 100][randInt(0,3)];
        const hrs = [4, 6, 8, 12, 24][randInt(0,4)];
        return { q: `Infuse ${vol} mL over ${hrs} hours. What is the rate in mL/hr?`, a: +(vol/hrs).toFixed(1), unit: 'mL/hr', work: `Volume \u00F7 time = ${vol} \u00F7 ${hrs} = ${(vol/hrs).toFixed(1)} mL/hr` };
    }
    if (type === 'drops') {
        const vol = [500, 1000, 100, 250][randInt(0,3)];
        const min = [60, 120, 240, 30][randInt(0,3)];
        const df = [20, 15, 60][randInt(0,2)];
        return { q: `Infuse ${vol} mL over ${min} minutes. Drop factor is ${df} gtt/mL. Calculate drops/min.`, a: Math.round((vol*df)/min), unit: 'gtt/min', work: `(Volume \u00D7 drop factor) \u00F7 time = (${vol} \u00D7 ${df}) \u00F7 ${min} = ${Math.round((vol*df)/min)} gtt/min` };
    }
    if (type === 'conversion') {
        const conversions = [
            () => { const v = randInt(1,20)*0.5; return { q: `Convert ${v} mg to micrograms (mcg).`, a: v*1000, unit: 'mcg', work: `1 mg = 1000 mcg, so ${v} \u00D7 1000 = ${v*1000} mcg` }; },
            () => { const v = randInt(1,20)*250; return { q: `Convert ${v} mcg to milligrams (mg).`, a: v/1000, unit: 'mg', work: `1000 mcg = 1 mg, so ${v} \u00F7 1000 = ${v/1000} mg` }; },
            () => { const v = randInt(1,10)*0.25; return { q: `Convert ${v} g to milligrams (mg).`, a: v*1000, unit: 'mg', work: `1 g = 1000 mg, so ${v} \u00D7 1000 = ${v*1000} mg` }; },
            () => { const v = randInt(1,20)*250; return { q: `Convert ${v} mg to grams (g).`, a: v/1000, unit: 'g', work: `1000 mg = 1 g, so ${v} \u00F7 1000 = ${v/1000} g` }; },
            () => { const v = randInt(1,4)*0.25; return { q: `Convert ${v} L to millilitres (mL).`, a: v*1000, unit: 'mL', work: `1 L = 1000 mL, so ${v} \u00D7 1000 = ${v*1000} mL` }; },
            () => { const v = randInt(1,20)*100; return { q: `Convert ${v} mL to litres (L).`, a: v/1000, unit: 'L', work: `1000 mL = 1 L, so ${v} \u00F7 1000 = ${v/1000} L` }; },
            () => { const v = randInt(3,50); return { q: `A patient weighs ${v} kg. Convert to pounds (lb). Use 1 kg = 2.2 lb.`, a: +(v*2.2).toFixed(1), unit: 'lb', work: `${v} \u00D7 2.2 = ${(v*2.2).toFixed(1)} lb` }; },
            () => { const v = randInt(20,220); return { q: `A patient weighs ${v} lb. Convert to kilograms (kg). Use 1 kg = 2.2 lb.`, a: +(v/2.2).toFixed(1), unit: 'kg', work: `${v} \u00F7 2.2 = ${(v/2.2).toFixed(1)} kg` }; }
        ];
        return conversions[randInt(0, conversions.length-1)]();
    }
    // mg/kg paediatric
    const wt = randInt(8, 40);
    const perKg = [5, 10, 15, 2, 4][randInt(0,4)];
    return { q: `A child weighs ${wt} kg. The dose is ${perKg} mg/kg/dose. What is the dose?`, a: wt*perKg, unit: 'mg', work: `Weight \u00D7 dose/kg = ${wt} \u00D7 ${perKg} = ${wt*perKg} mg` };
}

function openCalculations() {
    setActiveNav('calc');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Calculations</span>';
    calcScore = 0; calcAttempts = 0;
    let html = '<div class="section-header"><div><h2>&#x1F9EE; Drug Calculations Practice</h2>';
    html += '<p class="section-description">Practice the calculations you\'ll be tested on. Pick a type to begin.</p></div></div>';
    html += '<div class="calc-type-grid">';
    const types = [['tablet','&#x1F48A; Tablet Dose'],['liquid','&#x1F9EA; Liquid Dose'],['ivrate','&#x1F4A7; IV Rate (mL/hr)'],['drops','&#x1F4A7; Drops/min (gtt)'],['mgkg','&#x2696;&#xFE0F; mg/kg (Paediatric)'],['conversion','&#x1F504; Unit Conversion'],['mixed','&#x1F3B2; Mixed (all types)']];
    types.forEach(t => { html += `<div class="calc-type-card" onclick="features.newCalc('${t[0]}')">${t[1]}</div>`; });
    html += '</div><div id="calcArea"></div>';
    mainContent.innerHTML = html;
}

function newCalc(type) {
    const t = type === 'mixed' ? ['tablet','liquid','ivrate','drops','mgkg','conversion'][randInt(0,5)] : type;
    calcCurrent = buildCalcProblem(t);
    calcCurrent.baseType = type;
    let html = `<div class="calc-card">
        <div class="calc-question">${calcCurrent.q}</div>
        <div class="calc-input-row">
            <input type="number" step="any" id="calcAnswer" placeholder="Your answer" onkeydown="if(event.key==='Enter')features.checkCalc()">
            <span class="calc-unit">${calcCurrent.unit}</span>
        </div>
        <button class="calc-btn" onclick="features.checkCalc()">Check Answer</button>
        <div id="calcFeedback"></div>
    </div>
    <div class="calc-score">Score: ${calcScore}/${calcAttempts}</div>`;
    document.getElementById('calcArea').innerHTML = html;
    const inp = document.getElementById('calcAnswer'); if (inp) inp.focus();
}

function checkCalc() {
    const inp = document.getElementById('calcAnswer');
    if (!inp || inp.value === '') return;
    const val = parseFloat(inp.value);
    const correct = Math.abs(val - calcCurrent.a) < 0.05;
    calcAttempts++;
    if (correct) { calcScore++; awardXP(3, 'calculation'); }
    const fb = document.getElementById('calcFeedback');
    fb.innerHTML = `<div class="calc-feedback ${correct ? 'right' : 'wrong'}">
        ${correct ? '\u2705 Correct!' : '\u274C Not quite. Correct answer: ' + calcCurrent.a + ' ' + calcCurrent.unit}
        <div class="calc-work"><strong>Working:</strong> ${calcCurrent.work}</div>
    </div>
    <button class="calc-btn" onclick="features.newCalc('${calcCurrent.baseType}')">Next Question &#x2192;</button>`;
    inp.disabled = true;
    saveProgress('calc', {score: calcScore, total: calcAttempts, date: new Date().toISOString()});
}

// ===== GAMIFICATION: XP, STREAK, BADGES =====
function getGame() {
    try { return JSON.parse(localStorage.getItem('medlearn_game') || '{"xp":0,"streak":0,"lastActive":null,"badges":[]}'); }
    catch(e) { return { xp: 0, streak: 0, lastActive: null, badges: [] }; }
}
function saveGame(g) { localStorage.setItem('medlearn_game', JSON.stringify(g)); }

const LEVELS = [
    [0, 'Pre-Nursing'], [100, 'Student Nurse'], [300, 'Senior Student'],
    [600, 'New Graduate'], [1000, 'Registered Nurse'], [1600, 'Clinical Nurse'], [2500, 'Nurse Educator']
];
function getLevel(xp) {
    let idx = 0;
    LEVELS.forEach((l, i) => { if (xp >= l[0]) idx = i; });
    const next = LEVELS[idx + 1];
    return {
        num: idx + 1, title: LEVELS[idx][1], base: LEVELS[idx][0],
        nextAt: next ? next[0] : null,
        progress: next ? Math.round((xp - LEVELS[idx][0]) / (next[0] - LEVELS[idx][0]) * 100) : 100
    };
}

function verifiedCount() { try { return Object.keys(JSON.parse(localStorage.getItem('medlearn_verified') || '{}')).length; } catch(e) { return 0; } }
function sessionCount() { try { return JSON.parse(localStorage.getItem('medlearn_progress') || '[]').length; } catch(e) { return 0; } }

const BADGES = [
    { id: 'first', icon: '\uD83C\uDF93', name: 'First Steps', desc: 'Earn your first XP', test: g => g.xp > 0 },
    { id: 'streak3', icon: '\uD83D\uDD25', name: 'On a Roll', desc: '3-day study streak', test: g => g.streak >= 3 },
    { id: 'streak7', icon: '\uD83D\uDD25', name: 'Week Warrior', desc: '7-day study streak', test: g => g.streak >= 7 },
    { id: 'xp250', icon: '\u2B50', name: 'Getting Serious', desc: 'Reach 250 XP', test: g => g.xp >= 250 },
    { id: 'xp500', icon: '\uD83C\uDF1F', name: 'Rising Star', desc: 'Reach 500 XP', test: g => g.xp >= 500 },
    { id: 'xp1000', icon: '\uD83C\uDFC6', name: 'RN Level', desc: 'Reach 1000 XP', test: g => g.xp >= 1000 },
    { id: 'verify10', icon: '\u2705', name: 'Fact Checker', desc: 'Verify 10 drug classes', test: () => verifiedCount() >= 10 },
    { id: 'sessions20', icon: '\uD83D\uDCAA', name: 'Dedicated', desc: 'Complete 20 study sessions', test: () => sessionCount() >= 20 }
];
function checkBadges() {
    const g = getGame();
    g.badges = g.badges || [];
    let newly = [];
    BADGES.forEach(b => { if (!g.badges.includes(b.id) && b.test(g)) { g.badges.push(b.id); newly.push(b); } });
    if (newly.length) saveGame(g);
    return newly;
}
function updateStreak() {
    const g = getGame();
    const today = new Date().toDateString();
    if (g.lastActive === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    g.streak = (g.lastActive === yesterday) ? (g.streak || 0) + 1 : 1;
    g.lastActive = today;
    saveGame(g);
}
function awardXP(points, reason) {
    const g = getGame();
    g.xp = (g.xp || 0) + points;
    saveGame(g);
    updateStreak();
    const newBadges = checkBadges();
    if (newBadges.length) {
        setTimeout(() => alert('\uD83C\uDF89 New badge unlocked: ' + newBadges.map(b => b.icon + ' ' + b.name).join(', ')), 300);
    }
}

function openAchievements() {
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Achievements</span>';
    const g = getGame();
    const lvl = getLevel(g.xp || 0);
    let html = '<div class="section-header"><div><h2>&#x1F3C5; Achievements</h2>';
    html += '<p class="section-description">Your progress and badges</p></div></div>';
    html += `<div class="xp-hero">
        <div class="xp-hero-level">Level ${lvl.num} &bull; ${lvl.title}</div>
        <div class="xp-hero-xp">${g.xp || 0} XP &bull; &#x1F525; ${g.streak || 0}-day streak</div>
        <div class="progress-bar-container" style="margin-top:0.6rem;"><div class="progress-bar-fill" style="width:${lvl.progress}%"></div></div>
        <div class="xp-hero-next">${lvl.nextAt ? (lvl.nextAt - (g.xp || 0)) + ' XP to next level' : 'Max level reached!'}</div>
    </div>`;
    html += '<h3 style="margin:1.5rem 0 0.75rem;">Badges</h3><div class="badge-grid">';
    const earned = g.badges || [];
    BADGES.forEach(b => {
        const has = earned.includes(b.id);
        html += `<div class="badge-card ${has ? 'earned' : 'locked'}">
            <div class="badge-icon">${has ? b.icon : '\uD83D\uDD12'}</div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.desc}</div>
        </div>`;
    });
    html += '</div>';
    mainContent.innerHTML = html;
}

// ===== MATCH-UP GAME =====
let matchSet = [], matchLeft = [], matchRight = [], matchDone = 0, matchMistakes = 0, matchSel = null, matchStartTime = 0, matchTimerId = null, matchMsg = '';

function openMatchGame() {
    setActiveNav('match');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Match-Up</span>';
    let html = '<div class="section-header"><div><h2>&#x1F9E9; Match-Up Game</h2>';
    html += '<p class="section-description">Match each generic name to its brand. Fast and correct wins!</p></div></div>';
    html += '<div style="text-align:center;padding:1.5rem 1rem;">';
    html += '<div style="margin-bottom:1rem;"><label style="font-size:0.9rem;">Category: </label><select id="matchCat" style="padding:0.5rem;border:1px solid var(--border);border-radius:8px;"><option value="all">All Medications</option>';
    for (const [key, cat] of Object.entries(medicationDatabase)) html += `<option value="${key}">${cat.icon} ${cat.name}</option>`;
    html += '</select></div>';
    html += '<button onclick="features.startMatch()" style="padding:0.8rem 2rem;background:var(--secondary);color:white;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;">&#x1F3AE; Start Game</button>';
    html += '</div>';
    mainContent.innerHTML = html;
}

function firstBrand(b) { return b.split('/')[0].trim(); }

function startMatch() {
    const catSel = document.getElementById('matchCat');
    const catKey = catSel ? catSel.value : 'all';
    let pool = getAllMeds();
    if (catKey !== 'all') pool = pool.filter(m => m.category === catKey);
    if (pool.length < 5) { alert('Not enough medications in this category. Try another.'); return; }
    matchSet = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    matchLeft = matchSet.map(m => ({ gen: m.generic, text: m.generic })).sort(() => Math.random() - 0.5);
    matchRight = matchSet.map(m => ({ gen: m.generic, text: firstBrand(m.brand) })).sort(() => Math.random() - 0.5);
    matchDone = 0; matchMistakes = 0; matchSel = null; matchMsg = '';
    matchStartTime = Date.now();
    if (matchTimerId) clearInterval(matchTimerId);
    matchTimerId = setInterval(() => { const t = document.getElementById('matchTimer'); if (t) t.textContent = Math.round((Date.now() - matchStartTime) / 1000) + 's'; }, 500);
    renderMatch();
}

function renderMatch() {
    const matched = new Set(matchLeft.filter(l => l._m).map(l => l.gen));
    let html = '<div class="section-header"><div><h2>&#x1F9E9; Match-Up</h2>';
    html += `<p class="section-description">Matched ${matchDone}/6 &bull; Mistakes: ${matchMistakes} &bull; <span id="matchTimer">0s</span></p></div></div>`;
    if (matchMsg) html += `<div class="match-msg">${matchMsg}</div>`;
    html += '<div class="match-grid"><div class="match-col"><div class="match-col-head">Generic</div>';
    matchLeft.forEach((l, i) => {
        const cls = l._m ? 'matched' : (matchSel === i ? 'selected' : '');
        html += `<button class="match-item ${cls}" ${l._m ? 'disabled' : ''} onclick="features.matchPickLeft(${i})">${l.text}</button>`;
    });
    html += '</div><div class="match-col"><div class="match-col-head">Brand</div>';
    matchRight.forEach((r, j) => {
        html += `<button class="match-item ${r._m ? 'matched' : ''}" ${r._m ? 'disabled' : ''} onclick="features.matchPickRight(${j})">${r.text}</button>`;
    });
    html += '</div></div>';
    mainContent.innerHTML = html;
}

function matchPickLeft(i) {
    if (matchLeft[i]._m) return;
    matchSel = i; matchMsg = '';
    renderMatch();
}

function matchPickRight(j) {
    if (matchRight[j]._m || matchSel === null) return;
    const leftGen = matchLeft[matchSel].gen;
    const rightGen = matchRight[j].gen;
    if (leftGen === rightGen) {
        matchLeft[matchSel]._m = true;
        matchRight[j]._m = true;
        matchDone++;
        matchSel = null;
        matchMsg = '\u2705 Match!';
        if (matchDone === 6) { finishMatch(); return; }
    } else {
        matchMistakes++;
        matchSel = null;
        matchMsg = '\u274C Not a match - try again';
    }
    renderMatch();
}

function finishMatch() {
    if (matchTimerId) { clearInterval(matchTimerId); matchTimerId = null; }
    const secs = Math.round((Date.now() - matchStartTime) / 1000);
    const xp = Math.max(10, 40 - matchMistakes * 5);
    awardXP(xp, 'Match-Up game');
    saveProgress('match', { score: 6, total: 6 + matchMistakes, date: new Date().toISOString() });
    mainContent.innerHTML = `<div style="text-align:center;padding:3rem 1rem;"><h2>&#x1F389; All Matched!</h2>
        <p style="font-size:1.3rem;margin:1rem 0;">Time: <strong>${secs}s</strong> &bull; Mistakes: <strong>${matchMistakes}</strong></p>
        <p style="color:var(--success);font-weight:700;font-size:1.1rem;">+${xp} XP</p>
        <button onclick="features.openMatchGame()" style="margin-top:1.5rem;padding:0.7rem 1.5rem;background:var(--secondary);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Play Again</button></div>`;
}

// ===== BODY-SYSTEM MAP =====
function openBodyMap() {
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">Body Map</span>';
    // [categoryKey, topPct, leftPct]
    const spots = [
        ['cns', 5, 50], ['psychiatric', 3, 72], ['ophthalmicOtic', 11, 28],
        ['cardiovascular', 27, 43], ['respiratory', 29, 60],
        ['endocrine', 40, 39], ['gastrointestinal', 48, 57],
        ['fluidsElectrolytes', 34, 14], ['musculoskeletal', 74, 39]
    ];
    const svg = '<svg class="bodymap-svg" viewBox="0 0 200 360" aria-hidden="true">' +
        '<circle cx="100" cy="38" r="26"/>' +
        '<rect x="90" y="60" width="20" height="16"/>' +
        '<rect x="60" y="74" width="80" height="130" rx="26"/>' +
        '<rect x="38" y="80" width="18" height="95" rx="9"/>' +
        '<rect x="144" y="80" width="18" height="95" rx="9"/>' +
        '<rect x="72" y="198" width="24" height="130" rx="11"/>' +
        '<rect x="104" y="198" width="24" height="130" rx="11"/>' +
        '</svg>';
    let hotspots = '';
    spots.forEach(s => {
        const cat = medicationDatabase[s[0]];
        if (!cat) return;
        hotspots += `<button class="bodymap-hotspot" style="top:${s[1]}%;left:${s[2]}%;background:${cat.color}" title="${cat.name}" onclick="app.browseCategoryFromMap('${s[0]}')">${cat.icon}</button>`;
    });
    let html = '<div class="section-header"><div><h2>&#x1F5FA;&#xFE0F; Body-System Map</h2>';
    html += '<p class="section-description">Tap a body region or a system below to jump to those medications.</p></div></div>';
    html += `<div class="bodymap-layout"><div class="bodymap-wrap">${svg}${hotspots}</div>`;
    html += '<div class="bodymap-legend">';
    for (const [key, cat] of Object.entries(medicationDatabase)) {
        html += `<div class="bodymap-legend-item" onclick="app.browseCategoryFromMap('${key}')">
            <span class="bml-swatch" style="background:${cat.color}"></span>
            <span class="bml-icon">${cat.icon}</span>
            <span class="bml-name">${cat.name}</span>
        </div>`;
    }
    html += '</div></div>';
    mainContent.innerHTML = html;
}

// ===== GROUP SUB-VIEWS =====
const featureGroups = {
    study: {
        title: 'Study & Practice',
        icon: '\uD83C\uDF93',
        tools: [
            { icon: '\uD83C\uDCCF', title: 'Flashcards', desc: 'Flip cards with optional spaced repetition', action: 'features.openFlashcards()' },
            { icon: '\uD83C\uDFAF', title: 'Weak Spots', desc: 'Review the cards you keep getting wrong', action: 'features.openWeakSpots()' },
            { icon: '\uD83D\uDCDD', title: "Practice Questions", desc: 'NMBA-style questions by category', action: 'features.openNCLEX()' },
            { icon: '\u23F1\uFE0F', title: 'Timed Quiz', desc: 'Beat the clock - 10 rapid questions', action: 'features.openTimedQuiz()' },
            { icon: '\uD83D\uDCCB', title: 'Case Studies', desc: 'Clinical scenarios with reasoning', action: 'features.openCaseStudies()' },
            { icon: '\uD83E\uDDE9', title: 'Match-Up Game', desc: 'Match generics to brands against the clock', action: 'features.openMatchGame()' },
            { icon: '\u2696\uFE0F', title: 'Compare Drugs', desc: 'Side-by-side comparison of two meds', action: 'features.openCompare()' }
        ]
    },
    safety: {
        title: 'Safety',
        icon: '\uD83D\uDEE1\uFE0F',
        tools: [
            { icon: '\uD83D\uDEA8', title: 'High-Risk Medicines', desc: 'A PINCH high-risk drugs & why', action: 'features.openHighAlert()' },
            { icon: '\u26A0\uFE0F', title: 'Drug Interactions', desc: 'Check common interaction pairs', action: 'features.openInteractions()' },
            { icon: '\uD83D\uDC40', title: 'Look-Alike / Sound-Alike', desc: 'Commonly confused drug names', action: 'features.openLookAlike()' },
            { icon: '\u2705', title: 'Rights of Administration', desc: 'The rights & checks for safe practice', action: 'features.openRights()' }
        ]
    },
    reference: {
        title: 'Reference',
        icon: '\uD83D\uDCDA',
        tools: [
            { icon: '\uD83D\uDD2C', title: 'Lab Values & Antidotes', desc: 'Therapeutic ranges, toxic levels, antidotes', action: 'features.openLabValues()' },
            { icon: '\uD83E\uDDE0', title: 'Mnemonics', desc: 'Suffix patterns & memory aids', action: 'features.openMnemonics()' },
            { icon: '\uD83D\uDD17', title: 'References & Resources', desc: 'AMH, eTG, AIDH & official AU drug resources', action: 'features.openReferences()' }
        ]
    }
};

function openGroup(key) {
    const group = featureGroups[key];
    if (!group) return;
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">' + group.title + '</span>';
    let html = `<div class="section-header"><div><h2>${group.icon} ${group.title}</h2>`;
    html += `<p class="section-description">Choose a tool</p></div></div>`;
    html += '<div class="group-grid">';
    group.tools.forEach(t => {
        html += `<div class="group-tile" onclick="${t.action}">
            <div class="gt-icon">${t.icon}</div>
            <div class="gt-title">${t.title}</div>
            <div class="gt-desc">${t.desc}</div>
        </div>`;
    });
    html += '</div>';
    mainContent.innerHTML = html;
}

// ===== PUBLIC API =====
window.features = {
    openFlashcards, startFlashcardDeck, fcAnswer,
    openFavorites, toggleFavorite, isFavorite,
    openCompare, renderComparison,
    openHighAlert,
    openLabValues,
    openProgress, saveProgress,
    openNCLEX, startNCLEX, toggleNCLEXOption, selectNCLEXOption, submitNCLEX, nextNCLEX,
    openInteractions, addInteractionDrug, removeInteractionDrug,
    openMnemonics,
    toggleDarkMode,
    openTimedQuiz, startTimedQuiz, answerTimed,
    openLookAlike,
    dismissDisclaimer,
    openCalculations, newCalc, checkCalc,
    openRights,
    openReferences,
    openCaseStudies, startCase, answerCase, nextCase,
    openGroup,
    openBodyMap,
    openMatchGame, startMatch, matchPickLeft, matchPickRight,
    openAchievements,
    openWeakSpots
};

})();
