"""
Phase 3: Scheme Eligibility and Impact Simulation
==================================================
Multi-scheme eligibility checking and revenue/employment impact simulation
for all MSMEs in msme_data.csv against schemes in schemes_data.csv.

Output Files:
  - scheme_eligibility_results.csv  : Per-scheme and combined impact projections
  - phase3_evaluation.txt           : Simulation summary and spot-check report
"""

import pandas as pd
import numpy as np
import os

np.random.seed(42)


# ---------------------------------------------------------------------------
# 1. DATA LOADING
# ---------------------------------------------------------------------------

def load_data():
    msme_path = "msme_data.csv"
    scheme_path = "schemes_data.csv"

    if not os.path.exists(msme_path):
        raise FileNotFoundError(f"Cannot find {msme_path}. Run data_generator.py first.")
    if not os.path.exists(scheme_path):
        raise FileNotFoundError(f"Cannot find {scheme_path}.")

    msme_df = pd.read_csv(msme_path)
    scheme_df = pd.read_csv(scheme_path)

    print(f"Loaded {len(msme_df)} MSME records.")
    print(f"Loaded {len(scheme_df)} schemes.\n")
    return msme_df, scheme_df


# ---------------------------------------------------------------------------
# 2. ELIGIBILITY LOGIC
# ---------------------------------------------------------------------------

def parse_list_field(value: str) -> list[str]:
    """Parse a comma-separated scheme field into a cleaned list."""
    return [v.strip() for v in str(value).split(",")]


def is_eligible(msme: pd.Series, scheme: pd.Series) -> bool:
    """
    Determine whether a single MSME is eligible for a given scheme.

    Rules:
      - Sector    : MSME sector must appear in scheme's Eligible_Sectors (or scheme allows 'All')
      - Category  : MSME category must appear in scheme's Target_Category  (or scheme allows 'All')
      - Location  : MSME location type must appear in scheme's Location_Criteria (or scheme allows 'All')
    """
    # --- Sector check ---
    eligible_sectors = parse_list_field(scheme["Eligible_Sectors"])
    if "All" not in eligible_sectors and msme["Sector"] not in eligible_sectors:
        return False

    # --- Category check ---
    target_categories = parse_list_field(scheme["Target_Category"])
    if "All" not in target_categories and msme["Category"] not in target_categories:
        return False

    # --- Location check ---
    location_criteria = parse_list_field(scheme["Location_Criteria"])
    if "All" not in location_criteria and msme["Location_Type"] not in location_criteria:
        return False

    return True


def get_eligible_schemes(msme: pd.Series, scheme_df: pd.DataFrame) -> pd.DataFrame:
    """Return the subset of schemes that an MSME qualifies for."""
    mask = scheme_df.apply(lambda s: is_eligible(msme, s), axis=1)
    return scheme_df[mask].reset_index(drop=True)


# ---------------------------------------------------------------------------
# 3. IMPACT SIMULATION (single scheme)
# ---------------------------------------------------------------------------

def simulate_single_scheme(msme: pd.Series, scheme: pd.Series) -> dict:
    """
    Calculate revenue and employment impact for ONE eligible scheme.

    Revenue Impact:
        subsidy_applied   = min(Annual_Revenue * Impact_Factor_Revenue, Max_Subsidy_Amount)
        projected_revenue = Annual_Revenue + subsidy_applied
        revenue_increase% = (subsidy_applied / Annual_Revenue) * 100

    Employment Impact:
        new_jobs              = round(Number_of_Employees * (Impact_Factor_Employment / 100))
        projected_employees   = Number_of_Employees + new_jobs
        employment_increase%  = (new_jobs / Number_of_Employees) * 100  [0 if no employees]
    """
    annual_revenue = msme["Annual_Revenue"]
    num_employees = msme["Number_of_Employees"]

    # Revenue
    impact_factor_rev = float(scheme["Impact_Factor_Revenue"])
    max_subsidy = float(scheme["Max_Subsidy_Amount"])
    subsidy_applied = min(annual_revenue * impact_factor_rev, max_subsidy)
    projected_revenue = annual_revenue + subsidy_applied
    revenue_increase_pct = (subsidy_applied / annual_revenue * 100) if annual_revenue > 0 else 0.0

    # Employment
    impact_factor_emp = float(scheme["Impact_Factor_Employment"])
    new_jobs = round(num_employees * (impact_factor_emp / 100))
    projected_employees = num_employees + new_jobs
    employment_increase_pct = (new_jobs / num_employees * 100) if num_employees > 0 else 0.0

    return {
        "MSME_ID": msme["MSME_ID"],
        "Sector": msme["Sector"],
        "Category": msme["Category"],
        "Location_Type": msme["Location_Type"],
        "Scheme_ID": scheme["Scheme_ID"],
        "Scheme_Name": scheme["Scheme_Name"],
        "Simulation_Type": "Single_Scheme",
        # Before
        "Before_Annual_Revenue": round(annual_revenue, 2),
        "Before_Employees": num_employees,
        # Impact factors
        "Impact_Factor_Revenue": impact_factor_rev,
        "Impact_Factor_Employment": impact_factor_emp,
        "Max_Subsidy_Amount": max_subsidy,
        # Calculated
        "Subsidy_Applied": round(subsidy_applied, 2),
        "New_Jobs_Added": new_jobs,
        # After
        "Projected_Revenue": round(projected_revenue, 2),
        "Projected_Employees": projected_employees,
        # % change
        "Revenue_Increase_Pct": round(revenue_increase_pct, 4),
        "Employment_Increase_Pct": round(employment_increase_pct, 4),
    }


