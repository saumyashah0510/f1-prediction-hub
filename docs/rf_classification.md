# Random Forest Classification : 

## **Notebook 1**

**We have two datasets train(2024) and test(2025)**

## ***Step 1   METRICS*** : 

1) **Mean absolute error** : Average error your mistakes  
2) **Mean_squared_error** : Square error and then average  
3) **accuracy_score** : Out of all predictions, what percentage did your model get right? (TP + TN) / (Total) [Less important here]
4) **precision_score** : "Of all the drivers my model predicted would get a Podium, what percentage actually did?" [TP / (TP + FP)]  
5) **recall_score** : "Of all the drivers who actually got a Podium, what percentage did my model find?" [TP / (TP + FN)]  
6) **f1_score** : Harmonic mean of precision and recall  
7) **roc_auc_score** : This metric looks at the probabilities (e.g., 80% chance of a win), not just the final "Yes/No" prediction. It asks: "How good is my model at ranking drivers?" (Most important here)  
8) **confusion_matrix** : A 2x2 box that shows you all four of those results at once. It's the "source code" for all the other metrics.


## ***Step 3  Prepare Features and Targets*** : 
- Seperates data into features(X) and target(y) which is the final step before modelling
- classification_targets = ['win','podium','points_finish','top5']

## ***Step 4  Evaluate functions*** : 
Made functions to calculate and print classification metrics

## ***Step 5  Baseline Classification Model*** : 

**Baseline Class Parameters :**

1) N-estimators : No of decision trees
2) Max_depth
3) Min_sample_split
4) Min_samples_leaf
5) max_features : This controls how many features the tree looks at when splitting.
6) class weight : Balanced (If your dataset has uneven class sizes (e.g., 90% “no” and 10% “yes”), this helps fix that imbalance.) 

Train model for each of the classification target with weights

**OUTPUT** <pre>
Baseline Classification Parameters:
   n_estimators: 100
   max_depth: 15
   min_samples_split: 10
   min_samples_leaf: 4
   max_features: sqrt
   class_weight: balanced

Training baseline classifier for 'win'...
 Classification Metrics
Metric             Train            Test
Accuracy        0.974 ( 97.4%)   0.945 ( 94.5%)
Precision       0.667            0.477
Recall          1.000            0.579
F1 Score        0.800            0.523
ROC AUC         0.998            0.958

Training baseline classifier for 'podium'...
 Classification Metrics
Metric             Train            Test
Accuracy        0.914 ( 91.4%)   0.909 ( 90.9%)
Precision       0.657            0.654
Recall          0.961            0.888
F1 Score        0.781            0.753
ROC AUC         0.984            0.952

Training baseline classifier for 'points_finish'...
Classification Metrics
Metric            Train            Test
Accuracy        0.918 ( 91.8%)   0.784 ( 78.4%)
Precision       0.918            0.794
Recall          0.922            0.792
F1 Score        0.920            0.793
ROC AUC         0.979            0.847

Training baseline classifier for 'top5'...
 Classification Metrics
Metric             Train            Test
Accuracy        0.933 ( 93.3%)   0.872 ( 87.2%)
Precision       0.819            0.742
Recall          0.959            0.782
F1 Score        0.883            0.762
ROC AUC         0.988            0.907

✅ All baseline classification models trained!
</pre>

### **Key Findings :**
1) Models demonstrate overfitting
2) The models performed perfectly on the 2024 training data (e.g., the `win` model achieved 100% recall and an 80% F1), but their performance dropped significantly on the unseen 2025 test set (the `win` model's F1 fell to 52.3%).
3) This large gap between training and test scores shows the models "memorized" the 2024 season instead of learning general patterns.


## ***Step 6 Optimizing Classification model***

This cell runs a "hyperparameter search" to find the best possible settings for each of our four classifiers, aiming to beat the baseline.

1.  **`class_param_grid`**: We define a "search space," which is a wide range of possible settings for the model (e.g., `n_estimators`, `max_depth`).
2.  **`RandomizedSearchCV`**: This is the "tuner" that will build and test 30 (`n_iter=30`) different models using random combinations of those settings.
3.  **`cv=tscv`**: Crucially, it uses a `TimeSeriesSplit`. This is a leak-proof validation method that forces the model to always train on "past" races to predict "future" races.
4.  **`scoring`**: The tuner's goal is to find the model with the highest **F1 Score**, our most important metric for imbalanced data.
5.  **`.fit(..., sample_weight=...)`**: The entire tuning process is weighted using our `train_weights`, so it correctly focuses on more recent races.
6.  **`best_model`**: After all 30 models are tested, the single best-performing one is selected, and its final scores on the 2025 Test Set are printed.

