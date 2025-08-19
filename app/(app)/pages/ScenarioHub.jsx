import React, { useState, useEffect } from "react";
import { View, StyleSheet, BackHandler, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScenarioList } from "../../../components/ScenarioList";
import { ScenarioSimulator } from "../../../components/ScenarioSimulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../../api/api"; // Adjust the import path as necessary
import axios from "axios";
import Loader from "../../../components/Loader";
import { router, useFocusEffect } from "expo-router";
import TranslatedText from "../../../components/TranslatedText";

const COMPLETED_SCENARIOS_KEY = "completed_scenarios";

export default function ScenarioHub() {
  const [currentScenarioId, setCurrentScenarioId] = useState(
    null
  );
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.push("/(app)/(tabs)");
        return true;
      }
    );
    return () => backHandler.remove(); // Clean up the listener
  });

  useEffect(() => {
    loadCompletedScenarios();
  }, []);

  const loadCompletedScenarios = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/progress?type=scenario`);
      const data = response.data;

      if (data.progress) {
        const completed = data.progress.map((item) => item.scenarioId);
        console.log("Completed scenarios:", completed);

        setCompletedScenarios(completed);

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          COMPLETED_SCENARIOS_KEY,
          JSON.stringify(completed)
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load completed scenarios:", error);
    }
  };

  const handleScenarioSelect = (scenarioId) => {
    setCurrentScenarioId(scenarioId);
  };

  const handleScenarioComplete = async (result) => {
    console.log("Scenario complete result:", result);
    const response = await API.post(`/scenarios/${result.scenarioId}/submit`, {
      choiceId: result.choiceId,
      timeSpent: result.timeSpent,
      points: result.points,
    });
    Alert.alert(
      "Exp Earned!",
      `Congratulations!!! You have earned ${response.data.points} Exp points.`,
      [{ text: "OK" }]
    );
    // console.log("Scenario", response.data.choice);
    return [response.data.choice, response.data.points]; // Assuming the API returns the updated scenario data
  };

  const handleExit = () => {
    setCurrentScenarioId(null);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <Loader />
      </SafeAreaView>
    );
  }

  if (currentScenarioId) {
    return (
      <ScenarioSimulator
        scenarioId={currentScenarioId}
        onComplete={handleScenarioComplete}
        onExit={handleExit}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScenarioList
        onScenarioSelect={handleScenarioSelect}
        completedScenarios={completedScenarios}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
