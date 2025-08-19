import React, { useEffect, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  Easing,
  Animated,
  Platform,
  BackHandler,
} from "react-native";
import {
  TriangleAlert,
  DollarSign,
  Smartphone,
  Users,
  Zap,
  ChevronRight,
  Eye,
  Hexagon,
  Star,
  Sparkles,
  Lock,
  TrendingUp,
  ShieldCheck,
  Clock,
} from "lucide-react-native";
import ChatbotButton from "../../../components/ChatbotButton";
import ChatbotPopup from "../../../components/ChatbotPopup";
import { PSBColors, PSBShadows, PSBSpacing } from "../../../utils/PSBColors";
// import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import TranslatedText from "../../../components/TranslatedText";

const { width } = Dimensions.get("window");

interface SimulatorModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "fraud" | "financial";
  route: string;
  image: any;
}

const simulatorModules: SimulatorModule[] = [
  {
    id: "ponzi-scheme-simulator",
    title: "Ponzi Scheme Simulator",
    description: "Detect and prevent investment-based fraud.",
    icon: TriangleAlert,
    category: "fraud",
    route: "/pages/PonziSimulator",
    image: require("../../../assets/ponzi.png"),
  },
  {
    id: "charity-scam-simulator",
    title: "Charity Scam Simulator",
    description: "Learn to recognize charity scams effectively.",
    icon: DollarSign,
    category: "fraud",
    route: "/pages/charityScamSimulator",
    image: require("../../../assets/charity.png"),
  },
  {
    id: "identity-theft",
    title: "Identity Theft Simulation",
    description: "Master identity theft prevention strategies.",
    icon: Users,
    category: "fraud",
    route: "/pages/identityTheftSimulator",
    image: require("../../../assets/identity.png"),
  },
  {
    id: "phishing-simulation",
    title: "Phishing Simulation",
    description: "Prevent phishing attacks in real-world scenarios.",
    icon: Smartphone,
    category: "fraud",
    route: "/pages/PhishingSimulator",
    image: require("../../../assets/phishing.png"),
  },
  {
    id: "lottery-fraud-simulator",
    title: "Lottery Fraud Simulation",
    description: "Uncover deceptive lottery scam tactics.",
    icon: TriangleAlert,
    category: "fraud",
    route: "/pages/lotteryFraudSimulator",
    image: require("../../../assets/lottery.png"),
  },
  {
    id: "loan-fraud-simulator",
    title: "Loan Fraud Simulation",
    description: "Analyze fraudulent loan transactions.",
    icon: DollarSign,
    category: "fraud",
    route: "/pages/loanScamSimulator",
    image: require("../../../assets/loan.png"),
  },
];

