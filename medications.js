// MedLearn - Comprehensive Medication Database
// Structure: Categories > Drug Classes > Individual Medications

const medicationDatabase = {
    cardiovascular: {
        name: "Cardiovascular",
        icon: "\u2764\uFE0F",
        description: "Medications affecting the heart and blood vessels",
        classes: {}
    },
    respiratory: {
        name: "Respiratory",
        icon: "\uD83E\uDEC1",
        description: "Medications for lung and airway conditions",
        classes: {}
    },
    cns: {
        name: "Central Nervous System",
        icon: "\uD83E\uDDE0",
        description: "Medications affecting the brain and nervous system",
        classes: {}
    },
    endocrine: {
        name: "Endocrine",
        icon: "\u2696\uFE0F",
        description: "Medications for hormonal and metabolic disorders",
        classes: {}
    },
    antiinfective: {
        name: "Anti-Infective",
        icon: "\uD83E\uDDA0",
        description: "Medications to fight infections",
        classes: {}
    },
    gastrointestinal: {
        name: "Gastrointestinal",
        icon: "\uD83E\uDDB7",
        description: "Medications for digestive system disorders",
        classes: {}
    },
    psychiatric: {
        name: "Psychiatric",
        icon: "\uD83E\uDDEC",
        description: "Medications for mental health conditions",
        classes: {}
    },
    musculoskeletal: {
        name: "Musculoskeletal",
        icon: "\uD83E\uDDB4",
        description: "Medications for bones, joints, and muscles",
        classes: {}
    }
};


// ===== CARDIOVASCULAR - Calcium Channel Blockers =====
medicationDatabase.cardiovascular.classes.ccb = {
    name: "Calcium Channel Blockers (CCBs)",
    description: "Block calcium entry into vascular smooth muscle and cardiac cells",
    medications: [
        {
            generic: "amlodipine",
            brand: "Norvasc",
            mechanism: "Blocks L-type calcium channels in vascular smooth muscle, causing vasodilation",
            indications: ["Hypertension", "Chronic stable angina", "Vasospastic angina"],
            sideEffects: ["Peripheral edema", "Dizziness", "Flushing", "Headache", "Palpitations"],
            nursingConsiderations: "Monitor BP and heart rate. Assess for peripheral edema. Do not discontinue abruptly. Avoid grapefruit juice.",
            dosageRange: "2.5-10 mg PO daily"
        },
        {
            generic: "diltiazem",
            brand: "Cardizem",
            mechanism: "Non-dihydropyridine CCB; reduces heart rate, contractility, and vasodilates",
            indications: ["Hypertension", "Angina", "Atrial fibrillation/flutter", "SVT"],
            sideEffects: ["Bradycardia", "Hypotension", "Constipation", "Dizziness", "Headache"],
            nursingConsiderations: "Monitor HR and BP closely. Assess ECG for heart block. Avoid in patients with HF with reduced EF. Do not crush ER forms.",
            dosageRange: "120-360 mg PO daily (ER); IV for arrhythmias"
        },
        {
            generic: "verapamil",
            brand: "Calan",
            mechanism: "Non-dihydropyridine CCB; slows AV conduction, reduces contractility",
            indications: ["Hypertension", "Angina", "SVT", "Atrial fibrillation"],
            sideEffects: ["Constipation", "Bradycardia", "Hypotension", "Heart block", "Dizziness"],
            nursingConsiderations: "Monitor for constipation (very common). Check HR before giving - hold if <60. Avoid with beta-blockers (risk of severe bradycardia).",
            dosageRange: "80-480 mg PO daily in divided doses"
        },
        {
            generic: "nifedipine",
            brand: "Procardia",
            mechanism: "Dihydropyridine CCB; potent peripheral vasodilator",
            indications: ["Hypertension", "Chronic stable angina", "Vasospastic angina", "Preterm labor"],
            sideEffects: ["Reflex tachycardia", "Flushing", "Headache", "Peripheral edema", "Dizziness"],
            nursingConsiderations: "Use extended-release only for hypertension (immediate release can cause dangerous hypotension). Monitor BP. Avoid grapefruit.",
            dosageRange: "30-90 mg PO daily (ER)"
        },
        {
            generic: "nicardipine",
            brand: "Cardene",
            mechanism: "Dihydropyridine CCB; selective for vascular smooth muscle",
            indications: ["Hypertension", "Hypertensive emergency (IV)", "Angina"],
            sideEffects: ["Hypotension", "Tachycardia", "Headache", "Nausea", "Flushing"],
            nursingConsiderations: "IV form used in ICU for hypertensive emergencies. Monitor BP continuously during IV infusion. Change IV site every 12 hours to prevent phlebitis.",
            dosageRange: "20-40 mg PO TID; 5-15 mg/hr IV"
        },
        {
            generic: "felodipine",
            brand: "Plendil",
            mechanism: "Dihydropyridine CCB; highly selective for vascular smooth muscle",
            indications: ["Hypertension"],
            sideEffects: ["Peripheral edema", "Headache", "Flushing", "Dizziness", "Tachycardia"],
            nursingConsiderations: "Swallow whole - do not crush or chew ER tablet. Avoid grapefruit (significantly increases drug levels). Monitor BP regularly.",
            dosageRange: "2.5-10 mg PO daily"
        }
    ]
};


// ===== CARDIOVASCULAR - ACE Inhibitors =====
medicationDatabase.cardiovascular.classes.aceInhibitors = {
    name: "ACE Inhibitors",
    description: "Block angiotensin-converting enzyme to reduce blood pressure and cardiac workload",
    medications: [
        {
            generic: "lisinopril",
            brand: "Zestril/Prinivil",
            mechanism: "Inhibits ACE, preventing conversion of angiotensin I to angiotensin II",
            indications: ["Hypertension", "Heart failure", "Post-MI", "Diabetic nephropathy"],
            sideEffects: ["Dry cough", "Hyperkalemia", "Dizziness", "Angioedema", "Hypotension"],
            nursingConsiderations: "Monitor potassium levels. Teach patient about dry cough (common reason for discontinuation). Watch for angioedema - emergency! Avoid in pregnancy.",
            dosageRange: "5-40 mg PO daily"
        },
        {
            generic: "enalapril",
            brand: "Vasotec",
            mechanism: "Prodrug converted to enalaprilat; inhibits ACE",
            indications: ["Hypertension", "Heart failure", "Asymptomatic LV dysfunction"],
            sideEffects: ["Dry cough", "Hypotension", "Hyperkalemia", "Headache", "Dizziness"],
            nursingConsiderations: "Available in IV form (enalaprilat) for hypertensive emergencies. Monitor renal function and potassium. First-dose hypotension possible.",
            dosageRange: "5-40 mg PO daily in 1-2 doses"
        },
        {
            generic: "ramipril",
            brand: "Altace",
            mechanism: "Prodrug; inhibits ACE, reduces aldosterone secretion",
            indications: ["Hypertension", "Heart failure post-MI", "Stroke prevention", "CV risk reduction"],
            sideEffects: ["Cough", "Dizziness", "Hyperkalemia", "Fatigue", "Angioedema"],
            nursingConsiderations: "Can open capsule and mix with applesauce. Monitor BP especially with first dose. Check creatinine and potassium regularly.",
            dosageRange: "1.25-20 mg PO daily"
        },
        {
            generic: "captopril",
            brand: "Capoten",
            mechanism: "First ACE inhibitor; directly inhibits ACE enzyme",
            indications: ["Hypertension", "Heart failure", "Diabetic nephropathy", "Post-MI"],
            sideEffects: ["Taste disturbance", "Dry cough", "Rash", "Proteinuria", "Neutropenia"],
            nursingConsiderations: "Take on empty stomach (food reduces absorption by 30-40%). Short half-life requires BID-TID dosing. Monitor WBC in patients with renal impairment.",
            dosageRange: "25-150 mg PO BID-TID"
        },
        {
            generic: "benazepril",
            brand: "Lotensin",
            mechanism: "Prodrug converted to benazeprilat; inhibits ACE",
            indications: ["Hypertension"],
            sideEffects: ["Cough", "Headache", "Dizziness", "Hyperkalemia", "Fatigue"],
            nursingConsiderations: "Monitor renal function especially in elderly. Avoid potassium supplements and K-sparing diuretics. Contraindicated in pregnancy.",
            dosageRange: "10-40 mg PO daily"
        },
        {
            generic: "quinapril",
            brand: "Accupril",
            mechanism: "Prodrug; inhibits ACE in tissue and plasma",
            indications: ["Hypertension", "Heart failure"],
            sideEffects: ["Dizziness", "Cough", "Headache", "Hyperkalemia", "Chest pain"],
            nursingConsiderations: "High-fat meals may reduce absorption. Monitor BP 2-6 hours after first dose. Assess renal function at baseline and periodically.",
            dosageRange: "10-80 mg PO daily"
        }
    ]
};


// ===== CARDIOVASCULAR - ARBs =====
medicationDatabase.cardiovascular.classes.arbs = {
    name: "Angiotensin II Receptor Blockers (ARBs)",
    description: "Block angiotensin II receptors; similar to ACE inhibitors but without the cough",
    medications: [
        {
            generic: "losartan",
            brand: "Cozaar",
            mechanism: "Blocks AT1 receptors, preventing angiotensin II effects",
            indications: ["Hypertension", "Diabetic nephropathy", "Stroke prevention", "Heart failure"],
            sideEffects: ["Dizziness", "Hyperkalemia", "Hypotension", "Back pain", "Diarrhea"],
            nursingConsiderations: "Good alternative for patients with ACE inhibitor cough. Monitor potassium and renal function. Contraindicated in pregnancy. Has uricosuric effect.",
            dosageRange: "25-100 mg PO daily"
        },
        {
            generic: "valsartan",
            brand: "Diovan",
            mechanism: "Selective AT1 receptor blocker",
            indications: ["Hypertension", "Heart failure", "Post-MI"],
            sideEffects: ["Dizziness", "Headache", "Hyperkalemia", "Fatigue", "Abdominal pain"],
            nursingConsiderations: "Food decreases absorption by 40%. Monitor BP and heart rate. Do not use with ACE inhibitors (dual blockade increases adverse events).",
            dosageRange: "80-320 mg PO daily"
        },
        {
            generic: "irbesartan",
            brand: "Avapro",
            mechanism: "Non-competitive AT1 receptor antagonist",
            indications: ["Hypertension", "Diabetic nephropathy in type 2 DM"],
            sideEffects: ["Dizziness", "Diarrhea", "Dyspepsia", "Fatigue", "Hyperkalemia"],
            nursingConsiderations: "Can be taken with or without food. Monitor renal function in diabetic patients. Check potassium levels regularly.",
            dosageRange: "150-300 mg PO daily"
        },
        {
            generic: "candesartan",
            brand: "Atacand",
            mechanism: "Tight binding to AT1 receptor with slow dissociation",
            indications: ["Hypertension", "Heart failure"],
            sideEffects: ["Dizziness", "Back pain", "Hyperkalemia", "Hypotension", "Pharyngitis"],
            nursingConsiderations: "Can be used in patients who cannot tolerate ACE inhibitors. Monitor renal function and electrolytes. Dose adjust in hepatic impairment.",
            dosageRange: "8-32 mg PO daily"
        },
        {
            generic: "olmesartan",
            brand: "Benicar",
            mechanism: "Blocks AT1 receptors in vascular smooth muscle and adrenal gland",
            indications: ["Hypertension"],
            sideEffects: ["Dizziness", "Diarrhea", "Sprue-like enteropathy (rare)", "Hyperkalemia", "Back pain"],
            nursingConsiderations: "Associated with rare but severe sprue-like enteropathy (chronic diarrhea, weight loss). Report persistent GI symptoms immediately.",
            dosageRange: "20-40 mg PO daily"
        },
        {
            generic: "telmisartan",
            brand: "Micardis",
            mechanism: "AT1 receptor blocker with longest half-life in class; partial PPAR-gamma agonist",
            indications: ["Hypertension", "CV risk reduction"],
            sideEffects: ["Dizziness", "Back pain", "Sinusitis", "Diarrhea", "Hyperkalemia"],
            nursingConsiderations: "Longest-acting ARB - good for 24hr coverage. Do not remove tablet from blister pack until ready to use. Has mild metabolic benefits.",
            dosageRange: "20-80 mg PO daily"
        }
    ]
};


// ===== CARDIOVASCULAR - Diuretics =====
medicationDatabase.cardiovascular.classes.diuretics = {
    name: "Diuretics",
    description: "Increase urine output to reduce fluid volume and blood pressure",
    medications: [
        {
            generic: "furosemide",
            brand: "Lasix",
            mechanism: "Loop diuretic; inhibits Na-K-2Cl cotransporter in ascending loop of Henle",
            indications: ["Heart failure", "Edema", "Hypertension", "Pulmonary edema", "Acute renal failure"],
            sideEffects: ["Hypokalemia", "Dehydration", "Ototoxicity", "Hypotension", "Hyponatremia"],
            nursingConsiderations: "Monitor I&O, daily weights, electrolytes (especially K+, Na+, Mg2+). Give in morning to avoid nocturia. Monitor hearing with high doses. Sulfa allergy cross-reactivity.",
            dosageRange: "20-80 mg PO/IV; up to 600mg/day"
        },
        {
            generic: "hydrochlorothiazide (HCTZ)",
            brand: "Microzide",
            mechanism: "Thiazide diuretic; inhibits Na-Cl cotransporter in distal convoluted tubule",
            indications: ["Hypertension", "Edema", "Calcium nephrolithiasis prevention"],
            sideEffects: ["Hypokalemia", "Hyperglycemia", "Hyperuricemia", "Hypercalcemia", "Photosensitivity"],
            nursingConsiderations: "First-line for hypertension. Monitor glucose in diabetics. Causes photosensitivity - use sunscreen. Monitor electrolytes. Less effective if GFR <30.",
            dosageRange: "12.5-50 mg PO daily"
        },
        {
            generic: "spironolactone",
            brand: "Aldactone",
            mechanism: "Potassium-sparing diuretic; aldosterone receptor antagonist",
            indications: ["Heart failure", "Ascites", "Hypertension", "Hypokalemia prevention", "Hirsutism"],
            sideEffects: ["Hyperkalemia", "Gynecomastia", "Menstrual irregularities", "GI upset", "Dizziness"],
            nursingConsiderations: "Monitor potassium closely - risk of hyperkalemia! Avoid potassium supplements and ACE inhibitors together. Gynecomastia is dose-related. Takes 2-3 days for full effect.",
            dosageRange: "25-200 mg PO daily"
        },
        {
            generic: "bumetanide",
            brand: "Bumex",
            mechanism: "Loop diuretic; 40x more potent than furosemide mg per mg",
            indications: ["Edema", "Heart failure", "Hepatic/renal disease"],
            sideEffects: ["Hypokalemia", "Dehydration", "Hypotension", "Ototoxicity", "Muscle cramps"],
            nursingConsiderations: "More predictable oral absorption than furosemide. 1 mg bumetanide = 40 mg furosemide. Monitor electrolytes and renal function. Assess volume status.",
            dosageRange: "0.5-2 mg PO/IV daily"
        },
        {
            generic: "chlorthalidone",
            brand: "Thalitone",
            mechanism: "Thiazide-like diuretic; longer duration of action than HCTZ",
            indications: ["Hypertension", "Edema"],
            sideEffects: ["Hypokalemia", "Hyperuricemia", "Hyperglycemia", "Hypotension", "Hyponatremia"],
            nursingConsiderations: "Longer half-life provides better 24hr BP control than HCTZ. Monitor electrolytes. May exacerbate gout. Give in morning.",
            dosageRange: "12.5-25 mg PO daily"
        },
        {
            generic: "metolazone",
            brand: "Zaroxolyn",
            mechanism: "Thiazide-like; works synergistically with loop diuretics",
            indications: ["Edema refractory to loop diuretics", "Heart failure", "Renal impairment"],
            sideEffects: ["Severe hypokalemia", "Dehydration", "Hypotension", "Hyponatremia", "Metabolic alkalosis"],
            nursingConsiderations: "Often added to loop diuretics for synergistic effect in resistant edema. Give 30 min before loop diuretic. Monitor electrolytes very closely - can cause profound diuresis.",
            dosageRange: "2.5-10 mg PO daily"
        }
    ]
};


