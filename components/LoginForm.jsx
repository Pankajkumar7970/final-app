import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Button,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { Link, router } from "expo-router";
import { LogIn, Mail, Lock, Google } from "lucide-react-native";
import FormInput from "./ui/FormInput";
import PrimaryButton from "./ui/PrimaryButton";
import { colors } from "../utils/colors";
import { LoginForm, ValidationError } from "../types/auth";
import { validateEmail, validateForm } from "../utils/validation";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  login,
  loginOrCreateWithSocial,
} from "../redux/services/operations/authServices";
import { LoginManager, AccessToken, Profile } from "react-native-fbsdk-next";
import TranslatedText from "./TranslatedText";

const width = Dimensions.get("window").width;

export default function LoginScreen({
  onSwitchToSignup,
  onForgotPassword,
  onLoginSuccess,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);
  const token = useSelector((state) => state.auth?.token);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "391480015245-9fj3s3l8hg7vus5ifadhqiff58ka4t5m.apps.googleusercontent.com",
      offlineAccess: true, // <- important
      scopes: ["profile", "email"],
    });
  }, []);

  // Your FB button press
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

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return null;
  };

  const handleLogin = async () => {
    const validationErrors = validateForm(formData, {
      email: validateEmail,
      password: validatePassword,
    });

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      // setLoading(true);
      const response = await dispatch(login(formData.email, formData.password));
      if (response?.error) {
        const errorMessage = response.error.toLowerCase();
        if (
          errorMessage.includes("user not found") ||
          errorMessage.includes("no user") ||
          errorMessage.includes("doesn't exist")
        ) {
          Toast.show({
            type: "error",
            text1: "User not found",
            text2: "Please sign up first",
            onPress: () => onSwitchToSignup(),
          });
        } else if (
          errorMessage.includes("incorrect password") ||
          errorMessage.includes("invalid password") ||
          errorMessage.includes("wrong password")
        ) {
          Toast.show({
            type: "error",
            text1: "Incorrect password",
            text2: "Please try again or reset your password",
            onPress: () => onForgotPassword(),
          });
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <LogIn size={32} color={colors.primary.green} />
            </View>
            <TranslatedText style={styles.title}>Welcome Back</TranslatedText>
            <TranslatedText style={styles.subtitle}>
              Sign in to your account
            </TranslatedText>
          </View>

          <View style={styles.formSection}>
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
              placeholder="Enter your password"
            />

            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={onForgotPassword}>
              {/* <Link href="/(auth)/forgot-password" asChild> */}
                <TranslatedText style={styles.forgotPasswordText}>
                  Forgot Password?
                </TranslatedText>
              {/* </Link> */}
            </TouchableOpacity>

            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
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
              <TranslatedText style={styles.orText}>Or</TranslatedText>
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
              variant={"outline"}
            />
          </View>
          <View style={styles.footerSection}>
            <TranslatedText style={styles.footerText}>
              Don't have an account?{" "}
              {/* <Link href="/(auth)/signup" asChild> */}
              <TouchableOpacity onPress={onSwitchToSignup}>
                <TranslatedText style={styles.linkText}>Sign Up</TranslatedText>
              </TouchableOpacity>
              {/* </Link> */}
            </TranslatedText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    minHeight: "100%",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary.green,
    fontWeight: "500",
  },
  loginButton: {
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
