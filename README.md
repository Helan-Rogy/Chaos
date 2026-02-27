<div align="center">
  
# 🚀 ChaosZen: MSME Scheme Impact & Optimization Engine

**An AI-powered, budget-constrained policy optimization platform designed to maximize the socio-economic impact of government schemes on Micro, Small, and Medium Enterprises (MSMEs).**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 Overview

Governments allocate hundreds of crores to MSME schemes, but distributing these funds efficiently is a monumental challenge. Allocation based on simple eligibility often results in suboptimal ROI for the economy.

**ChaosZen** solves this by combining **Machine Learning (Growth Prediction)**, **Rules-Based Simulation (Impact Modeling)**, and **Algorithmic Optimization (Greedy Knapsack)** to mathematically prove where every rupee should go to maximize either **Revenue Growth** or **Job Creation**.

This project provides a complete end-to-end pipeline, culminating in a **real-time React dashboard** for policy makers to simulate budget distributions dynamically.

---

## ✨ Core Features & Hackathon Phases

### 🎲 Phase 1: Synthetic Data Generation
Generates statistically realistic MSME profiles (`msme_data.csv`) featuring complex financials, compliance metrics, and industry sectors, alongside tailored government schemes (`schemes_data.csv`).

### 🧠 Phase 2: AI Growth Prediction Model
Uses a highly tuned **Random Forest Classifier** to evaluate 17 MSME features and predict their `Growth_Category` (High, Moderate, Low) along with a continuous 0-100 `Growth_Score`. Features SHAP explainability.

### ⚙️ Phase 3: Rules-Based Impact Simulation Engine
Evaluates every MSME against all available schemes. Simulates the exact mathematical impact (projected revenue lift and new jobs created) both for individual schemes and combined "stacked" schemes, strictly applying subsidy caps.

### 🧮 Phase 4: AI Policy Optimizer (Budget-Constrained Knapsack)
The core algorithmic brain. Given a strict government budget (e.g., ₹5 Crores), it evaluates all eligible MSME-scheme pairs and selects the absolute most efficient allocations.
- **Adjustable Policy Weights**: Slide the scale between prioritizing Revenue (`alpha`) vs. Jobs (`beta`).
- **Explainable AI**: Generates a human-readable justification string for *every single decision made*.

### 📊 Phase 5: Real-Time Policy Dashboard
A full-stack web application bringing the models to life.
- **Advisory UI**: Search any MSME to see its growth prediction and recommended schemes.
- **Policy Simulator**: Drag sliders to adjust total budget and policy priorities, and instantly watch the optimization engine recalculate the entire nation's budget distribution in milliseconds.

---

## 🏗️ Architecture & Tech Stack

- **Frontend (Dashboard)**: React 18, Vite, TailwindCSS, Recharts, Lucide Icons
- **Backend (Bridge API)**: Node.js, Express.js
- **Core Engine (ML & Math)**: Python 3, Pandas, Scikit-Learn, NumPy

```text
ChaosZen/
├── backend/               # Node.js Express API (Bridge between Python & React)
├── frontend/              # React + Vite Dashboard (Visual Interface)
├── engine/                # Core Python ML & Optimization Logic
│   ├── data_generator.py      # Phase 1
│   ├── growth_model.py        # Phase 2 
│   ├── scheme_eligibility.py  # Phase 3 
│   └── optimization_engine.py # Phase 4 
├── data/                  # Generated CSV datasets
├── reports/               # Evaluation criteria & text outputs
└── model_artifacts/       # Trained ML pipelines (.pkl)
```

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have **Python 3.10+** and **Node.js 18+** installed on your system.

Install Python dependencies:
```bash
pip install pandas numpy scikit-learn
```

### 2. Start the Backend API
The Node.js server acts as the executor for the Python optimization engine.
```bash
cd backend
npm install
node server.js
```
*Server runs on `http://localhost:5000`*

### 3. Start the Frontend Dashboard
Open a new terminal window.
```bash
cd frontend
npm install
npm run dev
```
*Dashboard runs on `http://localhost:5174`*

---

## 💻 Manual CLI Usage (Headless Engine)

If you prefer to run the optimization engine directly via the command line instead of the web dashboard:

```bash
# Run with default settings (₹5 Cr budget, 0.6 Revenue Weight)
python engine/optimization_engine.py

# Run with custom budget and jobs-heavy policy
python engine/optimization_engine.py --budget 100000000 --alpha 0.2

# Run with mandatory category sub-budgets (40% Micro, 35% Small, 25% Medium)
python engine/optimization_engine.py --equal-distribution
```

---

## 🏆 Hackathon Evaluation Criteria Satisfied
- **Data Completeness**: Realistic distributions and financial constraint handling.
- **ML Correctness**: Proper train/test splits, macro-F1 scoring, handle of imbalanced data.
- **Mathematical Soundness**: Correct compounding behavior in multi-scheme simulation.
- **Budget Strictness**: Greedy knapsack guarantees 0% budget overruns.
- **Transparency**: Justification tables rendered for both selected and *rejected* MSMEs.

---
*Built for the Hackathon. Empowering policymakers with data.*