// ===== CARDIOVASCULAR - Beta Blockers =====
medicationDatabase.cardiovascular.classes.betaBlockers = {
    name: "Beta-Adrenergic Blockers",
    description: "Block beta-adrenergic receptors to reduce heart rate, contractility, and blood pressure",
    medications: [
        {
            generic: "metoprolol",
            brand: "Lopressor/Toprol-XL",
            mechanism: "Selective beta-1 blocker; reduces HR, contractility, and cardiac output",
            indications: ["Hypertension", "Heart failure", "Angina", "Post-MI", "Atrial fibrillation"],
            sideEffects: ["Bradycardia", "Fatigue", "Dizziness", "Depression", "Bronchospasm (less likely)"],
            nursingConsiderations: "Check HR before giving - hold if <60 bpm. Do not crush XL form. Taper gradually - do not stop abruptly (rebound tachycardia). Take with food.",
            dosageRange: "25-200 mg PO BID (tartrate); 25-400 mg daily (succinate XL)"
        },
        {
            generic: "atenolol",
            brand: "Tenormin",
            mechanism: "Cardioselective beta-1 blocker; does not cross BBB well",
            indications: ["Hypertension", "Angina", "Post-MI"],
            sideEffects: ["Bradycardia", "Cold extremities", "Fatigue", "Dizziness", "GI upset"],
            nursingConsiderations: "Less CNS effects (depression, nightmares) than lipophilic beta blockers. Renally eliminated - adjust dose in renal impairment. Do not stop abruptly.",
            dosageRange: "25-100 mg PO daily"
        },
        {
            generic: "carvedilol",
            brand: "Coreg",
            mechanism: "Non-selective beta blocker + alpha-1 blocker; causes vasodilation",
            indications: ["Heart failure", "Hypertension", "Post-MI with LV dysfunction"],
            sideEffects: ["Dizziness", "Hypotension", "Bradycardia", "Weight gain", "Hyperglycemia masking"],
            nursingConsiderations: "Take with food to slow absorption and reduce orthostatic hypotension. Start low and titrate slowly in HF. Proven mortality benefit in heart failure.",
            dosageRange: "3.125-25 mg PO BID; CR: 10-80 mg daily"
        },
        {
            generic: "propranolol",
            brand: "Inderal",
            mechanism: "Non-selective beta blocker (beta-1 and beta-2); lipophilic",
            indications: ["Hypertension", "Angina", "Tremor", "Migraine prevention", "Performance anxiety", "Thyroid storm"],
            sideEffects: ["Bradycardia", "Bronchospasm", "Depression", "Nightmares", "Cold extremities", "Fatigue"],
            nursingConsiderations: "Contraindicated in asthma/COPD (non-selective). Can mask hypoglycemia symptoms in diabetics. Crosses BBB - more CNS effects. Do not stop abruptly.",
            dosageRange: "40-320 mg PO daily in divided doses"
        },
        {
            generic: "bisoprolol",
            brand: "Zebeta",
            mechanism: "Highly selective beta-1 blocker",
            indications: ["Hypertension", "Heart failure"],
            sideEffects: ["Bradycardia", "Fatigue", "Dizziness", "Cold extremities", "Diarrhea"],
            nursingConsiderations: "One of three beta-blockers with proven HF mortality benefit (with carvedilol and metoprolol succinate). Most beta-1 selective at lower doses.",
            dosageRange: "2.5-10 mg PO daily"
        },
        {
            generic: "labetalol",
            brand: "Trandate",
            mechanism: "Non-selective beta blocker + alpha-1 blocker; IV for hypertensive emergencies",
            indications: ["Hypertension", "Hypertensive emergency", "Pregnancy-induced hypertension"],
            sideEffects: ["Orthostatic hypotension", "Dizziness", "Fatigue", "Nausea", "Scalp tingling"],
            nursingConsiderations: "Safe in pregnancy (preferred agent). Patient should remain supine during IV infusion. Monitor BP every 5 min during IV push. Can give PO or IV.",
            dosageRange: "100-400 mg PO BID; 20-80 mg IV push"
        }
    ]
};


// ===== CARDIOVASCULAR - Anticoagulants =====
medicationDatabase.cardiovascular.classes.anticoagulants = {
    name: "Anticoagulants",
    description: "Prevent blood clot formation by inhibiting clotting factors",
    medications: [
        {
            generic: "warfarin",
            brand: "Coumadin",
            mechanism: "Inhibits vitamin K-dependent clotting factors (II, VII, IX, X)",
            indications: ["DVT/PE prevention", "Atrial fibrillation", "Mechanical heart valves", "Stroke prevention"],
            sideEffects: ["Bleeding", "Bruising", "Hemorrhage", "Skin necrosis (rare)", "Purple toe syndrome"],
            nursingConsiderations: "Monitor INR (goal usually 2-3). Many drug/food interactions - vitamin K foods affect levels. Antidote: vitamin K (phytonadione). Teratogenic - avoid in pregnancy.",
            dosageRange: "1-10 mg PO daily (individualized to INR)"
        },
        {
            generic: "heparin (unfractionated)",
            brand: "Heparin",
            mechanism: "Potentiates antithrombin III to inactivate thrombin and factor Xa",
            indications: ["DVT/PE treatment", "ACS", "During surgery", "Dialysis"],
            sideEffects: ["Bleeding", "HIT (heparin-induced thrombocytopenia)", "Osteoporosis (long-term)", "Injection site reactions"],
            nursingConsiderations: "Monitor aPTT (goal 1.5-2.5x control). Check platelets regularly for HIT. Antidote: protamine sulfate. Never give IM. Use infusion pump for IV.",
            dosageRange: "5000 units SubQ q8-12h (prophylaxis); IV infusion per protocol"
        },
        {
            generic: "enoxaparin",
            brand: "Lovenox",
            mechanism: "Low molecular weight heparin; primarily inhibits factor Xa",
            indications: ["DVT prophylaxis", "DVT/PE treatment", "ACS", "Unstable angina"],
            sideEffects: ["Bleeding", "Injection site bruising", "Thrombocytopenia", "Anemia", "Fever"],
            nursingConsiderations: "Give SubQ in abdomen (alternate sides). Do NOT expel air bubble. Do not rub injection site. Monitor anti-Xa levels in obesity/renal impairment. Partially reversed by protamine.",
            dosageRange: "30-40 mg SubQ daily (prophylaxis); 1 mg/kg SubQ q12h (treatment)"
        },
        {
            generic: "rivaroxaban",
            brand: "Xarelto",
            mechanism: "Direct factor Xa inhibitor (DOAC)",
            indications: ["DVT/PE treatment", "Stroke prevention in AFib", "DVT prophylaxis post-surgery"],
            sideEffects: ["Bleeding", "Bruising", "Back pain", "GI bleeding", "Anemia"],
            nursingConsiderations: "Take with evening meal (>15mg dose needs food for absorption). No routine monitoring needed. Reversal agent: andexanet alfa. Avoid with strong CYP3A4 inhibitors.",
            dosageRange: "10-20 mg PO daily"
        },
        {
            generic: "apixaban",
            brand: "Eliquis",
            mechanism: "Direct factor Xa inhibitor (DOAC)",
            indications: ["Stroke prevention in AFib", "DVT/PE treatment", "DVT prophylaxis"],
            sideEffects: ["Bleeding", "Bruising", "Nausea", "Anemia", "Hypersensitivity"],
            nursingConsiderations: "Can be taken with or without food. Lowest GI bleeding risk among DOACs. Reversal: andexanet alfa. Can crush and give via NG tube. Adjust dose in elderly/low weight/renal impairment.",
            dosageRange: "2.5-5 mg PO BID"
        },
        {
            generic: "dabigatran",
            brand: "Pradaxa",
            mechanism: "Direct thrombin (factor IIa) inhibitor",
            indications: ["Stroke prevention in non-valvular AFib", "DVT/PE treatment"],
            sideEffects: ["GI bleeding", "Dyspepsia", "Gastritis", "Bruising", "Hemorrhage"],
            nursingConsiderations: "Swallow whole - do NOT crush, chew, or open capsules. Store in original bottle (moisture sensitive). Reversal agent: idarucizumab (Praxbind). High GI side effects.",
            dosageRange: "150 mg PO BID (75 mg BID if CrCl 15-30)"
        }
    ]
};


// ===== CARDIOVASCULAR - Antiarrhythmics =====
medicationDatabase.cardiovascular.classes.antiarrhythmics = {
    name: "Antiarrhythmics",
    description: "Medications that restore normal heart rhythm",
    medications: [
        {
            generic: "amiodarone",
            brand: "Cordarone/Pacerone",
            mechanism: "Class III antiarrhythmic; blocks potassium, sodium, and calcium channels; beta-blocking activity",
            indications: ["Ventricular tachycardia", "Ventricular fibrillation", "Atrial fibrillation", "Cardiac arrest (ACLS)"],
            sideEffects: ["Pulmonary toxicity", "Thyroid dysfunction", "Hepatotoxicity", "Corneal deposits", "Photosensitivity", "Blue-gray skin"],
            nursingConsiderations: "Extremely long half-life (40-55 days). Monitor thyroid, liver, and pulmonary function. Use sunscreen (severe photosensitivity). Many drug interactions (increases digoxin/warfarin levels).",
            dosageRange: "200-400 mg PO daily (maintenance); 150 mg IV bolus"
        },
        {
            generic: "digoxin",
            brand: "Lanoxin",
            mechanism: "Cardiac glycoside; inhibits Na-K-ATPase pump, increases intracellular calcium",
            indications: ["Heart failure", "Atrial fibrillation (rate control)"],
            sideEffects: ["Digoxin toxicity (N/V, visual changes, arrhythmias)", "Bradycardia", "Anorexia", "Confusion"],
            nursingConsiderations: "Narrow therapeutic index (0.5-2.0 ng/mL). Check apical pulse x1 min before giving - hold if <60. Monitor potassium (hypokalemia increases toxicity). Antidote: digoxin immune Fab.",
            dosageRange: "0.125-0.25 mg PO daily"
        },
        {
            generic: "adenosine",
            brand: "Adenocard",
            mechanism: "Slows AV node conduction; causes transient heart block",
            indications: ["SVT (supraventricular tachycardia)", "Diagnosis of wide-complex tachycardia"],
            sideEffects: ["Transient asystole", "Chest pressure", "Flushing", "Dyspnea", "Headache"],
            nursingConsiderations: "Give rapid IV push followed by rapid 20mL NS flush. Half-life <10 seconds. Patient may feel 'impending doom' briefly. Monitor continuously. Have crash cart at bedside.",
            dosageRange: "6 mg rapid IV push; may repeat 12 mg x2"
        },
        {
            generic: "lidocaine",
            brand: "Xylocaine",
            mechanism: "Class IB antiarrhythmic; blocks sodium channels in ischemic tissue",
            indications: ["Ventricular tachycardia", "Ventricular fibrillation", "PVCs (post-MI)"],
            sideEffects: ["CNS toxicity (seizures, confusion)", "Bradycardia", "Hypotension", "Paresthesias", "Drowsiness"],
            nursingConsiderations: "IV only for arrhythmias. Monitor for CNS toxicity (numbness, twitching, seizures). Reduce dose in hepatic impairment and elderly. Use cardiac monitor continuously.",
            dosageRange: "1-1.5 mg/kg IV bolus; 1-4 mg/min infusion"
        },
        {
            generic: "flecainide",
            brand: "Tambocor",
            mechanism: "Class IC antiarrhythmic; potent sodium channel blocker",
            indications: ["SVT", "Atrial fibrillation/flutter", "WPW syndrome"],
            sideEffects: ["Proarrhythmic", "Dizziness", "Visual disturbances", "Dyspnea", "Heart failure worsening"],
            nursingConsiderations: "ONLY use in patients without structural heart disease (increased mortality in post-MI patients - CAST trial). Monitor ECG for QRS widening. Trough levels should be checked.",
            dosageRange: "50-200 mg PO BID"
        },
        {
            generic: "sotalol",
            brand: "Betapace",
            mechanism: "Class III antiarrhythmic with beta-blocking properties",
            indications: ["Ventricular tachycardia", "Atrial fibrillation maintenance"],
            sideEffects: ["QT prolongation", "Torsades de pointes", "Bradycardia", "Fatigue", "Dizziness"],
            nursingConsiderations: "Must initiate in hospital with continuous monitoring (3 days). Monitor QTc interval. Renally dosed. Betapace and Betapace AF are NOT interchangeable.",
            dosageRange: "80-160 mg PO BID"
        }
    ]
};


// ===== RESPIRATORY - Bronchodilators (Beta-2 Agonists) =====
medicationDatabase.respiratory.classes.beta2Agonists = {
    name: "Beta-2 Agonists (Bronchodilators)",
    description: "Relax bronchial smooth muscle by stimulating beta-2 adrenergic receptors",
    medications: [
        {
            generic: "albuterol",
            brand: "ProAir/Ventolin/Proventil",
            mechanism: "Short-acting beta-2 agonist (SABA); relaxes bronchial smooth muscle",
            indications: ["Acute bronchospasm", "Asthma (rescue)", "COPD exacerbation", "Exercise-induced bronchospasm"],
            sideEffects: ["Tachycardia", "Tremor", "Nervousness", "Hypokalemia", "Headache"],
            nursingConsiderations: "Rescue inhaler - use PRN, not scheduled. If using >2x/week, asthma is uncontrolled. Teach proper inhaler technique. Rinse mouth after use. Monitor HR.",
            dosageRange: "1-2 puffs q4-6h PRN; 2.5 mg nebulized q4-6h"
        },
        {
            generic: "salmeterol",
            brand: "Serevent",
            mechanism: "Long-acting beta-2 agonist (LABA); 12-hour bronchodilation",
            indications: ["Asthma maintenance (with ICS)", "COPD maintenance", "Exercise-induced bronchospasm prevention"],
            sideEffects: ["Tachycardia", "Tremor", "Headache", "Throat irritation", "Paradoxical bronchospasm"],
            nursingConsiderations: "NEVER use as rescue inhaler. Must always be used with inhaled corticosteroid in asthma (FDA black box warning). Use BID at same time daily. Not for acute symptoms.",
            dosageRange: "1 inhalation (50 mcg) BID"
        },
        {
            generic: "formoterol",
            brand: "Foradil/Perforomist",
            mechanism: "Long-acting beta-2 agonist with rapid onset",
            indications: ["Asthma maintenance (with ICS)", "COPD", "Exercise-induced bronchospasm"],
            sideEffects: ["Tremor", "Tachycardia", "Headache", "Hypokalemia", "Dizziness"],
            nursingConsiderations: "Faster onset than salmeterol but still not recommended as sole rescue therapy. Store capsules in blister pack until use. Do not swallow capsules.",
            dosageRange: "12 mcg inhaled BID"
        },
        {
            generic: "levalbuterol",
            brand: "Xopenex",
            mechanism: "R-isomer of albuterol; selective beta-2 agonist with fewer cardiac effects",
            indications: ["Acute bronchospasm", "Asthma", "COPD"],
            sideEffects: ["Tachycardia (less than albuterol)", "Tremor", "Nervousness", "Headache"],
            nursingConsiderations: "May cause fewer cardiac side effects than racemic albuterol. More expensive. Store nebulizer vials in foil pouch until use. Protect from light.",
            dosageRange: "0.63-1.25 mg nebulized q6-8h"
        },
        {
            generic: "terbutaline",
            brand: "Brethine",
            mechanism: "Beta-2 agonist; also used for tocolysis",
            indications: ["Bronchospasm", "Preterm labor (tocolysis - off label)"],
            sideEffects: ["Tachycardia", "Tremor", "Hypokalemia", "Pulmonary edema (with tocolysis)", "Nervousness"],
            nursingConsiderations: "Available SubQ for severe bronchospasm. In obstetrics: monitor for pulmonary edema and cardiac arrhythmias. FDA warning against prolonged tocolysis use.",
            dosageRange: "2.5-5 mg PO TID; 0.25 mg SubQ"
        },
        {
            generic: "indacaterol",
            brand: "Arcapta",
            mechanism: "Ultra-long-acting beta-2 agonist (24-hour duration)",
            indications: ["COPD maintenance"],
            sideEffects: ["Cough", "Nasopharyngitis", "Headache", "Nausea", "Oropharyngeal pain"],
            nursingConsiderations: "Once-daily dosing for COPD only (not approved for asthma). Use Neohaler device. Do not swallow capsules. Store in original packaging until use.",
            dosageRange: "75 mcg inhaled once daily"
        }
    ]
};


