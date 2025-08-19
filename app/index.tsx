import { Redirect, router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { View, ActivityIndicator, StyleSheet, Text, Image,Alert,BackHandler, NativeModules } from "react-native";
import { useEffect, useState } from "react";
import { ensurePermission } from "../utils/permissions";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Shield } from "lucide-react-native";
import { colors } from "../utils/colors";
import TranslatedText from "../components/TranslatedText";
// import {isRootDetected} from "react-native-root-detection";
import { isDeveloperModeEnabled } from "../utils/DeveloperSettings";
const { RootDetectionModule } = NativeModules;

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [permissionsReady, setPermissionsReady] = useState(false);

  useEffect(() => {
    async function checkSecurity() {
      const rooted = await RootDetectionModule.isDeviceRooted();
      const devMode = await isDeveloperModeEnabled();

      if (rooted) {
        Alert.alert("Security Alert", "This app cannot run on rooted devices.", [
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
      }

      // ⚠️ Only check Dev Mode in Production
      if (!__DEV__ && devMode) {
        Alert.alert(
          "Security Alert",
          "Developer Options are enabled. Please disable to use this app.",
          [{ text: "Exit", onPress: () => BackHandler.exitApp() }]
        );
      }
    }

    checkSecurity();
  }, []);


  useEffect(() => {
    async function requestPermissions() {
      // List of permissions you want
      const perms = ["location", "microphone", "internet"];

      for (let p of perms) {
        try {
          const status = await ensurePermission(p);
          console.log(`${p} status:`, status);
        } catch (err) {
          console.warn(`Error checking permission ${p}:`, err);
        }
      }
      setPermissionsReady(true);
    }

    requestPermissions();
  }, []);

  // Wait until both auth loading and permission checking are done
  if (isLoading || !permissionsReady) {
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
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundPattern} />

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: "https://cdn.jsdelivr.net/gh/Nishant-Manocha/FineduGuard_StaticFiles@main/FinEduGuardtransparent.png",
                }}
                style={{ height: 85, width: 85 }}
                resizeMode="contain"
              />
            </View>
            <TranslatedText style={styles.title}>
              Welcome to FinEduGuard App
            </TranslatedText>
            <TranslatedText style={styles.subtitle}>
              Your trusted financial partner for secure banking solutions
            </TranslatedText>
          </View>

          <View style={styles.actionSection}>
            <PrimaryButton
              title="Sign In"
              onPress={() => router.push("/(auth)/login")}
              style={styles.primaryButton}
            />

            <PrimaryButton
              title="Create Account"
              onPress={() => router.push("/(auth)/signup")}
              variant="outline"
              style={styles.secondaryButton}
            />
          </View>

          <View style={styles.footerSection}>
            <TranslatedText style={styles.footerText}>
              Secured by industry-leading encryption
            </TranslatedText>
          </View>
        </View>
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightGreen,
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: colors.primary.green,
    opacity: 0.05,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    marginTop: 80,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.primary.darkGreen,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral.gray600,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  actionSection: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginTop: 8,
  },
  footerSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.neutral.gray500,
    textAlign: "center",
  },
});





