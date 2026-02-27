# Data Design & Assumptions Documentation

This document explicitly outlines the methodology, logical groupings, and numerical boundaries applied to synthesize the datasets for Phase 1 of the AI-Powered Dual-Layer MSME Growth Advisory & Subsidy Optimization Platform challenge. The generation script (`data_generator.py`) was constructed to reflect real-world constraints while ensuring data suitability for the predictive machine learning models in Phase 2.

## 1. MSME Profile Demographics (Categorical Data)
To ensure broad and representative characteristics across the MSME landscape, categorical features follow these defined buckets:
- **Sectors:** *Manufacturing, IT Services, Food Processing, Textiles, Retail*. This covers both service and manufacturing segments allowing sector-specific bias behaviors (like Export Percentages).
- **Ownership Type:** *Sole Proprietorship, Partnership, Private Limited*. 
- **Category:** *Micro, Small, Medium*. Represents the traditional MSME classification.
- **Location Type:** *Urban, Rural, Semi-Urban*. Essential for evaluating scheme location constraints (e.g., Rural Employment Boost).

## 2. Realistic Ranges & Logical Generation (Numeric Data)
The numerical data distributions simulate realistic business metrics to avoid artificial skewness when training the Phase 2 Growth Prediction Model.

### Financial Indicators
* **Years of Operation:** Uniformly distributed between **1 to 25 years**.
* **Annual Revenue:** Ranging from **₹5,00,000 to ₹5,00,00,000** (5 Lakhs to 5 Crores).
* **Revenue Growth Rate:** Ranging between **-5% to +30%** to account for standard growth and occasional contraction.
* **Profit Margin:** Ranging from **2% to 25%**, which aligns with typical MSME profitability.
* **Debt Outstanding:** Logically tied to Annual Revenue; simulated as **10% to 50%** of the enterprise's annual revenue.
* **Loan to Revenue Ratio:** Derived dynamically (`Debt Outstanding / Annual Revenue`), ensuring a mathematically sound ratio.

### Operational Indicators
* **Number of Employees:** Logically scales with the enterprise `Category`.
    * *Micro:* 2 to 49 employees.
    * *Small/Medium:* 20 to 149 employees.
* **Capacity Utilization:** Ranges realistically between **40% and 95%**.
* **Export Percentage:** Tied to the `Sector`. Retail/Food/IT are assumed to have 0% direct goods exports in this dataset, while *Manufacturing and Textiles* are assigned **0% to 60%**.
* **Technology Level:** Modeled as a discrete rating from **1 to 5**.

### Compliance Indicators
* **GST Compliance Score (0-100):** Takes into account business maturity.
    * Businesses older than 5 years: Score ranges **60 - 100** (assumes stabilized operations).
    * Newer businesses (≤ 5 years): Score ranges **40 - 90** (assumes higher variability early on).
* **Inspection Score (0-100):** Uniformly randomly distributed between **50 and 100**.
* **Documentation Readiness Score (0-100):** Uniformly randomly distributed between **50 and 100**.

## 3. Target Variable & Balanced Distribution
To ensure the Phase 2 Machine Learning model builds unbiased predictions, the target variable `Growth_Category` (High / Moderate / Low) was synthesized using a quantifiable, deterministic composite scoring method before bucketing:
1. **Internal Score Calculation:** The script calculates a normalized internal score using weighted components to define what "Growth" practically means:
   * 50% Weight: `Revenue_Growth_Rate` (Financial traction)
   * 30% Weight: `Technology_Level` (Digital maturity)
   * 20% Weight: `GST_Compliance_Score` (Regulatory reliability)
2. **Balanced Quantiling:** The `Internal_Score` is split into exactly 3 quantiles using `pandas.qcut()`. This guarantees an evenly partitioned class distribution (~33.3% representation per class for Low, Moderate, and High), resolving target imbalance issues naturally before modeling in Phase 2.

## 4. Scheme Data Design
The scheme dataset (`schemes_data.csv`) is rigorously constrained to the **5 maximum schemes** limit specified in the problem statement requirements.
* **Scheme Targets Constraints:** Explicitly maps specific schemes to constrained `Target_Category` and `Location_Criteria` combinations (e.g., *Rural Employment Boost* only covers *Rural Micro* enterprises).
* **Impact Factors:** Follow strict problem definitions:
   * **Revenue Impact Factor:** Adheres to the **5% to 25%** allowable window.
   * **Employment Impact Factor:** Adheres to the **1 to 10 jobs** creation window.
* **Max Subsidy Amount:** Varied distinctly across scheme types and sectors from **₹2,00,000 to ₹20,00,000** to produce robust test cases for the Phase 4 optimization knapsack engine.
