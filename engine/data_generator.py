import pandas as pd
import numpy as np
import os

# Set seed for reproducibility
np.random.seed(42)

def generate_msme_data(n=300):
    sectors = ['Manufacturing', 'IT Services', 'Food Processing', 'Textiles', 'Retail']
    ownership_types = ['Sole Proprietorship', 'Partnership', 'Private Limited']
    categories = ['Micro', 'Small', 'Medium']
    location_types = ['Urban', 'Rural', 'Semi-Urban']
    
    data_list = []
    for i in range(1, n + 1):
        msme_id = f"MSME_{i:04d}"
        sector = np.random.choice(sectors)
        years_of_op = np.random.randint(1, 26)
        ownership = np.random.choice(ownership_types)
        category = np.random.choice(categories)
        location = np.random.choice(location_types)
        
        # Financials
        annual_revenue = np.random.uniform(500000, 50000000)
        rev_growth_rate = np.random.uniform(-0.05, 0.30)
        profit_margin = np.random.uniform(0.02, 0.25)
        debt = annual_revenue * np.random.uniform(0.1, 0.5)
        loan_to_rev = debt / annual_revenue
        
        # Operations
        num_employees = np.random.randint(2, 50) if category == 'Micro' else np.random.randint(20, 150)
        cap_utilization = np.random.uniform(40, 95)
        # Export Percentage - Note: Schema specifically uses a space here
        export_pct = np.random.uniform(0, 60) if sector in ['Manufacturing', 'Textiles'] else 0
        tech_level = np.random.randint(1, 6)
        
        # Compliance
        gst_score = np.random.uniform(60, 100) if years_of_op > 5 else np.random.uniform(40, 90)
        inspection_score = np.random.uniform(50, 100)
        doc_readiness = np.random.uniform(50, 100)
            
        data_list.append([
            msme_id, sector, years_of_op, ownership, category, location,
            annual_revenue, rev_growth_rate, profit_margin, debt, loan_to_rev,
            num_employees, cap_utilization, export_pct, tech_level,
            gst_score, inspection_score, doc_readiness
        ])
        
    # Column names matching the "Mandatory Dataset Structure" EXACTLY
    columns = [
        'MSME_ID', 'Sector', 'Years_of_Operation', 'Ownership_Type', 'Category', 'Location_Type',
        'Annual_Revenue', 'Revenue_Growth_Rate', 'Profit_Margin', 'Debt_Outstanding', 'Loan_to_Revenue_Ratio',
        'Number_of_Employees', 'Capacity_Utilization', 'Export Percentage', 'Technology_Level',
        'GST_Compliance_Score', 'Inspection_Score', 'Documentation_Readiness_Score'
    ]
    
    df = pd.DataFrame(data_list, columns=columns)
    
    # Composite score for balanced labeling
    norm_rev_growth = (df['Revenue_Growth_Rate'] - df['Revenue_Growth_Rate'].min()) / (df['Revenue_Growth_Rate'].max() - df['Revenue_Growth_Rate'].min())
    norm_tech = (df['Technology_Level'] - df['Technology_Level'].min()) / (df['Technology_Level'].max() - df['Technology_Level'].min())
    norm_compliance = (df['GST_Compliance_Score'] - df['GST_Compliance_Score'].min()) / (df['GST_Compliance_Score'].max() - df['GST_Compliance_Score'].min())
    
    df['Internal_Score'] = (norm_rev_growth * 0.5) + (norm_tech * 0.3) + (norm_compliance * 0.2)
    
    # Target variable name matching the schema
    df['Growth_Category'] = pd.qcut(df['Internal_Score'], q=3, labels=['Low', 'Moderate', 'High'])
    
    return df.drop(columns=['Internal_Score'])

def generate_scheme_data():
    # Headers matching the schema labels exactly
    schemes = [
        {
            'Scheme_ID': 'SCH_001',
            'Scheme_Name': 'Digital MSME Transformation Grant',
            'Eligible_Sectors': 'IT Services, Manufacturing',
            'Max_Subsidy_Amount': 500000,
            'Target_Category': 'Micro, Small',
            'Location_Criteria': 'All',
            'Impact_Factor_Revenue': 0.15,
            'Impact_Factor_Employment': 2
        },
        {
            'Scheme_ID': 'SCH_002',
            'Scheme_Name': 'Green Tech Subsidy',
            'Eligible_Sectors': 'Manufacturing, Textiles',
            'Max_Subsidy_Amount': 1000000,
            'Target_Category': 'Small, Medium',
            'Location_Criteria': 'Urban, Semi-Urban',
            'Impact_Factor_Revenue': 0.10,
            'Impact_Factor_Employment': 5
        },
        {
            'Scheme_ID': 'SCH_003',
            'Scheme_Name': 'Rural Employment Boost',
            'Eligible_Sectors': 'Food Processing, Textiles',
            'Max_Subsidy_Amount': 300000,
            'Target_Category': 'Micro',
            'Location_Criteria': 'Rural',
            'Impact_Factor_Revenue': 0.05,
            'Impact_Factor_Employment': 8
        },
        {
            'Scheme_ID': 'SCH_004',
            'Scheme_Name': 'Export Excellence Incentive',
            'Eligible_Sectors': 'Manufacturing, Textiles, Food Processing',
            'Max_Subsidy_Amount': 2000000,
            'Target_Category': 'Medium',
            'Location_Criteria': 'All',
            'Impact_Factor_Revenue': 0.25,
            'Impact_Factor_Employment': 4
        },
        {
            'Scheme_ID': 'SCH_005',
            'Scheme_Name': 'New Enterprise Support',
            'Eligible_Sectors': 'All',
            'Max_Subsidy_Amount': 200000,
            'Target_Category': 'Micro',
            'Location_Criteria': 'All',
            'Impact_Factor_Revenue': 0.20,
            'Impact_Factor_Employment': 3
        }
    ]
    return pd.DataFrame(schemes)

if __name__ == "__main__":
    # Ensure the data directory exists
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    msme_df = generate_msme_data(350)
    msme_df.to_csv(os.path.join(data_dir, 'msme_data.csv'), index=False)
    
    scheme_df = generate_scheme_data()
    scheme_df.to_csv(os.path.join(data_dir, 'schemes_data.csv'), index=False)
    
    print("Phase 1 Data Validation Summary:")
    print(f"- MSME Records: {len(msme_df)}")
    print(f"- Scheme Records: {len(scheme_df)}")
    print("- MSME Headers matched exactly (including 'Export Percentage' space)")
    print("- Growth_Category distribution:")
    print(msme_df['Growth_Category'].value_counts())
