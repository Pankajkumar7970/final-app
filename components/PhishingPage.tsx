import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  Shield,
  Lock,
  User,
  CreditCard,
  Phone,
  Eye,
  EyeOff,
  TriangleAlert as AlertTriangle,
} from "lucide-react-native";
import TranslatedText from "./TranslatedText";

interface PhishingPageProps {
  onSubmit: (data: {
    account: string;
    debitCard: string;
    cvv: string;
    otp: string;
    mobile: string;
    username: string;
    password: string;
  }) => void;
}

const PhishingPage = ({ onSubmit }: PhishingPageProps) => {
  const [formData, setFormData] = useState({
    account: "",
    debitCard: "",
    cvv: "",
    otp: "",
    mobile: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      {/* Educational Warning Banner */}
      <View style={styles.warningBanner}>
        <View style={styles.warningHeader}>
          <AlertTriangle size={20} color="#FFFFFF" strokeWidth={2} />
          <TranslatedText style={styles.warningBadgeText}>
            EDUCATIONAL SIMULATION
          </TranslatedText>
        </View>
        <TranslatedText style={styles.warningText}>
          This is a FAKE banking page for learning purposes only
        </TranslatedText>
      </View>

      {/* Punjab and Sind Bank Header */}
      <View style={styles.bankHeader}>
        <View style={styles.bankHeaderContent}>
          <View style={styles.bankLogo}>
            <Shield size={32} color="#10B981" strokeWidth={2} />
          </View>
          <View style={styles.bankInfo}>
            <TranslatedText style={styles.bankName}>
              ABC Bank of India
            </TranslatedText>
            <TranslatedText style={styles.bankSubtitle}>
              Personal Net Banking
            </TranslatedText>
          </View>
        </View>
        <View style={styles.secureIndicator}>
          <Lock size={16} color="#FFF" strokeWidth={2} />
          <TranslatedText style={styles.secureText}>
            secure.abc.bank.in
          </TranslatedText>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <TranslatedText style={styles.formTitle}>
              Account Verification Required
            </TranslatedText>
            <TranslatedText style={styles.formSubtitle}>
              Please verify your details to secure your ABC Bank account
            </TranslatedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TranslatedText style={styles.label}>
                Account Number
              </TranslatedText>
              <View style={styles.inputContainer}>
                <User
                  size={20}
                  color="#9CA3AF"
                  strokeWidth={2}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Account Number"
                  value={formData.account}
                  onChangeText={(text) =>
                    setFormData({ ...formData, account: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TranslatedText style={styles.label}>
                Debit Card Number
              </TranslatedText>
              <View style={styles.inputContainer}>
                <CreditCard
                  size={20}
                  color="#9CA3AF"
                  strokeWidth={2}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 16-digit Card Number"
                  value={formData.debitCard}
                  onChangeText={(text) =>
                    setFormData({ ...formData, debitCard: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <TranslatedText style={styles.label}>CVV</TranslatedText>
                <View style={styles.inputContainer}>
                  <Lock
                    size={20}
                    color="#9CA3AF"
                    strokeWidth={2}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="CVV"
                    value={formData.cvv}
                    onChangeText={(text) =>
                      setFormData({ ...formData, cvv: text })
                    }
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <TranslatedText style={styles.label}>OTP</TranslatedText>
                <View style={styles.inputContainer}>
                  <Lock
                    size={20}
                    color="#9CA3AF"
                    strokeWidth={2}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChangeText={(text) =>
                      setFormData({ ...formData, otp: text })
                    }
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TranslatedText style={styles.label}>
                Mobile Number
              </TranslatedText>
              <View style={styles.inputContainer}>
                <Phone
                  size={20}
                  color="#9CA3AF"
                  strokeWidth={2}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  onChangeText={(text) =>
                    setFormData({ ...formData, mobile: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TranslatedText style={styles.label}>
                Net Banking Username
              </TranslatedText>
              <View style={styles.inputContainer}>
                <User
                  size={20}
                  color="#9CA3AF"
                  strokeWidth={2}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Username"
                  value={formData.username}
                  onChangeText={(text) =>
                    setFormData({ ...formData, username: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TranslatedText style={styles.label}>
                Net Banking Password
              </TranslatedText>
              <View style={styles.inputContainer}>
                <Lock
                  size={20}
                  color="#9CA3AF"
                  strokeWidth={2}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#9CA3AF" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <TranslatedText style={styles.submitButtonText}>
                Verify Account
              </TranslatedText>
            </TouchableOpacity>
          </View>

          <View style={styles.customerCare}>
            <TranslatedText style={styles.customerCareText}>
              Customer Care:{" "}
              <TranslatedText style={styles.customerCareNumber}>
                1800-xx-23xx
              </TranslatedText>
            </TranslatedText>
          </View>
        </View>
      </ScrollView>

      {/* Educational Notice */}
      <View style={styles.educationalNotice}>
        <View style={styles.noticeHeader}>
          <AlertTriangle size={20} color="#F59E0B" strokeWidth={2} />
          <TranslatedText style={styles.noticeBadgeText}>
            Educational Notice
          </TranslatedText>
        </View>
        <TranslatedText style={styles.noticeText}>
          This is a FAKE Bank page. Real banks never ask for credentials via
          email/SMS links.
        </TranslatedText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  warningBanner: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  warningBadgeText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  warningText: {
    fontSize: 13,
    color: "#FFF",
    textAlign: "center",
  },
  bankHeader: {
    backgroundColor: "#10B981",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  bankHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bankLogo: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  bankSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
  },
  secureIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 8,
  },
  secureText: {
    fontSize: 13,
    color: "#FFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 36,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 17,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 20,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#1F2937",
  },
  eyeButton: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: "#10B981",
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 19,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  customerCare: {
    marginTop: 28,
    alignItems: "center",
  },
  customerCareText: {
    fontSize: 15,
    color: "#6B7280",
  },
  customerCareNumber: {
    fontWeight: "600",
    color: "#10B981",
  },
  educationalNotice: {
    backgroundColor: "#1E293B",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  noticeBadgeText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  noticeText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default PhishingPage;
