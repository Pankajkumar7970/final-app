import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  PSBBorderRadius,
  PSBColors,
  PSBShadows,
  PSBSpacing,
} from "../../../utils/PSBColors";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeToggle from "../../../components/ThemeToggle";
import {
  Award,
  ChartBar as BarChart3,
  Brain,
  Calculator,
  ChevronRight,
  CreditCard,
  Eye,
  Flag,
  GraduationCap,
  Lock,
  Play,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react-native";
import ChatbotButton from "../../../components/ChatbotButton";
import ChatbotPopup from "../../../components/ChatbotPopup";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";
import API from "../../../api/api";
import Toast from "react-native-toast-message";

const width = Dimensions.get("window").width;

const home = () => {
  const features = [
    {
      id: 1,
      title: "Simulators",
      description: "Understand fraud schemes through live simulations",
      icon: Brain,
      color: PSBColors.primary.green,
      route: "/(tabs)/simulator",
    },
    {
      id: 2,
      title: "Quizzes",
      description: "Test your financial fraud awareness skills",
      icon: Flag,
      color: PSBColors.primary.gold,
      route: "/pages/QuizzesScreen",
    },
    {
      id: 3,
      title: "Decision Scenarios",
      description: "Practice secure financial decision making",
      icon: Target,
      color: PSBColors.primary.gold,
      route: "/pages/ScenarioHub",
    },
    {
      id: 4,
      title: "Education Center",
      description: "Trusted resources for fraud prevention",
      icon: GraduationCap,
      color: PSBColors.primary.green,
      route: "/(app)/(tabs)/education",
    },
  ];

  const exploreTools = [
    {
      id: 1,
      title: "EMI Calculator",
      description: "Calculate loan EMIs with precision and ease",
      icon: Calculator,
      color: "#FF6B35",
      bgColor: "#FFF3E0",
      route: "/pages/FdAndRdCalculator",
      badge: "Popular",
      gradient: ["#FFF8F3", "#FFF3E0"],
    },
    {
      id: 2,
      title: "Tax Calculator",
      description: "Calculate your tax liability accurately",
      icon: BarChart3,
      color: "#9C27B0",
      bgColor: "#F3E5F5",
      route: "/pages/TaxCalculator",
      gradient: ["#FCF7FF", "#F3E5F5"],
    },
    {
      id: 3,
      title: "SIP Calculator",
      description: "Plan your investments for better returns",
      icon: TrendingUp,
      color: "#4CAF50",
      bgColor: "#E8F5E8",
      route: "/pages/SipTool",
      badge: "New",
      gradient: ["#F8FFF8", "#E8F5E8"],
    },
    {
      id: 4,
      title: "URL Analyzer",
      description: "Check suspicious URLs for safety",
      icon: Search,
      color: "#FF5722",
      bgColor: "#FBE9E7",
      route: "/pages/UrlAnalysisTool",
      gradient: ["#FFFAF9", "#FBE9E7"],
    },
  ];

  const ourSimulators = [
    {
      id: 1,
      title: "Phishing Simulator",
      description: "Learn to spot phishing attempts",
      icon: Smartphone,
      color: "#E91E63",
      gradient: ["#667eea", "#764ba2"] as const,
      route: "/pages/PhishingSimulator",
      difficulty: "Beginner",
    },
    {
      id: 2,
      title: "OTP Fraud",
      description: "Understand OTP scams",
      icon: Lock,
      color: "#9C27B0",
      gradient: ["#f5576c", "#F50057"] as const,
      route: "/pages/identityTheftSimulator/index",
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "Loan Scams",
      description: "Identify loan fraud patterns",
      icon: CreditCard,
      color: "#00BCD4",
      gradient: ["#00f2fe", "#4facfe"] as const,
      route: "/pages/loanScamSimulator/index",
      difficulty: "Advanced",
    },
    {
      id: 4,
      title: "Lottery Fraud",
      description: "Spot lottery scams",
      icon: Award,
      color: "#FF9800",
      gradient: ["#8b5cf6", "#a855f7"] as const,
      route: "/pages/lotteryFraudSimulator/index",
      difficulty: "Beginner",
    },
  ];

  const stats = [
    { label: "Schemes Exposed", value: "50+", icon: Eye, color: "#FF6B6B" },
    { label: "Users Protected", value: "10K+", icon: Shield, color: "#4ECDC4" },
    { label: "Success Rate", value: "95%", icon: TrendingUp, color: "#45B7D1" },
  ];

  const tips = [
    {
      title: "Secure Transactions",
      icon: "🔐",
      content:
        "Never share OTPs—even with bank employees. Banks will never ask for OTPs over phone.",
      gradient: [PSBColors.primary.lightGreen, "#F0FDF4"],
    },
    {
      title: "Verify URLs",
      icon: "🌐",
      content:
        "Always check URLs for HTTPS and correct spelling before entering sensitive information.",
      gradient: ["#DBEAFE", "#EFF6FF"],
    },
    {
      title: "Email Safety",
      icon: "📧",
      content:
        "Be cautious with email links. Verify sender authenticity before clicking any links.",
      gradient: ["#FEF3C7", "#FFFBEB"],
    },
  ];

  const dailyQuiz = {
    title: "Daily Challenge",
    description: "Test your fraud awareness knowledge",
    question: "What should you do if you receive an SMS asking for your OTP?",
    options: [
      "Share it immediately",
      "Ignore and delete the message",
      "Call the number back",
      "Forward to friends",
    ],
    correctAnswer: 1,
    icon: Sparkles,
    color: PSBColors.primary.green,
    bgGradient: [PSBColors.primary.lightGreen, "#F0FDF4"],
    route: "/pages/QuizzesScreen",
  };

  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const AnimatedView = Animated.createAnimatedComponent(View);

  const [streakMessage, setStreakMessage] = useState("");

  useEffect(() => {
    const updateStreak = async () => {
      try {
        const res = await API.post("/streak");
        // 🔑 no need to attach headers manually, interceptor already adds token
        setStreakMessage(res.data.message || "🔥 Welcome back!");
      } catch (err) {
        console.error("Streak error:", err.response?.data || err.message);
        setStreakMessage("⚠ Unable to update streak");
      } finally {
        // setLoading(false);
      }
    };

    updateStreak();
  }, []);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert("Exit", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    );

    return () => backHandler.remove(); // Clean up the listener
  });

  // ✅ Smooth fade-in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  useEffect(() => {
    Animated.timing(cardFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [cardFadeAnim]);

  // Continuous rotation for sparkle icon
  Animated.loop(
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    })
  ).start();

  // Wave animation for emoji
  Animated.loop(
    Animated.sequence([
      Animated.timing(waveAnim, {
        toValue: -15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(waveAnim, {
        toValue: 15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(waveAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ])
  ).start();

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % tips.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * (width - 30),
        animated: true,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(xOffset / (width - 30));
    setCurrentIndex(newIndex);
  };

  const featureScaleAnim = new Animated.Value(1);
  const handlePressIn = () => {
    Animated.spring(featureScaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(featureScaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleOptionPress = (index: number) => {
    setSelectedOption(index);
    const correct = index === dailyQuiz.correctAnswer;
    setIsCorrect(correct);
  };
  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "#10B981";
      case "intermediate":
        return "#F59E0B";
      case "advanced":
        return "#EF4444";
      case "expert":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  return (
    <LinearGradient
      colors={[PSBColors.background.primary, PSBColors.background.secondary]}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={PSBColors.primary.green}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <AnimatedView style={[styles.header, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[
                PSBColors.gradient.primary[0],
                PSBColors.gradient.primary[1],
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <View style={styles.greetingWrapper}>
                  <View style={styles.logoRow}>
                    <View style={styles.logoContainer}>
                      <Shield size={28} color={PSBColors.primary.gold} />
                      <Text style={styles.logoText}>FinEduGuard</Text>
                    </View>
                  </View>
                  <View style={styles.greetingRow}>
                    <Text style={styles.greeting}>Welcome Back!</Text>
                    <Animated.Text
                      style={[
                        styles.waveEmoji,
                        {
                          transform: [
                            {
                              rotate: waveAnim.interpolate({
                                inputRange: [-15, 15],
                                outputRange: ["-15deg", "15deg"],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      👋
                    </Animated.Text>
                  </View>
                  <Text style={styles.subtitle}>
                    Stay protected with FinEduGuard
                  </Text>
                  <View style={styles.headerStats}>
                    <View style={styles.headerStatItem}>
                      <Star size={14} color={PSBColors.primary.gold} />
                      <Text style={styles.headerStatText}>PSB Certified</Text>
                    </View>
                    <View style={styles.headerStatItem}>
                      <Users size={14} color={PSBColors.primary.gold} />
                      <Text style={styles.headerStatText}>10K+ Protected</Text>
                    </View>
                  </View>
                </View>
                <ThemeToggle />
              </View>
            </LinearGradient>
          </AnimatedView>

          {/* Stats */}
          <AnimatedView
            style={[
              styles.statsContainer,
              {
                opacity: cardFadeAnim,
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Our Impact</Text>
            <View style={styles.statsRow}>
              {stats.map((stat, index) => (
                <AnimatedView
                  key={index}
                  style={[
                    styles.statCard,
                    {
                      opacity: cardFadeAnim,
                    },
                    PSBShadows.md,
                  ]}
                >
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: stat.color + "20" },
                    ]}
                  >
                    <stat.icon size={28} color={stat.color} />
                  </View>
                  <Text style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </AnimatedView>
              ))}
            </View>
          </AnimatedView>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Explore Services</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature) => (
                <AnimatedTouchable
                  key={feature.id}
                  style={[
                    styles.featureCard,
                    {
                      opacity: cardFadeAnim,
                      // transform: [{ scale: scaleAnim }],
                    },
                  ]}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => router.push(feature.route as any)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={["#FFFFFF", "#FFF8E1"]}
                    style={[
                      styles.featureGradient,
                      { borderColor: feature.color },
                    ]}
                  >
                    <feature.icon size={32} color={feature.color} />
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </LinearGradient>
                </AnimatedTouchable>
              ))}
            </View>
          </View>

          {/* Explore Tools Section */}
          <View style={[styles.toolsContainer, { marginBottom: 70 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore Tools</Text>
              <AnimatedTouchable
                style={styles.viewAllButton}
                onPress={() => router.push("/(tabs)/tools")}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={PSBColors.primary.green} />
              </AnimatedTouchable>
            </View>
            <View style={[styles.toolsGrid, { marginTop: -50 }]}>
              {exploreTools.map((tool, index) => (
                <AnimatedTouchable
                  key={tool.id}
                  style={[
                    styles.toolCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideUpAnim }],
                    },
                  ]}
                  onPress={() => handleCardPress(tool.route)}
                  activeOpacity={0.95}
                >
                  <LinearGradient
                    colors={[tool.gradient[0], tool.gradient[1]]}
                    style={[
                      styles.toolGradient,
                      {
                        borderColor: tool.color,
                        borderWidth: 0.8,
                      },
                    ]}
                  >
                    <View style={styles.toolHeader}>
                      <View
                        style={[
                          styles.toolIconContainer,
                          {
                            backgroundColor: tool.color + "15",
                            borderColor: tool.color + "25",
                          },
                        ]}
                      >
                        <tool.icon
                          size={22}
                          color={tool.color}
                          strokeWidth={2.5}
                        />
                      </View>
                      {tool.badge && (
                        <View
                          style={[
                            styles.toolBadge,
                            { backgroundColor: tool.color },
                          ]}
                        >
                          <Text style={styles.toolBadgeText}>{tool.badge}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.toolContent}>
                      <Text style={[styles.toolTitle, { color: tool.color }]}>
                        {tool.title}
                      </Text>
                      <Text style={styles.toolDescription}>
                        {tool.description}
                      </Text>
                    </View>
                    <View style={styles.toolFooter}>
                      <View style={styles.toolAction}>
                        <Text
                          style={[styles.toolActionText, { color: tool.color }]}
                        >
                          Try Now
                        </Text>
                        <ChevronRight
                          size={14}
                          color={tool.color}
                          strokeWidth={2}
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </AnimatedTouchable>
              ))}
            </View>
          </View>

          {/* Our Simulators Section */}
          <View style={styles.simulatorsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Simulators</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push("/(tabs)/simulator")}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={PSBColors.primary.green} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              // contentContainerStyle={styles.simulatorsScroll}
              decelerationRate="fast"
              snapToInterval={width * 0.75 + 16}
              snapToAlignment="start"
            >
              {ourSimulators.map((simulator, index) => (
                <TouchableOpacity
                  key={simulator.id}
                  style={styles.simulatorCard}
                  onPress={() => handleCardPress(simulator.route)}
                  activeOpacity={0.95}
                >
                  <View style={styles.cardContainer}>
                    <LinearGradient
                      colors={[
                        ...simulator.gradient,
                        simulator.gradient[1] + "E6",
                      ]}
                      style={styles.simulatorGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {/* Card Content */}
                      <View style={styles.cardContent}>
                        {/* Header Section */}
                        <View style={styles.simulatorHeader}>
                          <View style={styles.simulatorIconContainer}>
                            <simulator.icon
                              size={24}
                              color="#FFFFFF"
                              strokeWidth={2}
                            />
                          </View>
                          <View
                            style={[
                              styles.difficultyBadge,
                              {
                                backgroundColor: getDifficultyColor(
                                  simulator.difficulty
                                ),
                              },
                            ]}
                          >
                            <Text style={styles.difficultyText}>
                              {simulator.difficulty}
                            </Text>
                          </View>
                        </View>

                        {/* Main Content */}
                        <View style={styles.simulatorContent}>
                          <Text style={styles.simulatorTitle}>
                            {simulator.title}
                          </Text>
                          <Text style={styles.simulatorDescription}>
                            {simulator.description}
                          </Text>
                        </View>

                        {/* Footer */}
                        <View style={styles.simulatorFooter}>
                          <View style={styles.actionContainer}>
                            <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                            <Text style={styles.simulatorAction}>
                              Start Simulation
                            </Text>
                          </View>
                          <ChevronRight
                            size={16}
                            color="#FFFFFF"
                            strokeWidth={2}
                          />
                        </View>
                      </View>

                      {/* Subtle Pattern Overlay */}
                      <View style={styles.patternOverlay} />
                    </LinearGradient>

                    {/* Glass Effect Border */}
                    <View style={styles.glassBorder} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Daily Quiz Section */}
          <View style={styles.quizContainer}>
            <Text style={styles.sectionTitle}>Daily Challenge</Text>
            <TouchableOpacity
              style={[
                styles.quizCard,
                PSBShadows.lg,
                { borderWidth: 1, borderColor: dailyQuiz.color + "20" },
              ]}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[dailyQuiz.bgGradient[0], dailyQuiz.bgGradient[1]]}
                style={styles.quizGradient}
              >
                <View style={styles.quizHeader}>
                  <View style={styles.quizIconContainer}>
                    <Animated.View
                      style={{
                        transform: [
                          {
                            rotate: rotateAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0deg", "360deg"],
                            }),
                          },
                        ],
                      }}
                    >
                      <dailyQuiz.icon size={28} color={dailyQuiz.color} />
                    </Animated.View>
                  </View>
                  <View
                    style={[
                      styles.quizBadge,
                      { backgroundColor: PSBColors.primary.gold },
                    ]}
                  >
                    <Text style={styles.quizBadgeText}>TODAY</Text>
                  </View>
                </View>

                <View style={styles.quizContent}>
                  <Text style={styles.quizTitle}>{dailyQuiz.title}</Text>
                  <Text style={styles.quizDescription}>
                    {dailyQuiz.description}
                  </Text>

                  <View style={styles.quizQuestionContainer}>
                    <Text style={styles.quizQuestion}>
                      {dailyQuiz.question}
                    </Text>
                    <View style={styles.quizOptionsContainer}>
                      {dailyQuiz.options.map((option, index) => {
                        const isSelected = selectedOption === index;
                        const correct = index === dailyQuiz.correctAnswer;

                        return (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.quizOption,
                              isSelected &&
                                (isCorrect
                                  ? styles.correctOption
                                  : styles.wrongOption),
                              selectedOption !== null &&
                                !isCorrect &&
                                correct &&
                                styles.correctOption,
                            ]}
                            onPress={() => handleOptionPress(index)}
                            disabled={selectedOption !== null}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.quizOptionText,
                                isSelected &&
                                  (isCorrect
                                    ? styles.correctOptionText
                                    : styles.wrongOptionText),
                                selectedOption !== null &&
                                  !isCorrect &&
                                  correct &&
                                  styles.correctOptionText,
                              ]}
                            >
                              {String.fromCharCode(65 + index)}. {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {selectedOption !== null && (
                      <View style={styles.feedbackContainer}>
                        <Text
                          style={[
                            styles.quizFeedbackText,
                            {
                              color: isCorrect
                                ? PSBColors.status.success
                                : PSBColors.status.error,
                            },
                          ]}
                        >
                          {isCorrect
                            ? "🎉 Perfect! You know how to stay safe!"
                            : "💡 Learn more in our comprehensive quizzes!"}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.takeQuizButton,
                            { backgroundColor: PSBColors.primary.green },
                          ]}
                          onPress={() => router.push(dailyQuiz.route)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.takeQuizButtonText}>
                            Take Full Quiz
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Enhanced Tips Carousel with PSB Colors */}
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Security Tips</Text>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tipsScroll}
              onScroll={handleScroll}
              scrollEventThrottle={0.0001}
            >
              {tips.map((tip, index) => (
                <View
                  key={index}
                  style={[styles.tipCard, { width: width - 50 }]}
                >
                  <LinearGradient
                    colors={[tip.gradient[0], tip.gradient[1]]}
                    style={[styles.tipGradient, PSBShadows.md]}
                  >
                    <View style={styles.tipIconContainer}>
                      <Text style={styles.tipIcon}>{tip.icon}</Text>
                    </View>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
                      <Text style={styles.tipText}>{tip.content}</Text>
                    </View>
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>

            {/* Pagination Dots with PSB Colors */}
            <View style={styles.paginationContainer}>
              {tips.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Chatbot */}
        <ChatbotButton onPress={() => setPopupVisible(true)} />
        <ChatbotPopup
          visible={isPopupVisible}
          onClose={() => setPopupVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header with Logo
  header: {
    marginBottom: PSBSpacing.lg,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: PSBSpacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greetingWrapper: {
    flex: 1,
    paddingRight: 15,
  },
  logoRow: {
    marginBottom: PSBSpacing.md,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: PSBColors.primary.gold,
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: PSBSpacing.sm,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: PSBColors.text.inverse,
    marginRight: 10,
  },
  waveEmoji: {
    fontSize: 24,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 16,
    color: PSBColors.text.inverse,
    marginBottom: 15,
    fontWeight: "400",
    opacity: 0.95,
  },
  headerStats: {
    flexDirection: "row",
    gap: 20,
  },
  headerStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerStatText: {
    color: PSBColors.text.inverse,
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.9,
  },

  // Stats Section
  statsContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: PSBSpacing.xl,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: PSBColors.primary.green,
    // marginBottom: PSBSpacing.lg,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsRow: {
    marginTop: PSBSpacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: PSBColors.background.card,
    borderRadius: PSBBorderRadius.lg,
    paddingVertical: 16,
    alignItems: "center",
    ...PSBShadows.md,
    borderWidth: 1,
    borderColor: "rgba(2, 0, 2, 0.1)",
    paddingHorizontal: 12,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: PSBColors.primary.green,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },

  // Features Section
  featuresContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: PSBSpacing.xl,
  },
  featuresGrid: {
    marginTop: PSBSpacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 60) / 2,
    height: 160,
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
    ...PSBShadows.lg,
  },
  featureGradient: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
    color: PSBColors.primary.green,
  },
  featureDescription: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },

  // Enhanced Tools Section
  toolsContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: PSBSpacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: PSBSpacing.lg,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: PSBColors.primary.green + "15",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PSBColors.primary.green + "30",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: PSBColors.primary.green,
    marginRight: 4,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  toolCard: {
    width: (width - 60) / 2,
    height: 180,
    marginBottom: PSBSpacing.lg,
    borderRadius: 20,
    overflow: "hidden",
    ...PSBShadows.lg,
  },
  toolGradient: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    // borderWidth: 0.7,
    // borderColor: "rgba(0,0,0,0.07)",
  },
  toolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  toolContent: {
    flex: 1,
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  toolDescription: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    lineHeight: 16,
  },
  toolFooter: {
    marginTop: "auto",
  },
  toolAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  toolActionText: {
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  toolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  toolBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Simulators Section
  simulatorsContainer: {
    marginBottom: PSBSpacing.xl,
    paddingHorizontal: PSBSpacing.lg,
  },
  // simulatorsScroll: {
  //   paddingLeft: PSBSpacing.lg,
  //   paddingRight: 4,
  // },
  simulatorCard: {
    width: width * 0.75,
    height: 200,
    marginRight: 16,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 20,
    ...PSBShadows.accent,
  },
  simulatorGradient: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardContent: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  simulatorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  simulatorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  simulatorContent: {
    flex: 1,
    justifyContent: "center",
  },
  simulatorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  simulatorDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 20,
    fontWeight: "400",
  },
  simulatorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  simulatorAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
    letterSpacing: -0.1,
  },
  patternOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: "transparent",
    borderRadius: 20,
  },
  glassBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    pointerEvents: "none",
  },

  // Quiz Section
  quizContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: PSBSpacing.xl,
  },
  quizCard: {
    marginTop: PSBSpacing.lg,
    borderRadius: 24,
    overflow: "hidden",
  },
  quizGradient: {
    padding: 24,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  quizIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PSBColors.background.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  quizBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: PSBBorderRadius.lg,
  },
  quizBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: PSBColors.text.inverse,
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PSBColors.text.accent,
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  quizQuestionContainer: {
    marginBottom: 16,
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: PSBColors.text.primary,
    marginBottom: 16,
    lineHeight: 24,
  },
  quizOptionsContainer: {
    gap: 12,
  },
  quizOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: PSBColors.background.primary,
    borderRadius: PSBBorderRadius.lg,
    borderWidth: 1,
    borderColor: PSBColors.border.primary,
    ...PSBShadows.sm,
  },
  quizOptionText: {
    fontSize: 14,
    color: PSBColors.text.primary,
    lineHeight: 20,
    fontWeight: "500",
  },
  correctOption: {
    backgroundColor: "#DCFCE7",
    borderColor: PSBColors.status.success,
  },
  wrongOption: {
    backgroundColor: "#FEE2E2",
    borderColor: PSBColors.status.error,
  },
  correctOptionText: {
    color: PSBColors.status.success,
    fontWeight: "600",
  },
  wrongOptionText: {
    color: PSBColors.status.error,
    fontWeight: "600",
  },
  feedbackContainer: {
    marginTop: 16,
    alignItems: "center",
    gap: 12,
  },
  quizFeedbackText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  takeQuizButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: PSBBorderRadius.lg,
    ...PSBShadows.sm,
  },
  takeQuizButtonText: {
    color: PSBColors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
  },

  // Tips Section
  tipsContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: -55,
    // marginBottom: PSBSpacing.xl,
  },
  tipsScroll: {
    paddingRight: 20,
  },
  tipCard: {
    marginRight: 20,
    marginTop: PSBSpacing.lg,
    borderRadius: PSBBorderRadius.xl,
    overflow: "hidden",
    borderWidth: 0.8,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  tipGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 120,
    borderRadius: PSBBorderRadius.xl,
  },
  tipIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    ...PSBShadows.sm,
  },
  tipIcon: {
    fontSize: 28,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: PSBColors.text.accent,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: PSBColors.text.primary,
    lineHeight: 18,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PSBColors.border.secondary,
  },
  paginationDotActive: {
    backgroundColor: PSBColors.primary.green,
    width: 24,
  },
});

export default home;
