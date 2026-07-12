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
    if (med && known !== null) updateSRS(med.generic, known);
    fcIndex++;
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
    { generic: "warfarin", reason: "Narrow therapeutic index. Numerous drug/food interactions. Hemorrhage risk. INR monitoring essential." },
    { generic: "insulin lispro", reason: "High-alert: wrong dose can cause fatal hypoglycemia. Always double-check units. Never abbreviate 'U'." },
    { generic: "insulin glargine", reason: "Often confused with other insulins. CLEAR solution (unlike NPH). Cannot mix. Wrong insulin = fatal." },
    { generic: "morphine", reason: "Respiratory depression risk. Dose-dependent. Monitor RR<12. Keep naloxone available." },
    { generic: "hydromorphone", reason: "5-7x more potent than morphine. Fatal if dose confused with morphine doses. HIGH ALERT." },
    { generic: "fentanyl", reason: "80-100x potent than morphine. Patch only for opioid-tolerant. Heat increases absorption = overdose." },
    { generic: "methotrexate", reason: "Fatal if given daily instead of weekly. Immunosuppressant. Requires folate supplementation." },
    { generic: "digoxin", reason: "Narrow therapeutic index (0.5-2.0). Check apical pulse. Hypokalemia increases toxicity." },
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

    let html = '<div class="section-header"><div><h2>&#x1F6A8; High-Alert Medications</h2>';
    html += '<p class="section-description">Medications with heightened risk of causing significant harm. Know these for NCLEX and clinical practice.</p></div></div>';

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
    { drug: "digoxin", range: "0.5 - 2.0 ng/mL", toxic: ">2.0 ng/mL", antidote: "Digoxin Immune Fab (Digibind)", monitoring: "Check K+ (hypokalemia increases toxicity). Check apical pulse." },
    { drug: "phenytoin", range: "10 - 20 mcg/mL", toxic: ">20 mcg/mL (free >2.0)", antidote: "No specific antidote. Supportive care.", monitoring: "Monitor free levels in hypoalbuminemia. Check albumin." },
    { drug: "lithium", range: "0.6 - 1.2 mEq/L", toxic: ">1.5 mEq/L", antidote: "Hemodialysis for severe toxicity", monitoring: "Monitor Na+, thyroid, renal function. Maintain hydration." },
    { drug: "theophylline", range: "5 - 15 mcg/mL", toxic: ">20 mcg/mL", antidote: "Charcoal hemoperfusion. Supportive.", monitoring: "Many drug interactions. Smoking affects levels. Monitor HR." },
    { drug: "vancomycin", range: "Trough: 15-20 mcg/mL (serious infections)", toxic: "Trough >20 mcg/mL", antidote: "No antidote. Adjust dose/interval.", monitoring: "Monitor renal function (nephrotoxic). Red man syndrome if infused too fast." },
    { drug: "gentamicin", range: "Peak: 5-10; Trough: <2 mcg/mL", toxic: "Peak >12; Trough >2", antidote: "Hemodialysis in severe cases", monitoring: "Monitor renal function and hearing (ototoxic + nephrotoxic)." },
    { drug: "warfarin", range: "INR 2.0 - 3.0 (most indications)", toxic: "INR >4.0 (bleeding risk)", antidote: "Vitamin K (phytonadione); FFP/PCC for emergency", monitoring: "Weekly INR initially. Watch for bleeding. Diet counseling (vitamin K foods)." },
    { drug: "heparin", range: "aPTT 1.5-2.5x control (60-80 sec)", toxic: "aPTT >100 sec", antidote: "Protamine sulfate (1 mg per 100 units heparin)", monitoring: "Check aPTT q6h. Monitor platelets for HIT. Watch for bleeding." },
    { drug: "valproic acid", range: "50 - 100 mcg/mL", toxic: ">100 mcg/mL", antidote: "L-carnitine for hepatotoxicity. Supportive.", monitoring: "Monitor LFTs, CBC, ammonia. Teratogenic - pregnancy test." },
    { drug: "carbamazepine", range: "4 - 12 mcg/mL", toxic: ">12 mcg/mL", antidote: "No specific antidote. Supportive.", monitoring: "Monitor CBC (aplastic anemia). Check Na+ (SIADH). HLA-B*1502 testing." },
    { drug: "metformin", range: "N/A (no routine monitoring)", toxic: "Lactic acidosis (lactate >5)", antidote: "Hemodialysis. Bicarbonate for acidosis.", monitoring: "Monitor renal function (Cr/GFR). Hold before contrast. Monitor B12 annually." },
    { drug: "acetaminophen", range: "10-30 mcg/mL (therapeutic)", toxic: ">150 mcg/mL at 4hr post-ingestion", antidote: "N-acetylcysteine (NAC / Mucomyst)", monitoring: "Max 4g/day (2g in liver disease). Check LFTs. Rumack-Matthew nomogram." }
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
    { type: "SATA", stem: "A nurse is administering digoxin. Which findings should the nurse report to the provider? (Select all that apply)", options: ["Apical pulse of 58 bpm","Serum potassium of 3.2 mEq/L","Patient reports seeing yellow halos","Blood pressure 128/78","Serum digoxin level 1.8 ng/mL"], correct: [0,1,2], rationale: "Hold digoxin if HR<60. Hypokalemia (K<3.5) increases digoxin toxicity. Yellow/green visual changes indicate toxicity. BP is normal. Digoxin 1.8 is within range (0.5-2.0)." },
    { type: "SATA", stem: "Which nursing interventions are appropriate for a patient receiving heparin IV infusion? (Select all that apply)", options: ["Monitor aPTT every 6 hours","Use an infusion pump","Apply firm pressure to injection sites for 5 minutes","Administer vitamin K as antidote","Monitor platelet count"], correct: [0,1,2,4], rationale: "aPTT monitors heparin effectiveness. Infusion pump ensures accurate dosing. Firm pressure prevents bleeding. Protamine (not vitamin K) is the heparin antidote. Platelets monitor for HIT." },
    { type: "Priority", stem: "A nurse is caring for 4 patients. Which patient should the nurse assess FIRST?", options: ["Patient on morphine with respiratory rate of 10","Patient on furosemide with potassium of 3.4","Patient on metformin reporting nausea","Patient on lisinopril with dry cough"], correct: [0], rationale: "Respiratory rate of 10 with opioid use indicates respiratory depression — life-threatening emergency requiring immediate assessment and possible naloxone. Other findings require attention but are not immediately life-threatening." },
    { type: "SATA", stem: "A patient is prescribed warfarin. Which patient statements indicate effective teaching? (Select all that apply)", options: ["I will eat consistent amounts of green vegetables","I will use an electric razor for shaving","I will take ibuprofen for headaches","I will get my blood tested regularly","I should avoid contact sports"], correct: [0,1,3,4], rationale: "Consistent vitamin K intake (not elimination) is correct. Electric razor prevents cuts. NSAIDs increase bleeding risk with warfarin - should use acetaminophen. Regular INR monitoring is essential. Avoiding contact sports prevents injury/bleeding." },
    { type: "Priority", stem: "Which patient taking antihypertensives should the nurse see FIRST?", options: ["Patient on atenolol with HR 56 and dizziness","Patient on amlodipine with ankle edema","Patient on losartan with potassium 5.1","Patient on HCTZ with sodium 134"], correct: [0], rationale: "HR 56 with dizziness on a beta-blocker indicates symptomatic bradycardia requiring immediate assessment. Ankle edema is expected with CCBs. K+ 5.1 and Na 134 are slightly abnormal but not emergent." },
    { type: "SATA", stem: "A nurse is caring for a patient with a fentanyl transdermal patch. Which interventions are appropriate? (Select all that apply)", options: ["Apply patch to a hairless area","Cut the patch in half if dose seems too high","Avoid applying heat to the patch area","Monitor respiratory rate regularly","Remove old patch before applying new one"], correct: [0,2,3,4], rationale: "Apply to hairless, non-irritated skin. NEVER cut patches (causes dose dumping). Heat increases absorption dangerously. Monitor RR for respiratory depression. Always remove old patch to prevent overdose." },
    { type: "Priority", stem: "A nurse is reviewing labs for patients on medications. Which result requires immediate notification of the provider?", options: ["Phenytoin level 22 mcg/mL","Digoxin level 1.6 ng/mL","INR 2.5 on warfarin","Lithium level 1.0 mEq/L"], correct: [0], rationale: "Phenytoin therapeutic range is 10-20. Level of 22 is toxic and can cause ataxia, nystagmus, seizures. Digoxin 1.6 is therapeutic (0.5-2.0). INR 2.5 is goal range (2-3). Lithium 1.0 is therapeutic (0.6-1.2)." },
    { type: "SATA", cat: "Cardiovascular", stem: "Which medications require the nurse to check an apical pulse for one full minute before administration? (Select all that apply)", options: ["Digoxin","Metoprolol","Lisinopril","Diltiazem","Furosemide"], correct: [0,1,3], rationale: "Digoxin, beta-blockers (metoprolol), and non-dihydropyridine CCBs (diltiazem) can cause bradycardia. Hold if HR<60. Lisinopril and furosemide don't typically require pulse check before admin." },
    { type: "Priority", cat: "Endocrine", stem: "A patient with type 1 diabetes has a blood glucose of 45 mg/dL and is alert. What should the nurse do FIRST?", options: ["Give 15 g of fast-acting carbohydrate","Administer IV insulin","Call the provider","Recheck glucose in 1 hour"], correct: [0], rationale: "For conscious hypoglycemia, follow the rule of 15: give 15g fast-acting carb (juice, glucose tabs), recheck in 15 min. Never give insulin when glucose is low. Act before calling provider." },
    { type: "SATA", cat: "Endocrine", stem: "Which statements about insulin administration are correct? (Select all that apply)", options: ["Regular insulin is the only insulin given IV","Rotate injection sites to prevent lipodystrophy","NPH insulin is clear","Roll (don't shake) cloudy insulin","Rapid-acting insulin is given with meals"], correct: [0,1,3,4], rationale: "Regular insulin is the only IV insulin. Rotate sites. NPH is CLOUDY (not clear). Roll cloudy insulin gently. Rapid-acting (lispro/aspart) given with meals." },
    { type: "Priority", cat: "Respiratory", stem: "A patient using an albuterol inhaler and a fluticasone inhaler asks which to use first. What should the nurse teach?", options: ["Use albuterol first, then fluticasone","Use fluticasone first, then albuterol","Use them at the same time","Order does not matter"], correct: [0], rationale: "Use the bronchodilator (albuterol) FIRST to open airways, then the corticosteroid (fluticasone) can reach deeper. Always rinse mouth after the steroid to prevent thrush." },
    { type: "SATA", cat: "Anticoagulants", stem: "A patient on enoxaparin (Lovenox). Which nursing actions are correct? (Select all that apply)", options: ["Give subcutaneously in the abdomen","Do not expel the air bubble in the syringe","Aspirate before injecting","Do not rub the site after injection","Rotate injection sites"], correct: [0,1,3,4], rationale: "Give SubQ in the abdomen (love handles). Do NOT expel air bubble. Do NOT aspirate. Do NOT rub (causes bruising). Rotate sites." },
    { type: "Priority", cat: "Safety", stem: "The nurse prepares to give IV potassium chloride. Which action is essential for safety?", options: ["Always dilute and infuse via pump - never IV push","Give rapid IV push for faster effect","Give undiluted for accuracy","Push over 1 minute"], correct: [0], rationale: "IV potassium is NEVER given by IV push (causes fatal cardiac arrest). Always dilute and infuse slowly via pump, max 10 mEq/hr peripherally. A high-alert medication." },
    { type: "SATA", cat: "Pain/Opioids", stem: "A patient is receiving morphine for pain. Which findings require the nurse to hold the dose and notify the provider? (Select all that apply)", options: ["Respiratory rate of 8","Sedation level - difficult to arouse","Pain rating of 6/10","Respiratory rate of 18","Oxygen saturation of 85%"], correct: [0,1,4], rationale: "Hold opioids for RR<12, excessive sedation, and low O2 sat (respiratory depression signs). Pain 6/10 and RR 18 are acceptable to medicate." },
    { type: "Priority", cat: "Antibiotics", stem: "A patient receiving IV vancomycin develops flushing and redness of the face and neck during infusion. What is the nurse's priority action?", options: ["Slow or stop the infusion","Continue - this is a normal reaction","Increase the infusion rate","Give the next dose early"], correct: [0], rationale: "This is 'Red Man Syndrome' caused by infusing vancomycin too fast. Slow or stop the infusion. Prevent by infusing over at least 60 minutes. Not a true allergy but requires slower rate." },
    { type: "SATA", cat: "Psychiatric", stem: "A patient is starting an SSRI (sertraline). Which teaching points should the nurse include? (Select all that apply)", options: ["Full effect may take 4-6 weeks","Do not stop abruptly","Report thoughts of self-harm immediately","You can combine it freely with MAOIs","Watch for signs of serotonin syndrome"], correct: [0,1,2,4], rationale: "SSRIs take 4-6 weeks. Do not stop abruptly (discontinuation syndrome). Report suicidal thoughts (black box warning). NEVER combine with MAOIs (serotonin syndrome). Watch for serotonin syndrome." },
    { type: "Priority", cat: "Endocrine", stem: "A patient on levothyroxine reports palpitations, weight loss, and feeling hot. What does the nurse suspect?", options: ["Dose too high (hyperthyroid symptoms)","Dose too low","Normal response","Allergic reaction"], correct: [0], rationale: "Palpitations, weight loss, heat intolerance = signs of too much thyroid hormone (hyperthyroidism). The dose is likely too high and needs adjustment. Report to provider." },
    { type: "SATA", cat: "Antibiotics", stem: "Which teaching points apply to a patient taking ciprofloxacin? (Select all that apply)", options: ["Report tendon pain immediately","Avoid taking with antacids or dairy","Increase fluid intake","Use sunscreen (photosensitivity)","Take with calcium for better absorption"], correct: [0,1,2,3], rationale: "Fluoroquinolones cause tendon rupture (report pain). Antacids/dairy/calcium reduce absorption (separate by 2h). Hydrate well. Causes photosensitivity - use sunscreen." },
    { type: "Priority", cat: "Cardiovascular", stem: "A patient started on lisinopril develops swelling of the lips and tongue. What is the nurse's priority?", options: ["Assess airway and prepare for emergency - this is angioedema","Document as a mild side effect","Give the next dose with food","Reassure the patient it will pass"], correct: [0], rationale: "Lip/tongue swelling = angioedema, a life-threatening emergency with ACE inhibitors. Priority is airway assessment and emergency intervention. Stop the drug and notify provider immediately." },
    { type: "SATA", cat: "Cardiovascular", stem: "Which are signs of digoxin toxicity the nurse should monitor for? (Select all that apply)", options: ["Nausea and vomiting","Yellow-green vision changes","Bradycardia","Increased appetite","Confusion"], correct: [0,1,2,4], rationale: "Digoxin toxicity: N/V, visual disturbances (yellow-green halos), bradycardia, and confusion. Anorexia (loss of appetite), NOT increased appetite, is an early sign." },
    { type: "Priority", cat: "Safety", stem: "A patient receiving IV magnesium sulfate has absent deep tendon reflexes. What should the nurse do FIRST?", options: ["Stop the infusion","Increase the rate","Continue and document","Give more magnesium"], correct: [0], rationale: "Absent deep tendon reflexes indicate magnesium toxicity. STOP the infusion first, then notify provider. Antidote is calcium gluconate. Monitor respirations and reflexes." },
    { type: "SATA", cat: "Endocrine", stem: "Which patient teaching is correct for oral corticosteroids like prednisone? (Select all that apply)", options: ["Take with food","Do not stop abruptly","Monitor blood glucose","Report signs of infection","Take on an empty stomach at bedtime"], correct: [0,1,2,3], rationale: "Take prednisone with food (GI irritation), in the morning (mimics cortisol). Never stop abruptly (adrenal crisis). Monitor glucose (hyperglycemia) and watch for infection (immunosuppression)." },
    { type: "Priority", cat: "Respiratory", stem: "A patient on theophylline has a level of 22 mcg/mL and reports nausea and palpitations. What is the priority?", options: ["Hold the drug and notify the provider - level is toxic","Give the next dose","Encourage more fluids only","Document as therapeutic"], correct: [0], rationale: "Theophylline therapeutic range is 5-15 mcg/mL. A level of 22 is toxic; nausea and palpitations are toxicity signs. Hold the drug and notify the provider." },
    { type: "SATA", cat: "Pain/Opioids", stem: "Which interventions help prevent opioid-induced constipation? (Select all that apply)", options: ["Increase fluid intake","Start a bowel regimen (stool softener/laxative)","Increase dietary fiber","Encourage ambulation","Restrict fluids"], correct: [0,1,2,3], rationale: "Opioids commonly cause constipation. Prevent with fluids, prophylactic bowel regimen, fiber, and activity. Restricting fluids would worsen constipation." },
    { type: "Priority", cat: "Anticoagulants", stem: "A patient on warfarin has an INR of 5.5 with no active bleeding. What does the nurse anticipate?", options: ["Holding warfarin and possibly giving vitamin K","Increasing the warfarin dose","Giving protamine sulfate","No change needed"], correct: [0], rationale: "INR 5.5 is above therapeutic range (2-3) - high bleeding risk. Anticipate holding warfarin and possibly vitamin K. Protamine is for heparin, not warfarin." },
    { type: "SATA", cat: "Antibiotics", stem: "Which are appropriate when administering IV vancomycin? (Select all that apply)", options: ["Infuse over at least 60 minutes","Monitor trough levels","Monitor renal function","Give rapid IV push","Monitor for ototoxicity"], correct: [0,1,2,4], rationale: "Infuse slowly (>=60 min) to prevent Red Man Syndrome. Monitor troughs, renal function (nephrotoxic), and hearing (ototoxic). Never IV push." },
    { type: "Priority", cat: "Psychiatric", stem: "A patient on lithium reports vomiting, diarrhea, and coarse tremors. What should the nurse suspect?", options: ["Lithium toxicity","Normal side effects","Underdosing","Allergic reaction"], correct: [0], rationale: "Vomiting, diarrhea, and coarse tremor are signs of lithium toxicity. Therapeutic range is narrow (0.6-1.2 mEq/L). Hold the dose, check level, and ensure hydration." },
    { type: "SATA", cat: "Safety", stem: "Which are considered high-alert medications requiring extra safety checks? (Select all that apply)", options: ["Insulin","Heparin","IV potassium chloride","Oral acetaminophen","Opioids"], correct: [0,1,2,4], rationale: "Insulin, heparin, concentrated electrolytes (KCl), and opioids are high-alert medications per ISMP. Routine oral acetaminophen is not typically high-alert (though max dose matters)." },
    { type: "Priority", cat: "Cardiovascular", stem: "A patient on furosemide has a potassium of 2.9 mEq/L. What is the nurse's priority concern?", options: ["Risk of cardiac dysrhythmias","Increased urine output","Mild headache","Weight loss"], correct: [0], rationale: "K+ 2.9 is hypokalemia (normal 3.5-5.0). Loop diuretics waste potassium. Low K+ increases risk of life-threatening cardiac dysrhythmias, especially dangerous with digoxin." },
    { type: "SATA", cat: "Respiratory", stem: "Which teaching points are correct for a patient using an inhaled corticosteroid? (Select all that apply)", options: ["Rinse mouth after each use","Use a spacer if prescribed","This is a rescue inhaler for attacks","Use it regularly even when feeling well","Watch for oral thrush"], correct: [0,1,3,4], rationale: "Rinse mouth (prevents thrush), use spacer, use regularly (maintenance, NOT rescue), and watch for thrush. Inhaled steroids are NOT rescue inhalers - albuterol is." }
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
    let html = '<div class="section-header"><div><h2>&#x1F4DD; NCLEX-Style Practice</h2>';
    html += `<p class="section-description">${nclexQuestions.length} questions available. Choose a category to begin.</p></div></div>`;
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
        mainContent.innerHTML = `<div style="text-align:center;padding:3rem 1rem;"><h2>NCLEX Practice Complete!</h2><p style="font-size:2rem;font-weight:700;color:var(--primary);margin:1rem 0;">${nclexScore}/${nclexActive.length}</p><p style="color:var(--text-light);">${Math.round((nclexScore/nclexActive.length)*100)}%</p><button onclick="features.openNCLEX()" style="margin-top:1rem;padding:0.7rem 1.5rem;background:var(--primary);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Choose Another Category</button></div>`;
        saveProgress('nclex', {score: nclexScore, total: nclexActive.length, date: new Date().toISOString()});
        return;
    }
    nclexAnswered = false;
    const q = nclexActive[nclexIndex];
    const isSATA = q.type === 'SATA';

    let html = '<div class="section-header"><div><h2>&#x1F4DD; NCLEX Practice</h2>';
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
    { drugs: ["warfarin","aspirin"], severity: "severe", effect: "Greatly increased bleeding risk. Both affect hemostasis through different mechanisms.", nursing: "Avoid combination unless specifically ordered. Monitor for signs of bleeding." },
    { drugs: ["warfarin","ibuprofen"], severity: "severe", effect: "NSAIDs increase bleeding risk and can displace warfarin from protein binding.", nursing: "Use acetaminophen instead. If NSAID required, monitor INR closely." },
    { drugs: ["metformin","contrast dye"], severity: "severe", effect: "Risk of lactic acidosis. Contrast can impair renal function needed to clear metformin.", nursing: "Hold metformin 48hrs before and after contrast. Check renal function before restarting." },
    { drugs: ["digoxin","furosemide"], severity: "moderate", effect: "Furosemide causes hypokalemia which increases digoxin toxicity.", nursing: "Monitor potassium closely. May need K+ supplementation. Watch for digoxin toxicity signs." },
    { drugs: ["digoxin","amiodarone"], severity: "severe", effect: "Amiodarone increases digoxin levels by 70-100%. Risk of toxicity.", nursing: "Reduce digoxin dose by 50% when starting amiodarone. Monitor digoxin levels." },
    { drugs: ["ACE inhibitor","potassium"], severity: "severe", effect: "Both increase serum potassium. Risk of fatal hyperkalemia.", nursing: "Avoid K+ supplements with ACE inhibitors unless specifically ordered. Monitor K+ levels." },
    { drugs: ["SSRI","tramadol"], severity: "severe", effect: "Both increase serotonin. Risk of serotonin syndrome (hyperthermia, rigidity, clonus).", nursing: "Monitor for serotonin syndrome: agitation, tremor, hyperthermia, hyperreflexia. Avoid combination." },
    { drugs: ["SSRI","MAOI"], severity: "severe", effect: "Serotonin syndrome - potentially fatal. Hypertensive crisis possible.", nursing: "NEVER combine. Must wait 14 days after stopping MAOI (5 weeks for fluoxetine) before starting SSRI." },
    { drugs: ["metoprolol","verapamil"], severity: "severe", effect: "Both slow heart rate. Risk of severe bradycardia, heart block, or asystole.", nursing: "Avoid combination. Monitor HR and ECG closely if both necessary. Watch for hypotension." },
    { drugs: ["ciprofloxacin","antacids"], severity: "moderate", effect: "Antacids bind ciprofloxacin in GI tract, reducing absorption by up to 90%.", nursing: "Separate administration by at least 2 hours. Give cipro first." },
    { drugs: ["warfarin","vitamin K foods"], severity: "moderate", effect: "Vitamin K counteracts warfarin. Inconsistent intake causes INR fluctuations.", nursing: "Teach consistent (not zero) vitamin K intake. Monitor INR with diet changes." },
    { drugs: ["lithium","NSAIDs"], severity: "severe", effect: "NSAIDs reduce lithium excretion, increasing levels to toxic range.", nursing: "Avoid NSAIDs. Use acetaminophen for pain. If NSAID needed, check lithium level in 5 days." },
    { drugs: ["opioids","benzodiazepines"], severity: "severe", effect: "Additive CNS and respiratory depression. FDA black box warning.", nursing: "Avoid combination. If both necessary, use lowest doses and monitor respirations continuously." },
    { drugs: ["levothyroxine","calcium"], severity: "moderate", effect: "Calcium binds levothyroxine reducing absorption significantly.", nursing: "Separate by at least 4 hours. Take levothyroxine on empty stomach in morning." },
    { drugs: ["spironolactone","ACE inhibitor"], severity: "moderate", effect: "Both increase potassium. Risk of hyperkalemia especially in renal impairment.", nursing: "Monitor potassium closely (within 1 week of starting). Avoid K+ supplements." }
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
        { trick: "-pril", meaning: "ACE Inhibitors", example: "lisinoPRIL, enalaPRIL, ramiPRIL - watch for cough & angioedema" },
        { trick: "-sartan", meaning: "ARBs (Angiotensin Receptor Blockers)", example: "loSARTAN, valSARTAN - like ACE but no cough" },
        { trick: "-olol", meaning: "Beta Blockers", example: "metoprOLOL, atenOLOL, propranOLOL - lower HR & BP" },
        { trick: "-dipine", meaning: "Calcium Channel Blockers (dihydropyridines)", example: "amloDIPINE, nifeDIPINE - watch for edema" },
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
        { trick: "RIPE", meaning: "TB drugs", example: "Rifampin, Isoniazid, Pyrazinamide, Ethambutol" },
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