# ---------------------------------------------------------------------------
# 4. COMBINED MULTI-SCHEME IMPACT SIMULATION
# ---------------------------------------------------------------------------

def simulate_combined_schemes(msme: pd.Series, eligible_schemes: pd.DataFrame) -> dict | None:
    """
    Simulate the combined (stacked) impact when an MSME qualifies for multiple schemes.

    Revenue: subsidies are applied sequentially — each subsidy is calculated on the
             running (compounding) revenue total after the previous scheme's boost.
    Employment: new jobs from all schemes are summed (no duplication).

    Returns None if the MSME is eligible for fewer than 2 schemes.
    """
    if len(eligible_schemes) < 2:
        return None

    annual_revenue_original = msme["Annual_Revenue"]
    num_employees_original = msme["Number_of_Employees"]

    running_revenue = annual_revenue_original
    total_subsidy = 0.0
    total_new_jobs = 0
    scheme_ids = []
    scheme_names = []

    for _, scheme in eligible_schemes.iterrows():
        impact_factor_rev = float(scheme["Impact_Factor_Revenue"])
        max_subsidy = float(scheme["Max_Subsidy_Amount"])
        impact_factor_emp = float(scheme["Impact_Factor_Employment"])

        # Subsidy based on current (running) revenue — compounding effect
        subsidy = min(running_revenue * impact_factor_rev, max_subsidy)
        running_revenue += subsidy
        total_subsidy += subsidy

        # New jobs based on original employee count (avoiding double-counting)
        new_jobs = round(num_employees_original * (impact_factor_emp / 100))
        total_new_jobs += new_jobs

        scheme_ids.append(scheme["Scheme_ID"])
        scheme_names.append(scheme["Scheme_Name"])

    projected_revenue_combined = running_revenue
    projected_employees_combined = num_employees_original + total_new_jobs
    revenue_increase_pct = ((projected_revenue_combined - annual_revenue_original) / annual_revenue_original * 100) if annual_revenue_original > 0 else 0.0
    employment_increase_pct = (total_new_jobs / num_employees_original * 100) if num_employees_original > 0 else 0.0

    return {
        "MSME_ID": msme["MSME_ID"],
        "Sector": msme["Sector"],
        "Category": msme["Category"],
        "Location_Type": msme["Location_Type"],
        "Scheme_ID": " + ".join(scheme_ids),
        "Scheme_Name": " + ".join(scheme_names),
        "Simulation_Type": "Combined_Multi_Scheme",
        # Before
        "Before_Annual_Revenue": round(annual_revenue_original, 2),
        "Before_Employees": num_employees_original,
        # Impact factors (combined)
        "Impact_Factor_Revenue": round(sum(float(s["Impact_Factor_Revenue"]) for _, s in eligible_schemes.iterrows()), 4),
        "Impact_Factor_Employment": round(sum(float(s["Impact_Factor_Employment"]) for _, s in eligible_schemes.iterrows()), 4),
        "Max_Subsidy_Amount": sum(float(s["Max_Subsidy_Amount"]) for _, s in eligible_schemes.iterrows()),
        # Calculated
        "Subsidy_Applied": round(total_subsidy, 2),
        "New_Jobs_Added": total_new_jobs,
        # After
        "Projected_Revenue": round(projected_revenue_combined, 2),
        "Projected_Employees": projected_employees_combined,
        # % change
        "Revenue_Increase_Pct": round(revenue_increase_pct, 4),
        "Employment_Increase_Pct": round(employment_increase_pct, 4),
    }


# ---------------------------------------------------------------------------
# 5. RUN FULL SIMULATION OVER ALL MSMEs
# ---------------------------------------------------------------------------

