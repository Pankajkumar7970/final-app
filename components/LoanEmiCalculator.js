import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import {
  Calculator,
  CreditCard,
  DollarSign,
  Calendar,
  Percent,
} from "lucide-react-native";
import { PSBColors } from "../utils/PSBColors";
import TranslatedText from "./TranslatedText";

const screenWidth = Dimensions.get("window").width;

const LoanEmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({
    loanAmount: "",
    annualRate: "",
    tenure: "",
  });

  const validateInputs = () => {
    const newErrors = { loanAmount: "", annualRate: "", tenure: "" };
    let isValid = true;

    const loanAmountNum = parseFloat(loanAmount);
    const annualRateNum = parseFloat(annualRate);
    const tenureNum = parseFloat(tenure);

    if (!loanAmount || loanAmountNum <= 0) {
      newErrors.loanAmount = "Loan amount must be greater than 0";
      isValid = false;
    }

    if (!annualRate || annualRateNum < 0) {
      newErrors.annualRate = "Interest rate must be 0 or greater";
      isValid = false;
    }

    if (!tenure || tenureNum <= 0 || !Number.isInteger(tenureNum)) {
      newErrors.tenure = "Tenure must be a positive whole number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculate = () => {
    if (!validateInputs()) return;

    const P = parseFloat(loanAmount);
    const R = parseFloat(annualRate);
    const N = parseInt(tenure);

    let emi;
    let totalPayment;
    let totalInterest;

    if (R === 0) {
      emi = P / N;
      totalPayment = P;
      totalInterest = 0;
    } else {
      const r = R / (12 * 100);
      const numerator = P * r * Math.pow(1 + r, N);
      const denominator = Math.pow(1 + r, N) - 1;
      emi = numerator / denominator;
      totalPayment = emi * N;
      totalInterest = totalPayment - P;
    }

    setResult({
      emi,
      totalPayment,
      totalInterest,
    });
  };

  const reset = () => {
    setLoanAmount("");
    setAnnualRate("");
    setTenure("");
    setResult(null);
    setErrors({ loanAmount: "", annualRate: "", tenure: "" });
  };

  const isFormValid =
    loanAmount &&
    annualRate &&
    tenure &&
    parseFloat(loanAmount) > 0 &&
    parseFloat(annualRate) >= 0 &&
    parseFloat(tenure) > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <CreditCard size={32} color={PSBColors.primary.darkGreen} />
          <TranslatedText style={styles.title}>
            Loan EMI Calculator
          </TranslatedText>
        </View>
        <TranslatedText style={styles.subtitle}>
          Calculate monthly EMI and visualize principal vs interest breakdown
        </TranslatedText>
      </View>

      <View style={styles.content}>
        {/* Input Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {/* <DollarSign size={20} color="#0066cc" /> */}
            <TranslatedText style={styles.cardTitle}>
              Enter Loan Details
            </TranslatedText>
          </View>

          <View style={styles.inputContainer}>
            <TranslatedText style={styles.label}>
              Loan Amount (₹)
            </TranslatedText>
            <TextInput
              style={[styles.input, errors.loanAmount && styles.inputError]}
              placeholder="Enter loan amount"
              value={loanAmount}
              onChangeText={setLoanAmount}
              keyboardType="numeric"
            />
            {errors.loanAmount ? (
              <TranslatedText style={styles.errorText}>
                {errors.loanAmount}
              </TranslatedText>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Percent size={16} color="#666666" />
              <TranslatedText style={styles.label}>
                Annual Interest Rate (%)
              </TranslatedText>
            </View>
            <TextInput
              style={[styles.input, errors.annualRate && styles.inputError]}
              placeholder="Enter annual interest rate"
              value={annualRate}
              onChangeText={setAnnualRate}
              keyboardType="numeric"
            />
            {errors.annualRate ? (
              <TranslatedText style={styles.errorText}>
                {errors.annualRate}
              </TranslatedText>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Calendar size={16} color="#666666" />
              <TranslatedText style={styles.label}>
                Loan Tenure (Months)
              </TranslatedText>
            </View>
            <TextInput
              style={[styles.input, errors.tenure && styles.inputError]}
              placeholder="Enter tenure in months"
              value={tenure}
              onChangeText={setTenure}
              keyboardType="numeric"
            />
            {errors.tenure ? (
              <TranslatedText style={styles.errorText}>
                {errors.tenure}
              </TranslatedText>
            ) : null}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.calculateButton,
                !isFormValid && styles.disabledButton,
              ]}
              onPress={calculate}
              disabled={!isFormValid}
            >
              <Calculator size={16} color="#ffffff" />
              <TranslatedText style={styles.calculateButtonText}>
                Calculate EMI
              </TranslatedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <TranslatedText style={styles.resetButtonText}>
                Reset
              </TranslatedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Section */}
        {result && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <CreditCard size={20} color="#10b981" />
              <TranslatedText style={styles.cardTitle}>
                EMI Calculation Results
              </TranslatedText>
            </View>
            <View style={styles.resultContainer}>
              <View style={[styles.resultItem, styles.emiItem]}>
                <TranslatedText style={styles.resultLabel}>
                  Monthly EMI
                </TranslatedText>
                <TranslatedText style={[styles.resultValue, styles.emiValue]}>
                  {formatCurrency(result.emi)}
                </TranslatedText>
              </View>
              <View style={styles.resultItem}>
                <TranslatedText style={styles.resultLabel}>
                  Total Payment
                </TranslatedText>
                <TranslatedText style={styles.resultValue}>
                  {formatCurrency(result.totalPayment)}
                </TranslatedText>
              </View>
              <View style={[styles.resultItem, styles.interestItem]}>
                <TranslatedText style={styles.resultLabel}>
                  Total Interest
                </TranslatedText>
                <TranslatedText
                  style={[styles.resultValue, styles.interestValue]}
                >
                  {formatCurrency(result.totalInterest)}
                </TranslatedText>
              </View>
              <View style={styles.detailsContainer}>
                <TranslatedText style={styles.detailText}>
                  Principal: {formatCurrency(parseFloat(loanAmount))}
                </TranslatedText>
                <TranslatedText style={styles.detailText}>
                  Interest Rate: {annualRate}% per annum
                </TranslatedText>
                <TranslatedText style={styles.detailText}>
                  Tenure: {tenure} months
                </TranslatedText>
              </View>
            </View>

            {/* Horizontal Bar Chart for Principal vs Interest */}
            <View style={styles.chartCard}>
              <TranslatedText style={styles.chartTitle}>
                Principal vs Interest
              </TranslatedText>
              <View
                style={{
                  width: Math.min(screenWidth - 64, 320),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BarChart
                  data={{
                    labels: ["Principal", "Interest"],
                    datasets: [
                      {
                        data: [
                          parseFloat(loanAmount) || 0,
                          result ? result.totalInterest : 0,
                        ],
                      },
                    ],
                  }}
                  width={Math.min(screenWidth - 96, 280)}
                  height={180}
                  yAxisLabel="₹"
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#f9fafb",
                    backgroundGradientTo: "#f9fafb",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                  }}
                  style={{ borderRadius: 16, marginLeft: 0 }}
                  fromZero
                  horizontal={true}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginBottom: 32, marginTop: 20 },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 300,
  },
  content: { gap: 24, paddingHorizontal: 20 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b" },
  inputContainer: { marginBottom: 16 },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  label: { fontSize: 14, fontWeight: "500", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  inputError: { borderColor: "#ef4444" },
  errorText: { fontSize: 12, color: "#ef4444", marginTop: 4 },
  buttonContainer: { flexDirection: "row", gap: 12, marginTop: 8 },
  calculateButton: {
    flex: 1,
    backgroundColor: PSBColors.primary.darkGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: { backgroundColor: "#9ca3af" },
  calculateButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  resetButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: { color: "#374151", fontSize: 16, fontWeight: "500" },
  resultContainer: { gap: 16 },
  resultItem: { backgroundColor: "#f3f4f6", borderRadius: 8, padding: 16 },
  emiItem: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#93c5fd",
  },
  interestItem: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  resultLabel: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  resultValue: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  emiValue: { fontSize: 28, color: "#0066cc" },
  interestValue: { color: "#d97706" },
  detailsContainer: { gap: 4 },
  detailText: { fontSize: 14, color: "#64748b" },
  chartCard: {
    marginTop: 24,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  chartTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default LoanEmiCalculator;
