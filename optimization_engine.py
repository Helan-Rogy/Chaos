"""
Phase 4: Budget-Constrained Optimization Engine
================================================
Selects the best MSME-scheme funding allocations within a government budget
using a weighted composite score (alpha × revenue_impact + beta × employment_impact)
and a greedy efficiency-based knapsack algorithm.

Usage:
    python optimization_engine.py
    python optimization_engine.py --alpha 0.8 --budget 50000000
    python optimization_engine.py --alpha 0.3 --budget 100000000 --equal-distribution

Outputs:
    optimization_results.csv   — Selected MSME-scheme pairs with scores & justification
    phase4_evaluation.txt      — Full report with sensitivity analysis
"""

import pandas as pd
import numpy as np
import argparse
import os

np.random.seed(42)

# ---------------------------------------------------------------------------
# DEFAULT CONFIGURATION
# ---------------------------------------------------------------------------
DEFAULT_BUDGET   = 50_000_000   # ₹5 crore
DEFAULT_ALPHA    = 0.6          # revenue weight (beta = 1 - alpha)

# Category budget shares for --equal-distribution mode
CATEGORY_BUDGET_SHARES = {
    "Micro":  0.40,
    "Small":  0.35,
    "Medium": 0.25,
}

# ---------------------------------------------------------------------------
# 1. LOAD & VALIDATE DATA
# ---------------------------------------------------------------------------

def load_eligibility_data(json_mode=False) -> pd.DataFrame:
    path = "scheme_eligibility_results.csv"
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"'{path}' not found. Run scheme_eligibility.py (Phase 3) first."
        )
    df = pd.read_csv(path)

    # Use only Single_Scheme rows to avoid double-counting in optimization
    single = df[df["Simulation_Type"] == "Single_Scheme"].copy()
    if not json_mode:
        print(f"Loaded {len(df)} total rows from Phase 3.")
        print(f"Using {len(single)} Single_Scheme rows for optimization.\n")
    return single


# ---------------------------------------------------------------------------
# 2. COMPOSITE SCORING
# ---------------------------------------------------------------------------

def compute_scores(df: pd.DataFrame, alpha: float) -> pd.DataFrame:
    """
    For each MSME-scheme pair compute:
        Normalized_Rev_Score = Revenue_Increase_Pct  / max(Revenue_Increase_Pct)
        Normalized_Emp_Score = Employment_Increase_Pct / max(Employment_Increase_Pct)
        Composite_Score      = alpha * Norm_Rev + beta * Norm_Emp
        Efficiency           = Composite_Score / Subsidy_Applied  (score per rupee)
    """
    beta = 1.0 - alpha

    max_rev = df["Revenue_Increase_Pct"].max()
    max_emp = df["Employment_Increase_Pct"].max()

    # Avoid division by zero
    df = df.copy()
    df["Norm_Rev_Score"] = df["Revenue_Increase_Pct"] / max_rev if max_rev > 0 else 0.0
    df["Norm_Emp_Score"] = df["Employment_Increase_Pct"] / max_emp if max_emp > 0 else 0.0

    df["Composite_Score"] = (alpha * df["Norm_Rev_Score"]) + (beta * df["Norm_Emp_Score"])
    df["Efficiency"]       = df["Composite_Score"] / df["Subsidy_Applied"].replace(0, np.nan)
    df["Policy_Alpha"]     = alpha
    df["Policy_Beta"]      = beta

    return df


# ---------------------------------------------------------------------------
# 3. GREEDY KNAPSACK OPTIMIZATION
# ---------------------------------------------------------------------------

def greedy_select(df: pd.DataFrame, budget: float) -> pd.DataFrame:
    """
    Greedy efficiency-based knapsack:
    1. Sort all pairs by Efficiency (descending) — most score-per-rupee first
    2. Select a pair if its subsidy fits within the remaining budget
    3. Continue until budget exhausted or all pairs evaluated
    """
    sorted_df   = df.sort_values("Efficiency", ascending=False).reset_index(drop=True)
    remaining   = budget
    selected    = []
    global_rank = 0

    for _, row in sorted_df.iterrows():
        global_rank += 1
        cost = row["Subsidy_Applied"]
        if cost <= remaining:
            row = row.copy()
            row["Efficiency_Rank"]        = global_rank
            row["Cumulative_Budget_Used"]  = budget - remaining + cost
            remaining                     -= cost
            row["Remaining_Budget"]        = remaining
            selected.append(row)

    return pd.DataFrame(selected) if selected else pd.DataFrame()