// ===== RESPIRATORY - Inhaled Corticosteroids =====
medicationDatabase.respiratory.classes.inhaledCorticosteroids = {
    name: "Inhaled Corticosteroids (ICS)",
    description: "Reduce airway inflammation to prevent asthma and COPD exacerbations",
    medications: [
        {
            generic: "fluticasone",
            brand: "Flovent",
            mechanism: "Potent topical corticosteroid; reduces airway inflammation, edema, and mucus production",
            indications: ["Persistent asthma", "COPD (combination products)"],
            sideEffects: ["Oral thrush (candidiasis)", "Hoarseness", "Sore throat", "Cough", "Adrenal suppression (high doses)"],
            nursingConsiderations: "RINSE MOUTH after each use to prevent thrush. Not for acute attacks. Use spacer with MDI. Maintenance only - takes days to weeks for full effect.",
            dosageRange: "88-440 mcg inhaled BID"
        },
        {
            generic: "budesonide",
            brand: "Pulmicort",
            mechanism: "Corticosteroid with high topical potency and good safety profile",
            indications: ["Persistent asthma", "Croup (nebulized)"],
            sideEffects: ["Oral thrush", "Dysphonia", "Cough", "Headache", "Growth suppression in children (minor)"],
            nursingConsiderations: "Available as nebulizer suspension (good for children). Rinse mouth after use. Monitor growth in pediatric patients. Can mix with albuterol in nebulizer.",
            dosageRange: "180-360 mcg inhaled BID; 0.25-1 mg nebulized"
        },
        {
            generic: "beclomethasone",
            brand: "QVAR",
            mechanism: "Inhaled corticosteroid prodrug; activated in the lungs",
            indications: ["Persistent asthma"],
            sideEffects: ["Oral thrush", "Hoarseness", "Headache", "Pharyngitis", "Cough"],
            nursingConsiderations: "Extrafine particle formulation - no spacer required (but can use one). Rinse mouth after use. Do not use for acute bronchospasm.",
            dosageRange: "40-320 mcg inhaled BID"
        },
        {
            generic: "mometasone",
            brand: "Asmanex",
            mechanism: "Potent inhaled corticosteroid; once-daily dosing possible",
            indications: ["Persistent asthma"],
            sideEffects: ["Oral candidiasis", "Dysphonia", "Headache", "Musculoskeletal pain", "Sinusitis"],
            nursingConsiderations: "Can be dosed once daily in mild-moderate asthma. Twist-to-open device. Rinse mouth. Has nasal form (Nasonex) for allergic rhinitis.",
            dosageRange: "220-440 mcg inhaled daily or BID"
        },
        {
            generic: "ciclesonide",
            brand: "Alvesco",
            mechanism: "Prodrug activated in lungs; minimal oral deposition",
            indications: ["Persistent asthma"],
            sideEffects: ["Headache", "Nasopharyngitis", "Arthralgia", "Oral thrush (rare)", "Back pain"],
            nursingConsiderations: "Lower risk of oral thrush due to prodrug design (inactive until reaching lungs). Once or twice daily dosing. Still recommend mouth rinsing.",
            dosageRange: "80-320 mcg inhaled BID"
        },
        {
            generic: "fluticasone/salmeterol",
            brand: "Advair",
            mechanism: "Combination ICS + LABA; anti-inflammatory + long-acting bronchodilation",
            indications: ["Persistent asthma", "COPD"],
            sideEffects: ["Oral thrush", "Hoarseness", "Headache", "Upper respiratory infection", "Tachycardia"],
            nursingConsiderations: "Most prescribed combination inhaler. Rinse mouth after use. NOT for rescue. Available as Diskus (DPI) or HFA (MDI). Black box warning for LABA in asthma (must use with ICS).",
            dosageRange: "1 inhalation BID (various strengths)"
        }
    ]
};

// ===== RESPIRATORY - Anticholinergics =====
medicationDatabase.respiratory.classes.anticholinergics = {
    name: "Anticholinergics (Bronchodilators)",
    description: "Block muscarinic receptors in airway smooth muscle to cause bronchodilation",
    medications: [
        {
            generic: "ipratropium",
            brand: "Atrovent",
            mechanism: "Short-acting muscarinic antagonist (SAMA); blocks acetylcholine in bronchial smooth muscle",
            indications: ["COPD", "Acute bronchospasm (with albuterol)", "Rhinorrhea (nasal form)"],
            sideEffects: ["Dry mouth", "Headache", "Cough", "Nausea", "Blurred vision (if contacts eye)"],
            nursingConsiderations: "Slower onset than albuterol (15-30 min). Often combined with albuterol (DuoNeb/Combivent). Protect eyes during nebulizer treatment. Not first-line rescue in asthma.",
            dosageRange: "2 puffs QID; 0.5 mg nebulized q6-8h"
        },
        {
            generic: "tiotropium",
            brand: "Spiriva",
            mechanism: "Long-acting muscarinic antagonist (LAMA); 24-hour bronchodilation",
            indications: ["COPD maintenance", "Asthma (add-on)"],
            sideEffects: ["Dry mouth", "Constipation", "UTI", "Blurred vision", "Tachycardia"],
            nursingConsiderations: "Once daily - cornerstone of COPD maintenance. Use HandiHaler (capsule) or Respimat (mist). Do not swallow capsules. Contraindicated with narrow-angle glaucoma.",
            dosageRange: "18 mcg (HandiHaler) or 2.5 mcg (Respimat) inhaled daily"
        },
        {
            generic: "umeclidinium",
            brand: "Incruse Ellipta",
            mechanism: "Long-acting muscarinic antagonist (LAMA)",
            indications: ["COPD maintenance"],
            sideEffects: ["Nasopharyngitis", "Upper respiratory infection", "Cough", "Arthralgia", "Dry mouth"],
            nursingConsiderations: "Once-daily dosing via Ellipta device. Simple to use inhaler. Do not use with other anticholinergics. Available in combinations (Anoro = umeclidinium/vilanterol).",
            dosageRange: "62.5 mcg inhaled once daily"
        },
        {
            generic: "aclidinium",
            brand: "Tudorza Pressair",
            mechanism: "Long-acting muscarinic antagonist; rapid onset",
            indications: ["COPD maintenance"],
            sideEffects: ["Headache", "Nasopharyngitis", "Cough", "Diarrhea", "Dry mouth"],
            nursingConsiderations: "BID dosing (unlike tiotropium). Rapid onset of action. Colored control window turns from green to red when dose is inhaled correctly.",
            dosageRange: "400 mcg inhaled BID"
        },
        {
            generic: "glycopyrrolate (inhaled)",
            brand: "Lonhala/Seebri",
            mechanism: "Long-acting muscarinic antagonist for inhalation",
            indications: ["COPD maintenance"],
            sideEffects: ["UTI", "Upper respiratory infection", "Nasopharyngitis", "Dry mouth", "Constipation"],
            nursingConsiderations: "Available as nebulizer solution (Lonhala Magnair) or DPI (Seebri). Do not use for acute bronchospasm. Different from glycopyrrolate injection used for secretions.",
            dosageRange: "15.6 mcg nebulized BID or 15.6 mcg DPI BID"
        },
        {
            generic: "ipratropium/albuterol",
            brand: "Combivent/DuoNeb",
            mechanism: "Combination SAMA + SABA for dual bronchodilation",
            indications: ["COPD", "Acute bronchospasm"],
            sideEffects: ["Dry mouth", "Tachycardia", "Tremor", "Headache", "Cough"],
            nursingConsiderations: "Combine anticholinergic and beta-2 agonist for synergistic effect. Commonly used in ER and inpatient for COPD exacerbations. Protect eyes during nebulizer use.",
            dosageRange: "1 vial (3 mL) nebulized QID; 1 puff QID (Respimat)"
        }
    ]
};


// ===== RESPIRATORY - Leukotriene Modifiers =====
medicationDatabase.respiratory.classes.leukotrieneModifiers = {
    name: "Leukotriene Receptor Antagonists",
    description: "Block leukotriene receptors to reduce inflammation and bronchoconstriction",
    medications: [
        {
            generic: "montelukast",
            brand: "Singulair",
            mechanism: "Blocks cysteinyl leukotriene receptor (CysLT1), reducing inflammation",
            indications: ["Asthma prophylaxis", "Allergic rhinitis", "Exercise-induced bronchospasm"],
            sideEffects: ["Headache", "Neuropsychiatric events (depression, suicidal thoughts)", "Abdominal pain", "Fatigue"],
            nursingConsiderations: "FDA black box warning for neuropsychiatric events - monitor mood changes. Take in evening for asthma. Not for acute attacks. Good for children (chewable tablets available).",
            dosageRange: "10 mg PO daily (adults); 4-5 mg (pediatric)"
        },
        {
            generic: "zafirlukast",
            brand: "Accolate",
            mechanism: "Leukotriene receptor antagonist; competitive blocker of CysLT1",
            indications: ["Asthma prophylaxis"],
            sideEffects: ["Headache", "Hepatotoxicity", "GI upset", "Infection", "Dizziness"],
            nursingConsiderations: "Take on empty stomach (1 hour before or 2 hours after meals). Monitor liver function. Inhibits CYP2C9 and 3A4 - drug interactions with warfarin. BID dosing.",
            dosageRange: "20 mg PO BID"
        },
        {
            generic: "zileuton",
            brand: "Zyflo",
            mechanism: "5-lipoxygenase inhibitor; blocks leukotriene synthesis (not receptor)",
            indications: ["Asthma prophylaxis"],
            sideEffects: ["Hepatotoxicity", "Headache", "Dyspepsia", "Myalgia", "Insomnia"],
            nursingConsiderations: "Monitor LFTs monthly for first 3 months, then periodically. Inhibits CYP1A2 - increases theophylline and warfarin levels. QID dosing limits adherence.",
            dosageRange: "600 mg PO QID (IR); 1200 mg PO BID (ER)"
        },
        {
            generic: "cromolyn sodium",
            brand: "Intal",
            mechanism: "Mast cell stabilizer; prevents release of inflammatory mediators",
            indications: ["Asthma prophylaxis", "Exercise-induced bronchospasm", "Allergic rhinitis"],
            sideEffects: ["Cough", "Throat irritation", "Unpleasant taste", "Headache", "Nausea"],
            nursingConsiderations: "Preventive only - NOT for acute attacks. Must use regularly (QID) for effect. Very safe - often used in children. Takes 2-4 weeks for full benefit.",
            dosageRange: "20 mg inhaled QID"
        },
        {
            generic: "omalizumab",
            brand: "Xolair",
            mechanism: "Monoclonal antibody against IgE; prevents IgE-mediated inflammation",
            indications: ["Moderate-severe persistent allergic asthma", "Chronic urticaria"],
            sideEffects: ["Injection site reactions", "Anaphylaxis", "Headache", "Arthralgia", "Fatigue"],
            nursingConsiderations: "SubQ injection every 2-4 weeks. Must observe patient 2 hours after first 3 doses (anaphylaxis risk). Expensive. Only for IgE-mediated asthma. Administer in healthcare setting.",
            dosageRange: "150-375 mg SubQ every 2-4 weeks (based on IgE and weight)"
        },
        {
            generic: "theophylline",
            brand: "Theo-24/Elixophyllin",
            mechanism: "Methylxanthine; phosphodiesterase inhibitor, adenosine antagonist; bronchodilator",
            indications: ["Asthma", "COPD", "Apnea of prematurity"],
            sideEffects: ["Tachycardia", "Nausea/vomiting", "Seizures", "Insomnia", "Arrhythmias"],
            nursingConsiderations: "Narrow therapeutic index (5-15 mcg/mL). Monitor drug levels. Many interactions (smoking, erythromycin, cimetidine). Signs of toxicity: N/V, tachycardia, seizures.",
            dosageRange: "200-400 mg PO BID (adjust per levels)"
        }
    ]
};


// ===== CNS - Opioid Analgesics =====
medicationDatabase.cns.classes.opioids = {
    name: "Opioid Analgesics",
    description: "Bind to opioid receptors to provide pain relief",
    medications: [
        {
            generic: "morphine",
            brand: "MS Contin/Roxanol",
            mechanism: "Mu-opioid receptor agonist; gold standard opioid analgesic",
            indications: ["Severe pain", "MI pain", "Pulmonary edema", "Palliative care"],
            sideEffects: ["Respiratory depression", "Constipation", "Nausea/vomiting", "Sedation", "Hypotension", "Pruritus"],
            nursingConsiderations: "Monitor respiratory rate (hold if <12). Assess pain scale before and after. Have naloxone at bedside. Causes histamine release. Titrate slowly in opioid-naive patients.",
            dosageRange: "2-15 mg IV/IM q3-4h; 15-30 mg PO q4h"
        },
        {
            generic: "hydromorphone",
            brand: "Dilaudid",
            mechanism: "Potent mu-opioid agonist; 5-7x more potent than morphine",
            indications: ["Severe pain", "Chronic pain", "Palliative care"],
            sideEffects: ["Respiratory depression", "Sedation", "Constipation", "Nausea", "Dizziness"],
            nursingConsiderations: "HIGH ALERT medication - verify dose carefully (easily confused with morphine dosing). 1 mg IV hydromorphone ~ 7 mg IV morphine. Monitor respirations closely.",
            dosageRange: "0.2-1 mg IV q2-3h; 2-4 mg PO q4-6h"
        },
        {
            generic: "oxycodone",
            brand: "OxyContin/Percocet",
            mechanism: "Semi-synthetic mu-opioid agonist",
            indications: ["Moderate-severe pain", "Chronic pain (ER form)"],
            sideEffects: ["Constipation", "Nausea", "Sedation", "Dizziness", "Respiratory depression", "Euphoria"],
            nursingConsiderations: "High abuse potential (Schedule II). OxyContin is ER - do not crush. Percocet = oxycodone + acetaminophen (watch total APAP). Initiate bowel regimen prophylactically.",
            dosageRange: "5-15 mg PO q4-6h (IR); 10-80 mg PO q12h (ER)"
        },
        {
            generic: "fentanyl",
            brand: "Duragesic/Sublimaze",
            mechanism: "Synthetic mu-opioid agonist; 80-100x more potent than morphine",
            indications: ["Severe pain", "Anesthesia", "Chronic pain (patch)", "Breakthrough cancer pain"],
            sideEffects: ["Respiratory depression", "Bradycardia", "Muscle rigidity", "Constipation", "Sedation"],
            nursingConsiderations: "Patch: only for opioid-tolerant patients. Do NOT cut patches. Avoid heat (increases absorption). IV: used in anesthesia/ICU. Monitor closely - rapid onset, short duration (IV).",
            dosageRange: "25-100 mcg/hr transdermal; 25-100 mcg IV"
        },
        {
            generic: "tramadol",
            brand: "Ultram",
            mechanism: "Weak mu-opioid agonist + inhibits serotonin/norepinephrine reuptake",
            indications: ["Moderate pain"],
            sideEffects: ["Nausea", "Dizziness", "Constipation", "Seizures", "Serotonin syndrome", "Headache"],
            nursingConsiderations: "Lower abuse potential (Schedule IV) but still has opioid effects. Risk of seizures at high doses. Serotonin syndrome risk with SSRIs/SNRIs. Max 400 mg/day.",
            dosageRange: "50-100 mg PO q4-6h"
        },
        {
            generic: "codeine",
            brand: "Various (Tylenol #3)",
            mechanism: "Prodrug converted to morphine by CYP2D6; weak opioid agonist",
            indications: ["Mild-moderate pain", "Cough suppression"],
            sideEffects: ["Constipation", "Nausea", "Sedation", "Respiratory depression", "Dizziness"],
            nursingConsiderations: "Effectiveness depends on CYP2D6 metabolism (ultra-rapid metabolizers at risk for toxicity). Avoid in children <12 and post-tonsillectomy. Often combined with acetaminophen.",
            dosageRange: "15-60 mg PO q4-6h"
        }
    ]
};

