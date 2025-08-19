import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  verifyOtp,
} from "../../redux/services/operations/authServices";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import SecureTextInput from "../../components/SecureTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { PSBColors } from "../../utils/PSBColors";
import TranslatedText from "../../components/TranslatedText";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);
  // const router = useRouter();

  const handleSendOtp = async () => {
    if (!email)
      return Toast.show({ type: "error", text1: "Enter your email!" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return Toast.show({ type: "error", text1: "Enter a valid email!" });

    const response = await dispatch(forgotPassword(email));
    if (response?.error) {
      const msg = response.error.toLowerCase();
      if (msg.includes("not found")) {
        Toast.show({
          type: "error",
          text1: "User not found",
          text2: "Please sign up first",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to send OTP",
          text2: response.error,
        });
      }
    } else {
      Toast.show({
        type: "success",
        text1: "OTP sent",
        text2: "Check your email",
      });
      setStep(2);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      return Toast.show({ type: "error", text1: "Enter a valid 4-digit OTP" });
    }

    const response = await dispatch(verifyOtp(email, otp));
    if (response?.error) {
      Toast.show({
        type: "error",
        text1: "OTP verification failed",
        text2: response.error,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "OTP Verified",
        text2: "Reset your password",
      });
      router.push(
        `/ResetPassword?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{
            uri: "https://cdn.jsdelivr.net/gh/Nishant-Manocha/FineduGuard_StaticFiles@main/FinEduGuardWhiteLogo.png",
          }}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <View style={styles.card}>
          <TranslatedText style={styles.title}>Forgot Password</TranslatedText>
          <TranslatedText style={styles.subtitle}>
            Enter your email to receive a reset OTP
          </TranslatedText>

          {step === 1 && (
            <>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#777" />
                <SecureTextInput
                  style={styles.input}
                  placeholder="Enter your Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Sending..." : "Send Reset OTP"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <TranslatedText style={styles.label}>Enter OTP</TranslatedText>
              <View style={styles.inputWrapper}>
                <Ionicons name="key-outline" size={20} color="#777" />
                <SecureTextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PSBColors.primary.lightGreen,
    // backgroundColor: "#eafaf1",
  },
  header: {
    backgroundColor: PSBColors.primary.darkGreen,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogo: {
    width: screenWidth * 0.6, // ✅ 60% of screen width
    height: screenWidth * 0.4, // ✅ maintains aspect ratio 3:1
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: screenWidth * 0.9, // ✅ 90% of screen width
    maxWidth: 400,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: PSBColors.primary.darkGreen,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#1e2a3a",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#c0392b",
    marginVertical: 10,
  },
  label: {
    fontWeight: "600",
    color: "#1e2a3a",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: PSBColors.primary.darkGreen,
    borderWidth: 1.5,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    width: "100%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#1e2a3a",
    fontSize: 15,
  },
  button: {
    backgroundColor: PSBColors.primary.darkGreen,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    shadowColor: PSBColors.primary.darkGreen,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ForgotPassword;