def greedy_select_with_category_budgets(df: pd.DataFrame, total_budget: float) -> pd.DataFrame:
    """
    Split total budget by MSME category (40% Micro, 35% Small, 25% Medium)
    and run a separate greedy selection within each sub-budget.
    """
    all_selected = []
    for category, share in CATEGORY_BUDGET_SHARES.items():
        sub_budget  = total_budget * share
        sub_df      = df[df["Category"] == category].copy()
        selected    = greedy_select(sub_df, sub_budget)
        if not selected.empty:
            selected["Sub_Budget_Category"] = category
            selected["Sub_Budget_Allocated"] = round(sub_budget, 2)
            all_selected.append(selected)

    if not all_selected:
        return pd.DataFrame()

    combined = pd.concat(all_selected, ignore_index=True)
    combined["Cumulative_Budget_Used"] = combined["Subsidy_Applied"].cumsum()
    return combined


# ---------------------------------------------------------------------------
# 4. DECISION JUSTIFICATION
# ---------------------------------------------------------------------------

def build_justification(row: pd.Series, total_rows: int, budget: float) -> str:
    """Generate a human-readable reason for why this MSME-scheme pair was selected."""
    return (
        f"Selected (Efficiency Rank #{int(row['Efficiency_Rank'])} of {total_rows}). "
        f"Revenue impact: {row['Revenue_Increase_Pct']:.2f}% "
        f"(weight={row['Policy_Alpha']:.1f}), "
        f"Employment impact: {row['Employment_Increase_Pct']:.2f}% "
        f"(weight={row['Policy_Beta']:.1f}). "
        f"Composite score: {row['Composite_Score']:.4f}. "
        f"Subsidy ₹{row['Subsidy_Applied']:,.0f} fit within "
        f"remaining budget ₹{row['Remaining_Budget'] + row['Subsidy_Applied']:,.0f}."
    )


def add_justifications(selected: pd.DataFrame, total_rows: int, budget: float) -> pd.DataFrame:
    selected = selected.copy()
    selected["Decision_Justification"] = selected.apply(
        lambda r: build_justification(r, total_rows, budget), axis=1
    )
    selected.insert(0, "Selection_Rank", range(1, len(selected) + 1))
    return selected


# ---------------------------------------------------------------------------
# 5. SENSITIVITY ANALYSIS
# ---------------------------------------------------------------------------

def sensitivity_analysis(df: pd.DataFrame, budget: float) -> str:
    """
    Run optimization at alpha = 0.1, 0.3, 0.5, 0.7, 0.9 and report
    how the number of selected pairs and dominant schemes shift.
    """
    lines = []
    lines.append(f"{'Alpha':>6} {'Beta':>5} {'Selected':>9} {'Budget Used':>14} {'Top Scheme':>30} {'Avg Score':>10}")
    lines.append("-" * 80)

    for alpha in [0.1, 0.3, 0.5, 0.7, 0.9]:
        scored  = compute_scores(df.copy(), alpha)
        sel     = greedy_select(scored, budget)
        if sel.empty:
            lines.append(f"{alpha:>6.1f} {1-alpha:>5.1f}  {'—':>9}  {'—':>14}  {'—':>30}  {'—':>10}")
            continue
        top_scheme  = sel["Scheme_Name"].value_counts().idxmax()
        budget_used = sel["Subsidy_Applied"].sum()
        avg_score   = sel["Composite_Score"].mean()
        lines.append(
            f"{alpha:>6.1f} {1-alpha:>5.1f} {len(sel):>9,} "
            f"₹{budget_used:>12,.0f}  {top_scheme:>30}  {avg_score:>10.4f}"
        )

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# 6. REPORTING
# ---------------------------------------------------------------------------

