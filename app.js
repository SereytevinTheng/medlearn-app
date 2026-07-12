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
    function renderHome() {
        currentView = 'home';
        currentCategory = null;
        currentClass = null;
        // Reset feature nav active state
        document.querySelectorAll('.feature-nav-btn').forEach(b => b.classList.remove('active'));
        const homeBtn = document.querySelector('[data-feature="home"]');
        if (homeBtn) homeBtn.classList.add('active');
        updateBreadcrumb([{ label: 'Home', level: 'home' }]);

        let html = '<div class="section-header"><div><h2>Medication Categories</h2>';
        html += '<p class="section-description">Select a category to explore drug classes and medications</p></div></div>';
        html += '<div class="categories-grid">';

        for (const [key, category] of Object.entries(medicationDatabase)) {
            const classCount = Object.keys(category.classes).length;
            let medCount = 0;
            for (const cls of Object.values(category.classes)) {
                medCount += cls.medications.length;
            }
            html += `
                <div class="category-card" onclick="app.navigateToCategory('${key}')">
                    <div class="card-icon">${category.icon}</div>
                    <div class="card-title">${category.name}</div>
                    <div class="card-description">${category.description}</div>
                    <div class="card-count">${classCount} classes &bull; ${medCount} medications</div>
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
            { label: category.name, level: 'category' }
        ]);

        let html = '<div class="section-header"><div>';
        html += `<h2>${category.icon} ${category.name}</h2>`;
        html += `<p class="section-description">${category.description}</p>`;
        html += '</div>';
        html += `<button class="quiz-btn" onclick="app.startQuiz('category')">&#x1F4DD; Quiz Me</button>`;
        html += '</div>';
        html += '<div class="classes-grid">';

        for (const [key, drugClass] of Object.entries(category.classes)) {
            html += `
                <div class="class-card" onclick="app.navigateToClass('${categoryKey}', '${key}')">
                    <div class="class-title">${drugClass.name}</div>
                    <div class="class-description">${drugClass.description}</div>
                    <div class="class-med-count">${drugClass.medications.length} medications</div>
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
        html += '<div class="medications-grid">';

        drugClass.medications.forEach((med, index) => {
            html += `
                <div class="med-card" onclick="app.showMedDetail('${categoryKey}', '${classKey}', ${index})">
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
        `;

        medDetailContent.innerHTML = html;
        medDetailModal.classList.remove('hidden');
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
            <div class="footer">Generated by MedLearn &bull; Educational use only &bull; Always verify with current drug references</div>
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
        printClass
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