// ===== CNS - Anticonvulsants =====
medicationDatabase.cns.classes.anticonvulsants = {
    name: "Anticonvulsants/Antiepileptics",
    description: "Medications that prevent or control seizures",
    medications: [
        {
            generic: "phenytoin",
            brand: "Dilantin",
            mechanism: "Blocks voltage-gated sodium channels; stabilizes neuronal membranes",
            indications: ["Seizures (tonic-clonic, partial)", "Status epilepticus", "Seizure prophylaxis"],
            sideEffects: ["Gingival hyperplasia", "Ataxia", "Nystagmus", "Hirsutism", "SJS/TEN", "Purple glove syndrome (IV)"],
            nursingConsiderations: "Narrow therapeutic index (10-20 mcg/mL). Monitor free levels. Many drug interactions. IV: use filter, give slowly (max 50 mg/min), cardiac monitor. Teach oral hygiene.",
            dosageRange: "300-400 mg PO daily; 15-20 mg/kg IV loading"
        },
        {
            generic: "levetiracetam",
            brand: "Keppra",
            mechanism: "Binds synaptic vesicle protein SV2A; modulates neurotransmitter release",
            indications: ["Partial seizures", "Generalized seizures", "Myoclonic seizures"],
            sideEffects: ["Behavioral changes", "Irritability", "Drowsiness", "Headache", "Dizziness"],
            nursingConsiderations: "Few drug interactions (renally eliminated). Monitor for behavioral/mood changes (especially aggression in children). Can give IV or PO. Adjust dose in renal impairment.",
            dosageRange: "500-1500 mg PO BID"
        },
        {
            generic: "valproic acid",
            brand: "Depakote/Depakene",
            mechanism: "Increases GABA, blocks sodium channels, blocks T-type calcium channels",
            indications: ["Seizures (all types)", "Bipolar disorder", "Migraine prevention"],
            sideEffects: ["Hepatotoxicity", "Pancreatitis", "Thrombocytopenia", "Weight gain", "Tremor", "Teratogenic (neural tube defects)"],
            nursingConsiderations: "Monitor LFTs and CBC. Highly teratogenic - pregnancy test before starting in women. Check levels (50-100 mcg/mL). Can cause fatal hepatotoxicity especially in children <2.",
            dosageRange: "500-2000 mg PO daily in divided doses"
        },
        {
            generic: "carbamazepine",
            brand: "Tegretol",
            mechanism: "Blocks voltage-gated sodium channels; stabilizes inactivated state",
            indications: ["Partial seizures", "Tonic-clonic seizures", "Trigeminal neuralgia", "Bipolar disorder"],
            sideEffects: ["Aplastic anemia", "Agranulocytosis", "SJS/TEN", "Hyponatremia", "Dizziness", "Diplopia"],
            nursingConsiderations: "Test for HLA-B*1502 in Asian patients (SJS risk). Potent CYP3A4 inducer - many drug interactions. Monitor CBC and sodium. Autoinduces own metabolism.",
            dosageRange: "200-1200 mg PO daily in divided doses"
        },
        {
            generic: "lamotrigine",
            brand: "Lamictal",
            mechanism: "Blocks voltage-gated sodium channels; inhibits glutamate release",
            indications: ["Partial seizures", "Generalized seizures", "Bipolar maintenance"],
            sideEffects: ["SJS/TEN (especially with rapid titration)", "Rash", "Dizziness", "Headache", "Diplopia", "Nausea"],
            nursingConsiderations: "MUST titrate slowly to reduce SJS risk. Valproate doubles lamotrigine levels (use lower dose). Stop immediately if rash develops. Interaction with oral contraceptives.",
            dosageRange: "100-400 mg PO daily (slow titration over 6 weeks)"
        },
        {
            generic: "gabapentin",
            brand: "Neurontin",
            mechanism: "Binds alpha-2-delta subunit of voltage-gated calcium channels; reduces neurotransmitter release",
            indications: ["Partial seizures (adjunct)", "Postherpetic neuralgia", "Neuropathic pain", "Fibromyalgia (off-label)"],
            sideEffects: ["Drowsiness", "Dizziness", "Ataxia", "Peripheral edema", "Weight gain"],
            nursingConsiderations: "Not a true GABA analog despite name. Renally eliminated - adjust in renal impairment. Taper when discontinuing. Absorption is saturable - higher doses have less bioavailability.",
            dosageRange: "300-1200 mg PO TID"
        }
    ]
};


// ===== CNS - Antiparkinsonian =====
medicationDatabase.cns.classes.antiparkinsonian = {
    name: "Antiparkinsonian Agents",
    description: "Medications to manage Parkinson's disease by increasing dopamine or reducing acetylcholine",
    medications: [
        {
            generic: "levodopa/carbidopa",
            brand: "Sinemet",
            mechanism: "Levodopa converts to dopamine in brain; carbidopa prevents peripheral conversion",
            indications: ["Parkinson's disease"],
            sideEffects: ["Dyskinesia", "Nausea", "Orthostatic hypotension", "Hallucinations", "On-off phenomenon", "Darkened urine"],
            nursingConsiderations: "Most effective PD drug. Take on empty stomach (protein reduces absorption). 'Drug holidays' no longer recommended. On-off fluctuations develop over time. Avoid with MAOIs.",
            dosageRange: "25/100 to 50/200 mg PO TID"
        },
        {
            generic: "pramipexole",
            brand: "Mirapex",
            mechanism: "Non-ergot dopamine agonist (D2, D3, D4 receptors)",
            indications: ["Parkinson's disease", "Restless leg syndrome"],
            sideEffects: ["Somnolence (sleep attacks)", "Nausea", "Hallucinations", "Impulse control disorders", "Orthostatic hypotension"],
            nursingConsiderations: "Warn about sudden sleep attacks (do not drive until effect known). Watch for impulse control disorders (gambling, hypersexuality, shopping). Taper slowly to discontinue.",
            dosageRange: "0.125-1.5 mg PO TID"
        },
        {
            generic: "ropinirole",
            brand: "Requip",
            mechanism: "Non-ergot dopamine agonist (D2 receptors primarily)",
            indications: ["Parkinson's disease", "Restless leg syndrome"],
            sideEffects: ["Nausea", "Dizziness", "Somnolence", "Hallucinations", "Impulse control disorders"],
            nursingConsiderations: "Similar to pramipexole. Can be used as monotherapy in early PD or adjunct in advanced. Augmentation possible in RLS (symptoms occur earlier in day).",
            dosageRange: "0.25-8 mg PO TID; XL: 2-24 mg daily"
        },
        {
            generic: "selegiline",
            brand: "Eldepryl/Zelapar",
            mechanism: "Selective MAO-B inhibitor; prevents dopamine breakdown in brain",
            indications: ["Parkinson's disease (adjunct)", "Major depression (transdermal)"],
            sideEffects: ["Insomnia", "Nausea", "Dizziness", "Orthostatic hypotension", "Dyskinesia (with levodopa)"],
            nursingConsiderations: "At recommended doses, selective for MAO-B (no tyramine dietary restriction needed). At higher doses, loses selectivity. Metabolized to amphetamine derivatives (avoid evening dosing).",
            dosageRange: "5 mg PO BID; ODT: 1.25 mg daily"
        },
        {
            generic: "amantadine",
            brand: "Symmetrel/Gocovri",
            mechanism: "Increases dopamine release; NMDA receptor antagonist; mild anticholinergic",
            indications: ["Parkinson's disease", "Drug-induced EPS", "Levodopa-induced dyskinesia", "Influenza A"],
            sideEffects: ["Livedo reticularis", "Ankle edema", "Confusion", "Hallucinations", "Insomnia"],
            nursingConsiderations: "Unique mottled skin appearance (livedo reticularis) is harmless. Do not stop abruptly (neuroleptic malignant syndrome risk). Renally eliminated - adjust dose.",
            dosageRange: "100 mg PO BID; ER: 137-274 mg daily"
        },
        {
            generic: "benztropine",
            brand: "Cogentin",
            mechanism: "Anticholinergic; blocks muscarinic receptors to restore dopamine/ACh balance",
            indications: ["Parkinson's disease", "Drug-induced EPS (dystonia, akathisia)"],
            sideEffects: ["Dry mouth", "Blurred vision", "Constipation", "Urinary retention", "Confusion", "Tachycardia"],
            nursingConsiderations: "Often used for acute dystonic reactions (give IM/IV). Avoid in elderly (anticholinergic burden). Contraindicated in narrow-angle glaucoma. Monitor for urinary retention.",
            dosageRange: "0.5-6 mg PO/IM daily"
        }
    ]
};


// ===== ENDOCRINE - Diabetes (Insulins) =====
medicationDatabase.endocrine.classes.insulins = {
    name: "Insulins",
    description: "Exogenous insulin preparations for blood glucose control",
    medications: [
        {
            generic: "insulin lispro",
            brand: "Humalog",
            mechanism: "Rapid-acting insulin analog; mimics prandial insulin secretion",
            indications: ["Type 1 DM", "Type 2 DM", "DKA", "Hyperkalemia"],
            sideEffects: ["Hypoglycemia", "Injection site reactions", "Lipodystrophy", "Weight gain", "Hypokalemia"],
            nursingConsiderations: "Give within 15 min of meals (rapid onset 15 min, peak 1-2 hr). CLEAR solution. Can mix with NPH. Monitor blood glucose. Rotate injection sites.",
            dosageRange: "Individualized; 0.5-1 unit/kg/day total insulin"
        },
        {
            generic: "insulin aspart",
            brand: "NovoLog",
            mechanism: "Rapid-acting insulin analog",
            indications: ["Type 1 DM", "Type 2 DM"],
            sideEffects: ["Hypoglycemia", "Injection site reactions", "Lipodystrophy", "Weight gain"],
            nursingConsiderations: "Give 5-10 min before meals. Can be used in insulin pumps. CLEAR solution. Faster onset than regular insulin. Do not mix with other insulins in pump.",
            dosageRange: "Individualized based on glucose monitoring"
        },
        {
            generic: "regular insulin (human)",
            brand: "Humulin R/Novolin R",
            mechanism: "Short-acting insulin; identical structure to human insulin",
            indications: ["Type 1 DM", "Type 2 DM", "DKA (IV)", "Hyperkalemia"],
            sideEffects: ["Hypoglycemia", "Weight gain", "Injection site reactions", "Hypokalemia"],
            nursingConsiderations: "ONLY insulin that can be given IV. Give 30 min before meals SubQ. CLEAR solution. Used in sliding scales. Onset 30 min, peak 2-4 hr, duration 6-8 hr.",
            dosageRange: "Variable; IV drip 0.1 units/kg/hr for DKA"
        },
        {
            generic: "insulin glargine",
            brand: "Lantus/Basaglar",
            mechanism: "Long-acting basal insulin; forms microprecipitates for slow absorption",
            indications: ["Type 1 DM (basal)", "Type 2 DM (basal)"],
            sideEffects: ["Hypoglycemia", "Weight gain", "Injection site reactions", "Lipodystrophy"],
            nursingConsiderations: "Give once daily at SAME TIME each day. CLEAR solution - do NOT mix with other insulins. No peak (peakless). Cannot give IV. Provides 24hr basal coverage.",
            dosageRange: "10-80 units SubQ daily (individualized)"
        },
        {
            generic: "insulin detemir",
            brand: "Levemir",
            mechanism: "Long-acting insulin; binds to albumin for prolonged action",
            indications: ["Type 1 DM (basal)", "Type 2 DM (basal)"],
            sideEffects: ["Hypoglycemia", "Weight gain (less than glargine)", "Injection site reactions"],
            nursingConsiderations: "Give once or twice daily. CLEAR solution. Do not mix with other insulins. May cause less weight gain than glargine. Duration 12-24 hours.",
            dosageRange: "10-60 units SubQ daily or BID"
        },
        {
            generic: "NPH insulin",
            brand: "Humulin N/Novolin N",
            mechanism: "Intermediate-acting insulin; protamine added to delay absorption",
            indications: ["Type 1 DM", "Type 2 DM"],
            sideEffects: ["Hypoglycemia (especially at peak)", "Weight gain", "Injection site reactions"],
            nursingConsiderations: "CLOUDY - must gently roll (not shake) to resuspend. Has a distinct peak (4-12 hr) - risk of hypoglycemia. Can mix with rapid/short-acting insulin. Give BID usually.",
            dosageRange: "Individualized; typically BID dosing"
        }
    ]
};