def build_report(selected: pd.DataFrame, df_all: pd.DataFrame,
                 alpha: float, budget: float, equal_dist: bool) -> str:
    beta = 1 - alpha
    lines = []
    add  = lines.append

    add("=" * 70)
    add("PHASE 4: BUDGET-CONSTRAINED OPTIMIZATION ENGINE REPORT")
    add("=" * 70)
    add("")

    # --- 1. Policy Config ---
    add("1. POLICY CONFIGURATION")
    add("-" * 40)
    add(f"  Total Budget               : ₹{budget:,.0f}")
    add(f"  Revenue Weight (alpha)     : {alpha:.2f}")
    add(f"  Employment Weight (beta)   : {beta:.2f}")
    add(f"  Distribution Mode          : {'Category Sub-budgets' if equal_dist else 'Global Greedy'}")
    add(f"  Input MSME-Scheme Pairs    : {len(df_all)}")
    add("")

    # --- 2. Optimization Summary ---
    if selected.empty:
        add("No pairs selected within budget. Try a larger budget or different alpha.")
        return "\n".join(lines)

    budget_used   = selected["Subsidy_Applied"].sum()
    budget_unused = budget - budget_used
    utilization   = budget_used / budget * 100

    add("2. OPTIMIZATION SUMMARY")
    add("-" * 40)
    add(f"  Pairs Selected             : {len(selected)}")
    add(f"  Unique MSMEs Funded        : {selected['MSME_ID'].nunique()}")
    add(f"  Budget Used                : ₹{budget_used:,.2f}")
    add(f"  Budget Unused              : ₹{budget_unused:,.2f}")
    add(f"  Budget Utilization         : {utilization:.2f}%")
    add("")

    # --- 3. Aggregate Before vs After ---
    add("3. AGGREGATE BEFORE vs AFTER PROJECTIONS")
    add("-" * 40)
    total_rev_before = selected["Before_Annual_Revenue"].sum()
    total_rev_after  = selected["Projected_Revenue"].sum()
    total_emp_before = selected["Before_Employees"].sum()
    total_emp_after  = selected["Projected_Employees"].sum()
    rev_lift         = (total_rev_after - total_rev_before) / total_rev_before * 100
    emp_lift         = (total_emp_after - total_emp_before) / total_emp_before * 100 if total_emp_before > 0 else 0

    add(f"  Total Revenue  BEFORE : ₹{total_rev_before:>20,.2f}")
    add(f"  Total Revenue  AFTER  : ₹{total_rev_after:>20,.2f}  (+{rev_lift:.2f}%)")
    add(f"  Total Employees BEFORE: {total_emp_before:>20,}")
    add(f"  Total Employees AFTER : {total_emp_after:>20,}  (+{emp_lift:.2f}%)")
    add(f"  Total New Jobs Created: {int(selected['New_Jobs_Added'].sum()):>20,}")
    add(f"  Total Subsidy Disbursed: ₹{selected['Subsidy_Applied'].sum():>19,.2f}")
    add("")

    # --- 4. Per-Scheme Breakdown ---
    add("4. PER-SCHEME SELECTION BREAKDOWN")
    add("-" * 40)
    scheme_summary = selected.groupby("Scheme_Name").agg(
        Times_Selected   = ("MSME_ID", "count"),
        Total_Subsidy    = ("Subsidy_Applied", "sum"),
        Total_Jobs       = ("New_Jobs_Added", "sum"),
        Avg_Score        = ("Composite_Score", "mean"),
    ).sort_values("Times_Selected", ascending=False)

    add(f"  {'Scheme':<40} {'Selected':>9} {'Subsidy':>16} {'Jobs':>6} {'Avg Score':>10}")
    add("  " + "-" * 85)
    for name, row in scheme_summary.iterrows():
        add(f"  {name:<40} {int(row['Times_Selected']):>9,} "
            f"₹{row['Total_Subsidy']:>14,.0f} {int(row['Total_Jobs']):>6,} {row['Avg_Score']:>10.4f}")
    add("")

    # --- 5. Top 10 Selections ---
    add("5. TOP 10 RANKED SELECTIONS (Best Efficiency)")
    add("-" * 70)
    hdr = (f"  {'Rank':>4} {'MSME_ID':<12} {'Scheme':<10} {'Score':>8} "
           f"{'Efficiency':>12} {'Subsidy':>14} {'Rev+%':>7} {'Emp+%':>7}")
    add(hdr)
    add("  " + "-" * 75)
    for _, r in selected.head(10).iterrows():
        add(
            f"  {int(r['Selection_Rank']):>4} {r['MSME_ID']:<12} {r['Scheme_ID']:<10} "
            f"{r['Composite_Score']:>8.4f} {r['Efficiency']:>12.8f} "
            f"₹{r['Subsidy_Applied']:>12,.0f} {r['Revenue_Increase_Pct']:>6.2f}% "
            f"{r['Employment_Increase_Pct']:>6.2f}%"
        )
    add("")

    # --- 6. Decision Justification Sample ---
    add("6. DECISION JUSTIFICATION (Top 3 Selections)")
    add("-" * 70)
    for _, r in selected.head(3).iterrows():
        add(f"  Rank #{int(r['Selection_Rank'])}: {r['MSME_ID']} → {r['Scheme_Name']}")
        add(f"    {r['Decision_Justification']}")
        add("")

    # --- 7. Sensitivity Analysis ---
    add("7. POLICY SENSITIVITY ANALYSIS (How alpha shifts selection)")
    add("-" * 70)
    add("  Varying alpha from 0.1 (employment-heavy) to 0.9 (revenue-heavy):")
    add("")
    add("  " + sensitivity_analysis(df_all, budget).replace("\n", "\n  "))
    add("")

    # --- 8. Budget Utilization ---
    add("8. BUDGET UTILIZATION ANALYSIS")
    add("-" * 40)
    add(f"  Total eligible pairs evaluated : {len(df_all)}")
    add(f"  Pairs funded                   : {len(selected)}")
    add(f"  Pairs not funded (budget limit): {len(df_all) - len(selected)}")
    add(f"  Cost of all eligible pairs     : ₹{df_all['Subsidy_Applied'].sum():,.2f}")
    add(f"  Budget coverage                : {budget / df_all['Subsidy_Applied'].sum() * 100:.1f}% of total demand")
    add("")

    add("=" * 70)
    add("END OF PHASE 4 REPORT")
    add("=" * 70)

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# 7. CLI ARGUMENT PARSING
# ---------------------------------------------------------------------------

