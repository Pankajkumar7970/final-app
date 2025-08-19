import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TranslatedText from "./TranslatedText";

const HomePage = ({ onLogin, onLogout, isLoggedIn }) => (
  <View style={styles.container}>
    <TranslatedText style={styles.heading}>
      Welcome to FinEduGuard! 👋
    </TranslatedText>
    <TranslatedText style={styles.subheading}>
      Your account is {isLoggedIn ? "active" : "not logged in"}.
    </TranslatedText>
    {!isLoggedIn ? (
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <TranslatedText style={styles.buttonText}>Login</TranslatedText>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <TranslatedText style={styles.buttonText}>Logout</TranslatedText>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#151717",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#151717",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomePage;