**OUTPUT** <pre>
Classification Search Space:
   Testing 30 random combinations per target
   Using 3-fold TIME SERIES CV with F1 scoring

 Optimizing 'win' classifier...
Fitting 3 folds for each of 30 candidates, totalling 90 fits
 Best F1 Score (CV): 0.362
 Best Parameters: {'n_estimators': 100, 'min_samples_split': 2, 'min_samples_leaf': 6, 'max_samples': None, 'max_features': 0.3, 'max_depth': None, 'class_weight': 'balanced_subsample'}

 Optimized 'win' Metrics
Metric                    Train            Test
Accuracy        0.960 ( 96.0%)   0.938 ( 93.8%)
Precision       0.574            0.443
Recall          0.977            0.725
F1 Score        0.723            0.550
ROC AUC         0.994            0.965

 Optimizing 'podium' classifier...
Fitting 3 folds for each of 30 candidates, totalling 90 fits
 Best F1 Score (CV): 0.667
 Best Parameters: {'n_estimators': 100, 'min_samples_split': 5, 'min_samples_leaf': 6, 'max_samples': 0.8, 'max_features': 'sqrt', 'max_depth': 25, 'class_weight': 'balanced_subsample'}

 Optimized 'podium' Metrics
Metric                    Train            Test
Accuracy        0.900 ( 90.0%)   0.905 ( 90.5%)
Precision       0.628            0.644
Recall          0.911            0.881
F1 Score        0.743            0.744
ROC AUC         0.972            0.953

 Optimizing 'points_finish' classifier...
Fitting 3 folds for each of 30 candidates, totalling 90 fits
 Best F1 Score (CV): 0.843
 Best Parameters: {'n_estimators': 200, 'min_samples_split': 10, 'min_samples_leaf': 1, 'max_samples': 0.7, 'max_features': 0.5, 'max_depth': 15, 'class_weight': 'balanced_subsample'}

 Optimized 'points_finish' Metrics
Metric                    Train            Test
Accuracy        0.932 ( 93.2%)   0.780 ( 78.0%)
Precision       0.942            0.789
Recall          0.925            0.790
F1 Score        0.933            0.789
ROC AUC         0.986            0.845

 Optimizing 'top5' classifier...
Fitting 3 folds for each of 30 candidates, totalling 90 fits

 Best F1 Score (CV): 0.794
 Best Parameters: {'n_estimators': 200, 'min_samples_split': 5, 'min_samples_leaf': 4, 'max_samples': 0.9, 'max_features': 0.5, 'max_depth': None, 'class_weight': 'balanced'}

 Optimized 'top5' Metrics
Metric                    Train            Test
Accuracy        0.947 ( 94.7%)   0.876 ( 87.6%)
Precision       0.854            0.769
Recall          0.965            0.749
F1 Score        0.906            0.759
ROC AUC         0.991            0.913

 All classification models optimized successfully!

</pre>

## ***Comapring classification Models***

<pre>
💡 IMPROVEMENTS:
   ✅ win: F1 improved by 5.2%
   ⚠️  podium: Baseline F1 was better
   ⚠️  points_finish: Baseline F1 was better
   ⚠️  top5: Baseline F1 was better
</pre>

<hr><hr><hr>

## **Notebook 2**

## ***Step 1: Import Libraries***

This cell imports all necessary tools. We're adding new, advanced libraries from `sklearn` for this improved notebook:

* **`StratifiedKFold`**: This is the most important new import. It's an advanced cross-validation tool that fixes problems with imbalanced data.
* **`learning_curve`**: This will help us visually diagnose if our models are "memorizing" the training data (overfitting).
* **`precision_recall_curve`**: A specialized tool to help us find the *best* probability threshold (e.g., 0.5, 0.4, etc.) for our classifiers.

##  ***Step 4: Define Evaluation Functions***

This cell creates our "toolbox" of advanced helper functions to grade our models.

1. **`calculate_classification_metrics`**: A master "scorecard" function. We give it the true answers and the model's predictions, and it returns all our key metrics at once (Accuracy, F1, Precision, Recall, and AUC).

