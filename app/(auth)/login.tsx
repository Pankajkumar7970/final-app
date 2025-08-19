import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import LoginForm from "../../components/LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import TranslatedText from "../../components/TranslatedText";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleLoginSuccess = () => {
    signIn();
  };

  const switchToSignup = () => {
    router.push("/(auth)/signup");
  };

  const switchToForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      {/* <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn.jsdelivr.net/gh/Nishant-Manocha/FineduGuard_StaticFiles@main/FinEduGuardWhiteLogo.png",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appSubtitle}>Secure Financial Education</Text>
      </View> */}

      {/* Form Container */}
      <View style={styles.formContainer}>
        <LoginForm
          onSwitchToSignup={switchToSignup}
          onForgotPassword={switchToForgotPassword}
          onLoginSuccess={handleLoginSuccess}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#1b8a5a", // Rich green background restored
  },
  header: {
    alignItems: "center",
    paddingTop: 35,
    paddingBottom: 30,
  },
  logo: {
    width: width * 0.8,
    height: width * 0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#f1d28f", // Gold tone for elegance
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // paddingHorizontal: 20,
    paddingTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
  },
});
