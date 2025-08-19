import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TranslatedText from "./TranslatedText";

const SecurityTips = ({ onRestart, loading }) => {
  const tips = [
    {
      icon: "globe-outline",
      title: "Check the URL Carefully",
      description:
        "Always verify the website URL. Banks use specific domains like sbi.co.in, not variations like secure-sbi-alert.in",
      example:
        "✅ https://onlineabc.abc.co.in vs ❌ https://secure-abc-alert.in",
    },
    {
      icon: "call-outline",
      title: "Banks Never Ask for Sensitive Info",
      description:
        "Legitimate banks will NEVER ask for passwords, OTPs, or account details via SMS, email, or phone calls",
      example:
        "If in doubt, call your bank's official customer service number directly",
    },
    {
      icon: "eye-outline",
      title: "Look for Security Indicators",
      description:
        "Check for SSL certificates (https://), proper spelling, and official branding before entering any information",
      example: "Look for the padlock icon in your browser's address bar",
    },
    {
      icon: "warning-outline",
      title: "Beware of Urgency Tactics",
      description:
        "Scammers create false urgency. Take time to verify suspicious messages instead of acting immediately",
      example:
        "Phrases like 'verify immediately' or 'account will be blocked' are red flags",
    },
  ];

  const preventionSteps = [
    "Enable SMS alerts for all transactions",
    "Use official banking apps only",
    "Never click links in suspicious messages",
    "Keep your banking apps updated",
    "Use strong, unique passwords",
    "Enable two-factor authentication where available",
  ];

  // const handleReportCrime = () => {
  //   Linking.openURL('https://cybercrime.gov.in/');
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="shield-checkmark" size={32} color="#FFF" />
          </View>
          <TranslatedText style={styles.title}>
            How to Stay Protected
          </TranslatedText>
          <View style={styles.badge}>
            <TranslatedText style={styles.badgeText}>
              Your Security Toolkit
            </TranslatedText>
          </View>
        </View>

        <View style={styles.tipsGrid}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon} size={24} color="#3B82F6" />
                </View>
                <TranslatedText style={styles.tipTitle}>
                  {tip.title}
                </TranslatedText>
              </View>
              <TranslatedText style={styles.tipDescription}>
                {tip.description}
              </TranslatedText>
              <View style={styles.tipExample}>
                <TranslatedText style={styles.tipExampleText}>
                  {tip.example}
                </TranslatedText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <TranslatedText style={styles.checklistTitle}>
              Prevention Checklist
            </TranslatedText>
          </View>
          <TranslatedText style={styles.checklistSubtitle}>
            Follow these steps to protect yourself
          </TranslatedText>
          <View style={styles.checklistItems}>
            {preventionSteps.map((step, index) => (
              <View key={index} style={styles.checklistItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <TranslatedText style={styles.checklistItemText}>
                  {step}
                </TranslatedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reminderCard}>
          <TranslatedText style={styles.reminderTitle}>
            Remember: You Are the First Line of Defense
          </TranslatedText>
          <TranslatedText style={styles.reminderDescription}>
            Technology can help, but your awareness and caution are the most
            important factors in staying safe online. When in doubt, always:
          </TranslatedText>
          <View style={styles.reminderSteps}>
            <TranslatedText style={styles.reminderStep}>
              🛑 <TranslatedText style={styles.bold}>Stop</TranslatedText> -
              Don't act on impulse
            </TranslatedText>
            <TranslatedText style={styles.reminderStep}>
              🤔 <TranslatedText style={styles.bold}>Think</TranslatedText> - Is
              this request legitimate?
            </TranslatedText>
            <TranslatedText style={styles.reminderStep}>
              📞 <TranslatedText style={styles.bold}>Verify</TranslatedText> -
              Contact your bank directly using official numbers
            </TranslatedText>
          </View>
        </View>

        <View style={styles.congratulations}>
          <TranslatedText style={styles.congratulationsText}>
            🎓 Congratulations! You've completed the security awareness
            simulation.
          </TranslatedText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={onRestart}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <TranslatedText style={styles.restartButtonText}>
                Go to Home
              </TranslatedText>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.reportButton} onPress={handleReportCrime}>
            <Text style={styles.reportButtonText}>Report Real Cybercrime</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerIcon: {
    backgroundColor: "#10B981",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  tipsGrid: {
    gap: 24,
    marginBottom: 32,
  },
  tipCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipIcon: {
    backgroundColor: "#EBF4FF",
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  tipDescription: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 12,
  },
  tipExample: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
  },
  tipExampleText: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "#374151",
  },
  checklistCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  checklistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
    marginLeft: 8,
  },
  checklistSubtitle: {
    fontSize: 14,
    color: "#059669",
    marginBottom: 16,
  },
  checklistItems: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checklistItemText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  reminderCard: {
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B82F6",
    marginBottom: 16,
  },
  reminderDescription: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
  },
  reminderSteps: {
    gap: 8,
  },
  reminderStep: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
  },
  congratulations: {
    alignItems: "center",
    marginBottom: 32,
  },
  congratulationsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 16,
  },
  restartButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  reportButton: {
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  reportButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
});

export default SecurityTips;
