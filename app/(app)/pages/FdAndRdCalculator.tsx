import React from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import Calculator from "../../../components/Calculator";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import TranslatedText from "../../../components/TranslatedText";

export default function FdAndRdCalculator() {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Calculator />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
