import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";
import { GoalsProvider } from "../../contexts/GoalsContext";
import TranslatedText from "../../components/TranslatedText";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1a2e",
        }}
      >
        <ActivityIndicator size="large" color="#ff6b6b" />
        <TranslatedText style={{ color: "white", marginTop: 10 }}>
          Loading...
        </TranslatedText>
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Render the protected app
  return (
    <GoalsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="pages" /> */}
      </Stack>
    </GoalsProvider>
  );
}
