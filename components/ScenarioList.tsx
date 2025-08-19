import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Play,
  Clock,
  Target,
  TrendingUp,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
  Brain,
  ListFilter as Filter,
  Trophy,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
// import { scenarios, Scenario } from '../data/scenarios';
import { apiCall } from "../utils/api";
import API from "../api/api";
import Loader from "./Loader";
import { PSBColors } from "../utils/PSBColors";
import TranslatedText from "./TranslatedText";

const { width } = Dimensions.get("window");

interface ScenarioListProps {
  onScenarioSelect: (scenarioId: string) => void;
  completedScenarios?: string[];
}

export const ScenarioList: React.FC<ScenarioListProps> = ({
  onScenarioSelect,
  completedScenarios = [],
}) => {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  console.log("Scenario", completedScenarios);
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        const response = await API.get(
          `/scenarios?category=${selectedCategory}&difficulty=${selectedDifficulty}`
        );
        const data = response.data;

        setScenarios(data.scenarios || data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      }
    };

    fetchScenarios();
  }, [selectedCategory, selectedDifficulty]);

  const categories = [
    { id: "all", label: "All Categories", icon: Brain },
    { id: "fraud-detection", label: "Fraud Detection", icon: AlertTriangle },
    { id: "investment", label: "Investment", icon: TrendingUp },
    { id: "budgeting", label: "Budgeting", icon: Target },
    { id: "insurance", label: "Insurance", icon: CheckCircle },
    { id: "retirement", label: "Retirement", icon: Clock },
  ];

  const difficulties = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  // const filteredScenarios = scenarios.filter((scenario) => {
  //   const categoryMatch =
  //     selectedCategory === "all" || scenario.category === selectedCategory;
  //   const difficultyMatch =
  //     selectedDifficulty === "all" ||
  //     scenario.difficulty === selectedDifficulty;
  //   return categoryMatch && difficultyMatch;
  // });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "#10b981";
      case "intermediate":
        return "#f59e0b";
      case "advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fraud-detection":
        return AlertTriangle;
      case "investment":
        return TrendingUp;
      case "budgeting":
        return Target;
      case "insurance":
        return CheckCircle;
      case "retirement":
        return Clock;
      default:
        return Brain;
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "rgba(250,250,250,0.9)",
        }}
      >
        <Loader />
      </SafeAreaView>
    );
  }

  const isCompleted = (scenarioId: string) =>
    completedScenarios.includes(scenarioId);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#f8fafc", "#f8fafc"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TranslatedText style={styles.title}>
              Financial Decision Scenarios
            </TranslatedText>
            <TranslatedText style={styles.subtitle}>
              Practice real-world financial decisions in a safe environment
            </TranslatedText>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Trophy size={20} color="#f59e0b" />
                <TranslatedText style={styles.statValue}>
                  {completedScenarios.length}
                </TranslatedText>
                <TranslatedText style={styles.statLabel}>
                  Completed
                </TranslatedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Target size={20} color="#3b82f6" />
                <TranslatedText style={styles.statValue}>
                  {scenarios.length}
                </TranslatedText>
                <TranslatedText style={styles.statLabel}>Total</TranslatedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Brain size={20} color="#10b981" />
                <TranslatedText style={styles.statValue}>
                  {Math.round(
                    (completedScenarios.length / scenarios.length) * 100
                  )}
                  %
                </TranslatedText>
                <TranslatedText style={styles.statLabel}>
                  Progress
                </TranslatedText>
              </View>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <TranslatedText style={styles.filterTitle}>
                Category
              </TranslatedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.filterButton,
                          selectedCategory === category.id &&
                            styles.filterButtonActive,
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                      >
                        <IconComponent
                          size={16}
                          color={
                            selectedCategory === category.id
                              ? "#ffffff"
                              : "rgba(0,0,0,0.5)"
                          }
                        />
                        <TranslatedText
                          style={[
                            styles.filterButtonText,
                            selectedCategory === category.id &&
                              styles.filterButtonTextActive,
                          ]}
                        >
                          {category.label}
                        </TranslatedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <TranslatedText style={styles.filterTitle}>
                Difficulty
              </TranslatedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  {difficulties.map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty.id}
                      style={[
                        styles.filterButton,
                        selectedDifficulty === difficulty.id &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() => setSelectedDifficulty(difficulty.id)}
                    >
                      <TranslatedText
                        style={[
                          styles.filterButtonText,
                          selectedDifficulty === difficulty.id &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        {difficulty.label}
                      </TranslatedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Scenarios List */}
          <View style={styles.scenariosContainer}>
            <TranslatedText style={styles.scenariosTitle}>
              {scenarios.length} Scenario
              {scenarios.length !== 1 ? "s" : ""} Available
            </TranslatedText>

            {scenarios.map((scenario) => {
              const CategoryIcon = getCategoryIcon(scenario.category);
              const completed = isCompleted(scenario._id);

              return (
                <TouchableOpacity
                  key={scenario.id}
                  style={[
                    styles.scenarioCard,
                    completed && styles.completedCard,
                  ]}
                  onPress={() => onScenarioSelect(scenario._id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.scenarioHeader}>
                    <View style={styles.scenarioLeft}>
                      <View
                        style={[
                          styles.scenarioIcon,
                          {
                            backgroundColor:
                              getDifficultyColor(scenario.difficulty) + "20",
                          },
                        ]}
                      >
                        <CategoryIcon
                          size={24}
                          color={getDifficultyColor(scenario.difficulty)}
                        />
                      </View>
                      <View style={styles.scenarioInfo}>
                        <TranslatedText style={styles.scenarioTitle}>
                          {scenario.title}
                        </TranslatedText>
                        <Text
                          style={styles.scenarioDescription}
                          numberOfLines={2}
                        >
                          {scenario.description}
                        </Text>
                      </View>
                    </View>

                    {completed && (
                      <View style={styles.completedBadge}>
                        <CheckCircle size={16} color="#10b981" />
                      </View>
                    )}
                  </View>

                  <View style={styles.scenarioMeta}>
                    <View style={styles.metaItem}>
                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor: getDifficultyColor(
                              scenario.difficulty
                            ),
                          },
                        ]}
                      >
                        <TranslatedText style={styles.difficultyText}>
                          {scenario.difficulty.charAt(0).toUpperCase() +
                            scenario.difficulty.slice(1)}
                        </TranslatedText>
                      </View>
                    </View>

                    {scenario.timeLimit && (
                      <View style={styles.metaItem}>
                        <Clock size={14} color="#94a3b8" />
                        <TranslatedText style={styles.metaText}>
                          {scenario.timeLimit}s
                        </TranslatedText>
                      </View>
                    )}

                    <View style={styles.metaItem}>
                      <TranslatedText style={styles.choicesCount}>
                        {scenario.choices.length} choices
                      </TranslatedText>
                    </View>
                  </View>

                  <View style={styles.scenarioFooter}>
                    <Text style={styles.learningObjective} numberOfLines={2}>
                      🎯 {scenario.learningObjective}
                    </Text>

                    <View style={styles.playButton}>
                      <Play size={16} color={PSBColors.primary.darkGreen} />
                      <TranslatedText style={styles.playButtonText}>
                        {completed ? "Play Again" : "Start Scenario"}
                      </TranslatedText>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {scenarios.length === 0 && (
            <View style={styles.emptyState}>
              <Filter size={48} color="#6b7280" />
              <TranslatedText style={styles.emptyTitle}>
                No Scenarios Found
              </TranslatedText>
              <TranslatedText style={styles.emptyDescription}>
                Try adjusting your filters to see more scenarios
              </TranslatedText>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(0,0,0,0.5)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    marginHorizontal: 16,
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.05)",
    borderWidth: 1,
    // padding: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: PSBColors.primary.darkGreen,
    borderColor: PSBColors.primary.darkGreen,
  },
  filterButtonText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#ffffff",
  },
  scenariosContainer: {
    marginBottom: 24,
  },
  scenariosTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  scenarioCard: {
    backgroundColor: "rgba(50, 50, 50, 0.01)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // elevation: 2,
  },
  completedCard: {
    borderColor: "rgba(16, 185, 129, 0.3)",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  scenarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  scenarioLeft: {
    flexDirection: "row",
    flex: 1,
  },
  scenarioIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  scenarioInfo: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    lineHeight: 24,
  },
  scenarioDescription: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
    lineHeight: 20,
  },
  completedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    padding: 8,
    borderRadius: 20,
  },
  scenarioMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  metaText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  choicesCount: {
    fontSize: 12,
    color: "#94a3b8",
  },
  scenarioFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  learningObjective: {
    flex: 1,
    fontSize: 13,
    color: "rgba(0,0,0,0.4)",
    lineHeight: 18,
    marginRight: 16,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PSBColors.primary.lightGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PSBColors.primary.green,
    gap: 8,
  },
  playButtonText: {
    fontSize: 14,
    color: PSBColors.primary.darkGreen,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
  },
});
