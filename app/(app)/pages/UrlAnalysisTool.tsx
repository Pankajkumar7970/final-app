import React from "react";
import { ScrollView, View, StyleSheet, BackHandler } from "react-native";
import { FraudAnalyzer } from "../../../components/FraudAnalyzer";
import { SecurityFeatures } from "../../../components/SecurityFeatures";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import TranslatedText from "../../../components/TranslatedText";

export default function UrlAnalysisTool() {
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
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <FraudAnalyzer />
          <SecurityFeatures />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    flex: 1,
  },
});
