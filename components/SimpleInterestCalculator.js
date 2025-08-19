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
import { LineChart } from "react-native-chart-kit";
import { Calculator, TrendingUp, Calendar, Percent } from "lucide-react-native";
import { PSBColors } from "../utils/PSBColors";
import TranslatedText from "./TranslatedText";

const screenWidth = Dimensions.get("window").width;

const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({ principal: "", rate: "", time: "" });

  const validateInputs = () => {
    const newErrors = { principal: "", rate: "", time: "" };
    let isValid = true;

    const principalNum = parseFloat(principal);
    const rateNum = parseFloat(rate);
    const timeNum = parseFloat(time);

    if (!principal || principalNum <= 0) {
      newErrors.principal = "Principal amount must be greater than 0";
      isValid = false;
    }
    if (!rate || rateNum <= 0) {
      newErrors.rate = "Interest rate must be greater than 0";
      isValid = false;
    }
    if (!time || timeNum <= 0) {
      newErrors.time = "Time period must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const calculate = () => {
    if (!validateInputs()) return;

    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    const simpleInterest = (P * R * T) / 100;
    const totalAmount = P + simpleInterest;

    setResult({ simpleInterest, totalAmount });
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setResult(null);
    setErrors({ principal: "", rate: "", time: "" });
  };

  const isFormValid =
    principal &&
    rate &&
    time &&
    parseFloat(principal) > 0 &&
    parseFloat(rate) > 0 &&
    parseFloat(time) > 0;

  const getLabels = () => {
    const T = parseInt(time);
    const step = T > 10 ? Math.ceil(T / 10) : 1; // Only show ~10 labels
    return Array.from({ length: T + 1 }, (_, i) =>
      i % step === 0 ? `${i} yr` : ""
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Calculator size={32} color={PSBColors.primary.darkGreen} />
          <TranslatedText style={styles.title}>
            Simple Interest Calculator
          </TranslatedText>
        </View>
        <TranslatedText style={styles.subtitle}>
          Calculate simple interest and visualize total amount growth
        </TranslatedText>
      </View>

      {/* Input Section */}
      <View style={styles.card}>
        <TranslatedText style={styles.cardTitle}>
          Enter Loan Details
        </TranslatedText>
        <View style={styles.inputContainer}>
          <TranslatedText style={styles.label}>
            Principal Amount (₹)
          </TranslatedText>
          <TextInput
            style={[styles.input, errors.principal && styles.inputError]}
            placeholder="Enter principal amount"
            value={principal}
            onChangeText={setPrincipal}
            keyboardType="numeric"
          />
          {errors.principal ? (
            <TranslatedText style={styles.errorText}>
              {errors.principal}
            </TranslatedText>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Percent size={16} color="#666" />
            <TranslatedText style={styles.label}>
              Annual Interest Rate (%)
            </TranslatedText>
          </View>
          <TextInput
            style={[styles.input, errors.rate && styles.inputError]}
            placeholder="Enter interest rate"
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
          />
          {errors.rate ? (
            <TranslatedText style={styles.errorText}>
              {errors.rate}
            </TranslatedText>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Calendar size={16} color="#666" />
            <TranslatedText style={styles.label}>
              Time Period (Years)
            </TranslatedText>
          </View>
          <TextInput
            style={[styles.input, errors.time && styles.inputError]}
            placeholder="Enter time in years"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
          />
          {errors.time ? (
            <TranslatedText style={styles.errorText}>
              {errors.time}
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
            <Calculator size={16} color="#fff" />
            <TranslatedText style={styles.calculateButtonText}>
              Calculate
            </TranslatedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <TranslatedText style={styles.resetButtonText}>
              Reset
            </TranslatedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results */}
      {result && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={20} color="#10b981" />
            <TranslatedText style={styles.cardTitle}>
              Calculation Results
            </TranslatedText>
          </View>
          <View style={styles.resultContainer}>
            <View style={styles.resultItem}>
              <TranslatedText style={styles.resultLabel}>
                Simple Interest
              </TranslatedText>
              <TranslatedText style={styles.resultValue}>
                {formatCurrency(result.simpleInterest)}
              </TranslatedText>
            </View>
            <View style={[styles.resultItem, styles.totalAmountItem]}>
              <TranslatedText style={styles.resultLabel}>
                Total Amount
              </TranslatedText>
              <TranslatedText
                style={[styles.resultValue, styles.totalAmountValue]}
              >
                {formatCurrency(result.totalAmount)}
              </TranslatedText>
            </View>
          </View>

          {/* Chart */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
          >
            <LineChart
              data={{
                labels: getLabels(),
                datasets: [
                  {
                    data: Array.from(
                      { length: parseInt(time) + 1 },
                      (_, i) =>
                        parseFloat(principal) +
                        (parseFloat(principal) * parseFloat(rate) * i) / 100
                    ),
                    color: (opacity = 1) => `rgba(16,185,129,${opacity})`,
                    strokeWidth: 2,
                  },
                  {
                    data: Array.from(
                      { length: parseInt(time) + 1 },
                      (_, i) =>
                        (parseFloat(principal) * parseFloat(rate) * i) / 100
                    ),
                    color: (opacity = 1) => `rgba(234,88,12,${opacity})`,
                    strokeWidth: 2,
                  },
                ],
                legend: ["Total Amount", "Simple Interest"],
              }}
              width={Math.max(screenWidth, parseInt(time) * 60)} // wider for more years
              height={220}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(31,41,55,${opacity})`,
                labelColor: (opacity = 1) => `rgba(107,114,128,${opacity})`,
                propsForDots: { r: "3.5", strokeWidth: "2", stroke: "#fff" },
                propsForLabels: { fontSize: 11 },
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", marginBottom: 32 },
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 4,
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
  calculateButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
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
  totalAmountItem: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  resultLabel: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  resultValue: { fontSize: 24, fontWeight: "bold", color: "#0066cc" },
  totalAmountValue: { color: "#10b981" },
});

export default SimpleInterestCalculator;
