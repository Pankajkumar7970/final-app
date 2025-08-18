import API from "./api"; // ✅ This is your axios client with token handling

class ApiService {
  // Calculate savings based on income and expenses
  async calculateSavings(income, expenses, goal) {
    const res = await API.post("/calculate-savings", {
      income,
      expenses,
      goal,
    });
    return res.data;
  }

  // Calculate investment projections
  async calculateInvestments(savingsPerMonth, goal, customRates = null) {
    const res = await API.post("/calculate-investments", {
      savingsPerMonth,
      goal,
      customRates,
    });
    return res.data;
  }

  // Get improvement tips
  async getImprovementTips(expenses, income, savingsGoal) {
    const res = await API.post("/improvement-tips", {
      expenses,
      income,
      savingsGoal,
    });
    return res.data;
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(
    income,
    expenses,
    savingsPerMonth,
    goal,
    goalTimeframeYears
  ) {
    const res = await API.post("/personalized-recommendations", {
      income,
      expenses,
      savingsPerMonth,
      goal,
      goalTimeframeYears,
    });
    return res.data;
  }

  // Get financial health score
  async getFinancialHealthScore(
    income,
    expenses,
    savingsPerMonth,
    goal,
    currentSavings
  ) {
    const res = await API.post("/financial-health-score", {
      income,
      expenses,
      savingsPerMonth,
      goal,
      currentSavings,
    });
    return res.data;
  }

  // Get wealth gap analysis
  async getWealthGapAnalysis(age, annualIncome, currentSavings) {
    const res = await API.post("/wealth-gap", {
      age,
      annualIncome,
      currentSavings,
    });
    return res.data;
  }

  // Get FIRE (Financial Independence, Retire Early) calculation
  async calculateFIRE(
    monthlyExpenses,
    currentSavings,
    monthlyIncome,
    investmentGrowthRate = 7
  ) {
    const res = await API.post("/fire-calculator", {
      monthlyExpenses,
      currentSavings,
      monthlyIncome,
      investmentGrowthRate,
    });
    return res.data;
  }

  // Get learning content
  async getLearningContent() {
    const res = await API.get("/learn");
    return res.data;
  }

  // Get investment options
  async getInvestmentOptions() {
    const res = await API.get("/investment-options");
    return res.data;
  }

  // Health check
  async healthCheck() {
    const res = await API.get("/health");
    return res.data;
  }
}

export default new ApiService();