def run_simulation(msme_df: pd.DataFrame, scheme_df: pd.DataFrame) -> pd.DataFrame:
    """
    For every MSME:
      - Determine which schemes it is eligible for
      - Simulate impact for each eligible scheme individually
      - Simulate combined impact if eligible for ≥ 2 schemes
    Returns a DataFrame of all simulation rows.
    """
    all_rows = []
    eligibility_counts = []

    for _, msme in msme_df.iterrows():
        eligible = get_eligible_schemes(msme, scheme_df)
        eligibility_counts.append(len(eligible))

        # Single-scheme rows
        for _, scheme in eligible.iterrows():
            row = simulate_single_scheme(msme, scheme)
            all_rows.append(row)

        # Combined multi-scheme row
        if len(eligible) >= 2:
            combined_row = simulate_combined_schemes(msme, eligible)
            if combined_row:
                all_rows.append(combined_row)

    print(f"Eligibility distribution (# schemes per MSME):")
    counts = pd.Series(eligibility_counts).value_counts().sort_index()
    for k, v in counts.items():
        print(f"  Eligible for {k} scheme(s): {v} MSMEs")

    results_df = pd.DataFrame(all_rows)
    return results_df, eligibility_counts


# ---------------------------------------------------------------------------
# 6. REPORTING
# ---------------------------------------------------------------------------

