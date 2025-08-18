import React from "react";
import { StatusBar } from "expo-status-bar";
import CalculatorApp from "../../../components/CalculatorApp";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler } from "react-native";
import { router, useFocusEffect } from "expo-router";

export default function App() {
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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <CalculatorApp />
    </SafeAreaView>
  );
}
