/**
 * Maximus HealthCare Consult — "Know Your Numbers" Interactive Health & BMI Calculator
 * Promotes preventive healthcare and regular engagement across Ghana.
 */

function calculateHealthScore(event) {
  event.preventDefault();
  const form = document.getElementById("health-calc-form");
  if (!form) return false;

  const age = parseFloat(form.elements["calc_age"].value) || 35;
  const height = parseFloat(form.elements["calc_height"].value); // cm
  const weight = parseFloat(form.elements["calc_weight"].value); // kg
  const systolic = parseFloat(form.elements["calc_systolic"].value); // mmHg
  const diastolic = parseFloat(form.elements["calc_diastolic"].value); // mmHg
  const glucose = parseFloat(form.elements["calc_glucose"].value) || null; // mmol/L

  if (!height || !weight) {
    alert("Please enter both your height and weight.");
    return false;
  }

  // 1. BMI Calculation
  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);
  let bmiCategory = "Normal weight";
  let bmiColor = "#10B981"; // green

  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "#F59E0B";
  } else if (bmi >= 18.5 && bmi < 25) {
    bmiCategory = "Healthy weight (Ideal)";
    bmiColor = "#10B981";
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = "Overweight";
    bmiColor = "#F59E0B";
  } else {
    bmiCategory = "Obesity range";
    bmiColor = "#EF4444";
  }

  // 2. Blood Pressure Assessment
  let bpCategory = "Not provided";
  let bpColor = "#6B7280";
  if (systolic && diastolic) {
    if (systolic < 120 && diastolic < 80) {
      bpCategory = "Optimal / Normal Blood Pressure";
      bpColor = "#10B981";
    } else if (systolic <= 129 && diastolic < 80) {
      bpCategory = "Elevated Blood Pressure";
      bpColor = "#F59E0B";
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      bpCategory = "Stage 1 Hypertension";
      bpColor = "#F97316";
    } else if (systolic >= 140 || diastolic >= 90) {
      bpCategory = "Stage 2 Hypertension";
      bpColor = "#EF4444";
    }
  }

  // 3. Composite Health Score Calculation (out of 100)
  let score = 100;

  // BMI penalty
  if (bmi < 18.5) score -= 12;
  else if (bmi >= 25 && bmi < 30) score -= 15;
  else if (bmi >= 30) score -= 25;

  // BP penalty
  if (systolic && diastolic) {
    if (systolic >= 140 || diastolic >= 90) score -= 25;
    else if (systolic >= 130 || diastolic >= 80) score -= 15;
    else if (systolic >= 120) score -= 8;
  }

  // Glucose penalty (if entered)
  if (glucose) {
    if (glucose > 7.0) score -= 20;
    else if (glucose > 5.6) score -= 10;
  }

  score = Math.max(30, Math.min(98, Math.round(score)));

  // Display results
  const resultBox = document.getElementById("calc-result-box");
  const scoreVal = document.getElementById("calc-score-val");
  const bmiVal = document.getElementById("calc-bmi-val");
  const bmiCat = document.getElementById("calc-bmi-cat");
  const bpCat = document.getElementById("calc-bp-cat");
  const adviceEl = document.getElementById("calc-advice");
  const waShareBtn = document.getElementById("calc-wa-share");

  if (scoreVal) scoreVal.textContent = score + "/100";
  if (bmiVal) bmiVal.textContent = bmi;
  if (bmiCat) {
    bmiCat.textContent = bmiCategory;
    bmiCat.style.color = bmiColor;
  }
  if (bpCat) {
    bpCat.textContent = bpCategory;
    bpCat.style.color = bpColor;
  }

  let advice = "Your numbers are within a solid range! Maintain regular hydration, balanced nutrition with lower sodium, and get your blood pressure checked every 3 months.";
  if (score < 70) {
    advice = "Your numbers indicate elevated risk factors. We recommend booking a comprehensive checkup at our East Legon consultation suite and discussing preventive monitoring with our pharmacist.";
  }
  if (adviceEl) adviceEl.textContent = advice;

  // Prepare WhatsApp Share link
  const waMsg = `🏥 *MAXIMUS HEALTH ASSESSMENT SUMMARY*\n──────────────────────────\n▪️ *BMI:* ${bmi} (${bmiCategory})\n▪️ *Blood Pressure:* ${systolic || 'N/A'}/${diastolic || 'N/A'} mmHg (${bpCategory})\n▪️ *Fasting Sugar:* ${glucose ? glucose + ' mmol/L' : 'Not tested'}\n▪️ *Cardiovascular Wellness Score:* ${score}/100\n──────────────────────────\n_Hello Pharmacist, I completed your online health test and would like personalized advice on my numbers._`;
  
  if (waShareBtn) {
    waShareBtn.href = `https://wa.me/233248031796?text=${encodeURIComponent(waMsg)}`;
  }

  if (resultBox) {
    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return false;
}