def parse_args():
    parser = argparse.ArgumentParser(
        description="Phase 4: Budget-Constrained MSME Scheme Optimization Engine"
    )
    parser.add_argument(
        "--alpha", type=float, default=DEFAULT_ALPHA,
        help=f"Revenue weight (0.0–1.0). Employment weight = 1 - alpha. Default: {DEFAULT_ALPHA}"
    )
    parser.add_argument(
        "--budget", type=float, default=DEFAULT_BUDGET,
        help=f"Total government budget in rupees. Default: ₹{DEFAULT_BUDGET:,.0f}"
    )
    parser.add_argument(
        "--equal-distribution", action="store_true",
        help="Split budget as 40%% Micro / 35%% Small / 25%% Medium instead of global greedy."
    )
    parser.add_argument(
        "--output-prefix", type=str, default="",
        help="Optional prefix for output filenames."
    )
    parser.add_argument(
        "--json-out", action="store_true",
        help="Output results as JSON string to stdout (for API integration)."
    )
    return parser.parse_args()


# ---------------------------------------------------------------------------
# 8. MAIN
# ---------------------------------------------------------------------------

def main():
    args = parse_args()

    alpha      = max(0.0, min(1.0, args.alpha))   # clamp to [0, 1]
    beta       = round(1.0 - alpha, 4)
    budget     = args.budget
    equal_dist = args.equal_distribution
    prefix     = args.output_prefix

    # Mute standard print statements if json-out is active
    def log(msg="", end="\n"):
        if not args.json_out:
            print(msg, end=end)

    log("=" * 60)
    log("PHASE 4: Budget-Constrained Optimization Engine")
    log("=" * 60)
    log(f"  Budget    : ₹{budget:,.0f}")
    log(f"  Alpha     : {alpha}  (Revenue weight)")
    log(f"  Beta      : {beta}  (Employment weight)")
    log(f"  Mode      : {'Category Sub-budgets' if equal_dist else 'Global Greedy'}")
    log()

    # 1. Load Phase 3 data
    df = load_eligibility_data(json_mode=args.json_out)

    # 2. Score every pair
    df_scored = compute_scores(df, alpha)
    log(f"Composite scores computed. Avg score: {df_scored['Composite_Score'].mean():.4f}")
    log(f"Score range: {df_scored['Composite_Score'].min():.4f} – {df_scored['Composite_Score'].max():.4f}\n")

    # 3. Run optimization
    if equal_dist:
        selected = greedy_select_with_category_budgets(df_scored, budget)
    else:
        selected = greedy_select(df_scored, budget)

    if selected.empty:
        log("WARNING: No pairs could be selected within the given budget.")
        if args.json_out:
            print("{}")
        return

    log(f"Optimization complete: {len(selected)} pairs selected.")
    log(f"Budget used: ₹{selected['Subsidy_Applied'].sum():,.2f} / ₹{budget:,.0f} "
          f"({selected['Subsidy_Applied'].sum()/budget*100:.1f}%)\n")

    # 4. Add justifications and selection rank
    selected = add_justifications(selected, len(df_scored), budget)

    # 5. Select & reorder output columns
    output_cols = [
        "Selection_Rank", "MSME_ID", "Sector", "Category", "Location_Type",
        "Scheme_ID", "Scheme_Name",
        "Before_Annual_Revenue", "Before_Employees",
        "Subsidy_Applied", "New_Jobs_Added",
        "Projected_Revenue", "Projected_Employees",
        "Revenue_Increase_Pct", "Employment_Increase_Pct",
        "Norm_Rev_Score", "Norm_Emp_Score",
        "Composite_Score", "Efficiency",
        "Policy_Alpha", "Policy_Beta",
        "Efficiency_Rank", "Cumulative_Budget_Used", "Remaining_Budget",
        "Decision_Justification",
    ]
    # Only include columns that exist (equal-dist mode adds extras)
    output_cols = [c for c in output_cols if c in selected.columns]
    out_df = selected[output_cols]

    if args.json_out:
        import json
        
        # Determine unselected pairs correctly
        unselected = df_scored[~df_scored.index.isin(selected.index)].copy()
        
        # Calculate reason for not selecting
        # For simplicity, if not selected, they ran out of budget at their rank
        unselected = unselected.sort_values("Efficiency", ascending=False).reset_index(drop=True)
        unselected["Reason"] = f"Budget limits exhausted before Rank {len(selected) + 1} could be funded."
        
        # Select key columns for unselected
        un_cols = ["MSME_ID", "Scheme_Name", "Subsidy_Applied", "Composite_Score", "Efficiency", "Reason"]
        un_cols = [c for c in un_cols if c in unselected.columns]
        un_df = unselected[un_cols]

        response = {
            "budget": budget,
            "budget_used": float(selected['Subsidy_Applied'].sum()),
            "utilization_pct": float(selected['Subsidy_Applied'].sum() / budget * 100),
            "alpha": alpha,
            "beta": beta,
            "total_selected": len(selected),
            "total_jobs_created": float(selected['New_Jobs_Added'].sum()),
            "total_revenue_gain": float((selected['Projected_Revenue'] - selected['Before_Annual_Revenue']).sum()),
            "selected": json.loads(out_df.to_json(orient="records")),
            "unselected": json.loads(un_df.to_json(orient="records"))
        }
        print(json.dumps(response))
        return

    # 6. Save results CSV
    csv_path = f"{prefix}optimization_results.csv"
    out_df.to_csv(csv_path, index=False)
    print(f"Results saved to '{csv_path}'.")

    # 7. Build & save report
    report = build_report(selected, df_scored, alpha, budget, equal_dist)
    print()
    print(report)

    report_path = f"{prefix}phase4_evaluation.txt"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"\nEvaluation report saved to '{report_path}'.")

    # 8. Final summary
    log("\n" + "=" * 60)
    log("FINAL SUMMARY")
    log("=" * 60)
    log(f"  Pairs Selected    : {len(selected)}")
    log(f"  Unique MSMEs      : {selected['MSME_ID'].nunique()}")
    log(f"  Budget Used       : ₹{selected['Subsidy_Applied'].sum():,.2f}")
    log(f"  Revenue Gain      : ₹{(selected['Projected_Revenue'] - selected['Before_Annual_Revenue']).sum():,.2f}")
    log(f"  New Jobs Created  : {int(selected['New_Jobs_Added'].sum()):,}")
    log(f"  Avg Composite Score : {selected['Composite_Score'].mean():.4f}")
    log("=" * 60)


if __name__ == "__main__":
    main()
