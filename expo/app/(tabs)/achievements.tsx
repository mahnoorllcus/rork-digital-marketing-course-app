import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, Star, Target, Zap, Award, TrendingUp } from "lucide-react-native";
import { useCourse } from "@/providers/CourseProvider";

export default function AchievementsScreen() {
  const { userProgress, calculateOverallProgress } = useCourse();
  const overallProgress = calculateOverallProgress();
  const completedLessons = Object.values(userProgress.completedLessons).flat().length;

  const badges = [
    {
      id: "starter",
      title: "Quick Starter",
      description: "Complete your first lesson",
      icon: Zap,
      color: ["#FDE68A", "#F59E0B"] as const,
      earned: completedLessons >= 1,
    },
    {
      id: "dedicated",
      title: "Dedicated Learner",
      description: "Complete 5 lessons",
      icon: Target,
      color: ["#A78BFA", "#7C3AED"] as const,
      earned: completedLessons >= 5,
    },
    {
      id: "expert",
      title: "Marketing Expert",
      description: "Complete 10 lessons",
      icon: Trophy,
      color: ["#FCA5A5", "#EF4444"] as const,
      earned: completedLessons >= 10,
    },
    {
      id: "master",
      title: "Digital Master",
      description: "Complete all modules",
      icon: Award,
      color: ["#6EE7B7", "#10B981"] as const,
      earned: overallProgress === 100,
    },
  ];

  const stats = [
    { label: "Lessons Completed", value: completedLessons, icon: Star },
    { label: "Quizzes Passed", value: userProgress.quizScores ? Object.keys(userProgress.quizScores).length : 0, icon: Target },
    { label: "Current Streak", value: "3 days", icon: TrendingUp },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>Track your learning journey</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <Icon size={24} color="#4F46E5" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges Earned</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <View
                  key={badge.id}
                  style={[styles.badgeCard, !badge.earned && styles.lockedBadge]}
                >
                  {badge.earned ? (
                    <LinearGradient
                      colors={badge.color}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.badgeGradient}
                    >
                      <Icon size={32} color="#FFFFFF" />
                    </LinearGradient>
                  ) : (
                    <View style={styles.badgeLocked}>
                      <Icon size={32} color="#D1D5DB" />
                    </View>
                  )}
                  <Text style={[styles.badgeTitle, !badge.earned && styles.lockedText]}>
                    {badge.title}
                  </Text>
                  <Text style={[styles.badgeDescription, !badge.earned && styles.lockedText]}>
                    {badge.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Motivational Quote */}
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quoteCard}
        >
          <Text style={styles.quoteText}>
            "Success in digital marketing comes from continuous learning and adaptation."
          </Text>
          <Text style={styles.quoteAuthor}>- Marketing Expert</Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 15,
    borderRadius: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeLocked: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  badgeDescription: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  lockedText: {
    color: "#D1D5DB",
  },
  quoteCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 25,
    borderRadius: 16,
  },
  quoteText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#E0E7FF",
    textAlign: "right",
  },
});