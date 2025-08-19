import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ScamMap from "../../../components/ScamMap";
import ReportForm from "../../../components/ReportForm";
import ReportList from "../../../components/ReportList";
import { ReportProvider } from "../../../contexts/ReportContext";
import { BackHandler } from "react-native";
import { router, useFocusEffect } from "expo-router";
import API from "../../../api/api";
import TranslatedText from "../../../components/TranslatedText";

const Tab = createBottomTabNavigator();

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
    <ReportProvider>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Map") {
              iconName = "map";
            } else if (route.name === "Report") {
              iconName = "create";
            } else if (route.name === "Reports") {
              iconName = "list";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#2e86de",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Map" component={ScamMap} />
        <Tab.Screen name="Report" component={ReportForm} />
        <Tab.Screen name="Reports" component={ReportList} />
      </Tab.Navigator>
    </ReportProvider>
  );
}
