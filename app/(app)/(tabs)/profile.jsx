import React, { useState, useEffect,useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  Platform,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Trophy,
  Flag,
  BookOpen,
  Brain,
  Award,
  Bell,
  Globe,
  CircleHelp as HelpCircle,
  Info,
  LogOut,
  Shield,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Target,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { setUser } from "../../../redux/slices/profileSlices";
import { router, useFocusEffect } from "expo-router";
import * as Animatable from "react-native-animatable";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { PSBColors, PSBShadows, PSBSpacing } from "../../../utils/PSBColors";
import Goals from "../../../components/Goals";
import { useGoals } from "../../../contexts/GoalsContext";
import { colors } from "../../../utils/colors";
import API from "../../../api/api";
import TranslatedText from "../../../components/TranslatedText";

const { width } = Dimensions.get("window");
const levelThresholds = [0, 200, 500, 1000, 2000, 5000];

const ProfileScreen = () => {
  const { resetState, setLoginState } = useGoals();
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const userProfile = useSelector((state) => state.profile?.user);
  const [userData, setUserData] = useState(null);

  const progress = useSharedValue(0);
  const headerScale = useSharedValue(1);
  const [userStats, setUserStats] = useState({
    coursesCompleted: 0,
    scenariosCompleted: 0,
    quizzesCompleted: 0,
    simulatorsUsed: 0,
    currentLevel: 1,
    experiencePoints: 0,
    nextLevelXP: 0,
  });

  const loadUserStats = useCallback(async () => {
  try {
    console.log("Requesting user data...");
    const user = await API.get("/users/currentuser");
    console.log("User stats:", user.data.user);

    const stats = await API.get("/progress");

    const numCompletedCourses = stats.data.progress.filter(
      (item) => item.type === "course"
    ).length;

    const numCompletedScenarios = stats.data.progress.filter(
      (item) => item.type === "scenario"
    ).length;

    const numCompletedQuizzes = stats.data.progress.filter(
      (item) => item.type === "quiz"
    ).length;

    const numSimulatorsUsed = stats.data.progress.filter(
      (item) => item.type === "simulator"
    ).length;

    setUserStats((prev) => ({
      ...prev,
      experiencePoints: user.data.user.totalExperiencePoints,
      currentLevel: user.data.user.level,
      nextLevelXP: levelThresholds[user.data.user.level],
      coursesCompleted: numCompletedCourses,
      scenariosCompleted: numCompletedScenarios,
      quizzesCompleted: numCompletedQuizzes,
      simulatorsUsed: numSimulatorsUsed,
    }));
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
}, []);


    useFocusEffect(
    useCallback(() => {
      loadUserStats();
    }, [loadUserStats])
  );



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
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    if (!userProfile) {
      loadUserData();
    } else {
      setUserData(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    setLoginState();
    headerScale.value = withSpring(1, { damping: 15 });
  }, []);

  const progressPercentage =
    (userStats.experiencePoints / userStats.nextLevelXP) * 100;

  useEffect(() => {
    progress.value = withTiming(progressPercentage, { duration: 1200 });
  }, [progressPercentage]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
      backgroundColor: PSBColors.primary.gold,
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: headerScale.value }],
    };
  });

  const badges = [
    { name: "Red Flag Spotter", icon: Flag, color: "#ff6b6b", earned: true },
    { name: "Collapse Survivor", icon: Shield, color: "#4ecdc4", earned: true },
    { name: "Financial Detective", icon: "🔍", color: "#45b7d1", earned: true },
    { name: "Story Master", icon: BookOpen, color: "#96ceb4", earned: true },
    { name: "Scheme Buster", icon: "⚖️", color: "#ffd93d", earned: true },
    { name: "Fraud Fighter", icon: "🛡️", color: "#ff9ff3", earned: true },
    { name: "Awareness Champion", icon: "📢", color: "#54a0ff", earned: false },
    {
      name: "Master Educator",
      icon: GraduationCap,
      color: "#5f27cd",
      earned: false,
    },
  ];

  const achievements = [
    {
      title: "First Simulation",
      description: "Completed your first Ponzi scheme simulation",
      date: "2024-01-15",
      icon: Target,
      color: "#4ecdc4",
    },
    {
      title: "Red Flag Expert",
      description: "Spotted 50 red flags in the detection game",
      date: "2024-01-20",
      icon: Flag,
      color: "#ff6b6b",
    },
    {
      title: "Story Enthusiast",
      description: "Completed 10 story mode scenarios",
      date: "2024-01-25",
      icon: BookOpen,
      color: "#45b7d1",
    },
  ];

  const settingsOptions = [
    { icon: Bell, title: "Notifications", color: "#4ecdc4" },
    { icon: Globe, title: "Language", color: "#45b7d1" },
    {
      icon: HelpCircle,
      title: "Help & Support",
      color: "#96ceb4",
      action: () => router.push("/pages/LearnScreen"),
    },
    {
      icon: Info,
      title: "About",
      color: "#ffd93d",
      action: () => router.push("/pages/about"),
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            dispatch(setUser(null));
            resetState();
            await signOut();
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const SectionDivider = () => <View style={styles.sectionDivider} />;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Enhanced Header */}
          <LinearGradient
            colors={[PSBColors.primary.green, "#006B4F"]}
            style={styles.headerGradient}
          >
            <Animated.View style={[styles.header, animatedHeaderStyle]}>
              <Animatable.View
                animation="bounceIn"
                duration={1000}
                style={styles.avatarContainer}
              >
                {userData?.avatar ? (
                  <Image
                    source={{ uri: userData.avatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={[PSBColors.primary.gold, "#E6B800"]}
                    style={styles.avatar}
                  >
                    <User size={40} color="white" />
                  </LinearGradient>
                )}
                <View style={styles.onlineIndicator} />
              </Animatable.View>

              <TranslatedText style={styles.userName}>
                {userData
                  ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                  : "Fraud Fighter"}
              </TranslatedText>
              <TranslatedText style={styles.userLevel}>
                Level {userStats.currentLevel}
              </TranslatedText>

              {/* Experience Points Display */}
              <View style={styles.xpContainer}>
                <TrendingUp size={16} color={PSBColors.primary.gold} />
                <TranslatedText style={styles.xpText}>
                  {userStats.experiencePoints} XP
                </TranslatedText>
              </View>
            </Animated.View>
          </LinearGradient>

          <View style={styles.contentContainer}>
            {/* Enhanced Progress Section */}
            <View style={styles.sectionContainer}>
              <Animatable.View
                delay={200}
                duration={800}
                style={styles.progressSection}
              >
                <View style={styles.progressCard}>
                  <View style={styles.progressHeader}>
                    <View style={styles.progressInfo}>
                      <View style={styles.sectionIconContainer}>
                        <Award size={24} color={PSBColors.primary.green} />
                      </View>
                      <View style={styles.progressTextContainer}>
                        <TranslatedText style={styles.progressTitle}>
                          Level Progress
                        </TranslatedText>
                        <TranslatedText style={styles.progressSubtitle}>
                          {userStats.nextLevelXP - userStats.experiencePoints}{" "}
                          XP to next level
                        </TranslatedText>
                      </View>
                    </View>
                    <View style={styles.progressPercentageContainer}>
                      <TranslatedText style={styles.progressPercentage}>
                        {Math.round(progressPercentage)}%
                      </TranslatedText>
                    </View>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <Animated.View
                        style={[styles.progressFill, animatedProgressStyle]}
                      />
                    </View>
                  </View>

                  <View style={styles.progressLabels}>
                    <TranslatedText style={styles.progressLabelText}>
                      {userStats.experiencePoints} XP
                    </TranslatedText>
                    <TranslatedText style={styles.progressLabelText}>
                      {userStats.nextLevelXP} XP
                    </TranslatedText>
                  </View>
                </View>
              </Animatable.View>
            </View>

            <SectionDivider />

            {/* Goals Section */}
            <View style={styles.sectionContainer}>
              <Goals />
            </View>

            <SectionDivider />

            {/* Enhanced Stats Section */}
            <View style={styles.sectionContainer}>
              <Animatable.View animation="fadeIn" delay={300} duration={800}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconContainer}>
                    <Brain size={24} color={PSBColors.primary.green} />
                  </View>
                  <TranslatedText style={styles.sectionTitle}>
                    Performance Stats
                  </TranslatedText>
                </View>

                <View style={styles.statsContainer}>
                  {[
                    {
                      icon: Flag,
                      value: userStats.scenariosCompleted,
                      label: "Scenarios Completed",
                      color: "#ff6b6b",
                    },
                    {
                      icon: Shield,
                      value: userStats.simulatorsUsed,
                      label: "Simulators Used",
                      color: "#4ecdc4",
                    },
                    {
                      icon: BookOpen,
                      value: userStats.quizzesCompleted,
                      label: "Quizzes Completed",
                      color: "#45b7d1",
                    },
                    {
                      icon: Trophy,
                      value: userStats.coursesCompleted,
                      label: "Courses Completed",
                      color: "#ffd93d",
                    },
                  ].map((stat, index) => (
                    <Animatable.View
                      key={index}
                      animation="bounceIn"
                      delay={400 + index * 100}
                      style={styles.statCard}
                    >
                      <LinearGradient
                        colors={[`${stat.color}20`, `${stat.color}10`]}
                        style={styles.statIconContainer}
                      >
                        <stat.icon size={28} color={stat.color} />
                      </LinearGradient>
                      <TranslatedText style={styles.statValue}>
                        {stat.value}
                      </TranslatedText>
                      <TranslatedText style={styles.statLabel}>
                        {stat.label}
                      </TranslatedText>
                    </Animatable.View>
                  ))}
                </View>
              </Animatable.View>
            </View>

            <SectionDivider />

            {/* Enhanced Badges Section */}
            <View style={styles.sectionContainer}>
              <Animatable.View animation="fadeIn" delay={400} duration={800}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconContainer}>
                    <Award size={24} color={PSBColors.primary.green} />
                  </View>
                  <TranslatedText style={styles.sectionTitle}>
                    Badge Collection
                  </TranslatedText>
                </View>

                <View style={styles.badgesContainer}>
                  {badges.map((badge, index) => (
                    <Animatable.View
                      key={index}
                      animation="zoomIn"
                      delay={500 + index * 100}
                      style={[
                        styles.badgeCard,
                        !badge.earned && styles.badgeCardLocked,
                      ]}
                    >
                      <View
                        style={[
                          styles.badgeIconContainer,
                          {
                            backgroundColor: badge.earned
                              ? `${badge.color}20`
                              : "#f0f0f0",
                          },
                        ]}
                      >
                        {typeof badge.icon === "string" ? (
                          <TranslatedText
                            style={[
                              styles.badgeIconText,
                              { opacity: badge.earned ? 1 : 0.3 },
                            ]}
                          >
                            {badge.icon}
                          </TranslatedText>
                        ) : (
                          <badge.icon
                            size={24}
                            color={badge.earned ? badge.color : "#999"}
                          />
                        )}
                      </View>
                      <TranslatedText
                        style={[
                          styles.badgeName,
                          !badge.earned && styles.badgeNameLocked,
                        ]}
                      >
                        {badge.name}
                      </TranslatedText>
                      {badge.earned && <View style={styles.earnedIndicator} />}
                    </Animatable.View>
                  ))}
                </View>
              </Animatable.View>
            </View>

            <SectionDivider />

            {/* Enhanced Achievements Section */}
            <View style={styles.sectionContainer}>
              <Animatable.View animation="fadeIn" delay={500} duration={800}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconContainer}>
                    <Trophy size={24} color={PSBColors.primary.green} />
                  </View>
                  <TranslatedText style={styles.sectionTitle}>
                    Recent Achievements
                  </TranslatedText>
                </View>

                <View style={styles.achievementsContainer}>
                  {achievements.map((achievement, index) => (
                    <Animatable.View
                      key={index}
                      animation="slideInRight"
                      delay={600 + index * 150}
                      style={styles.achievementCard}
                    >
                      <View
                        style={[
                          styles.achievementIconContainer,
                          { backgroundColor: `${achievement.color}15` },
                        ]}
                      >
                        <achievement.icon size={24} color={achievement.color} />
                      </View>

                      <View style={styles.achievementContent}>
                        <TranslatedText style={styles.achievementTitle}>
                          {achievement.title}
                        </TranslatedText>
                        <TranslatedText style={styles.achievementDescription}>
                          {achievement.description}
                        </TranslatedText>
                        <TranslatedText style={styles.achievementDate}>
                          {achievement.date}
                        </TranslatedText>
                      </View>

                      <View style={styles.achievementBadge}>
                        <Trophy size={16} color={PSBColors.primary.gold} />
                      </View>
                    </Animatable.View>
                  ))}
                </View>
              </Animatable.View>
            </View>

            <SectionDivider />

            {/* Enhanced Settings Section */}
            <View style={styles.sectionContainer}>
              <Animatable.View animation="fadeIn" delay={600} duration={800}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconContainer}>
                    <Info size={24} color={PSBColors.primary.green} />
                  </View>
                  <TranslatedText style={styles.sectionTitle}>
                    Settings & Support
                  </TranslatedText>
                </View>

                <View style={styles.settingsContainer}>
                  {settingsOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.settingItem}
                      onPress={option.action}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.settingIconContainer,
                          { backgroundColor: `${option.color}15` },
                        ]}
                      >
                        <option.icon size={22} color={option.color} />
                      </View>
                      <TranslatedText style={styles.settingText}>
                        {option.title}
                      </TranslatedText>
                      <ChevronRight size={20} color={PSBColors.text.tertiary} />
                    </TouchableOpacity>
                  ))}

                  {/* <View style={styles.logoutSeparator} /> */}

                  <TouchableOpacity
                    style={[styles.settingItem, styles.logoutItem]}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                  >
                    <View style={styles.logoutIconContainer}>
                      <LogOut size={22} color="#ff6b6b" />
                    </View>
                    <TranslatedText
                      style={[styles.settingText, styles.logoutText]}
                    >
                      Logout
                    </TranslatedText>
                    <ChevronRight size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: "#f8f9fb",
    paddingTop: 8,
  },
  headerGradient: {
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: PSBColors.primary.gold,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "white",
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: PSBColors.primary.gold,
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  userLevel: {
    fontSize: 17,
    color: PSBColors.text.inverse,
    fontWeight: "500",
    opacity: 0.9,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  xpText: {
    marginLeft: 8,
    fontSize: 15,
    color: PSBColors.primary.gold,
    fontWeight: "700",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 24,
    backgroundColor: "transparent",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: PSBColors.primary.green + "15",
  },
  sectionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PSBColors.primary.green + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: PSBColors.primary.green,
    letterSpacing: 0.3,
  },
  progressSection: {
    marginTop: -20,
    zIndex: 1,
  },
  progressCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e8ecf0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressTextContainer: {
    marginLeft: 12,
  },
  progressTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: PSBColors.primary.green,
  },
  progressSubtitle: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    marginTop: 4,
    fontWeight: "500",
  },
  progressPercentageContainer: {
    backgroundColor: PSBColors.primary.gold + "20",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PSBColors.primary.gold + "30",
  },
  progressPercentage: {
    fontSize: 17,
    color: PSBColors.primary.gold,
    fontWeight: "800",
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#f0f2f5",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabelText: {
    fontSize: 13,
    color: PSBColors.text.secondary,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e8ecf0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statValue: {
    fontSize: 30,
    fontWeight: "800",
    color: PSBColors.primary.green,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: PSBColors.text.secondary,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 16,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: (width - 60) / 2,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
    borderWidth: 1,
    borderColor: "#e8ecf0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  badgeCardLocked: {
    opacity: 0.6,
    backgroundColor: "#f8f9fa",
  },
  badgeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  badgeIconText: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 13,
    color: PSBColors.primary.green,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 16,
  },
  badgeNameLocked: {
    color: PSBColors.text.tertiary,
  },
  earnedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e8ecf0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  achievementIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  achievementContent: {
    flex: 1,
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: PSBColors.primary.green,
    marginBottom: 6,
  },
  achievementDescription: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    lineHeight: 20,
    marginBottom: 6,
    fontWeight: "500",
  },
  achievementDate: {
    fontSize: 12,
    color: PSBColors.text.tertiary,
    fontWeight: "600",
  },
  achievementBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PSBColors.primary.gold + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PSBColors.primary.gold + "30",
  },
  settingsContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e8ecf0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: PSBColors.primary.green,
    fontWeight: "600",
  },
  logoutSeparator: {
    height: 8,
    backgroundColor: "#f8f9fb",
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 4,
  },
  logoutItem: {
    borderBottomWidth: 0,
    backgroundColor: "#fff5f5",
  },
  logoutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffe5e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  logoutText: {
    color: "#ff6b6b",
    fontWeight: "700",
  },
  bottomSpacing: {
    height: 60,
  },
});

export default ProfileScreen;