// ===== ENDOCRINE - Oral Antidiabetics =====
medicationDatabase.endocrine.classes.oralAntidiabetics = {
    name: "Oral Antidiabetic Agents",
    description: "Non-insulin medications for type 2 diabetes management",
    medications: [
        {
            generic: "metformin",
            brand: "Glucophage",
            mechanism: "Biguanide; decreases hepatic glucose production, increases insulin sensitivity",
            indications: ["Type 2 DM (first-line)", "PCOS", "Prediabetes"],
            sideEffects: ["GI upset (diarrhea, nausea)", "Metallic taste", "Lactic acidosis (rare)", "B12 deficiency"],
            nursingConsiderations: "First-line for T2DM. Take with food to reduce GI effects. Hold before contrast dye procedures (48hr). Monitor renal function. No hypoglycemia when used alone. Weight neutral.",
            dosageRange: "500-2000 mg PO daily in divided doses"
        },
        {
            generic: "glipizide",
            brand: "Glucotrol",
            mechanism: "Sulfonylurea; stimulates insulin release from pancreatic beta cells",
            indications: ["Type 2 DM"],
            sideEffects: ["Hypoglycemia", "Weight gain", "GI upset", "Photosensitivity", "Blood dyscrasias"],
            nursingConsiderations: "Give 30 min before meals. Can cause HYPOGLYCEMIA - educate patient on symptoms. Avoid in sulfa allergy. Less risk of hypoglycemia in elderly vs glyburide.",
            dosageRange: "5-20 mg PO daily; XL: 5-20 mg daily"
        },
        {
            generic: "sitagliptin",
            brand: "Januvia",
            mechanism: "DPP-4 inhibitor; increases incretin hormones (GLP-1, GIP)",
            indications: ["Type 2 DM"],
            sideEffects: ["Nasopharyngitis", "Headache", "Pancreatitis (rare)", "Joint pain", "Upper respiratory infection"],
            nursingConsiderations: "Weight neutral, low hypoglycemia risk. Monitor for signs of pancreatitis (severe abdominal pain). Adjust dose in renal impairment. Can be combined with metformin.",
            dosageRange: "100 mg PO daily"
        },
        {
            generic: "empagliflozin",
            brand: "Jardiance",
            mechanism: "SGLT2 inhibitor; blocks glucose reabsorption in kidney, causes glycosuria",
            indications: ["Type 2 DM", "Heart failure", "CKD"],
            sideEffects: ["UTI", "Genital mycotic infections", "DKA (euglycemic)", "Hypotension", "Volume depletion"],
            nursingConsiderations: "CV and renal protective benefits. Monitor for genital yeast infections. Risk of euglycemic DKA (normal glucose but acidotic). Ensure adequate hydration. Do not use if GFR too low.",
            dosageRange: "10-25 mg PO daily"
        },
        {
            generic: "liraglutide",
            brand: "Victoza/Saxenda",
            mechanism: "GLP-1 receptor agonist; increases insulin secretion, slows gastric emptying, reduces appetite",
            indications: ["Type 2 DM", "Obesity (Saxenda)", "CV risk reduction"],
            sideEffects: ["Nausea/vomiting", "Diarrhea", "Pancreatitis", "Thyroid C-cell tumors (animal studies)", "Injection site reactions"],
            nursingConsiderations: "SubQ injection - any time of day independent of meals. Start low and titrate to reduce GI effects. Black box: thyroid C-cell tumors (avoid in MEN2/medullary thyroid cancer history). Promotes weight loss.",
            dosageRange: "0.6-1.8 mg SubQ daily (Victoza)"
        },
        {
            generic: "pioglitazone",
            brand: "Actos",
            mechanism: "Thiazolidinedione (TZD); PPAR-gamma agonist; increases insulin sensitivity",
            indications: ["Type 2 DM"],
            sideEffects: ["Weight gain", "Edema", "Heart failure", "Fractures", "Bladder cancer risk"],
            nursingConsiderations: "Contraindicated in NYHA Class III/IV heart failure. Monitor for fluid retention and weight gain. Takes 2-3 months for full effect. Monitor LFTs. Black box: CHF risk.",
            dosageRange: "15-45 mg PO daily"
        }
    ]
};


// ===== ENDOCRINE - Thyroid Agents =====
medicationDatabase.endocrine.classes.thyroid = {
    name: "Thyroid Agents",
    description: "Medications for thyroid hormone replacement or suppression",
    medications: [
        {
            generic: "levothyroxine",
            brand: "Synthroid/Levoxyl",
            mechanism: "Synthetic T4 (thyroxine); converts to active T3 in tissues",
            indications: ["Hypothyroidism", "TSH suppression (thyroid cancer)", "Myxedema coma"],
            sideEffects: ["Tachycardia", "Palpitations", "Insomnia", "Weight loss", "Heat intolerance", "Tremor"],
            nursingConsiderations: "Take on empty stomach 30-60 min before breakfast. Many drug interactions (separate from calcium, iron, antacids by 4 hrs). Monitor TSH every 6-8 weeks initially. Narrow therapeutic index.",
            dosageRange: "25-200 mcg PO daily"
        },
        {
            generic: "liothyronine",
            brand: "Cytomel",
            mechanism: "Synthetic T3; direct active thyroid hormone",
            indications: ["Hypothyroidism", "Myxedema coma", "T3 suppression test"],
            sideEffects: ["Tachycardia", "Angina", "Tremor", "Insomnia", "Headache", "Heat intolerance"],
            nursingConsiderations: "Faster onset and shorter duration than T4. More cardiac effects. Not usually first-line. Used in myxedema coma (IV). Monitor cardiac patients closely.",
            dosageRange: "25-75 mcg PO daily"
        },
        {
            generic: "methimazole",
            brand: "Tapazole",
            mechanism: "Thioamide; inhibits thyroid peroxidase, blocking thyroid hormone synthesis",
            indications: ["Hyperthyroidism", "Graves' disease", "Pre-thyroidectomy preparation"],
            sideEffects: ["Agranulocytosis", "Rash", "Hepatotoxicity", "Arthralgia", "GI upset"],
            nursingConsiderations: "Monitor CBC (report sore throat/fever - agranulocytosis). Preferred over PTU except in first trimester pregnancy. Takes 3-8 weeks for full effect. Monitor thyroid levels.",
            dosageRange: "5-30 mg PO daily"
        },
        {
            generic: "propylthiouracil (PTU)",
            brand: "PTU",
            mechanism: "Blocks thyroid hormone synthesis and peripheral T4 to T3 conversion",
            indications: ["Hyperthyroidism", "Thyroid storm", "First trimester pregnancy hyperthyroidism"],
            sideEffects: ["Hepatotoxicity (severe)", "Agranulocytosis", "Rash", "Lupus-like syndrome", "GI upset"],
            nursingConsiderations: "Black box: severe hepatotoxicity. Use only when methimazole inappropriate (1st trimester, thyroid storm). Monitor LFTs. Report sore throat/fever immediately. Shorter duration than methimazole.",
            dosageRange: "100-150 mg PO TID"
        },
        {
            generic: "potassium iodide",
            brand: "SSKI/Lugol's solution",
            mechanism: "Inhibits thyroid hormone release (Wolff-Chaikoff effect); reduces gland vascularity",
            indications: ["Thyroid storm", "Pre-thyroidectomy", "Radiation emergency (thyroid protection)"],
            sideEffects: ["Metallic taste", "GI upset", "Hypersensitivity", "Iodism (rash, rhinitis)", "Hypothyroidism"],
            nursingConsiderations: "Give AFTER thioamide has been started (prevents using iodide for new hormone). Mix in juice to mask taste. Short-term use only. Escape phenomenon occurs after 10-14 days.",
            dosageRange: "3-5 drops SSKI TID; Lugol's: 5-10 drops TID"
        },
        {
            generic: "desmopressin",
            brand: "DDAVP",
            mechanism: "Synthetic ADH analog; promotes water reabsorption in collecting ducts",
            indications: ["Diabetes insipidus (central)", "Nocturnal enuresis", "Hemophilia A", "von Willebrand disease"],
            sideEffects: ["Hyponatremia", "Water intoxication", "Headache", "Nausea", "Nasal congestion (intranasal)"],
            nursingConsiderations: "Monitor sodium and fluid balance closely. Restrict fluids to prevent water intoxication. Available intranasal, PO, and IV. Teach patient to report persistent headache.",
            dosageRange: "0.1-0.4 mg PO BID; 10-40 mcg intranasal"
        }
    ]
};


// ===== ANTI-INFECTIVE - Penicillins =====
medicationDatabase.antiinfective.classes.penicillins = {
    name: "Penicillins",
    description: "Beta-lactam antibiotics that inhibit bacterial cell wall synthesis",
    medications: [
        {
            generic: "amoxicillin",
            brand: "Amoxil",
            mechanism: "Aminopenicillin; binds PBPs to inhibit cell wall synthesis; broad spectrum",
            indications: ["Otitis media", "Sinusitis", "URI", "UTI", "H. pylori", "Dental infections"],
            sideEffects: ["Diarrhea", "Rash", "Nausea", "Allergic reactions", "C. diff colitis"],
            nursingConsiderations: "Most commonly prescribed antibiotic. Ask about penicillin allergy. Rash common with EBV (mono). Complete full course. Refrigerate suspension (good 14 days).",
            dosageRange: "250-875 mg PO BID-TID"
        },
        {
            generic: "amoxicillin/clavulanate",
            brand: "Augmentin",
            mechanism: "Amoxicillin + beta-lactamase inhibitor; extends spectrum to resistant organisms",
            indications: ["Sinusitis", "Otitis media", "Pneumonia", "UTI", "Skin infections", "Animal bites"],
            sideEffects: ["Diarrhea (more than amoxicillin alone)", "Nausea", "Vomiting", "Rash", "Vaginal candidiasis"],
            nursingConsiderations: "Take with food to reduce GI effects. Higher diarrhea rate than amoxicillin alone. Various formulations - not interchangeable. Refrigerate suspension.",
            dosageRange: "500/125 to 875/125 mg PO BID"
        },
        {
            generic: "piperacillin/tazobactam",
            brand: "Zosyn",
            mechanism: "Extended-spectrum penicillin + beta-lactamase inhibitor; covers Pseudomonas",
            indications: ["Nosocomial pneumonia", "Intra-abdominal infections", "Sepsis", "Febrile neutropenia"],
            sideEffects: ["Diarrhea", "Rash", "Thrombocytopenia", "Fever", "Phlebitis"],
            nursingConsiderations: "IV only - broad-spectrum 'big gun' antibiotic. Infuse over 30 min (or 4 hr extended infusion). Monitor platelets. Adjust dose in renal impairment. Sodium content is significant.",
            dosageRange: "3.375-4.5 g IV q6-8h"
        },
        {
            generic: "penicillin V",
            brand: "Pen-Vee K",
            mechanism: "Narrow-spectrum; effective against streptococci",
            indications: ["Strep pharyngitis", "Rheumatic fever prophylaxis", "Dental infections"],
            sideEffects: ["GI upset", "Diarrhea", "Rash", "Hypersensitivity", "Oral candidiasis"],
            nursingConsiderations: "Take on empty stomach for best absorption. Complete full 10-day course for strep throat. Drug of choice for Group A strep. Ask about penicillin allergy.",
            dosageRange: "250-500 mg PO QID"
        },
        {
            generic: "nafcillin",
            brand: "Nafcillin",
            mechanism: "Penicillinase-resistant penicillin; targets MSSA",
            indications: ["MSSA bacteremia", "Endocarditis (staph)", "Osteomyelitis", "Skin/soft tissue infections"],
            sideEffects: ["Phlebitis", "Interstitial nephritis", "Hepatotoxicity", "Neutropenia", "Rash"],
            nursingConsiderations: "IV only in practice. Drug of choice for MSSA serious infections. Highly irritating to veins - central line preferred. Monitor LFTs and renal function. Does NOT cover MRSA.",
            dosageRange: "1-2 g IV q4-6h"
        },
        {
            generic: "ampicillin/sulbactam",
            brand: "Unasyn",
            mechanism: "Aminopenicillin + beta-lactamase inhibitor",
            indications: ["Intra-abdominal infections", "Gynecologic infections", "Skin infections", "Community-acquired pneumonia"],
            sideEffects: ["Diarrhea", "Rash", "Pain at injection site", "Thrombophlebitis", "C. diff"],
            nursingConsiderations: "IV/IM administration. Good for mixed infections (aerobic + anaerobic). Adjust dose in renal impairment. Ask about penicillin allergy (~10% cross-reactivity with cephalosporins).",
            dosageRange: "1.5-3 g IV/IM q6h"
        }
    ]
};

// ===== ANTI-INFECTIVE - Cephalosporins =====
medicationDatabase.antiinfective.classes.cephalosporins = {
    name: "Cephalosporins",
    description: "Beta-lactam antibiotics with generations of increasing gram-negative coverage",
    medications: [
        {
            generic: "cephalexin",
            brand: "Keflex",
            mechanism: "1st generation; good gram-positive coverage (MSSA, strep)",
            indications: ["Skin infections", "UTI", "Strep pharyngitis", "Otitis media", "Bone infections"],
            sideEffects: ["GI upset", "Diarrhea", "Rash", "Headache", "Vaginal candidiasis"],
            nursingConsiderations: "Oral 1st gen cephalosporin. Good for skin/soft tissue. Ask about penicillin allergy (1-2% cross-reactivity). Can take with food. Complete full course.",
            dosageRange: "250-500 mg PO QID"
        },
        {
            generic: "ceftriaxone",
            brand: "Rocephin",
            mechanism: "3rd generation; broad gram-negative coverage; crosses BBB",
            indications: ["Meningitis", "Pneumonia", "Gonorrhea", "Sepsis", "UTI", "Lyme disease"],
            sideEffects: ["Diarrhea", "Biliary sludge/pseudolithiasis", "Rash", "Pain at IM site", "C. diff"],
            nursingConsiderations: "Once-daily dosing (long half-life). Do NOT mix with calcium-containing solutions (IV). Can cause biliary sludge - watch for RUQ pain. IM injection: reconstitute with lidocaine.",
            dosageRange: "1-2 g IV/IM q12-24h"
        },
        {
            generic: "cefazolin",
            brand: "Ancef",
            mechanism: "1st generation IV cephalosporin; excellent MSSA coverage",
            indications: ["Surgical prophylaxis", "Skin infections", "UTI", "Bone infections", "Endocarditis"],
            sideEffects: ["Diarrhea", "Nausea", "Rash", "Phlebitis", "Pain at injection site"],
            nursingConsiderations: "Gold standard for surgical prophylaxis (given within 60 min before incision). Redose intraoperatively for long cases. IV/IM only. Adjust in renal impairment.",
            dosageRange: "1-2 g IV q8h; 2 g IV for surgical prophylaxis"
        },
        {
            generic: "cefepime",
            brand: "Maxipime",
            mechanism: "4th generation; broad spectrum including Pseudomonas",
            indications: ["Febrile neutropenia", "Nosocomial pneumonia", "Complicated UTI", "Meningitis"],
            sideEffects: ["Neurotoxicity (seizures, encephalopathy)", "Diarrhea", "Rash", "Fever", "Headache"],
            nursingConsiderations: "Monitor for neurotoxicity especially in renal impairment (confusion, seizures, myoclonus). Adjust dose for renal function. Covers Pseudomonas. IV only.",
            dosageRange: "1-2 g IV q8-12h"
        },
        {
            generic: "cefdinir",
            brand: "Omnicef",
            mechanism: "3rd generation oral cephalosporin",
            indications: ["Otitis media", "Sinusitis", "Pharyngitis", "Bronchitis", "Skin infections"],
            sideEffects: ["Diarrhea", "Nausea", "Reddish stools (with iron)", "Rash", "Vaginal candidiasis"],
            nursingConsiderations: "Red/orange stools when taken with iron - not blood (reassure parents). Suspension tastes good for children. Separate from antacids and iron by 2 hours.",
            dosageRange: "300 mg PO BID or 600 mg daily"
        },
        {
            generic: "ceftazidime",
            brand: "Fortaz",
            mechanism: "3rd generation with excellent Pseudomonas coverage",
            indications: ["Pseudomonal infections", "Nosocomial pneumonia", "Meningitis", "Febrile neutropenia"],
            sideEffects: ["Diarrhea", "Rash", "Nausea", "Eosinophilia", "Candidiasis"],
            nursingConsiderations: "One of the best cephalosporins for Pseudomonas. IV/IM only. Adjust dose in renal impairment. Monitor renal function. Often used in CF exacerbations.",
            dosageRange: "1-2 g IV q8h"
        }
    ]
};