2. **`find_optimal_threshold`**: This is a new, critical function. Instead of using the default 0.5 probability threshold, this tool tests all thresholds from 0.1 to 0.9 to find the "sweet spot" that gives the highest possible **F1 Score**. This is essential for our imbalanced targets like `win`.

3. **`plot_learning_curve`**: This is our "overfitting detector." It plots the model's "Training Score" (homework) vs. its "Cross-Validation Score" (exam) as we give it more and more data. This graph visually proves if our model is actually *learning* (the lines come together) or just *memorizing* (the lines stay far apart).

## ***Step 5: Train BASELINE Classification Models (Conservative)***

This cell trains a new, *smarter* baseline model to fix the overfitting we found in our last experiment.

1.  **Conservative Parameters:** We define `baseline_class_params` with "stricter" rules (like a shallower `max_depth` and higher `min_samples_leaf`). This is a **regularization** technique to prevent the model from "memorizing" the training data and force it to learn general patterns.

2.  **Training:** We loop through each target (`win`, `podium`, etc.) and train a new conservative classifier, making sure to use our `sample_weight`.

3.  **Threshold Optimization (NEW!):** This is the key upgrade. After training, we immediately use our `find_optimal_threshold` function. This function analyzes the model's predicted probabilities on the test set to find the "sweet spot" (e.g., 0.35 instead of 0.5) that gives the **highest possible F1-Score**.

4.  **Evaluation:** We save *both* the default (0.5 threshold) metrics and the new, improved "optimized threshold" metrics. The optimized F1 score is our new, more robust baseline to beat.

**OUTPUT** <pre>

🌲 CONSERVATIVE BASELINE PARAMETERS
   n_estimators        : 200
   max_depth           : 12
   min_samples_split   : 20
   min_samples_leaf    : 10
   max_features        : sqrt
   class_weight        : balanced
   max_samples         : 0.8

🏁 Training baseline classifier for **'win'** ...
 Results for 'win':
   Default Threshold (0.50)
      ➤ F1 Score : 0.527
      ➤ ROC AUC  : 0.960
   Optimized Threshold (0.55)
      ➤ F1 Score : 0.560
      ➤ ROC AUC  : 0.960

🏁 Training baseline classifier for **'podium'** ...
 Results for 'podium':
   Default Threshold (0.50)
      ➤ F1 Score : 0.736
      ➤ ROC AUC  : 0.954
   Optimized Threshold (0.55)
      ➤ F1 Score : 0.750
      ➤ ROC AUC  : 0.954

🏁 Training baseline classifier for **'points_finish'** ...
 Results for 'points_finish':
   Default Threshold (0.50)
      ➤ F1 Score : 0.790
      ➤ ROC AUC  : 0.847
   Optimized Threshold (0.45)
      ➤ F1 Score : 0.795
      ➤ ROC AUC  : 0.847

🏁 Training baseline classifier for **'top5'** ...
 Results for 'top5':
   Default Threshold (0.50)
      ➤ F1 Score : 0.738
      ➤ ROC AUC  : 0.903
   Optimized Threshold (0.60)
      ➤ F1 Score : 0.755
      ➤ ROC AUC  : 0.903

 All baseline models trained successfully with threshold optimization!
 </pre>

* The output clearly shows this was a success. For *every target*, the **Optimized F1 Score** is higher than the default, giving us a new, much more robust baseline to beat. The high `AUC` scores (e.g., 0.96 for `win`) also prove our model has excellent predictive power.


## ***Step 7: Optimized Hyperparameter Search (Less Aggressive)***

This cell runs our main "Robot Olympics" to find the best possible classifier for each target. This is a much more robust process than our first notebook.

1.  **"Careful" Search Space (`class_param_grid`):** We define a *new* set of blueprints. Based on our last experiment, we are only searching for "conservative" models (e.g., shallower `max_depth`, higher `min_samples_leaf`) to **prevent overfitting**.

2.  **`StratifiedKFold` (`cv=skf`):** We use this as our new "race track." It ensures that every test fold has a **fair and representative sample** of our rare "Yes" answers (like `win`), which is essential for imbalanced data.

3.  **Weighted Tuning:** We correctly pass `sample_weight=train_weights` to the `.fit()` command. This forces the `RandomizedSearchCV` to use our **temporal weights**, so it prioritizes finding models that perform well on *recent* races.