// ===== LOOK-ALIKE / SOUND-ALIKE (LASA) DRUGS =====
const lasaPairs = [
    { a: "hydralazine", b: "hydroxyzine", note: "Hydralazine = vasodilator (BP). Hydroxyzine = antihistamine/anxiety. Very commonly confused!" },
    { a: "hydromorphone", b: "morphine", note: "Hydromorphone (Dilaudid) is ~7x more potent than morphine. Dose errors can be fatal." },
    { a: "clonidine", b: "klonopin (clonazepam)", note: "Clonidine = antihypertensive. Clonazepam = benzodiazepine. Sound-alike names." },
    { a: "metformin", b: "metronidazole", note: "Metformin = diabetes. Metronidazole (Flagyl) = antibiotic. Both start with 'metro/metf'." },
    { a: "prednisone", b: "prednisolone", note: "Both corticosteroids but different potency/forms. Verify carefully." },
    { a: "celebrex (celecoxib)", b: "celexa (citalopram)", note: "Celebrex = NSAID. Celexa = SSRI antidepressant. Classic sound-alike error." },
    { a: "lamictal (lamotrigine)", b: "lamisil (terbinafine)", note: "Lamictal = anticonvulsant/mood. Lamisil = antifungal. Look-alike names." },
    { a: "novolog (aspart)", b: "novolin (regular/NPH)", note: "NovoLog = rapid-acting. Novolin = regular/NPH. Insulin mix-ups are high-alert errors." },
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
    openLookAlike
};

})();
