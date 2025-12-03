export const EDA_IMAGES = [
  { id: 1, title: "Feature Importance", src: "/images/eda/01_overview.png", description: "Top factors influencing race outcomes based on historical data." },
  { id: 2, title: "Correlation Heatmap", src: "/images/eda/02_correlation.png", description: "Analyzing feature relationships to identify multicollinearity." },
  { id: 3, title: "DNF Analysis", src: "/images/eda/03_dnf_analysis.png", description: "Breakdown of mechanical failures vs. accidents by circuit." },
  { id: 4, title: "Age vs Performance", src: "/images/eda/04_age_performance.png", description: "Impact of driver age on average finishing position." },
  { id: 5, title: "Season Comparison", src: "/images/eda/05_season_comparison.png", description: "Evolution of lap times and average speeds across eras." },
];

export const MODELS = [
  {
    id: "xgboost-reg",
    name: "XGBoost Regressor",
    type: "Regression",
    target: "Finishing Position (1-20)",
    description: "Our primary model for predicting the exact finishing order. It minimizes the Mean Absolute Error (MAE) to get as close to the real result as possible.",
    metrics: {
      mae: 2.989,
      rmse: 4.215,
      r2: 0.46,
      accuracy_2pos: "49.1%"
    },
    params: {
      n_estimators: 1000,
      learning_rate: 0.05,
      max_depth: 8,
      objective: "reg:absoluteerror"
    },
    top_features: [
      "Qualifying Position",
      "Gap to Pole (Q3)",
      "Recent Form (Last 5 Races)",
      "Grid Position"
    ]
  },
  {
    id: "lgbm-class",
    name: "LightGBM Classifier",
    type: "Classification",
    target: "Probabilities (Win, Podium, Top 10)",
    description: "Specialized in binary outcomes. We use this to calculate the percentage chance of a driver achieving specific milestones.",
    metrics: {
      f1_podium: 0.794,
      f1_points: 0.796,
      f1_win: 0.615,
      auc_podium: 0.956
    },
    params: {
      n_estimators: 1000,
      learning_rate: 0.05,
      num_leaves: 31,
      objective: "binary"
    },
    top_features: [
      "Avg Quali Position (Last 5)",
      "Points to Leader",
      "Teammate Battle Rate",
      "Circuit Experience"
    ]
  }
];