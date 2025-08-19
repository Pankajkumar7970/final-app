import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Link, router } from "expo-router";
import { UserPlus, User, Mail, Lock } from "lucide-react-native";
import FormInput from "../components/ui/FormInput";
import PrimaryButton from "../components/ui/PrimaryButton";
// import Header from "../components/ui/Header";
import { colors } from "../utils/colors";
// import { SignupForm, ValidationError } from "@/types/auth";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
  validateForm,
} from "../utils/validation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import {
  sendOtp,
  login,
  loginOrCreateWithSocial,
} from "../redux/services/operations/authServices";
import { setSignUpData } from "../redux/slices/authSlice";
import OAuthButtons from "./OAuthButtons";
import Toast from "react-native-toast-message";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import TranslatedText from "./TranslatedText";

export default function SignupScreen({ onSignupSuccess }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const getFieldError = (field) => {
    return errors.find((error) => error.field === field)?.message;
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "391480015245-9fj3s3l8hg7vus5ifadhqiff58ka4t5m.apps.googleusercontent.com",
      offlineAccess: true, // <- important
      scopes: ["profile", "email"],
    });
  }, []);

  async function onGoogleButtonPress() {
    if (isGoogleSigningIn) return;
    setIsGoogleSigningIn(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signOut();

      const signInResult = await GoogleSignin.signIn();
      console.log("signInResult:", signInResult);

      let idToken = signInResult?.data?.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens?.idToken;
      }
      if (!idToken) {
        console.error("Google Sign-In returned null ID token");
        return;
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential =
        await auth().signInWithCredential(googleCredential);

      // Build payload for backend social login/create
      const googleUser = userCredential?.user;
      const siUser = signInResult?.data?.user || {};

      const displayName = googleUser?.displayName || siUser?.name || "";
      const [firstNameFromDisplay, ...restName] = displayName
        .split(" ")
        .filter(Boolean);

      const email = googleUser?.email || siUser?.email;
      const firstName = siUser?.givenName || firstNameFromDisplay || "User";
      const lastName = siUser?.familyName || restName.join(" ") || "Google";
      const avatar = googleUser?.photoURL || siUser?.photo;
      console.log(
        "google user",
        email,
        firstName,
        lastName,
        avatar,
        "google user"
      );
      if (!email) {
        console.error("Google Sign-In returned no email");
        Toast.show({ type: "error", text1: "Google did not return an email" });
        return;
      }

      const result = await dispatch(
        loginOrCreateWithSocial({ email, firstName, lastName, avatar })
      );
      console.log(result);

      if (result?.success) {
        router.replace("/(app)/(tabs)");
      } else {
        Toast.show({ type: "error", text1: result?.error || "Sign-in failed" });
      }
    } catch (error) {
      if (error?.code === statusCodes.IN_PROGRESS) {
        console.warn("Google Sign-In already in progress");
      } else if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.warn("Google Sign-In cancelled by user");
      } else {
        console.error("Google Sign-In Error:", error);
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  }

  const handleSendOTP = async () => {
    const validationErrors = validateForm(formData, {
      fullName: validateFullName,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value) =>
        validateConfirmPassword(formData.password, value),
    });

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      try {
        setLoading(true);
        const response = await dispatch(sendOtp(formData.email));
        setLoading(false);

        if (response?.error) {
          const errorMessage = response.error;
          console.error("Error sending OTP:", errorMessage);
          Toast.show({
            type: "error",
            text1: errorMessage || "Failed to send OTP",
          });
          return;
        }
        const [firstName, lastName = ""] = formData.fullName.split(" ");

        Toast.show({ type: "success", text1: "OTP sent successfully!" });
        dispatch(
          setSignUpData({
            firstName,
            lastName,
            email: formData.email,
            password: formData.password,
          })
        );
        if (onSignupSuccess) onSignupSuccess();
      } catch (error) {
        setLoading(false);
        const errorMessage =
          error?.response?.data?.error || "Failed to send OTP";
        Toast.show({ type: "error", text1: errorMessage });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* <Header
          title="Create Account"
          showBackButton
          onBackPress={() => router.back()}
        /> */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                {/* <UserPlus size={32} color={colors.primary.green} /> */}
                <Image
                  source={{
                    uri: "https://cdn.jsdelivr.net/gh/Nishant-Manocha/FineduGuard_StaticFiles@main/FinEduGuardtransparent.png",
                  }}
                  style={{ height: 85, width: 85 }}
                  resizeMode="contain"
                />
              </View>
              <TranslatedText style={styles.title}>Join PSB</TranslatedText>
              <TranslatedText style={styles.subtitle}>
                Create your account to get started
              </TranslatedText>
            </View>

            <View style={styles.formSection}>
              <FormInput
                label="Full Name"
                value={formData.fullName}
                onChangeText={(fullName) =>
                  setFormData({ ...formData, fullName })
                }
                error={getFieldError("fullName")}
                placeholder="Enter your full name"
              />

              <FormInput
                label="Email"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                error={getFieldError("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
              />

              <FormInput
                label="Password"
                value={formData.password}
                onChangeText={(password) =>
                  setFormData({ ...formData, password })
                }
                error={getFieldError("password")}
                secureTextEntry
                placeholder="Create a strong password"
              />

              <FormInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) =>
                  setFormData({ ...formData, confirmPassword })
                }
                error={getFieldError("confirmPassword")}
                secureTextEntry
                placeholder="Confirm your password"
              />

              <PrimaryButton
                title="Send OTP"
                onPress={handleSendOTP}
                loading={loading}
                style={styles.signupButton}
              />
              <View style={styles.orTextContainer}>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#ccc",
                    width: "30px",
                  }}
                ></View>
                <Text style={styles.orText}>Or</Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#ccc",
                  }}
                ></View>
              </View>

              <PrimaryButton
                onPress={onGoogleButtonPress}
                title={
                  isGoogleSigningIn ? "Signing in..." : "Sign In with Google"
                }
                disabled={isGoogleSigningIn}
                // style={{
                //   backgroundColor: colors.primary.green,
                //   color: colors.primary.green,
                // }}
                // icon={<}
                variant={"outline"}
              />
            </View>

            <View style={styles.footerSection}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Link href="/(auth)/login" asChild>
                  <Text style={styles.linkText}>Sign In</Text>
                </Link>
              </Text>
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
    marginBottom: 24,
  },
  signupButton: {
    marginTop: 8,
  },
  footerSection: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.neutral.gray600,
    textAlign: "center",
  },
  linkText: {
    color: colors.primary.green,
    fontWeight: "600",
  },
  orText: {
    fontSize: 14,
    color: colors.neutral.gray400,
    textAlign: "center",
    marginVertical: 16,
    marginHorizontal: 8,
  },
  orTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
});
