import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, f1_score

# Set random seed for reproducibility
np.random.seed(42)

def main():
    print("Starting Phase 2: Growth Prediction Model Training...")
    
    # 1. Load Data
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'msme_data.csv')
    
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return
    
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} records.")

    # 2. Define Features and Target
    categorical_features = ['Sector', 'Ownership_Type', 'Category', 'Location_Type']
    numerical_features = [
        'Years_of_Operation', 'Annual_Revenue', 'Revenue_Growth_Rate', 'Profit_Margin', 
        'Debt_Outstanding', 'Loan_to_Revenue_Ratio', 'Number_of_Employees', 
        'Capacity_Utilization', 'Export Percentage', 'Technology_Level', 
        'GST_Compliance_Score', 'Inspection_Score', 'Documentation_Readiness_Score'
    ]
    target = 'Growth_Category'

    X = df[categorical_features + numerical_features]
    y = df[target]

    # Label Encode Target (Low=0, Moderate=1, High=2)
    # We want to ensure specific ordering for the Growth Score calculation
    # Mapping Low -> 0, Moderate -> 1, High -> 2
    le = LabelEncoder()
    # Explicitly fit on categories to ensure order
    le.classes_ = np.array(['Low', 'Moderate', 'High'])
    y_encoded = le.transform(y)

    # 3. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    # 4. Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    # 5. Model Training (Random Forest)
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ])

    # Hyperparameter Tuning
    param_grid = {
        'classifier__n_estimators': [100, 200],
        'classifier__max_depth': [10, 20, None],
        'classifier__min_samples_split': [2, 5]
    }

    print("Running GridSearchCV for hyperparameter tuning...")
    grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='f1_macro', n_jobs=-1)
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    print(f"Best parameters: {grid_search.best_params_}")

    # 6. Evaluation
    y_pred = best_model.predict(X_test)
    report = classification_report(le.inverse_transform(y_test), le.inverse_transform(y_pred))
    conf_matrix = confusion_matrix(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average='macro')

    print("\nEvaluation Report:")
    print(report)
    print("\nMacro F1-Score:", f1)

    report_path = os.path.join(base_dir, 'reports', 'phase2_evaluation.txt')
    with open(report_path, 'w') as f:
        f.write("Phase 2: Growth Prediction Model Evaluation\n")
        f.write("===========================================\n\n")
        f.write(f"Best Parameters: {grid_search.best_params_}\n\n")
        f.write("Classification Report:\n")
        f.write(report)
        f.write("\n\nConfusion Matrix:\n")
        f.write(np.array2string(conf_matrix))
        f.write(f"\n\nMacro F1-Score: {f1:.4f}\n")

    # 7. Growth Score Calculation (0-100)
    # Mapping probabilities: proba[:,0]*0 + proba[:,1]*50 + proba[:,2]*100
    all_probas = best_model.predict_proba(X)
    df['Growth_Score'] = (all_probas[:, 0] * 0) + (all_probas[:, 1] * 50) + (all_probas[:, 2] * 100)
    
    # Add Predicted Category for reference
    all_preds_encoded = best_model.predict(X)
    df['Predicted_Growth_Category'] = le.inverse_transform(all_preds_encoded)

    predictions_path = os.path.join(base_dir, 'data', 'msme_predictions.csv')
    df.to_csv(predictions_path, index=False)
    print(f"Predictions and Growth Scores saved to '{predictions_path}'")

    # 8. Feature Importance
    # Accessing feature names after OneHotEncoding
    ohe_categories = best_model.named_steps['preprocessor'].named_transformers_['cat'].get_feature_names_out(categorical_features)
    feature_names = numerical_features + list(ohe_categories)
    importances = best_model.named_steps['classifier'].feature_importances_
    
    feat_imp = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
    feat_imp = feat_imp.sort_values(by='Importance', ascending=False)
    
    print("\nTop 10 Feature Importances:")
    print(feat_imp.head(10))
    
    with open(report_path, 'a') as f:
        f.write("\n\nTop 10 Feature Importances:\n")
        f.write(feat_imp.head(10).to_string())

    # 9. SHAP Explainability (Optional / Fallback)
    try:
        import shap
        print("\nGenerating SHAP explainer...")
        # SHAP works best on the model itself, we need to transform X_test first
        X_test_transformed = best_model.named_steps['preprocessor'].transform(X_test)
        explainer = shap.TreeExplainer(best_model.named_steps['classifier'])
        # Store explainer for later use in advisory interface
        explainer_path = os.path.join(base_dir, 'model_artifacts', 'shap_explainer.pkl')
        with open(explainer_path, 'wb') as f:
            pickle.dump(explainer, f)
        print(f"SHAP explainer saved to {explainer_path}")
    except ImportError:
        print("\nWarning: 'shap' library not found. Skipping SHAP artifact generation.")

    # 10. Save Artifacts
    artifacts_dir = os.path.join(base_dir, 'model_artifacts')
    if not os.path.exists(artifacts_dir):
        os.makedirs(artifacts_dir)

    with open(os.path.join(artifacts_dir, 'growth_model.pkl'), 'wb') as f:
        pickle.dump(best_model, f)
    
    with open(os.path.join(artifacts_dir, 'label_encoder.pkl'), 'wb') as f:
        pickle.dump(le, f)
        
    with open(os.path.join(artifacts_dir, 'feature_names.pkl'), 'wb') as f:
        pickle.dump(feature_names, f)

    print(f"\nModel artifacts saved in '{artifacts_dir}/'")

if __name__ == "__main__":
    main()