// ===== ANTI-INFECTIVE - Fluoroquinolones =====
medicationDatabase.antiinfective.classes.fluoroquinolones = {
    name: "Fluoroquinolones",
    description: "Broad-spectrum antibiotics that inhibit DNA gyrase and topoisomerase IV",
    medications: [
        {
            generic: "ciprofloxacin",
            brand: "Cipro",
            mechanism: "Inhibits DNA gyrase and topoisomerase IV; bactericidal",
            indications: ["UTI", "Prostatitis", "Anthrax", "GI infections", "Bone/joint infections"],
            sideEffects: ["Tendon rupture", "QT prolongation", "CNS effects", "Photosensitivity", "C. diff", "Aortic dissection"],
            nursingConsiderations: "BLACK BOX: tendon rupture, peripheral neuropathy, CNS effects. Avoid in patients >60, on steroids, or organ transplant. Separate from antacids/calcium/iron by 2 hrs. Hydrate well.",
            dosageRange: "250-750 mg PO BID; 200-400 mg IV q12h"
        },
        {
            generic: "levofloxacin",
            brand: "Levaquin",
            mechanism: "Fluoroquinolone; targets DNA gyrase; respiratory fluoroquinolone",
            indications: ["Community-acquired pneumonia", "Sinusitis", "UTI", "Skin infections", "Prostatitis"],
            sideEffects: ["Tendon rupture", "QT prolongation", "Insomnia", "Nausea", "Dizziness", "Peripheral neuropathy"],
            nursingConsiderations: "Same black box warnings as ciprofloxacin. Better respiratory coverage than cipro. Once-daily dosing. Monitor QTc. Adjust dose in renal impairment. Avoid in myasthenia gravis.",
            dosageRange: "250-750 mg PO/IV daily"
        },
        {
            generic: "moxifloxacin",
            brand: "Avelox",
            mechanism: "Respiratory fluoroquinolone; excellent anaerobic coverage",
            indications: ["Community-acquired pneumonia", "Sinusitis", "Skin infections", "Intra-abdominal infections"],
            sideEffects: ["QT prolongation (most in class)", "Nausea", "Dizziness", "Diarrhea", "Hepatotoxicity"],
            nursingConsiderations: "Highest QT prolongation risk in fluoroquinolone class. Do NOT adjust for renal impairment (hepatically eliminated). No urinary concentration (not for UTI). Same black box warnings.",
            dosageRange: "400 mg PO/IV daily"
        },
        {
            generic: "ofloxacin",
            brand: "Floxin",
            mechanism: "Fluoroquinolone; parent compound of levofloxacin (racemic mixture)",
            indications: ["UTI", "Otitis externa/media (otic drops)", "Conjunctivitis (ophthalmic)"],
            sideEffects: ["GI upset", "Headache", "Insomnia", "Dizziness", "Photosensitivity"],
            nursingConsiderations: "Mostly used as otic and ophthalmic drops now. Otic drops: warm to body temperature before instilling. Same systemic warnings apply to oral form.",
            dosageRange: "200-400 mg PO BID; otic: 5-10 drops BID"
        },
        {
            generic: "delafloxacin",
            brand: "Baxdela",
            mechanism: "Novel fluoroquinolone; dual-targeting (DNA gyrase and topoisomerase IV equally)",
            indications: ["Acute bacterial skin infections", "Community-acquired pneumonia"],
            sideEffects: ["Nausea", "Diarrhea", "Headache", "Transaminase elevation", "Tendon effects"],
            nursingConsiderations: "Newer fluoroquinolone with activity against MRSA. Same class black box warnings apply. IV and PO available. No significant QT prolongation (advantage over others).",
            dosageRange: "450 mg PO BID or 300 mg IV q12h"
        },
        {
            generic: "norfloxacin",
            brand: "Noroxin",
            mechanism: "First-generation fluoroquinolone; concentrates in urinary tract",
            indications: ["UTI", "Prostatitis", "Gonorrhea (historical)"],
            sideEffects: ["Nausea", "Headache", "Dizziness", "Photosensitivity", "Tendon effects"],
            nursingConsiderations: "Primarily urinary tract concentration. Take on empty stomach with full glass of water. Same class warnings. Being phased out in many markets. Hydrate well.",
            dosageRange: "400 mg PO BID"
        }
    ]
};

// ===== ANTI-INFECTIVE - Macrolides =====
medicationDatabase.antiinfective.classes.macrolides = {
    name: "Macrolides",
    description: "Antibiotics that inhibit bacterial protein synthesis by binding to 50S ribosomal subunit",
    medications: [
        {
            generic: "azithromycin",
            brand: "Zithromax/Z-pack",
            mechanism: "Binds 50S ribosomal subunit; inhibits protein synthesis; bacteriostatic",
            indications: ["Community-acquired pneumonia", "Sinusitis", "Pharyngitis", "STIs (chlamydia)", "MAC prophylaxis"],
            sideEffects: ["GI upset", "QT prolongation", "Hepatotoxicity", "Hearing loss", "Diarrhea"],
            nursingConsiderations: "Z-pack: 5-day course (500mg day 1, then 250mg days 2-5). Long tissue half-life (continues working after last dose). Monitor QT interval. GI effects less than erythromycin.",
            dosageRange: "250-500 mg PO daily; 500 mg IV daily"
        },
        {
            generic: "erythromycin",
            brand: "E-Mycin/EES",
            mechanism: "Original macrolide; binds 50S ribosomal subunit",
            indications: ["Pertussis", "Chlamydia (pregnancy)", "Gastroparesis (prokinetic)", "Ophthalmia neonatorum (ointment)"],
            sideEffects: ["Severe GI upset", "QT prolongation", "Hepatotoxicity", "Ototoxicity", "Phlebitis (IV)"],
            nursingConsiderations: "Strong GI side effects (also used as prokinetic agent). Many drug interactions (CYP3A4 inhibitor). Eye ointment given to all newborns. IV form very irritating.",
            dosageRange: "250-500 mg PO QID; ophthalmic ointment"
        },
        {
            generic: "clarithromycin",
            brand: "Biaxin",
            mechanism: "Macrolide; binds 50S ribosome; also inhibits CYP3A4",
            indications: ["H. pylori (triple therapy)", "Sinusitis", "Pneumonia", "MAC", "Bronchitis"],
            sideEffects: ["Metallic taste", "GI upset", "Hepatotoxicity", "QT prolongation", "Headache"],
            nursingConsiderations: "Key component of H. pylori treatment. Many drug interactions (CYP3A4 inhibitor). Metallic/bitter taste common. ER form should be taken with food. BID dosing.",
            dosageRange: "250-500 mg PO BID"
        },
        {
            generic: "fidaxomicin",
            brand: "Dificid",
            mechanism: "Narrow-spectrum macrolide; inhibits RNA polymerase of C. difficile",
            indications: ["C. difficile infection"],
            sideEffects: ["Nausea", "Vomiting", "Abdominal pain", "GI hemorrhage", "Anemia"],
            nursingConsiderations: "Targets C. diff specifically with minimal disruption of normal flora. Lower recurrence rate than vancomycin PO. Very expensive. Can take with or without food.",
            dosageRange: "200 mg PO BID x 10 days"
        },
        {
            generic: "azithromycin (ophthalmic)",
            brand: "AzaSite",
            mechanism: "Topical macrolide for ocular bacterial infections",
            indications: ["Bacterial conjunctivitis"],
            sideEffects: ["Eye irritation", "Blurred vision", "Contact dermatitis", "Dysgeusia"],
            nursingConsiderations: "Instill drops - do not touch dropper to eye. Store at room temperature (becomes less viscous). Unique dosing: BID x2 days then daily x5 days.",
            dosageRange: "1 drop BID x2 days then daily x5 days"
        },
        {
            generic: "spiramycin",
            brand: "Rovamycine",
            mechanism: "Macrolide that concentrates in tissues; active against Toxoplasma",
            indications: ["Toxoplasmosis in pregnancy", "Dental infections", "Cryptosporidiosis"],
            sideEffects: ["GI upset", "Rash", "Nausea", "Vomiting", "Paresthesias"],
            nursingConsiderations: "Used primarily for toxoplasmosis in early pregnancy to prevent vertical transmission. Not widely available in US (available through CDC). Monitor for GI intolerance.",
            dosageRange: "1 g PO TID"
        }
    ]
};


// ===== GASTROINTESTINAL - Proton Pump Inhibitors =====
medicationDatabase.gastrointestinal.classes.ppis = {
    name: "Proton Pump Inhibitors (PPIs)",
    description: "Irreversibly block H+/K+ ATPase pump in parietal cells to reduce gastric acid",
    medications: [
        {
            generic: "omeprazole",
            brand: "Prilosec",
            mechanism: "Irreversibly inhibits proton pump (H+/K+-ATPase) in parietal cells",
            indications: ["GERD", "Peptic ulcer disease", "H. pylori (with antibiotics)", "Zollinger-Ellison", "Stress ulcer prophylaxis"],
            sideEffects: ["Headache", "C. diff risk", "Bone fractures (long-term)", "Hypomagnesemia", "B12 deficiency", "Pneumonia risk"],
            nursingConsiderations: "Take 30 min before breakfast. Long-term use risks: fractures, C. diff, hypomagnesemia, B12 deficiency. Do not crush DR capsules (can open and sprinkle on applesauce). Interacts with clopidogrel.",
            dosageRange: "20-40 mg PO daily"
        },
        {
            generic: "pantoprazole",
            brand: "Protonix",
            mechanism: "Proton pump inhibitor; irreversible acid suppression",
            indications: ["GERD", "Erosive esophagitis", "Stress ulcer prophylaxis (IV)", "Zollinger-Ellison"],
            sideEffects: ["Headache", "Diarrhea", "Nausea", "C. diff", "Fracture risk", "Hypomagnesemia"],
            nursingConsiderations: "IV form commonly used in hospitals for stress ulcer prophylaxis and GI bleeds. Fewer drug interactions than omeprazole. Do not split/crush/chew DR tablets.",
            dosageRange: "40 mg PO/IV daily"
        },
        {
            generic: "esomeprazole",
            brand: "Nexium",
            mechanism: "S-isomer of omeprazole; proton pump inhibitor",
            indications: ["GERD", "Erosive esophagitis", "H. pylori", "NSAID-induced ulcer prevention"],
            sideEffects: ["Headache", "Diarrhea", "Nausea", "Flatulence", "Abdominal pain"],
            nursingConsiderations: "Can open capsule and mix granules with water for NG tube administration. Take before meals. Same long-term risks as other PPIs. Available OTC.",
            dosageRange: "20-40 mg PO daily"
        },
        {
            generic: "lansoprazole",
            brand: "Prevacid",
            mechanism: "Proton pump inhibitor; acid-activated in parietal cell canaliculi",
            indications: ["GERD", "Peptic ulcer disease", "H. pylori", "NSAID-induced ulcers"],
            sideEffects: ["Diarrhea", "Abdominal pain", "Nausea", "Headache", "C. diff risk"],
            nursingConsiderations: "Available as orally disintegrating tablet (good for patients with swallowing difficulty). Take before eating. SoluTab can be given via NG tube. Same class precautions.",
            dosageRange: "15-30 mg PO daily"
        },
        {
            generic: "rabeprazole",
            brand: "Aciphex",
            mechanism: "Proton pump inhibitor with rapid activation at higher pH",
            indications: ["GERD", "Duodenal ulcer", "H. pylori", "Zollinger-Ellison"],
            sideEffects: ["Headache", "Diarrhea", "Pharyngitis", "Flatulence", "Infection risk"],
            nursingConsiderations: "Fastest onset of all PPIs. Non-enzymatic activation means fewer drug interactions. Do not crush DR tablets. Swallow whole. Same long-term class risks.",
            dosageRange: "20 mg PO daily"
        },
        {
            generic: "dexlansoprazole",
            brand: "Dexilant",
            mechanism: "Dual-delayed release PPI; R-enantiomer of lansoprazole",
            indications: ["GERD", "Erosive esophagitis"],
            sideEffects: ["Diarrhea", "Abdominal pain", "Nausea", "URI", "Flatulence"],
            nursingConsiderations: "Dual-release provides 2 peaks of drug release. Can be taken without regard to meals (unique among PPIs). Can open capsule and sprinkle on applesauce.",
            dosageRange: "30-60 mg PO daily"
        }
    ]
};

// ===== GASTROINTESTINAL - H2 Blockers =====
medicationDatabase.gastrointestinal.classes.h2Blockers = {
    name: "H2 Receptor Antagonists",
    description: "Block histamine H2 receptors on parietal cells to reduce acid secretion",
    medications: [
        {
            generic: "famotidine",
            brand: "Pepcid",
            mechanism: "Competitively blocks H2 receptors on gastric parietal cells",
            indications: ["GERD", "Peptic ulcer disease", "Stress ulcer prophylaxis", "Heartburn"],
            sideEffects: ["Headache", "Dizziness", "Constipation", "Diarrhea", "Thrombocytopenia (rare)"],
            nursingConsiderations: "Most commonly used H2 blocker now (ranitidine withdrawn). Less potent than PPIs but faster onset. Can take PRN for heartburn. IV available for hospital use. Fewer drug interactions than PPIs.",
            dosageRange: "20-40 mg PO BID; 20 mg IV q12h"
        },
        {
            generic: "cimetidine",
            brand: "Tagamet",
            mechanism: "First H2 blocker; blocks histamine stimulation of acid secretion",
            indications: ["GERD", "Peptic ulcer disease", "Heartburn", "Zollinger-Ellison"],
            sideEffects: ["Gynecomastia", "Impotence", "Confusion (elderly)", "Many drug interactions", "Headache"],
            nursingConsiderations: "Most drug interactions of all H2 blockers (inhibits CYP450). Can cause gynecomastia (anti-androgenic). Avoid in elderly (confusion). Largely replaced by famotidine.",
            dosageRange: "200-800 mg PO BID-QID"
        },
        {
            generic: "nizatidine",
            brand: "Axid",
            mechanism: "H2 receptor antagonist; also promotes GI motility",
            indications: ["GERD", "Peptic ulcer disease", "Heartburn"],
            sideEffects: ["Headache", "Dizziness", "Diarrhea", "Rhinitis", "Somnolence"],
            nursingConsiderations: "Has prokinetic activity (enhances gastric motility) - unique among H2 blockers. No anti-androgenic effects. Fewest drug interactions in class.",
            dosageRange: "150 mg PO BID or 300 mg at bedtime"
        },
        {
            generic: "sucralfate",
            brand: "Carafate",
            mechanism: "Forms protective barrier over ulcer crater in acidic environment (not an H2 blocker but used similarly)",
            indications: ["Duodenal ulcer", "Stress ulcer prophylaxis", "Mucositis"],
            sideEffects: ["Constipation", "Dry mouth", "Nausea", "GI discomfort", "Bezoar formation"],
            nursingConsiderations: "Take on empty stomach 1 hr before meals. Separate from other medications by 2 hours (impairs absorption). Requires acidic pH to work. Shake suspension well.",
            dosageRange: "1 g PO QID (1 hr before meals and bedtime)"
        },
        {
            generic: "misoprostol",
            brand: "Cytotec",
            mechanism: "Prostaglandin E1 analog; replaces protective prostaglandins inhibited by NSAIDs",
            indications: ["NSAID-induced ulcer prevention", "Labor induction (off-label)", "Incomplete abortion"],
            sideEffects: ["Diarrhea (dose-related)", "Abdominal pain", "Uterine contractions", "Nausea", "Flatulence"],
            nursingConsiderations: "CONTRAINDICATED in pregnancy (causes uterine contractions - abortifacient). Women of childbearing age need negative pregnancy test. Take with food. Combined with diclofenac (Arthrotec).",
            dosageRange: "200 mcg PO QID with food"
        },
        {
            generic: "bismuth subsalicylate",
            brand: "Pepto-Bismol",
            mechanism: "Coats GI mucosa; has antibacterial and antisecretory properties",
            indications: ["Diarrhea", "H. pylori (quadruple therapy)", "Heartburn", "Traveler's diarrhea prevention"],
            sideEffects: ["Black stools/tongue", "Constipation", "Tinnitus (salicylate toxicity)", "Nausea"],
            nursingConsiderations: "Warn patients about harmless black stools and tongue. Contains salicylate - avoid in aspirin allergy and children with viral illness (Reye's). Part of H. pylori quadruple therapy.",
            dosageRange: "524 mg PO q30min-1h PRN (max 8 doses/day)"
        }
    ]
};