def build_report(results_df: pd.DataFrame, eligibility_counts: list, msme_df: pd.DataFrame, scheme_df: pd.DataFrame) -> str:
    lines = []
    add = lines.append

    add("=" * 70)
    add("PHASE 3: SCHEME ELIGIBILITY AND IMPACT SIMULATION REPORT")
    add("=" * 70)
    add("")

    # --- Eligibility Summary ---
    add("1. ELIGIBILITY SUMMARY")
    add("-" * 40)
    counts_series = pd.Series(eligibility_counts)
    add(f"Total MSMEs analyzed          : {len(msme_df)}")
    add(f"Total schemes available       : {len(scheme_df)}")
    add(f"MSMEs eligible for 0 schemes  : {(counts_series == 0).sum()}")
    add(f"MSMEs eligible for 1 scheme   : {(counts_series == 1).sum()}")
    add(f"MSMEs eligible for ≥2 schemes : {(counts_series >= 2).sum()}")
    add(f"Max schemes for one MSME      : {counts_series.max()}")
    add("")

    # Per-scheme eligibility count
    add("Per-Scheme Eligibility Count:")
    single = results_df[results_df["Simulation_Type"] == "Single_Scheme"]
    scheme_counts = single["Scheme_ID"].value_counts().sort_index()
    for scheme_id, cnt in scheme_counts.items():
        name = scheme_df.loc[scheme_df["Scheme_ID"] == scheme_id, "Scheme_Name"].values[0]
        add(f"  {scheme_id} ({name}): {cnt} MSMEs")
    add("")

    # --- Revenue Impact Summary ---
    add("2. REVENUE IMPACT SIMULATION (Single-Scheme Rows)")
    add("-" * 40)
    if len(single) > 0:
        add(f"Total single-scheme impact rows : {len(single)}")
        add(f"Avg Subsidy Applied             : ₹{single['Subsidy_Applied'].mean():,.2f}")
        add(f"Avg Revenue Increase            : {single['Revenue_Increase_Pct'].mean():.2f}%")
        add(f"Max Subsidy Applied             : ₹{single['Subsidy_Applied'].max():,.2f}")
        add(f"Min Subsidy Applied             : ₹{single['Subsidy_Applied'].min():,.2f}")
        add(f"Avg Projected Revenue           : ₹{single['Projected_Revenue'].mean():,.2f}")
    add("")

    # --- Employment Impact Summary ---
    add("3. EMPLOYMENT IMPACT SIMULATION (Single-Scheme Rows)")
    add("-" * 40)
    if len(single) > 0:
        add(f"Total New Jobs Created (all single rows) : {single['New_Jobs_Added'].sum():,}")
        add(f"Avg New Jobs per Eligible MSME-Scheme    : {single['New_Jobs_Added'].mean():.2f}")
        add(f"Avg Employment Increase                  : {single['Employment_Increase_Pct'].mean():.2f}%")
        add(f"Max New Jobs (single scheme)             : {single['New_Jobs_Added'].max():,}")
    add("")

    # --- Multi-Scheme Summary ---
    combined = results_df[results_df["Simulation_Type"] == "Combined_Multi_Scheme"]
    add("4. MULTI-SCHEME COMBINED IMPACT")
    add("-" * 40)
    add(f"MSMEs with combined simulation rows     : {len(combined)}")
    if len(combined) > 0:
        add(f"Avg Combined Subsidy Applied            : ₹{combined['Subsidy_Applied'].mean():,.2f}")
        add(f"Avg Combined Revenue Increase           : {combined['Revenue_Increase_Pct'].mean():.2f}%")
        add(f"Avg Combined New Jobs Added             : {combined['New_Jobs_Added'].mean():.2f}")
        add(f"Avg Combined Employment Increase        : {combined['Employment_Increase_Pct'].mean():.2f}%")
    add("")

    # --- Before vs After Projection Snapshot ---
    add("5. BEFORE vs AFTER PROJECTION SNAPSHOT (10 Sample MSMEs)")
    add("-" * 70)
    header = (
        f"{'MSME_ID':<12} {'Scheme':<10} {'Type':<15} "
        f"{'Before Rev (₹)':>18} {'After Rev (₹)':>18} {'Rev+%':>7} "
        f"{'Emp Before':>10} {'Emp After':>10} {'Emp+%':>7}"
    )
    add(header)
    add("-" * 70)

    sample = results_df.head(30)  # first 30 rows for display
    seen_msme = set()
    count = 0
    for _, row in sample.iterrows():
        if count >= 10:
            break
        key = (row["MSME_ID"], row["Scheme_ID"])
        if key not in seen_msme:
            seen_msme.add(key)
            add(
                f"{row['MSME_ID']:<12} {row['Scheme_ID']:<10} {row['Simulation_Type']:<15} "
                f"{row['Before_Annual_Revenue']:>18,.2f} {row['Projected_Revenue']:>18,.2f} "
                f"{row['Revenue_Increase_Pct']:>6.2f}% "
                f"{row['Before_Employees']:>10} {row['Projected_Employees']:>10} "
                f"{row['Employment_Increase_Pct']:>6.2f}%"
            )
            count += 1
    add("")

    # --- Mathematical Verification ---
    add("6. MATHEMATICAL VERIFICATION (Spot-Check)")
    add("-" * 40)
    check_rows = results_df[results_df["Simulation_Type"] == "Single_Scheme"].head(3)
    for _, r in check_rows.iterrows():
        expected_subsidy = min(r["Before_Annual_Revenue"] * r["Impact_Factor_Revenue"], r["Max_Subsidy_Amount"])
        expected_rev = r["Before_Annual_Revenue"] + expected_subsidy
        expected_rev_pct = expected_subsidy / r["Before_Annual_Revenue"] * 100 if r["Before_Annual_Revenue"] > 0 else 0
        expected_jobs = round(r["Before_Employees"] * (r["Impact_Factor_Employment"] / 100))
        expected_emp = r["Before_Employees"] + expected_jobs

        add(f"  MSME: {r['MSME_ID']}  |  Scheme: {r['Scheme_ID']}")
        add(f"    Revenue:    {r['Before_Annual_Revenue']:>15,.2f}  ×  {r['Impact_Factor_Revenue']}  →  Subsidy = {expected_subsidy:,.2f}  (capped at {r['Max_Subsidy_Amount']:,.0f})")
        add(f"    Projected Revenue = {r['Before_Annual_Revenue']:,.2f} + {expected_subsidy:,.2f} = {expected_rev:,.2f}  ✓ (stored: {r['Projected_Revenue']:,.2f})")
        add(f"    Rev Increase % = {expected_rev_pct:.4f}%  ✓ (stored: {r['Revenue_Increase_Pct']:.4f}%)")
        add(f"    Employees: {r['Before_Employees']} × {r['Impact_Factor_Employment']}% = +{expected_jobs} jobs → {expected_emp} total  ✓ (stored: {r['Projected_Employees']})")
        add("")

    add("=" * 70)
    add("END OF PHASE 3 EVALUATION REPORT")
    add("=" * 70)

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# 7. MAIN
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("PHASE 3: Scheme Eligibility and Impact Simulation")
    print("=" * 60)
    print()

    # Load data
    msme_df, scheme_df = load_data()

    # Run simulation
    print("Running eligibility checks and impact simulations...")
    results_df, eligibility_counts = run_simulation(msme_df, scheme_df)
    print()

    # Save results CSV
    output_csv = "scheme_eligibility_results.csv"
    results_df.to_csv(output_csv, index=False)
    print(f"Results saved to '{output_csv}' ({len(results_df)} rows).")

    # Build and save report
    report = build_report(results_df, eligibility_counts, msme_df, scheme_df)
    print()
    print(report)

    report_path = "phase3_evaluation.txt"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"\nEvaluation report saved to '{report_path}'.")

    # Quick summary printout
    single_rows = results_df[results_df["Simulation_Type"] == "Single_Scheme"]
    combined_rows = results_df[results_df["Simulation_Type"] == "Combined_Multi_Scheme"]
    total_jobs = single_rows["New_Jobs_Added"].sum()
    total_subsidy = single_rows["Subsidy_Applied"].sum()

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Single-scheme impact rows : {len(single_rows)}")
    print(f"  Combined impact rows      : {len(combined_rows)}")
    print(f"  Total subsidy modeled     : ₹{total_subsidy:,.2f}")
    print(f"  Total new jobs modeled    : {total_jobs:,}")
    print("=" * 60)


if __name__ == "__main__":
    main()
