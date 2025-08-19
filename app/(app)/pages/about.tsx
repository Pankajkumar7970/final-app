// screens/AboutScreen.js
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  BookOpen,
  Shield,
  Bot,
  Globe,
  Mail,
  ExternalLink,
  Target,
  Eye,
} from "lucide-react-native";
import TranslatedText from "../../../components/TranslatedText";

export default function AboutScreen() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  const handleEmailPress = () => {
    Linking.openURL("mailto:contact@xxxxxxx.com");
  };

  const handleWebsitePress = () => {
    Linking.openURL("https://www.xxxxxxxx.com");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <TranslatedText style={styles.mainTitle}>
            About FinEduGuard
          </TranslatedText>
          <TranslatedText style={styles.description}>
            FinEduGuard is an innovative mobile application built to educate
            users about personal finance and raise awareness about financial
            frauds. We combine interactive learning, real-world simulations, and
            AI-powered insights to make finance simple, secure, and engaging.
          </TranslatedText>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={24} color="#1E40AF" />
            <TranslatedText style={styles.sectionTitle}>
              Our Mission
            </TranslatedText>
          </View>
          <TranslatedText style={styles.sectionText}>
            Our mission is to empower individuals with the knowledge and tools
            to make smarter financial decisions and to protect themselves from
            frauds and scams in the digital world.
          </TranslatedText>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={24} color="#1E40AF" />
            <TranslatedText style={styles.sectionTitle}>
              Our Vision
            </TranslatedText>
          </View>
          <TranslatedText style={styles.sectionText}>
            We envision a world where financial literacy is accessible to all,
            and every user feels confident and safe while managing their money.
          </TranslatedText>
        </View>

        {/* What We Offer Section */}
        <View style={styles.section}>
          <TranslatedText style={styles.sectionTitle}>
            What We Offer
          </TranslatedText>

          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <BookOpen size={20} color="#FFFFFF" />
              </View>
              <TranslatedText style={styles.featureText}>
                Easy-to-understand finance education modules
              </TranslatedText>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Shield size={20} color="#FFFFFF" />
              </View>
              <TranslatedText style={styles.featureText}>
                Real-life fraud simulations & awareness training
              </TranslatedText>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Bot size={20} color="#FFFFFF" />
              </View>
              <TranslatedText style={styles.featureText}>
                AI-powered financial assistant (FinEduGuard Assistant)
              </TranslatedText>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Globe size={20} color="#FFFFFF" />
              </View>
              <TranslatedText style={styles.featureText}>
                Up-to-date fraud alerts, tips, and prevention strategies
              </TranslatedText>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, styles.contactSection]}>
          <TranslatedText style={styles.sectionTitle}>
            Contact Us
          </TranslatedText>
          <TranslatedText style={styles.contactSubtitle}>
            We'd love to hear from you!
          </TranslatedText>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <Mail size={20} color="#1E40AF" />
            <TranslatedText style={styles.contactText}>
              contact@fineduguard.com
            </TranslatedText>
            <ExternalLink size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleWebsitePress}
            activeOpacity={0.7}
          >
            <Globe size={20} color="#1E40AF" />
            <TranslatedText style={styles.contactText}>
              www.fineduguard.com
            </TranslatedText>
            <ExternalLink size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#1E293B",
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#475569",
    lineHeight: 24,
  },
  featuresList: {
    marginTop: 16,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E40AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#374151",
    lineHeight: 22,
  },
  contactSection: {
    borderColor: "#1E40AF",
    borderWidth: 1,
  },
  contactSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1E40AF",
    marginLeft: 12,
  },
});
