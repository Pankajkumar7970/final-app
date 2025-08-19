import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Shield, Lock } from "lucide-react-native";
import FormInput from "../../components/ui/FormInput";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Header from "../../components/ui/Header";
import { colors } from "../../utils/colors";
// import { ResetPasswordForm, ValidationError } from '@/types/auth';
import TranslatedText from "../../components/TranslatedText";
import {
  validatePassword,
  validateConfirmPassword,
  validateForm,
} from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/services/operations/authServices";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);
  const token = useSelector((state) => state.auth?.token);
  const { email, otp } = useLocalSearchParams();

  const getFieldError = (field) => {
    return errors.find((error) => error.field === field)?.message;
  };

  useEffect(() => {
    if (token) {
      import("expo-router").then(({ router }) => {
        router.push("/(app)/(tabs)");
      });
    }
  }, [token]);

  const handleResetPassword = async () => {
    const validationErrors = validateForm(formData, {
      password: validatePassword,
      confirmPassword: (value) =>
        validateConfirmPassword(formData.password, value),
    });

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      // setLoading(true);
      // Simulate API call
      const response = await dispatch(
        resetPassword(email, formData.password, otp)
      );

      if (response?.error) {
        Toast.show({
          type: "error",
          text1: "Failed to reset password",
          text2: response.error,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Password reset successful",
          text2: "Redirecting to login...",
        });

        const timer = setTimeout(() => {
          import("expo-router").then(({ router }) => {
            router.replace("/(auth)/login");
          });
        }, 1500);
        return () => clearTimeout(timer);
      }
      // setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header
          title="Reset Password"
          showBackButton
          onBackPress={() => router.back()}
        />
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <Image
                  source={{
                    uri: "https://cdn.jsdelivr.net/gh/Nishant-Manocha/FineduGuard_StaticFiles@main/FinEduGuardtransparent.png",
                  }}
                  style={{ height: 85, width: 85 }}
                  resizeMode="contain"
                />
              </View>
              <TranslatedText style={styles.title}>
                Create New Password
              </TranslatedText>
              <TranslatedText style={styles.subtitle}>
                Please create a strong password for your account security.
              </TranslatedText>
            </View>

            <View style={styles.formSection}>
              <FormInput
                label="New Password"
                value={formData.password}
                onChangeText={(password) =>
                  setFormData({ ...formData, password })
                }
                error={getFieldError("password")}
                secureTextEntry
                placeholder="Enter new password"
              />

              <FormInput
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) =>
                  setFormData({ ...formData, confirmPassword })
                }
                error={getFieldError("confirmPassword")}
                secureTextEntry
                placeholder="Confirm new password"
              />

              <View style={styles.passwordRequirements}>
                <TranslatedText style={styles.requirementsTitle}>
                  Password Requirements:
                </TranslatedText>
                <TranslatedText style={styles.requirementItem}>
                  • At least 8 characters long
                </TranslatedText>
                <TranslatedText style={styles.requirementItem}>
                  • Contains uppercase and lowercase letters
                </TranslatedText>
                <TranslatedText style={styles.requirementItem}>
                  • Contains at least one number
                </TranslatedText>
                <TranslatedText style={styles.requirementItem}>
                  • Contains at least one special character
                </TranslatedText>
              </View>

              <PrimaryButton
                title="Reset Password"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.resetButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightGreen,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary.darkGreen,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral.gray600,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formSection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.neutral.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  passwordRequirements: {
    backgroundColor: colors.primary.lightGreen,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary.darkGreen,
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 12,
    color: colors.neutral.gray600,
    marginBottom: 4,
    paddingLeft: 4,
  },
  resetButton: {
    marginTop: 8,
  },
});
