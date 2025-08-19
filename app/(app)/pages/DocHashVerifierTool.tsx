import React from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DocHashVerifier } from "../../../components/DocHashVerifier";
import { router, useFocusEffect } from "expo-router";
import TranslatedText from "../../../components/TranslatedText";

export default function DocHashVerifierTool() {
  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(app)/(tabs)/tools");
        return true;
      }
    );
    return () => backHandler.remove(); // Clean up the listener
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <DocHashVerifier />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
});
