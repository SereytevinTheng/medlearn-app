// MedLearn - Application Logic
// Handles navigation, search, quiz, and medication detail views

(function() {
    'use strict';

    // Load data from localStorage if available (admin panel edits), otherwise use default
    const savedData = localStorage.getItem('medlearn_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            Object.keys(parsed).forEach(key => {
                medicationDatabase[key] = parsed[key];
            });
        } catch(e) { /* use default data */ }
    }

    // State management
    let currentView = 'home';
    let currentCategory = null;
    let currentClass = null;
    let medOrigin = 'medications'; // 'medications' or 'bodymap' - where the user entered the drug browser from
    let quizQuestions = [];
    let quizIndex = 0;
    let quizScore = 0;

    // DOM Elements
    const mainContent = document.getElementById('mainContent');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const quizModal = document.getElementById('quizModal');
    const closeQuiz = document.getElementById('closeQuiz');
    const quizContent = document.getElementById('quizContent');
    const medDetailModal = document.getElementById('medDetailModal');
    const closeMedDetail = document.getElementById('closeMedDetail');
    const medDetailContent = document.getElementById('medDetailContent');

    // Initialize app
    function init() {
        renderHome();
        setupEventListeners();
    }

    // Event Listeners
    function setupEventListeners() {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', handleSearch);
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.add('hidden');
            }
        });
        closeQuiz.addEventListener('click', () => quizModal.classList.add('hidden'));
        closeMedDetail.addEventListener('click', () => medDetailModal.classList.add('hidden'));
        quizModal.addEventListener('click', function(e) {
            if (e.target === quizModal) quizModal.classList.add('hidden');
        });
        medDetailModal.addEventListener('click', function(e) {
            if (e.target === medDetailModal) medDetailModal.classList.add('hidden');
        });
    }

    // ===== NAVIGATION =====
    function getDrugOfTheDay() {
        // Build a flat list of all medications with their location
        const all = [];
        for (const [catKey, cat] of Object.entries(medicationDatabase)) {
            for (const [classKey, cls] of Object.entries(cat.classes)) {
                cls.medications.forEach((med, medIndex) => {
                    all.push({ med, catKey, classKey, medIndex, className: cls.name });
                });
            }
        }
        if (all.length === 0) return null;
        // Seed from the calendar date so it stays the same all day
        const now = new Date();
        const daySeed = now.getFullYear() * 1000 + (now.getMonth() * 31 + now.getDate());
        return all[daySeed % all.length];
    }

    function countMeds() {
        let cats = 0, meds = 0;
        for (const category of Object.values(medicationDatabase)) {
            cats++;
            for (const cls of Object.values(category.classes)) meds += cls.medications.length;
        }
        return { cats, meds };
    }

    // ===== HOME DASHBOARD (HUB) =====
    function renderHome() {
        currentView = 'home';
        currentCategory = null;
        currentClass = null;
        updateBreadcrumb([{ label: 'Home', level: 'home' }]);

        const stats = countMeds();
        let favCount = 0, sessionCount = 0;
        try { favCount = JSON.parse(localStorage.getItem('medlearn_favorites') || '[]').length; } catch(e) {}
        try { sessionCount = JSON.parse(localStorage.getItem('medlearn_progress') || '[]').length; } catch(e) {}

        let html = '';

        // XP / streak stats bar
        let game = { xp: 0, streak: 0 };
        try { game = JSON.parse(localStorage.getItem('medlearn_game') || '{"xp":0,"streak":0}'); } catch(e) {}
        const levelThresholds = [[0,'Pre-Nursing'],[100,'Student Nurse'],[300,'Senior Student'],[600,'New Graduate'],[1000,'Registered Nurse'],[1600,'Clinical Nurse'],[2500,'Nurse Educator']];
        let li = 0;
        levelThresholds.forEach((l, i) => { if ((game.xp||0) >= l[0]) li = i; });
        const nextAt = levelThresholds[li+1] ? levelThresholds[li+1][0] : null;
        const lvlProgress = nextAt ? Math.round(((game.xp||0) - levelThresholds[li][0]) / (nextAt - levelThresholds[li][0]) * 100) : 100;
        html += `<div class="xp-bar" onclick="features.openAchievements()" title="View achievements">
            <span class="xp-bar-level">&#x1F3C5; Lvl ${li+1} &middot; ${levelThresholds[li][1]}</span>
            <span class="xp-bar-streak">&#x1F525; ${game.streak||0}</span>
            <span class="xp-bar-prog"><span class="progress-bar-container"><span class="progress-bar-fill" style="display:block;width:${lvlProgress}%"></span></span></span>
            <span class="xp-bar-xp">${game.xp||0} XP</span>
        </div>`;

        // Drug of the Day (stable per calendar day)
        const dotd = getDrugOfTheDay();
        if (dotd) {
            html += `<div class="dotd-card" onclick="app.showMedDetail('${dotd.catKey}','${dotd.classKey}',${dotd.medIndex})">
                <div class="dotd-label">&#x1F4C5; Drug of the Day</div>
                <div class="dotd-name">${dotd.med.generic}</div>
                <div class="dotd-brand">${dotd.med.brand} &bull; ${dotd.className}</div>
                <div class="dotd-hint">Tap to learn more &#x2192;</div>
            </div>`;
        }

        // Dashboard tiles
        const tiles = [
            { icon: '\uD83D\uDC8A', title: 'Medications', desc: 'Browse drugs by category, class and detail', stat: `${stats.meds} medications &bull; ${stats.cats} categories`, action: "app.renderMedications()", accent: 'var(--primary)' },
            { icon: '\uD83D\uDDFA\uFE0F', title: 'Body-System Map', desc: 'Explore medications visually by body region', stat: 'Interactive map', action: "features.openBodyMap()", accent: '#0d9488' },
            { icon: '\uD83C\uDF93', title: 'Study & Practice', desc: 'Flashcards, match game, quizzes & cases', stat: '7 study tools', action: "features.openGroup('study')", accent: 'var(--secondary)' },
            { icon: '\uD83E\uDDEE', title: 'Drug Calculations', desc: 'Dosage, IV rates, drops/min & paediatric maths', stat: '5 problem types', action: "features.openCalculations()", accent: 'var(--success)' },
            { icon: '\uD83D\uDEE1\uFE0F', title: 'Safety', desc: 'High-risk meds, interactions, look-alikes & rights', stat: '4 safety tools', action: "features.openGroup('safety')", accent: 'var(--danger)' },
            { icon: '\uD83D\uDCDA', title: 'Reference', desc: 'Lab values, ranges, mnemonics & external links', stat: '3 reference tools', action: "features.openGroup('reference')", accent: 'var(--warning)' },
            { icon: '\u2B50', title: 'Favourites', desc: 'Your saved medications for quick review', stat: `${favCount} saved`, action: "features.openFavorites()", accent: '#f59e0b' },
            { icon: '\uD83D\uDCCA', title: 'Progress', desc: 'Track your quiz scores and study sessions', stat: `${sessionCount} sessions`, action: "features.openProgress()", accent: '#0891b2' },
            { icon: '\uD83C\uDFC5', title: 'Achievements', desc: 'Your level, XP, streak and badges', stat: `Level ${li+1}`, action: "features.openAchievements()", accent: '#eab308' },
            { icon: '\uD83D\uDEE0\uFE0F', title: 'Edit Medications', desc: 'Add, edit or delete medications yourself', stat: 'Admin panel', action: "window.location.href='admin.html'", accent: '#64748b' }
        ];

        html += '<div class="hub-grid">';
        tiles.forEach(t => {
            html += `<div class="hub-tile" style="border-top-color:${t.accent}" onclick="${t.action}">
                <div class="hub-icon">${t.icon}</div>
                <div class="hub-title">${t.title}</div>
                <div class="hub-desc">${t.desc}</div>
                <div class="hub-stat">${t.stat}</div>
            </div>`;
        });
        html += '</div>';
        mainContent.innerHTML = html;
    }

    // Returns the second breadcrumb crumb based on where the user entered the browser
    function originCrumb() {
        return medOrigin === 'bodymap'
            ? { label: 'Body Map', level: 'bodymap' }
            : { label: 'Medications', level: 'medications' };
    }

    // Enter the drug browser from the body-system map (keeps a Body Map trail)
    function browseCategoryFromMap(categoryKey) {
        medOrigin = 'bodymap';
        navigateToCategory(categoryKey);
    }

    // ===== MEDICATION BROWSER =====
    function renderMedications() {
        currentView = 'medications';
        medOrigin = 'medications';
        currentCategory = null;
        currentClass = null;
        updateBreadcrumb([
            { label: 'Home', level: 'home' },
            { label: 'Medications', level: 'medications' }
        ]);

        let html = '<div class="section-header"><div><h2>Medication Categories</h2>';
        html += '<p class="section-description">Select a category to explore drug classes and medications</p></div></div>';

        // Verification progress
        const vs = verifiedStats();
        const pct = vs.total ? Math.round((vs.done / vs.total) * 100) : 0;
        html += `<div class="verify-progress">
            <div class="verify-progress-label">&#x2705; Cross-check progress: ${vs.done} of ${vs.total} drug classes verified against eTG/AMH (${pct}%)</div>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>`;

        html += '<div class="categories-grid">';

        for (const [key, category] of Object.entries(medicationDatabase)) {
            const classCount = Object.keys(category.classes).length;
            let medCount = 0;
            for (const cls of Object.values(category.classes)) {
                medCount += cls.medications.length;
            }
            const catColor = category.color || 'var(--primary)';
            html += `
                <div class="category-card" style="border-left-color:${catColor}" onclick="app.navigateToCategory('${key}')">
                    <div class="card-icon">${category.icon}</div>
                    <div class="card-title">${category.name}</div>
                    <div class="card-description">${category.description}</div>
                    <div class="card-count" style="color:${catColor};background:${catColor}1a">${classCount} classes &bull; ${medCount} medications</div>
                </div>
            `;
        }

        html += '</div>';
        mainContent.innerHTML = html;
    }

    function navigateToCategory(categoryKey) {
        currentView = 'category';
        currentCategory = categoryKey;
        currentClass = null;
        const category = medicationDatabase[categoryKey];

        updateBreadcrumb([
            { label: 'Home', level: 'home' },
            originCrumb(),
            { label: category.name, level: 'category' }
        ]);

        let html = '<div class="section-header"><div>';
        html += `<h2>${category.icon} ${category.name}</h2>`;
        html += `<p class="section-description">${category.description}</p>`;
        html += '</div>';
        html += `<button class="quiz-btn" onclick="app.startQuiz('category')">&#x1F4DD; Quiz Me</button>`;
        html += '</div>';
        html += '<div class="classes-grid">';

        const catColor = category.color || 'var(--secondary)';
        for (const [key, drugClass] of Object.entries(category.classes)) {
            const vBadge = isClassVerified(categoryKey, key) ? '<span class="class-verified-badge">&#x2705; Verified</span>' : '';
            html += `
                <div class="class-card" style="border-top-color:${catColor}" onclick="app.navigateToClass('${categoryKey}', '${key}')">
                    <div class="class-title">${drugClass.name} ${vBadge}</div>
                    <div class="class-description">${drugClass.description}</div>
                    <div class="class-med-count" style="color:${catColor}">${drugClass.medications.length} medications</div>
                </div>
            `;
        }

        html += '</div>';
        mainContent.innerHTML = html;
    }

    function navigateToClass(categoryKey, classKey) {
        currentView = 'class';
        currentCategory = categoryKey;
        currentClass = classKey;
        const category = medicationDatabase[categoryKey];
        const drugClass = category.classes[classKey];

        updateBreadcrumb([
            { label: 'Home', level: 'home' },
            originCrumb(),
            { label: category.name, level: 'category' },
            { label: drugClass.name, level: 'class' }
        ]);

        let html = '<div class="section-header"><div>';
        html += `<h2>${drugClass.name}</h2>`;
        html += `<p class="section-description">${drugClass.description}</p>`;
        html += '</div>';
        html += '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;">';
        html += `<button class="quiz-btn" onclick="app.startQuiz('class')">&#x1F4DD; Quiz Me</button>`;
        html += `<button class="quiz-btn" style="background:var(--secondary);" onclick="app.printClass()">&#x1F5A8;&#xFE0F; Print / PDF</button>`;
        html += '</div>';
        html += '</div>';

        // Verified tracker banner
        const verified = isClassVerified(categoryKey, classKey);
        html += `<div class="verify-banner ${verified ? 'verified' : ''}" id="verifyBanner">
            <span>${verified ? '\u2705 You have marked this class as verified against eTG/AMH.' : '\u2139\uFE0F Not yet verified. After checking this class against eTG/AMH, mark it below to track your progress.'}</span>
            <button class="verify-btn" onclick="app.toggleClassVerified('${categoryKey}','${classKey}')">${verified ? 'Unmark' : 'Mark as verified \u2713'}</button>
        </div>`;

        html += '<div class="medications-grid">';

        const medColor = category.color || 'var(--success)';
        drugClass.medications.forEach((med, index) => {
            html += `
                <div class="med-card" style="border-left-color:${medColor}" onclick="app.showMedDetail('${categoryKey}', '${classKey}', ${index})">
                    <div class="med-generic">${med.generic}</div>
                    <div class="med-brand">${med.brand}</div>
                    <div class="med-quick-info">
                        <span class="med-tag">${med.indications[0]}</span>
                        <span class="med-tag">${med.dosageRange.split(';')[0]}</span>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        mainContent.innerHTML = html;
    }

    // ===== BREADCRUMB =====
    function updateBreadcrumb(items) {
        let html = '';
        items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            if (index > 0) {
                html += '<span class="breadcrumb-separator">&#x25B6;</span>';
            }
            if (isLast) {
                html += `<span class="breadcrumb-item active">${item.label}</span>`;
            } else {
                html += `<span class="breadcrumb-item" onclick="app.breadcrumbNav('${item.level}')">${item.label}</span>`;
            }
        });
        breadcrumb.innerHTML = html;
    }

    function breadcrumbNav(level) {
        switch(level) {
            case 'home':
                renderHome();
                break;
            case 'bodymap':
                if (window.features && features.openBodyMap) features.openBodyMap();
                break;
            case 'medications':
                renderMedications();
                break;
            case 'category':
                navigateToCategory(currentCategory);
                break;
            case 'class':
                navigateToClass(currentCategory, currentClass);
                break;
        }
    }

    // ===== MEDICATION DETAIL =====
    function showMedDetail(categoryKey, classKey, medIndex) {
        const med = medicationDatabase[categoryKey].classes[classKey].medications[medIndex];
        const className = medicationDatabase[categoryKey].classes[classKey].name;

        let html = `
            <div class="med-detail-header">
                <h2>${med.generic}</h2>
                <div class="brand-name">Brand: ${med.brand}</div>
                <div style="font-size:0.85rem; color:#64748b; margin-top:0.25rem;">Class: ${className}</div>
            </div>

            <div class="med-detail-section">
                <h3>&#x2699;&#xFE0F; Mechanism of Action</h3>
                <p>${med.mechanism}</p>
            </div>

            <div class="med-detail-section">
                <h3>&#x1F3AF; Indications</h3>
                <ul>
                    ${med.indications.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>

            <div class="med-detail-section">
                <h3>&#x26A0;&#xFE0F; Side Effects</h3>
                <ul>
                    ${med.sideEffects.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>

            <div class="med-detail-section">
                <h3>&#x1F48A; Dosage Range</h3>
                <p>${med.dosageRange}</p>
            </div>

            <div class="med-detail-section">
                <h3>&#x1F469;&#x200D;&#x2695;&#xFE0F; Nursing Considerations</h3>
                <div class="nursing-alert">
                    <p>${med.nursingConsiderations}</p>
                </div>
            </div>

            <div class="med-detail-section">
                <h3>&#x1F4DD; My Notes</h3>
                <textarea class="med-notes-area" id="medNotesArea" placeholder="Add your own study notes for ${med.generic}...">${getMedNote(med.generic)}</textarea>
                <div>
                    <button class="med-notes-save" onclick="app.saveMedNote('${med.generic.replace(/'/g, "\\'")}')">Save Note</button>
                    <span class="med-notes-saved" id="medNotesSaved"></span>
                </div>
            </div>
        `;

        medDetailContent.innerHTML = html;
        medDetailModal.classList.remove('hidden');
    }

    // ===== PERSONAL NOTES =====
    function getMedNotes() {
        return JSON.parse(localStorage.getItem('medlearn_notes') || '{}');
    }

    function getMedNote(generic) {
        const notes = getMedNotes();
        // Escape HTML to safely place inside the textarea
        const raw = notes[generic] || '';
        return raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function saveMedNote(generic) {
        const area = document.getElementById('medNotesArea');
        if (!area) return;
        const notes = getMedNotes();
        const val = area.value.trim();
        if (val) { notes[generic] = val; } else { delete notes[generic]; }
        localStorage.setItem('medlearn_notes', JSON.stringify(notes));
        const saved = document.getElementById('medNotesSaved');
        if (saved) {
            saved.textContent = '\u2713 Saved';
            setTimeout(() => { saved.textContent = ''; }, 2000);
        }
    }

    // ===== SEARCH =====
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        const results = [];

        for (const [catKey, category] of Object.entries(medicationDatabase)) {
            // Search category names
            if (category.name.toLowerCase().includes(query)) {
                results.push({
                    type: 'category',
                    name: category.name,
                    path: 'Category',
                    action: () => navigateToCategory(catKey)
                });
            }

            for (const [classKey, drugClass] of Object.entries(category.classes)) {
                // Search class names
                if (drugClass.name.toLowerCase().includes(query)) {
                    results.push({
                        type: 'class',
                        name: drugClass.name,
                        path: `${category.name}`,
                        action: () => navigateToClass(catKey, classKey)
                    });
                }

                // Search medications
                drugClass.medications.forEach((med, idx) => {
                    if (med.generic.toLowerCase().includes(query) ||
                        med.brand.toLowerCase().includes(query)) {
                        results.push({
                            type: 'medication',
                            name: `${med.generic} (${med.brand})`,
                            path: `${category.name} > ${drugClass.name}`,
                            action: () => {
                                navigateToClass(catKey, classKey);
                                setTimeout(() => showMedDetail(catKey, classKey, idx), 100);
                            }
                        });
                    }
                });
            }
        }

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item"><div class="result-name">No results found</div></div>';
        } else {
            searchResults.innerHTML = results.slice(0, 10).map((r, i) => `
                <div class="search-result-item" onclick="app.searchAction(${i})">
                    <div class="result-name">${r.name}</div>
                    <div class="result-path">${r.path}</div>
                </div>
            `).join('');
        }

        // Store actions for click handling
        window._searchActions = results.slice(0, 10).map(r => r.action);
        searchResults.classList.remove('hidden');
    }

    function searchAction(index) {
        if (window._searchActions && window._searchActions[index]) {
            window._searchActions[index]();
            searchInput.value = '';
            searchResults.classList.add('hidden');
        }
    }

    // ===== QUIZ =====
    function startQuiz(scope) {
        let medications = [];

        if (scope === 'category' && currentCategory) {
            const category = medicationDatabase[currentCategory];
            for (const drugClass of Object.values(category.classes)) {
                drugClass.medications.forEach(med => {
                    medications.push({ ...med, className: drugClass.name });
                });
            }
        } else if (scope === 'class' && currentCategory && currentClass) {
            const drugClass = medicationDatabase[currentCategory].classes[currentClass];
            drugClass.medications.forEach(med => {
                medications.push({ ...med, className: drugClass.name });
            });
        }

        if (medications.length < 4) {
            alert('Need at least 4 medications to generate a quiz.');
            return;
        }

        quizQuestions = generateQuizQuestions(medications, 5);
        quizIndex = 0;
        quizScore = 0;
        renderQuizQuestion();
        quizModal.classList.remove('hidden');
    }

    function generateQuizQuestions(medications, count) {
        const questions = [];
        const questionTypes = [
            'brandToGeneric',
            'genericToBrand',
            'mechanismToMed',
            'medToIndication',
            'medToSideEffect',
            'nursingConsideration'
        ];

        const shuffled = [...medications].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));

        selected.forEach(med => {
            const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            const otherMeds = medications.filter(m => m.generic !== med.generic)
                .sort(() => Math.random() - 0.5).slice(0, 3);

            let question = {};

            switch(type) {
                case 'brandToGeneric':
                    question = {
                        text: `What is the generic name for "${med.brand}"?`,
                        correct: med.generic,
                        options: shuffle([med.generic, ...otherMeds.map(m => m.generic)])
                    };
                    break;
                case 'genericToBrand':
                    question = {
                        text: `What is the brand name for "${med.generic}"?`,
                        correct: med.brand,
                        options: shuffle([med.brand, ...otherMeds.map(m => m.brand)])
                    };
                    break;
                case 'mechanismToMed':
                    question = {
                        text: `Which medication has this mechanism: "${med.mechanism}"?`,
                        correct: med.generic,
                        options: shuffle([med.generic, ...otherMeds.map(m => m.generic)])
                    };
                    break;
                case 'medToIndication':
                    question = {
                        text: `Which is an indication for ${med.generic} (${med.brand})?`,
                        correct: med.indications[0],
                        options: shuffle([med.indications[0], ...otherMeds.map(m => m.indications[0])])
                    };
                    break;
                case 'medToSideEffect':
                    question = {
                        text: `Which is a side effect of ${med.generic} (${med.brand})?`,
                        correct: med.sideEffects[0],
                        options: shuffle([med.sideEffects[0], ...otherMeds.map(m => m.sideEffects[0])])
                    };
                    break;
                case 'nursingConsideration':
                    question = {
                        text: `This nursing consideration applies to which medication: "${med.nursingConsiderations.substring(0, 80)}..."`,
                        correct: med.generic,
                        options: shuffle([med.generic, ...otherMeds.map(m => m.generic)])
                    };
                    break;
            }

            questions.push(question);
        });

        return questions;
    }

    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function renderQuizQuestion() {
        if (quizIndex >= quizQuestions.length) {
            renderQuizScore();
            return;
        }

        const q = quizQuestions[quizIndex];
        let html = `
            <div style="font-size:0.85rem; color:var(--text-light); margin-bottom:0.5rem;">
                Question ${quizIndex + 1} of ${quizQuestions.length}
            </div>
            <div class="quiz-question">${q.text}</div>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <div class="quiz-option" onclick="app.answerQuiz(${i})">${opt}</div>
                `).join('')}
            </div>
        `;
        quizContent.innerHTML = html;
    }

    function answerQuiz(selectedIndex) {
        const q = quizQuestions[quizIndex];
        const selected = q.options[selectedIndex];
        const isCorrect = selected === q.correct;

        if (isCorrect) quizScore++;

        // Highlight answers
        const options = quizContent.querySelectorAll('.quiz-option');
        options.forEach((opt, i) => {
            opt.classList.add('disabled');
            if (q.options[i] === q.correct) {
                opt.classList.add('correct');
            } else if (i === selectedIndex && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        // Show feedback
        const feedback = document.createElement('div');
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.textContent = isCorrect ? '✓ Correct!' : `✗ Incorrect. The answer is: ${q.correct}`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'quiz-next-btn';
        nextBtn.textContent = quizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'See Results';
        nextBtn.onclick = () => {
            quizIndex++;
            renderQuizQuestion();
        };

        quizContent.appendChild(feedback);
        quizContent.appendChild(nextBtn);
    }

    function renderQuizScore() {
        const percentage = Math.round((quizScore / quizQuestions.length) * 100);
        let message = '';
        if (percentage === 100) message = 'Perfect score! Excellent knowledge!';
        else if (percentage >= 80) message = 'Great job! Keep studying!';
        else if (percentage >= 60) message = 'Good effort! Review the material.';
        else message = 'Keep studying! You\'ll get there!';

        quizContent.innerHTML = `
            <div class="quiz-score">
                <h3>Quiz Complete!</h3>
                <div class="score-number">${quizScore}/${quizQuestions.length}</div>
                <p style="color:var(--text-light); margin:0.5rem 0;">${percentage}%</p>
                <p style="margin:1rem 0; font-size:1.1rem;">${message}</p>
                <button class="quiz-next-btn" onclick="app.startQuiz('${currentClass ? 'class' : 'category'}')">
                    Try Again
                </button>
                <button class="quiz-next-btn" style="background:var(--text-light); margin-left:0.5rem;" onclick="document.getElementById('quizModal').classList.add('hidden')">
                    Close
                </button>
            </div>
        `;
    }

    // ===== VERIFIED TRACKER =====
    function getVerified() {
        try { return JSON.parse(localStorage.getItem('medlearn_verified') || '{}'); } catch(e) { return {}; }
    }
    function isClassVerified(catKey, classKey) {
        return !!getVerified()[catKey + '.' + classKey];
    }
    function toggleClassVerified(catKey, classKey) {
        const v = getVerified();
        const key = catKey + '.' + classKey;
        if (v[key]) { delete v[key]; } else { v[key] = true; }
        localStorage.setItem('medlearn_verified', JSON.stringify(v));
        navigateToClass(catKey, classKey); // re-render to update banner
    }
    function verifiedStats() {
        let total = 0, done = 0;
        const v = getVerified();
        for (const [catKey, cat] of Object.entries(medicationDatabase)) {
            for (const classKey of Object.keys(cat.classes)) {
                total++;
                if (v[catKey + '.' + classKey]) done++;
            }
        }
        return { total, done };
    }

    // ===== PRINT / PDF EXPORT =====
    function printClass() {
        if (!currentCategory || !currentClass) return;
        const category = medicationDatabase[currentCategory];
        const drugClass = category.classes[currentClass];

        let rows = '';
        drugClass.medications.forEach(med => {
            rows += `
                <div class="print-med">
                    <h3>${med.generic} <span style="font-weight:normal;font-style:italic;color:#555;">(${med.brand})</span></h3>
                    <p><strong>Mechanism:</strong> ${med.mechanism}</p>
                    <p><strong>Indications:</strong> ${med.indications.join(', ')}</p>
                    <p><strong>Side Effects:</strong> ${med.sideEffects.join(', ')}</p>
                    <p><strong>Dosage:</strong> ${med.dosageRange}</p>
                    <p><strong>Nursing Considerations:</strong> ${med.nursingConsiderations}</p>
                </div>`;
        });

        const win = window.open('', '_blank');
        win.document.write(`<!DOCTYPE html><html><head><title>${drugClass.name} - MedLearn Study Sheet</title>
            <style>
                body { font-family: Georgia, serif; padding: 2rem; line-height: 1.5; color: #1a1a1a; }
                h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem; }
                .subtitle { color: #666; font-style: italic; margin-bottom: 1.5rem; }
                .print-med { page-break-inside: avoid; margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
                .print-med h3 { color: #7c3aed; margin-bottom: 0.5rem; text-transform: capitalize; }
                .print-med p { margin: 0.3rem 0; font-size: 0.95rem; }
                .footer { margin-top: 2rem; font-size: 0.8rem; color: #999; text-align: center; }
                @media print { body { padding: 0.5rem; } }
            </style></head><body>
            <h1>${category.icon} ${drugClass.name}</h1>
            <div class="subtitle">${drugClass.description} &bull; ${category.name}</div>
            ${rows}
            <div class="footer">Generated by MedLearn &bull; Study aid only, not clinical advice &bull; Verify against Therapeutic Guidelines (eTG) and the Australian Medicines Handbook (AMH)</div>
            </body></html>`);
        win.document.close();
        setTimeout(() => { win.print(); }, 400);
    }

    // ===== PUBLIC API =====
    window.app = {
        navigateToCategory,
        navigateToClass,
        showMedDetail,
        breadcrumbNav,
        searchAction,
        startQuiz,
        answerQuiz,
        renderHome,
        renderMedications,
        browseCategoryFromMap,
        printClass,
        saveMedNote,
        toggleClassVerified
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
