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
    html += '</select></div><div id="flashcardArea"></div>';
    mainContent.innerHTML = html;
    startFlashcardDeck();
}

function startFlashcardDeck() {
    const sel = document.getElementById('fcCategorySelect');
    const catKey = sel ? sel.value : 'all';
    const allMeds = getAllMeds();
    fcDeck = catKey === 'all' ? allMeds : allMeds.filter(m => m.category === catKey);
    fcDeck = fcDeck.sort(() => Math.random() - 0.5);
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
    if (known === true) fcKnown++;
    else if (known === false) fcUnknown++;
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
    { type: "SATA", stem: "Which medications require the nurse to check an apical pulse for one full minute before administration? (Select all that apply)", options: ["Digoxin","Metoprolol","Lisinopril","Diltiazem","Furosemide"], correct: [0,1,3], rationale: "Digoxin, beta-blockers (metoprolol), and non-dihydropyridine CCBs (diltiazem) can cause bradycardia. Hold if HR<60. Lisinopril and furosemide don't typically require pulse check before admin." }
];

let nclexIndex = 0;
let nclexScore = 0;
let nclexAnswered = false;

function openNCLEX() {
    setActiveNav('nclex');
    breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="app.renderHome()">Home</span><span class="breadcrumb-separator">&#x25B6;</span><span class="breadcrumb-item active">NCLEX Prep</span>';
    nclexIndex = 0; nclexScore = 0;
    renderNCLEXQuestion();
}

function renderNCLEXQuestion() {
    if (nclexIndex >= nclexQuestions.length) {
        mainContent.innerHTML = `<div style="text-align:center;padding:3rem 1rem;"><h2>NCLEX Practice Complete!</h2><p style="font-size:2rem;font-weight:700;color:var(--primary);margin:1rem 0;">${nclexScore}/${nclexQuestions.length}</p><p style="color:var(--text-light);">${Math.round((nclexScore/nclexQuestions.length)*100)}%</p><button onclick="features.openNCLEX()" style="margin-top:1rem;padding:0.7rem 1.5rem;background:var(--primary);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Try Again</button></div>`;
        saveProgress('nclex', {score: nclexScore, total: nclexQuestions.length, date: new Date().toISOString()});
        return;
    }
    nclexAnswered = false;
    const q = nclexQuestions[nclexIndex];
    const isSATA = q.type === 'SATA';

    let html = '<div class="section-header"><div><h2>&#x1F4DD; NCLEX Practice</h2>';
    html += `<p class="section-description">Question ${nclexIndex+1} of ${nclexQuestions.length}</p></div></div>`;
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
    const q = nclexQuestions[nclexIndex];
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
    const q = nclexQuestions[nclexIndex];
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

// ===== PUBLIC API =====
window.features = {
    openFlashcards, startFlashcardDeck, fcAnswer,
    openFavorites, toggleFavorite, isFavorite,
    openCompare, renderComparison,
    openHighAlert,
    openLabValues,
    openProgress, saveProgress,
    openNCLEX, toggleNCLEXOption, selectNCLEXOption, submitNCLEX, nextNCLEX,
    openInteractions, addInteractionDrug, removeInteractionDrug
};

})();
