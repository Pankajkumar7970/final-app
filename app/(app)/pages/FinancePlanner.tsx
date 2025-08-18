import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Icons
import { PiggyBank, BarChart3, BookOpen, Home } from "lucide-react-native";

// Screens
// import OnboardingScreen from './src/screens/OnboardingScreen';
import PlanScreen from "../../../components/PlanScreen";
import CompareScreen from "../../../components/CompareScreen";
import LearnScreen from "../../../components/LearnScreen";

// Context
import { AppProvider } from "../../../contexts/AppContext";
import { PSBColors } from "../../../utils/PSBColors";
import { router, useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Removed Goals stack navigator

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          if (route.name === "Plan") {
            IconComponent = Home;
          } else if (route.name === "Compare") {
            IconComponent = BarChart3;
          } else if (route.name === "Learn") {
            IconComponent = BookOpen;
          }

          return <IconComponent size={size} color={color} />;
        },
        tabBarActiveTintColor: PSBColors.primary.darkGreen,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Plan"
        component={PlanScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Compare"
        component={CompareScreen}
        options={{ title: "Compare Options" }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: "Learn & Tips" }}
      />
    </Tab.Navigator>
  );
}

// Main App Stack
function AppStack() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}

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
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" backgroundColor="#3B82F6" />
        <AppStack />
      </AppProvider>
    </SafeAreaProvider>
  );
}
