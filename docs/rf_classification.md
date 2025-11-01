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

## Step 1: Import Libraries

This cell imports all necessary tools. We're adding new, advanced libraries from `sklearn` for this improved notebook:

* **`StratifiedKFold`**: This is the most important new import. It's an advanced cross-validation tool that fixes problems with imbalanced data.
* **`learning_curve`**: This will help us visually diagnose if our models are "memorizing" the training data (overfitting).
* **`precision_recall_curve`**: A specialized tool to help us find the *best* probability threshold (e.g., 0.5, 0.4, etc.) for our classifiers.