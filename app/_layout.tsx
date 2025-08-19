// RootLayout.jsx
import React, { useState } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Provider } from "react-redux";
import store from "../redux/store";
import Toast from "react-native-toast-message";

import { useFrameworkReady } from "../hooks/useFrameworkReady";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";

import {
  SecurityProvider,
  SecurityStatusIndicator,
} from "../components/SecurityProvider";

function MainLayout() {
  useFrameworkReady();

  // Language Switcher component
  const LanguageSwitcher = () => {
    const { setLang } = useLanguage();
    const [selected, setSelected] = useState("en");

    const handleSwitch = (lang) => {
      setSelected(lang);
      setLang(lang);
    };

    return (
      <View style={styles.switcherContainer}>
        {[
          { code: "en", label: "EN" },
          { code: "hi", label: "हि" },
          { code: "pa", label: "ਪੰ" },
        ].map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.switchButton,
              selected === lang.code && styles.activeButton,
            ]}
            onPress={() => handleSwitch(lang.code)}
          >
            <Text
              style={[
                styles.switchText,
                selected === lang.code && styles.activeText,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <LanguageProvider>
      <SecurityProvider>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
              <SafeAreaView style={{ flex: 1 }}>
                {/* Top-right language switcher */}
                <View style={styles.topRight}>
                  <LanguageSwitcher />
                </View>

                {/* App screens */}
                <Slot />

                {/* Status bar & indicators */}
                <StatusBar style="light" backgroundColor="#1a1a2e" />
                <SecurityStatusIndicator />
                <Toast position="top" visibilityTime={3000} />
              </SafeAreaView>
            </AuthProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SecurityProvider>
    </LanguageProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  topRight: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1000,
    flexDirection: "row",
  },
  switcherContainer: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: "#2e2e42",
  },
  activeButton: {
    backgroundColor: "#ff6b6b",
  },
  switchText: {
    color: "#fff",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