// ===== GASTROINTESTINAL - Antiemetics =====
medicationDatabase.gastrointestinal.classes.antiemetics = {
    name: "Antiemetics",
    description: "Medications that prevent or treat nausea and vomiting",
    medications: [
        {
            generic: "ondansetron",
            brand: "Zofran",
            mechanism: "5-HT3 (serotonin) receptor antagonist; blocks vomiting center and vagal nerve",
            indications: ["Chemotherapy-induced N/V", "Post-operative N/V", "Gastroenteritis", "Pregnancy N/V"],
            sideEffects: ["Headache", "Constipation", "QT prolongation", "Dizziness", "Fatigue"],
            nursingConsiderations: "Very commonly used antiemetic. Monitor QTc with IV doses >16mg. ODT (orally disintegrating tablet) good for patients who can't keep pills down. Safe in pregnancy.",
            dosageRange: "4-8 mg PO/IV q8h; 0.15 mg/kg IV for chemo"
        },
        {
            generic: "promethazine",
            brand: "Phenergan",
            mechanism: "Phenothiazine; H1 antagonist with antiemetic and sedative properties",
            indications: ["Nausea/vomiting", "Motion sickness", "Allergic reactions", "Sedation"],
            sideEffects: ["Severe sedation", "Tissue necrosis (IV)", "Respiratory depression", "EPS", "Anticholinergic effects"],
            nursingConsiderations: "BLACK BOX: IV administration can cause severe tissue injury (gangrene). Preferred route: deep IM or PO. Never give SubQ or intra-arterial. Avoid in children <2 (respiratory depression).",
            dosageRange: "12.5-25 mg PO/IM/PR q4-6h"
        },
        {
            generic: "metoclopramide",
            brand: "Reglan",
            mechanism: "Dopamine antagonist; increases GI motility and blocks CTZ",
            indications: ["Gastroparesis", "GERD", "Nausea/vomiting", "Migraine (adjunct)"],
            sideEffects: ["Tardive dyskinesia", "EPS", "Drowsiness", "Depression", "Diarrhea"],
            nursingConsiderations: "BLACK BOX: tardive dyskinesia risk (limit use to <12 weeks). Monitor for EPS (especially in young women). Give 30 min before meals. Treat EPS with diphenhydramine.",
            dosageRange: "5-10 mg PO/IV QID (30 min before meals)"
        },
        {
            generic: "prochlorperazine",
            brand: "Compazine",
            mechanism: "Phenothiazine; blocks dopamine D2 receptors in CTZ",
            indications: ["Nausea/vomiting", "Migraines (ER)", "Schizophrenia"],
            sideEffects: ["EPS (dystonia, akathisia)", "Sedation", "Hypotension", "Tardive dyskinesia", "NMS"],
            nursingConsiderations: "Can cause acute dystonic reactions (treat with diphenhydramine/benztropine). Available PO, IM, IV, PR. Avoid in children. Monitor for EPS regularly.",
            dosageRange: "5-10 mg PO/IM TID-QID"
        },
        {
            generic: "scopolamine",
            brand: "Transderm Scop",
            mechanism: "Anticholinergic; blocks muscarinic receptors in vomiting center",
            indications: ["Motion sickness", "Post-operative N/V"],
            sideEffects: ["Dry mouth", "Drowsiness", "Blurred vision", "Urinary retention", "Confusion (elderly)"],
            nursingConsiderations: "Apply patch behind ear 4 hrs before travel. Effective for 72 hrs. Wash hands after handling (avoid touching eyes - causes pupil dilation). Remove before MRI.",
            dosageRange: "1 patch (1.5 mg) behind ear q72h"
        },
        {
            generic: "granisetron",
            brand: "Kytril/Sancuso",
            mechanism: "5-HT3 receptor antagonist; similar to ondansetron",
            indications: ["Chemotherapy-induced N/V", "Radiation-induced N/V", "Post-operative N/V"],
            sideEffects: ["Headache", "Constipation", "Weakness", "QT prolongation", "Abdominal pain"],
            nursingConsiderations: "Available as transdermal patch (Sancuso) applied 24-48 hr before chemo. Longer duration than ondansetron. Patch useful when oral route not available.",
            dosageRange: "1-2 mg PO daily; 1 patch q7 days; 10 mcg/kg IV"
        }
    ]
};


// ===== PSYCHIATRIC - Antidepressants (SSRIs) =====
medicationDatabase.psychiatric.classes.ssris = {
    name: "SSRIs (Selective Serotonin Reuptake Inhibitors)",
    description: "First-line antidepressants that selectively block serotonin reuptake",
    medications: [
        {
            generic: "sertraline",
            brand: "Zoloft",
            mechanism: "Selectively inhibits serotonin reuptake in the synaptic cleft",
            indications: ["Major depression", "PTSD", "OCD", "Panic disorder", "Social anxiety", "PMDD"],
            sideEffects: ["Nausea", "Diarrhea", "Sexual dysfunction", "Insomnia", "Headache", "Weight changes"],
            nursingConsiderations: "Most commonly prescribed antidepressant. Takes 4-6 weeks for full effect. BLACK BOX: suicidality in young adults/adolescents (monitor closely). Do not stop abruptly (discontinuation syndrome).",
            dosageRange: "50-200 mg PO daily"
        },
        {
            generic: "fluoxetine",
            brand: "Prozac",
            mechanism: "SSRI; most activating SSRI; very long half-life (1-3 days; metabolite 4-16 days)",
            indications: ["Depression", "OCD", "Bulimia nervosa", "Panic disorder", "PMDD"],
            sideEffects: ["Insomnia", "Anxiety", "Nausea", "Headache", "Sexual dysfunction", "Weight loss initially"],
            nursingConsiderations: "Most activating - give in morning. Long half-life means less discontinuation syndrome. Can inhibit CYP2D6. Weekly dosing available (Prozac Weekly). Same black box warning.",
            dosageRange: "20-80 mg PO daily"
        },
        {
            generic: "escitalopram",
            brand: "Lexapro",
            mechanism: "S-enantiomer of citalopram; most selective SSRI",
            indications: ["Major depression", "Generalized anxiety disorder"],
            sideEffects: ["Nausea", "Insomnia", "Sexual dysfunction", "Fatigue", "Sweating", "Dry mouth"],
            nursingConsiderations: "Generally well-tolerated with fewer drug interactions. Start at 10 mg. Monitor for serotonin syndrome when combined with other serotonergic drugs. QT prolongation at high doses.",
            dosageRange: "10-20 mg PO daily"
        },
        {
            generic: "paroxetine",
            brand: "Paxil",
            mechanism: "SSRI with mild anticholinergic properties; most potent SSRI",
            indications: ["Depression", "GAD", "PTSD", "OCD", "Panic disorder", "Social anxiety", "Hot flashes"],
            sideEffects: ["Weight gain (most in class)", "Sedation", "Sexual dysfunction", "Discontinuation syndrome (worst)", "Dry mouth"],
            nursingConsiderations: "Worst discontinuation syndrome of SSRIs - taper VERY slowly. Most sedating SSRI (give at bedtime). Most weight gain. Avoid in pregnancy (category D). Strong CYP2D6 inhibitor.",
            dosageRange: "20-50 mg PO daily"
        },
        {
            generic: "citalopram",
            brand: "Celexa",
            mechanism: "SSRI; racemic mixture",
            indications: ["Major depression"],
            sideEffects: ["Nausea", "Dry mouth", "Drowsiness", "Sexual dysfunction", "QT prolongation (>40mg)"],
            nursingConsiderations: "FDA warning: do not exceed 40 mg/day (QT prolongation risk). Max 20 mg in elderly or hepatic impairment. ECG recommended at higher doses. Generally well-tolerated.",
            dosageRange: "20-40 mg PO daily (max 40 mg)"
        },
        {
            generic: "fluvoxamine",
            brand: "Luvox",
            mechanism: "SSRI primarily used for OCD; strong sigma-1 receptor agonist",
            indications: ["OCD", "Social anxiety disorder"],
            sideEffects: ["Nausea", "Insomnia", "Sedation", "Headache", "Sexual dysfunction", "GI upset"],
            nursingConsiderations: "Primary use is OCD (FDA-approved). Many drug interactions (inhibits CYP1A2, 2C19, 3A4). Give larger dose at bedtime if BID dosing. Monitor for serotonin syndrome.",
            dosageRange: "50-300 mg PO daily (divided BID if >100mg)"
        }
    ]
};

// ===== PSYCHIATRIC - Antipsychotics =====
medicationDatabase.psychiatric.classes.antipsychotics = {
    name: "Antipsychotics",
    description: "Block dopamine receptors to treat psychotic symptoms; typical and atypical",
    medications: [
        {
            generic: "haloperidol",
            brand: "Haldol",
            mechanism: "Typical (first-gen) antipsychotic; potent D2 receptor blockade",
            indications: ["Schizophrenia", "Acute psychosis", "Delirium", "Tourette syndrome", "Severe agitation"],
            sideEffects: ["EPS (dystonia, akathisia, parkinsonism)", "Tardive dyskinesia", "QT prolongation", "NMS", "Sedation"],
            nursingConsiderations: "High EPS risk. Monitor for tardive dyskinesia (AIMS scale). Give with benztropine for EPS prophylaxis. IM onset 20-30 min. Available as long-acting decanoate injection (monthly).",
            dosageRange: "0.5-5 mg PO/IM BID-TID; decanoate: monthly IM"
        },
        {
            generic: "olanzapine",
            brand: "Zyprexa",
            mechanism: "Atypical (second-gen); blocks D2, 5-HT2A, H1, muscarinic receptors",
            indications: ["Schizophrenia", "Bipolar disorder", "Agitation", "Treatment-resistant depression (with fluoxetine)"],
            sideEffects: ["Significant weight gain", "Metabolic syndrome", "Hyperglycemia", "Sedation", "Hyperlipidemia"],
            nursingConsiderations: "Highest weight gain of atypicals. Monitor metabolic panel, glucose, lipids, weight at baseline and regularly. IM form for acute agitation (do NOT give with IM benzodiazepines). ODT available.",
            dosageRange: "5-20 mg PO daily; 5-10 mg IM"
        },
        {
            generic: "quetiapine",
            brand: "Seroquel",
            mechanism: "Atypical; blocks D2, 5-HT2A, H1, alpha-1 receptors; dose-dependent effects",
            indications: ["Schizophrenia", "Bipolar disorder", "MDD (adjunct)", "Insomnia (off-label low dose)"],
            sideEffects: ["Sedation (significant)", "Weight gain", "Orthostatic hypotension", "Metabolic syndrome", "Cataracts (rare)"],
            nursingConsiderations: "Very sedating - give at bedtime. Low doses used off-label for insomnia (controversial). Monitor metabolic parameters. Rise slowly (orthostasis). Baseline eye exam recommended.",
            dosageRange: "25-800 mg PO daily (dose depends on indication)"
        },
        {
            generic: "risperidone",
            brand: "Risperdal",
            mechanism: "Atypical; potent D2 and 5-HT2A antagonist",
            indications: ["Schizophrenia", "Bipolar mania", "Irritability in autism", "Behavioral disturbances"],
            sideEffects: ["EPS (dose-related)", "Hyperprolactinemia", "Weight gain", "Sedation", "Orthostatic hypotension"],
            nursingConsiderations: "More EPS than other atypicals (especially at higher doses). Monitor prolactin (galactorrhea, amenorrhea, gynecomastia). Long-acting injection available (Risperdal Consta - q2 weeks).",
            dosageRange: "1-6 mg PO daily; LAI: 25-50 mg IM q2 weeks"
        },
        {
            generic: "aripiprazole",
            brand: "Abilify",
            mechanism: "Atypical; partial D2 agonist and 5-HT1A agonist (dopamine system stabilizer)",
            indications: ["Schizophrenia", "Bipolar disorder", "MDD (adjunct)", "Irritability in autism", "Tourette"],
            sideEffects: ["Akathisia", "Insomnia", "Nausea", "Weight gain (less)", "Headache", "Restlessness"],
            nursingConsiderations: "Unique mechanism (partial agonist) - less metabolic effects. Main side effect is akathisia (restlessness). Weight-neutral relative to others. Available as monthly LAI (Abilify Maintena).",
            dosageRange: "2-30 mg PO daily; LAI: 300-400 mg IM monthly"
        },
        {
            generic: "clozapine",
            brand: "Clozaril",
            mechanism: "Atypical; weak D2 block, strong 5-HT2A, H1, muscarinic, alpha-1 block",
            indications: ["Treatment-resistant schizophrenia", "Suicidality in schizophrenia"],
            sideEffects: ["Agranulocytosis", "Metabolic syndrome", "Seizures", "Myocarditis", "Sedation", "Drooling", "Constipation"],
            nursingConsiderations: "REMS program required (ANC monitoring). Weekly CBC for first 6 months, then biweekly, then monthly. Most effective antipsychotic but reserved due to agranulocytosis risk (~1%). Only for treatment-resistant cases.",
            dosageRange: "25-900 mg PO daily (slow titration)"
        }
    ]
};


