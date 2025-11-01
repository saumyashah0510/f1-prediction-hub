# Random Forest Classification : 

## **Notebook 1**

**We have two datasets train(2024) and test(2025)**

## ***Step 1   METRICS*** : 

1) **Mean absolute error** : Average error your mistakes  
2) **Mean_squared_error** : Square error and then average  
3) **accuracy_score** : Out of all predictions, what percentage did your model get right? (TP + TN) / (Total) [Less important here]  
4) **r2_score** : A score from 0 to 1 that answers: "Does my model actually work?" If r2 = 1 perfect model  
5) **precision_score** : "Of all the drivers my model predicted would get a Podium, what percentage actually did?" [TP / (TP + FP)]  
6) **recall_score** : "Of all the drivers who actually got a Podium, what percentage did my model find?" [TP / (TP + FN)]  
7) **f1_score** : Harmonic mean of precision and recall  
8) **roc_auc_score** : This metric looks at the probabilities (e.g., 80% chance of a win), not just the final "Yes/No" prediction. It asks: "How good is my model at ranking drivers?" (Most important here)  

9) **confusion_matrix** : A 2x2 box that shows you all four of those results at once. It's the "source code" for all the other metrics.


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

================================================================================
 Classification Metrics
================================================================================
Metric                    Train            Test
--------------------------------------------------------------------------------
Accuracy        0.974 ( 97.4%)   0.945 ( 94.5%)
Precision       0.667            0.477
Recall          1.000            0.579
F1 Score        0.800            0.523
ROC AUC         0.998            0.958
================================================================================
======================================================================

  Training baseline classifier for 'podium'...

================================================================================
 Classification Metrics
================================================================================
Metric                    Train            Test
--------------------------------------------------------------------------------
Accuracy        0.914 ( 91.4%)   0.909 ( 90.9%)
Precision       0.657            0.654
Recall          0.961            0.888
F1 Score        0.781            0.753
ROC AUC         0.984            0.952
================================================================================
======================================================================

  Training baseline classifier for 'points_finish'...

================================================================================
 Classification Metrics
================================================================================
Metric                    Train            Test
--------------------------------------------------------------------------------
Accuracy        0.918 ( 91.8%)   0.784 ( 78.4%)
Precision       0.918            0.794
Recall          0.922            0.792
F1 Score        0.920            0.793
ROC AUC         0.979            0.847
================================================================================
======================================================================

  Training baseline classifier for 'top5'...

================================================================================
 Classification Metrics
================================================================================
Metric                    Train            Test
--------------------------------------------------------------------------------
Accuracy        0.933 ( 93.3%)   0.872 ( 87.2%)
Precision       0.819            0.742
Recall          0.959            0.782
F1 Score        0.883            0.762
ROC AUC         0.988            0.907
================================================================================
======================================================================

✅ All baseline classification models trained!
</pre>