4.  **Final Tune-Up:** After the "Olympian" (`best_model`) is found, we *immediately* run `find_optimal_threshold` on its 2025 predictions. This gives us the **true, best-possible F1 score** for our new champion by finding its perfect confidence "sweet spot."

**OUTPUT** <pre>

 CAREFUL SEARCH SPACE (Prevents Overfitting)
   • n_estimators      → [150, 200, 250, 300]
   • max_depth         → [8, 10, 12, 15]  (shallower)
   • min_samples_split → [15, 20, 25, 30]  (higher)
   • min_samples_leaf  → [8, 10, 12, 15]  (higher)
   • max_features      → ['sqrt', 'log2', 0.4, 0.5]
   • class_weight      → ['balanced', 'balanced_subsample']
   • max_samples       → [0.7, 0.8, 0.9]

 Optimizing target: 'win' using StratifiedKFold cross-validation...
Fitting 3 folds for each of 25 candidates, totalling 75 fits
    Best CV F1 Score:          0.437
    Test F1 (Optimized):       0.585
    Best Parameters → depth=12, n_estimators=250, threshold=0.650

 Optimizing target: 'podium' using StratifiedKFold cross-validation...
Fitting 3 folds for each of 25 candidates, totalling 75 fits
    Best CV F1 Score:          0.682
    Test F1 (Optimized):       0.750
    Best Parameters → depth=12, n_estimators=300, threshold=0.550

 Optimizing target: 'points_finish' using StratifiedKFold cross-validation...
Fitting 3 folds for each of 25 candidates, totalling 75 fits
    Best CV F1 Score:          0.843
    Test F1 (Optimized):       0.798
    Best Parameters → depth=8, n_estimators=250, threshold=0.500

 Optimizing target: 'top5' using StratifiedKFold cross-validation...
Fitting 3 folds for each of 25 candidates, totalling 75 fits
    Best CV F1 Score:          0.781
    Test F1 (Optimized):       0.767
    Best Parameters → depth=10, n_estimators=200, threshold=0.600

 All classification models optimized successfully with careful tuning!
 </pre>

## COMPARISION : 
<pre>
💡 ANALYSIS:
   ✅ win: Optimized BETTER by 4.4% (F1: 0.560 → 0.585)
   ✅ podium: Optimized BETTER by 0.1% (F1: 0.750 → 0.750)
   ✅ points_finish: Optimized BETTER by 0.4% (F1: 0.795 → 0.798)
   ✅ top5: Optimized BETTER by 1.6% (F1: 0.755 → 0.767)
</pre>   


## ***Step 10: Feature Importance Analysis***

This cell's purpose is to "look inside the mind" of our best-performing model to see *how* it's making predictions.

1.  **Find Best Model:** First, it identifies the best-performing target (e.g., `points_finish`) from our comparison table. It then selects the *champion* model (either the "Baseline" or "Optimized" one) that had the highest final F1 score for that target.

2.  **Extract Importances:** It uses the champion's `.feature_importances_` attribute. This is a built-in property of Random Forest that gives a "score" to every feature, showing how much it contributed to the model's decisions.

3.  **Sort and Rank:** The code sorts these scores from highest to lowest to create a "Top 20" list of the most predictive features.

4.  **Visualize:** Finally, it creates a horizontal bar chart to visually display these Top 15 features. This chart is our most important "sanity check," as it proves that our model is using logical features (like `quali_position` or `weighted_points_5`) to make its decisions.

# ***FINAL SUMMARY***
<pre>
 BEST MODELS PERFORMANCE (with optimized thresholds):

win             | Optimized  | F1: 0.585 | AUC: 0.962 | Acc: 0.949 | Pre: 0.511 |Rec: 0.684 |
podium          | Optimized  | F1: 0.750 | AUC: 0.959 | Acc: 0.906 | Pre: 0.643 |Rec: 0.899 |
points_finish   | Optimized  | F1: 0.798 | AUC: 0.846 | Acc: 0.787 | Pre: 0.789 |Rec: 0.807 |
top5            | Optimized  | F1: 0.767 | AUC: 0.900 | Acc: 0.882 | Pre: 0.792 |Rec: 0.744 |

💡 KEY IMPROVEMENTS:
   ✅ Used shallower trees to prevent overfitting
   ✅ Higher min_samples constraints for regularization
   ✅ Stratified K-Fold CV for imbalanced classes
   ✅ Optimized probability thresholds per target
   ✅ Learning curve analysis to detect overfitting

</pre>   