// ===== PSYCHIATRIC - Benzodiazepines =====
medicationDatabase.psychiatric.classes.benzodiazepines = {
    name: "Benzodiazepines",
    description: "Enhance GABA-A receptor activity to produce anxiolytic, sedative, and anticonvulsant effects",
    medications: [
        {
            generic: "lorazepam",
            brand: "Ativan",
            mechanism: "Enhances GABA-A receptor function; intermediate-acting benzodiazepine",
            indications: ["Anxiety", "Insomnia", "Seizures (status epilepticus)", "Alcohol withdrawal", "Pre-procedure sedation"],
            sideEffects: ["Sedation", "Respiratory depression", "Dependence", "Amnesia", "Ataxia", "Confusion"],
            nursingConsiderations: "Preferred benzo in hepatic impairment (no active metabolites - LOT rule: Lorazepam, Oxazepam, Temazepam). Refrigerate IV form. Taper slowly - never abrupt discontinuation. Schedule IV.",
            dosageRange: "0.5-2 mg PO/IV/IM q6-8h"
        },
        {
            generic: "diazepam",
            brand: "Valium",
            mechanism: "Long-acting benzodiazepine; enhances GABA-A; active metabolites",
            indications: ["Anxiety", "Muscle spasm", "Seizures", "Alcohol withdrawal", "Procedural sedation"],
            sideEffects: ["Sedation", "Dependence", "Respiratory depression", "Paradoxical agitation", "Amnesia"],
            nursingConsiderations: "Very long-acting (active metabolite desmethyldiazepam has 100hr half-life). Accumulates in elderly - avoid. Do NOT give IM (erratic absorption). Available rectally for seizures (Diastat).",
            dosageRange: "2-10 mg PO/IV BID-QID"
        },
        {
            generic: "alprazolam",
            brand: "Xanax",
            mechanism: "Short-acting benzodiazepine with rapid onset",
            indications: ["Panic disorder", "GAD", "Anxiety"],
            sideEffects: ["Sedation", "Dependence (high)", "Withdrawal seizures", "Memory impairment", "Rebound anxiety"],
            nursingConsiderations: "Highest abuse potential in class due to rapid onset. VERY difficult to discontinue (severe withdrawal). Taper by 10% every 1-2 weeks. Short half-life requires frequent dosing.",
            dosageRange: "0.25-1 mg PO TID"
        },
        {
            generic: "midazolam",
            brand: "Versed",
            mechanism: "Ultra-short-acting benzodiazepine; water-soluble at acidic pH",
            indications: ["Procedural sedation", "Pre-anesthesia", "Status epilepticus", "ICU sedation"],
            sideEffects: ["Respiratory depression", "Amnesia (desired in procedures)", "Hypotension", "Paradoxical agitation"],
            nursingConsiderations: "Monitor respiratory status continuously. Have resuscitation equipment and flumazenil available. Potent amnestic - patient won't remember procedure. Onset 1-5 min IV. CYP3A4 metabolized.",
            dosageRange: "0.5-2 mg IV titrated; 0.25-1 mg/kg intranasal (seizures)"
        },
        {
            generic: "clonazepam",
            brand: "Klonopin",
            mechanism: "Long-acting benzodiazepine; serotonergic properties",
            indications: ["Seizure disorders", "Panic disorder", "Anxiety", "REM sleep behavior disorder"],
            sideEffects: ["Sedation", "Ataxia", "Dependence", "Cognitive impairment", "Depression"],
            nursingConsiderations: "Long half-life (18-50 hr) - once or twice daily dosing. Used as chronic anticonvulsant (tolerance develops to sedation). Taper slowly to discontinue. ODT available.",
            dosageRange: "0.5-2 mg PO BID-TID"
        },
        {
            generic: "temazepam",
            brand: "Restoril",
            mechanism: "Intermediate-acting benzodiazepine for sleep",
            indications: ["Insomnia (short-term)"],
            sideEffects: ["Morning drowsiness", "Dizziness", "Dependence", "Complex sleep behaviors", "Rebound insomnia"],
            nursingConsiderations: "For short-term insomnia only (7-10 days). Safe in hepatic impairment (LOT rule). Take 30 min before bed. Assess fall risk especially in elderly. Avoid alcohol.",
            dosageRange: "7.5-30 mg PO at bedtime"
        }
    ]
};


// ===== MUSCULOSKELETAL - NSAIDs =====
medicationDatabase.musculoskeletal.classes.nsaids = {
    name: "NSAIDs (Non-Steroidal Anti-Inflammatory Drugs)",
    description: "Inhibit cyclooxygenase enzymes to reduce pain, inflammation, and fever",
    medications: [
        {
            generic: "ibuprofen",
            brand: "Motrin/Advil",
            mechanism: "Non-selective COX-1 and COX-2 inhibitor",
            indications: ["Pain", "Inflammation", "Fever", "Arthritis", "Dysmenorrhea", "PDA closure (neonates)"],
            sideEffects: ["GI bleeding/ulcers", "Renal impairment", "CV events", "Hypertension", "Edema", "Platelet dysfunction"],
            nursingConsiderations: "Take with food/milk to reduce GI effects. Avoid in renal impairment, heart failure, and 3rd trimester pregnancy. Monitor renal function with chronic use. Increases bleeding risk.",
            dosageRange: "200-800 mg PO TID-QID (max 3200 mg/day)"
        },
        {
            generic: "naproxen",
            brand: "Aleve/Naprosyn",
            mechanism: "Non-selective COX inhibitor; longer duration than ibuprofen",
            indications: ["Pain", "Arthritis", "Gout", "Dysmenorrhea", "Tendinitis", "Bursitis"],
            sideEffects: ["GI upset/bleeding", "Renal impairment", "CV events", "Headache", "Edema"],
            nursingConsiderations: "Longer half-life allows BID dosing. May have lower CV risk than other NSAIDs. Same GI and renal precautions. Take with food. Available OTC (Aleve: 220mg).",
            dosageRange: "250-500 mg PO BID"
        },
        {
            generic: "celecoxib",
            brand: "Celebrex",
            mechanism: "Selective COX-2 inhibitor; less GI toxicity than non-selective NSAIDs",
            indications: ["Osteoarthritis", "Rheumatoid arthritis", "Acute pain", "Dysmenorrhea", "Ankylosing spondylitis"],
            sideEffects: ["CV events (MI, stroke)", "GI effects (less than other NSAIDs)", "Renal impairment", "Edema", "Headache"],
            nursingConsiderations: "BLACK BOX: increased CV risk. Less GI bleeding than non-selective NSAIDs but NOT zero risk. Contains sulfonamide moiety. Avoid in severe CAD, recent CABG.",
            dosageRange: "100-200 mg PO BID"
        },
        {
            generic: "ketorolac",
            brand: "Toradol",
            mechanism: "Potent non-selective COX inhibitor; strongest NSAID analgesic",
            indications: ["Moderate-severe acute pain (short-term)", "Post-operative pain", "Renal colic"],
            sideEffects: ["GI bleeding (high risk)", "Renal failure", "Bleeding", "Edema", "Headache"],
            nursingConsiderations: "Limit to 5 DAYS total (all routes combined) due to GI/renal toxicity. Do not use in renal impairment, elderly >65, or with anticoagulants. Most potent NSAID for pain.",
            dosageRange: "10 mg PO QID or 15-30 mg IV/IM q6h (max 5 days)"
        },
        {
            generic: "meloxicam",
            brand: "Mobic",
            mechanism: "Preferential COX-2 inhibitor at lower doses",
            indications: ["Osteoarthritis", "Rheumatoid arthritis", "Juvenile arthritis"],
            sideEffects: ["GI effects", "Edema", "Dizziness", "Headache", "Renal impairment"],
            nursingConsiderations: "Once-daily dosing (convenient). Preferential COX-2 selectivity at 7.5 mg but loses selectivity at 15 mg. Same class precautions. Popular for arthritis due to convenience.",
            dosageRange: "7.5-15 mg PO daily"
        },
        {
            generic: "indomethacin",
            brand: "Indocin",
            mechanism: "Potent non-selective COX inhibitor",
            indications: ["Gout (acute)", "PDA closure (neonates)", "Rheumatoid arthritis", "Ankylosing spondylitis", "Pericarditis"],
            sideEffects: ["Severe GI effects", "Headache (common)", "Dizziness", "Renal impairment", "CNS effects"],
            nursingConsiderations: "First-line for acute gout along with colchicine. Higher GI toxicity than other NSAIDs. Used IV in neonates for PDA closure. Take with food. Causes headache frequently.",
            dosageRange: "25-50 mg PO BID-TID"
        }
    ]
};

// ===== MUSCULOSKELETAL - Corticosteroids =====
medicationDatabase.musculoskeletal.classes.corticosteroids = {
    name: "Corticosteroids",
    description: "Potent anti-inflammatory and immunosuppressive agents",
    medications: [
        {
            generic: "prednisone",
            brand: "Deltasone",
            mechanism: "Synthetic glucocorticoid; inhibits phospholipase A2, reduces inflammatory mediators",
            indications: ["Asthma exacerbation", "Autoimmune diseases", "Allergic reactions", "Organ transplant", "COPD exacerbation"],
            sideEffects: ["Hyperglycemia", "Osteoporosis", "Immunosuppression", "Cushingoid features", "Adrenal suppression", "Weight gain", "Mood changes"],
            nursingConsiderations: "Take in morning (mimics natural cortisol). Taper slowly if used >2 weeks (adrenal suppression). Monitor glucose. Increased infection risk. Long-term: bone density, cataracts, GI protection.",
            dosageRange: "5-60 mg PO daily (varies widely by indication)"
        },
        {
            generic: "methylprednisolone",
            brand: "Solu-Medrol/Medrol",
            mechanism: "Intermediate-acting glucocorticoid; 5x more potent than hydrocortisone",
            indications: ["Acute asthma", "MS exacerbation", "Spinal cord injury", "Severe inflammation", "Transplant rejection"],
            sideEffects: ["Same as prednisone", "Hyperglycemia", "Infection", "GI upset", "Insomnia", "Mood changes"],
            nursingConsiderations: "IV pulse therapy for MS and severe flares. Dose pack (Medrol Dosepak) is pre-tapered. Give IV push slowly (cardiac arrhythmias with rapid injection). Monitor glucose closely.",
            dosageRange: "4-125 mg IV/PO; pulse: 1 g IV daily x 3-5 days"
        },
        {
            generic: "dexamethasone",
            brand: "Decadron",
            mechanism: "Long-acting glucocorticoid; 25x more potent than hydrocortisone; minimal mineralocorticoid effect",
            indications: ["Cerebral edema", "Croup", "Chemo-induced N/V", "Meningitis (adjunct)", "COVID-19 (severe)"],
            sideEffects: ["Hyperglycemia", "Immunosuppression", "Insomnia", "Psychosis", "Adrenal suppression"],
            nursingConsiderations: "Very long-acting (36-72 hr). No mineralocorticoid effect (no fluid retention). Used in brain tumors (reduces edema). Monitor neuro status. Not preferred for adrenal insufficiency replacement.",
            dosageRange: "0.5-16 mg PO/IV daily"
        },
        {
            generic: "hydrocortisone",
            brand: "Cortef/Solu-Cortef",
            mechanism: "Physiologic glucocorticoid; identical to endogenous cortisol",
            indications: ["Adrenal insufficiency", "Adrenal crisis", "Inflammation", "Allergic reactions"],
            sideEffects: ["Fluid retention", "Hyperglycemia", "Hypokalemia", "Weight gain", "Immunosuppression"],
            nursingConsiderations: "Drug of choice for adrenal insufficiency replacement (physiologic dosing). Stress dosing needed during illness/surgery. Give 2/3 in AM, 1/3 in PM to mimic circadian rhythm.",
            dosageRange: "20-240 mg PO/IV daily (replacement: 15-25 mg daily)"
        },
        {
            generic: "triamcinolone",
            brand: "Kenalog",
            mechanism: "Intermediate-acting glucocorticoid; used locally and systemically",
            indications: ["Joint injections", "Allergic rhinitis (nasal)", "Skin conditions", "Asthma"],
            sideEffects: ["Local: skin atrophy, depigmentation", "Systemic: same as other steroids", "Joint damage with repeated injections"],
            nursingConsiderations: "Intra-articular injection provides local anti-inflammatory effect. Limit injections to same joint (q3-4 months max). Nasal spray (Nasacort) available OTC. Monitor injection sites.",
            dosageRange: "2-40 mg intra-articular; nasal: 2 sprays/nostril daily"
        },
        {
            generic: "budesonide (oral)",
            brand: "Entocort EC/Uceris",
            mechanism: "Locally-acting glucocorticoid; high first-pass metabolism limits systemic effects",
            indications: ["Crohn's disease (ileal/right colon)", "Ulcerative colitis", "Microscopic colitis"],
            sideEffects: ["Headache", "Nausea", "Adrenal suppression (less)", "Respiratory infection", "Acne"],
            nursingConsiderations: "Targeted GI effect with less systemic absorption than prednisone. Still may need taper. Entocort releases in ileum; Uceris releases throughout colon. Not equivalent to prednisone mg for mg.",
            dosageRange: "3-9 mg PO daily"
        }
    ]
};


// ===== MUSCULOSKELETAL - Muscle Relaxants =====
medicationDatabase.musculoskeletal.classes.muscleRelaxants = {
    name: "Skeletal Muscle Relaxants",
    description: "Reduce muscle spasm and spasticity through central or peripheral mechanisms",
    medications: [
        {
            generic: "cyclobenzaprine",
            brand: "Flexeril",
            mechanism: "Centrally acting; structurally related to TCAs; reduces muscle spasm via brainstem",
            indications: ["Acute musculoskeletal pain", "Muscle spasm", "Fibromyalgia (off-label low dose)"],
            sideEffects: ["Drowsiness", "Dry mouth", "Dizziness", "Constipation", "Fatigue"],
            nursingConsiderations: "For short-term use only (2-3 weeks). Very sedating - take at bedtime. Avoid in elderly (anticholinergic). Do not use with MAOIs. Not for spasticity (use baclofen/tizanidine).",
            dosageRange: "5-10 mg PO TID"
        },
        {
            generic: "baclofen",
            brand: "Lioresal",
            mechanism: "GABA-B receptor agonist; reduces spasticity at spinal level",
            indications: ["Spasticity (MS, spinal cord injury)", "Hiccups", "Alcohol withdrawal (off-label)"],
            sideEffects: ["Drowsiness", "Weakness", "Dizziness", "Nausea", "Withdrawal seizures (if stopped abruptly)"],
            nursingConsiderations: "DO NOT stop abruptly (can cause seizures, hallucinations, death). Taper over weeks. Intrathecal pump available for severe spasticity. Monitor for sedation. Adjust dose in renal impairment.",
            dosageRange: "5-20 mg PO TID (max 80 mg/day)"
        },
        {
            generic: "tizanidine",
            brand: "Zanaflex",
            mechanism: "Alpha-2 adrenergic agonist; reduces spasticity centrally",
            indications: ["Spasticity (MS, spinal cord injury)", "Muscle spasm"],
            sideEffects: ["Sedation", "Dry mouth", "Hypotension", "Hepatotoxicity", "Dizziness"],
            nursingConsiderations: "Monitor LFTs at baseline, 1, 3, 6 months. Food affects absorption (be consistent). Potentiated by CYP1A2 inhibitors (ciprofloxacin - AVOID). Short-acting - give at bedtime for nighttime spasms.",
            dosageRange: "2-8 mg PO TID (max 36 mg/day)"
        },
        {
            generic: "methocarbamol",
            brand: "Robaxin",
            mechanism: "Centrally acting; mechanism not fully understood; sedative properties",
            indications: ["Acute musculoskeletal pain", "Muscle spasm", "Tetanus (adjunct)"],
            sideEffects: ["Drowsiness", "Dizziness", "Nausea", "Brown/black/green urine", "Headache"],
            nursingConsiderations: "Can cause harmless dark discoloration of urine (warn patient). IV form available for tetanus. Less sedating than cyclobenzaprine. Avoid alcohol. May impair driving.",
            dosageRange: "750-1500 mg PO QID; 1-3 g IV/IM"
        },
        {
            generic: "dantrolene",
            brand: "Dantrium",
            mechanism: "Acts directly on skeletal muscle; blocks ryanodine receptors, reduces calcium release from SR",
            indications: ["Malignant hyperthermia (treatment)", "Spasticity (cerebral palsy, MS, spinal cord injury)", "NMS"],
            sideEffects: ["Hepatotoxicity", "Muscle weakness", "Drowsiness", "Diarrhea", "Photosensitivity"],
            nursingConsiderations: "LIFE-SAVING for malignant hyperthermia (IV: 1-2.5 mg/kg, repeat to 10 mg/kg). Monitor LFTs with oral use. Only muscle relaxant acting peripherally (on muscle itself). Keep available in OR.",
            dosageRange: "25-100 mg PO QID; IV: 1-2.5 mg/kg for MH"
        },
        {
            generic: "carisoprodol",
            brand: "Soma",
            mechanism: "Centrally acting; metabolized to meprobamate (a barbiturate-like anxiolytic)",
            indications: ["Acute musculoskeletal pain (short-term)"],
            sideEffects: ["Sedation", "Dizziness", "Headache", "Dependence", "Withdrawal symptoms"],
            nursingConsiderations: "Schedule IV (abuse potential - metabolized to meprobamate). Short-term use only. High abuse/dependence risk. Avoid in patients with substance abuse history. Taper to discontinue.",
            dosageRange: "250-350 mg PO TID and at bedtime"
        }
    ]
};