const FloatingParticle: React.FC<{ delay: number; color: string }> = ({
  delay,
  color,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -20,
              duration: 2000 + Math.random() * 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 1000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 2000 + Math.random() * 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 1000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    setTimeout(animate, delay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.floatingParticle,
        {
          backgroundColor: color,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    />
  );
};

const ModuleCard = ({ module }) => {
  const IconComponent = module.icon;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const glowAnim = useRef(new Animated.Value(0)).current;

  const index = simulatorModules.indexOf(module);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600 + index * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800 + index * 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),

      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    router.push(module.route);
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Beginner":
        return {
          bg: "#DCFCE7",
          text: "#166534",
          accent: "#22C55E",
        };
      case "Intermediate":
        return {
          bg: "#FEF3C7",
          text: "#92400E",
          accent: "#F59E0B",
        };
      case "Advanced":
        return {
          bg: "#FEE2E2",
          text: "#991B1B",
          accent: "#EF4444",
        };
      default:
        return {
          bg: "#DBEAFE",
          text: "#1E40AF",
          accent: "#3B82F6",
        };
    }
  };

  const difficultyColors = getDifficultyColor(module.difficulty);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.cardGlow,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Header with category and difficulty */}
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={[PSBColors.primary.green, "#14B8A6"]}
            style={styles.categoryBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Zap size={12} color="#FFFFFF" strokeWidth={2.5} />
            <TranslatedText style={styles.categoryText}>
              FRAUD DETECTION
            </TranslatedText>
          </LinearGradient>

          {module.difficulty && (
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: difficultyColors.bg },
              ]}
            >
              <View
                style={[
                  styles.difficultyDot,
                  { backgroundColor: difficultyColors.accent },
                ]}
              />
              <TranslatedText
                style={[
                  styles.difficultyText,
                  { color: difficultyColors.text },
                ]}
              >
                {module.difficulty}
              </TranslatedText>
            </View>
          )}
        </View>

        {/* Main content */}
        <View style={styles.cardContent}>
          {/* Image section with overlay */}
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              <Image source={module.image} style={styles.cardImage} />
              <LinearGradient
                colors={["rgba(0, 64, 37, 0.1)", "rgba(0, 64, 37, 0.05)"]}
                style={styles.imageOverlay}
              ></LinearGradient>
            </View>
          </View>

          {/* Text content */}
          <View style={styles.textSection}>
            <View style={styles.titleContainer}>
              <TranslatedText style={styles.cardTitle}>
                {module.title}
              </TranslatedText>
              <View style={styles.titleUnderline} />
            </View>

            <TranslatedText style={styles.cardDescription}>
              {module.description}
            </TranslatedText>
          </View>
        </View>

        {/* Footer with action button */}
        <View style={styles.cardFooter}>
          <TranslatedText style={styles.progressText}>
            Ready to start
          </TranslatedText>

          <TouchableOpacity onPress={handlePress}>
            <LinearGradient
              colors={[PSBColors.primary.green, "#14B8A6"]}
              style={styles.actionButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TranslatedText style={styles.actionText}>
                Start Training
              </TranslatedText>
              <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Floating elements */}
        {/* <View style={styles.floatingElements}>
          <View style={[styles.floatingDot, { top: 20, right: 30 }]} />
          <View
            style={[styles.floatingDot, { bottom: 40, left: 25, opacity: 0.6 }]}
          />
        </View> */}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SimulatorsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const heroScaleAnim = useRef(new Animated.Value(0.95)).current;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const fraudModules = simulatorModules.filter((m) => m.category === "fraud");

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
    (Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(),
      []);
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={PSBColors.primary.green}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={["#004025", "#00563F", "#006057"]}
          style={styles.heroHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroOverlay} />
          <FloatingParticle delay={0} color="rgba(255, 215, 0, 0.6)" />
          <FloatingParticle delay={1000} color="rgba(138, 43, 226, 0.4)" />
          <FloatingParticle delay={2000} color="rgba(0, 191, 255, 0.5)" />

          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: heroScaleAnim },
                ],
              },
            ]}
          >
            <View style={styles.brandContainer}>
              <View style={styles.logoSection}>
                <LinearGradient
                  colors={["#FFD700", "#FFA500", "#FF6B35"]}
                  style={styles.logoContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Zap size={36} color="#FFFFFF" strokeWidth={3} />
                  <View style={styles.logoGlow} />
                </LinearGradient>
                <View style={styles.sparkleField}>
                  <Sparkles
                    size={16}
                    color="#FFD700"
                    style={[styles.sparkle, { top: -8, right: -8 }]}
                  />
                  <Star
                    size={12}
                    color="#FFFFFF"
                    style={[styles.sparkle, { bottom: -6, left: -6 }]}
                  />
                  <Hexagon
                    size={10}
                    color="#FFA500"
                    style={[styles.sparkle, { top: 10, right: 15 }]}
                  />
                </View>
              </View>

              <View style={styles.brandTextContainer}>
                <TranslatedText style={styles.brandTitle}>
                  Simulation Academy
                </TranslatedText>
                <TranslatedText style={styles.brandSubtitle}>
                  Master the art of fraud detection with our interactive
                  simulators.
                </TranslatedText>
                <View style={styles.brandFeatures}>
                  <View style={styles.featurePill}>
                    <Lock size={12} color="#10B981" strokeWidth={2} />
                    <TranslatedText style={styles.featureText}>
                      Enterprise Security
                    </TranslatedText>
                  </View>
                  <View style={styles.featurePill}>
                    <Eye size={12} color="#3B82F6" strokeWidth={2} />
                    <TranslatedText style={styles.featureText}>
                      AI Analytics
                    </TranslatedText>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.cardList}>
          {fraudModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </View>
      </ScrollView>

      <ChatbotButton onPress={() => setPopupVisible(true)} />
      <ChatbotPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PSBColors.background.secondary,
  },
  // heroHeader: {
  //   backgroundColor: PSBColors.primary.green,
  //   paddingTop: 50,
  //   paddingBottom: 30,
  //   paddingHorizontal: PSBSpacing.lg,
  // },
  // heroContent: {
  //   alignItems: "center",
  // },
  // brandContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginTop: 16,
  // },
  // logoContainer: {
  //   width: 56,
  //   height: 56,
  //   borderRadius: 28,
  //   backgroundColor: PSBColors.primary.gold,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginRight: 14,
  //   ...PSBShadows.lg,
  // },
  // brandTitle: {
  //   fontSize: 24,
  //   fontWeight: "800",
  //   color: PSBColors.text.inverse,
  //   letterSpacing: -0.3,
  // },
  // brandSubtitle: {
  //   fontSize: 14,
  //   color: PSBColors.text.inverse,
  //   fontWeight: "500",
  // },
  scrollContainer: {
    paddingBottom: 40,
    // paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PSBColors.text.primary,
    marginBottom: 16,
  },
  cardList: {
    gap: 20,
  },
  // card: {
  //   flexDirection: "row",
  //   backgroundColor: "#fff",
  //   borderRadius: 16,
  //   overflow: "hidden",
  //   ...PSBShadows.md,
  //   alignSelf: "center",
  //   padding: 12,
  //   gap: 12,
  //   elevation: 3,
  //   width: width - 32,
  //   minHeight: 120,
  //   borderColor: PSBColors.border.primary,
  //   borderWidth: 1,
  // },
  // imageWrapper: {
  //   width: "40%",
  //   aspectRatio: 4 / 3, // or 4/3 if needed
  //   borderRadius: 12,
  //   overflow: "hidden",
  //   backgroundColor: "transparent", // no background to avoid contrast
  //   padding: 0,
  //   margin: 0,
  // },
  // cardImage: {
  //   width: "100%",
  //   height: "100%",
  //   resizeMode: "contain", // you can switch to "contain" if still overflows
  // },
  cardRight: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardTextContainer: {
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: PSBColors.text.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: PSBColors.text.secondary,
    lineHeight: 18,
  },
  cardRightBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  heroHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
    position: "relative",
    overflow: "hidden",
    marginBottom: 20,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    top: "20%",
    right: "15%",
  },
  heroContent: {
    alignItems: "center",
    zIndex: 1,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoSection: {
    position: "relative",
    marginBottom: 24,
  },
  logoContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 15,
    position: "relative",
  },
  logoGlow: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 48,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    zIndex: -1,
  },
  sparkleField: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -18,
    left: -18,
  },
  sparkle: {
    position: "absolute",
  },
  brandTextContainer: {
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  brandSubtitle: {
    fontSize: 16,
    color: "#E2E8F0",
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  brandFeatures: {
    flexDirection: "row",
    gap: 12,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    gap: 6,
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  heroStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    // backdropFilter: "blur(10px)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#CBD5E1",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 10,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  floatingParticle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    top: "20%",
    left: "20%",
  },
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(0, 64, 37, 0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  cardGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 28,
    backgroundColor: PSBColors.primary.green,
    zIndex: -1,
  },
  shimmerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    overflow: "hidden",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  shimmer: {
    width: 100,
    height: "100%",
    backgroundColor: "rgba(0, 64, 37, 0.3)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    shadowColor: PSBColors.primary.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cardContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
  },
  imageSection: {
    width: 140,
  },
  imageWrapper: {
    width: "100%",
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: PSBColors.background.tertiary,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  textSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    marginBottom: 8,
  },
  // cardTitle: {
  //   fontSize: 20,
  //   fontWeight: "800",
  //   color: PSBColors.text.primary,
  //   lineHeight: 26,
  //   letterSpacing: -0.3,
  // },
  titleUnderline: {
    width: 30,
    height: 3,
    backgroundColor: PSBColors.primary.green,
    borderRadius: 2,
    marginTop: 4,
  },
  // cardDescription: {
  //   fontSize: 15,
  //   color: PSBColors.text.secondary,
  //   lineHeight: 22,
  //   marginBottom: 12,
  //   fontWeight: "500",
  // },
  metaContainer: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: PSBColors.text.tertiary,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 16,
    // borderTopWidth: 1,
    // borderTopColor: "rgba(0, 0, 0, 0.05)",
    // backgroundColor: "rgba(248, 250, 252, 0.8)",
  },
  progressIndicator: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(0, 64, 37, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: PSBColors.primary.green,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12.5,
    color: PSBColors.text.tertiary,
    fontWeight: "600",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: PSBColors.primary.green,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // elevation: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  floatingElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  floatingDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0, 64, 37, 0.15)",
  },
});
