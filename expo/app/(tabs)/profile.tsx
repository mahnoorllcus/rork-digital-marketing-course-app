import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  User, 
  Award, 
  LogOut,
  ChevronRight,
  Calendar,
  Star,
  Edit3,
  Share2,
  Trophy,
  Target,
  BookOpen,
  TrendingUp
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCourse } from "@/providers/CourseProvider";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { userProgress, calculateOverallProgress, modules } = useCourse();
  const { user, logout } = useAuth();
  
  const completedLessons = Object.values(userProgress.completedLessons).flat().length;
  const totalLessons = modules.reduce((total: number, module: any) => total + module.lessons.length, 0);
  const completedQuizzes = Object.keys(userProgress.quizScores).length;
  const averageScore = Object.values(userProgress.quizScores).length > 0 
    ? Math.round(Object.values(userProgress.quizScores).reduce((sum, score) => sum + score, 0) / Object.values(userProgress.quizScores).length)
    : 0;
  
  const getBadges = () => {
    const badges = [];
    if (completedLessons >= 5) badges.push({ name: "First Steps", icon: "🎯", description: "Completed 5 lessons" });
    if (completedLessons >= 15) badges.push({ name: "Knowledge Seeker", icon: "📚", description: "Completed 15 lessons" });
    if (completedQuizzes >= 3) badges.push({ name: "Quiz Master", icon: "🧠", description: "Completed 3 quizzes" });
    if (averageScore >= 80) badges.push({ name: "High Achiever", icon: "⭐", description: "80%+ average score" });
    if (calculateOverallProgress() === 100) badges.push({ name: "Course Complete", icon: "🏆", description: "Completed entire course" });
    return badges;
  };
  
  const getStreak = () => {
    return Math.floor(Math.random() * 15) + 1;
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth");
          }
        }
      ]
    );
  };

  const handleViewCertificate = () => {
    if (calculateOverallProgress() === 100) {
      router.push("/certificate");
    } else {
      Alert.alert(
        "Certificate Not Available",
        "Complete all modules to earn your certificate!"
      );
    }
  };

  const profileGroups = [
    {
      title: "👤 Account Management",
      items: [
        {
          icon: Edit3,
          title: "Edit Profile",
          subtitle: "Update your personal information",
          type: "action" as const,
          onPress: () => Alert.alert("Coming Soon", "Profile editing will be available in the next update!"),
          enabled: true,
        },
        {
          icon: User,
          title: "Account Settings",
          subtitle: "Manage your account preferences",
          type: "action" as const,
          onPress: () => Alert.alert("Coming Soon", "Account settings will be available soon!"),
          enabled: true,
        },
      ],
    },
    {
      title: "🏆 Achievements & Progress",
      items: [
        {
          icon: Award,
          title: "View Certificate",
          subtitle: calculateOverallProgress() === 100 ? "Ready to download" : `${Math.round(calculateOverallProgress())}% complete`,
          type: "action" as const,
          onPress: handleViewCertificate,
          enabled: calculateOverallProgress() === 100,
        },
        {
          icon: Trophy,
          title: "View All Achievements",
          subtitle: "See your badges and milestones",
          type: "action" as const,
          onPress: () => router.push("/(tabs)/achievements"),
          enabled: true,
        },
      ],
    },
    {
      title: "📤 Share & Connect",
      items: [
        {
          icon: Share2,
          title: "Share Progress",
          subtitle: "Share your achievements with friends",
          type: "action" as const,
          onPress: () => Alert.alert("Share Progress", `I've completed ${Math.round(calculateOverallProgress())}% of the Digital Marketing Course! 🚀`),
          enabled: true,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={["#667EEA", "#764BA2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <TouchableOpacity style={styles.avatarContainer}>
            <User size={50} color="#FFFFFF" />
            <View style={styles.editAvatarBadge}>
              <Edit3 size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
          <Text style={styles.userEmail}>{user?.email || "guest@example.com"}</Text>
          {user?.isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>👤 Guest Mode</Text>
            </View>
          )}
          
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {Math.floor(calculateOverallProgress() / 20) + 1}</Text>
            <Text style={styles.levelSubtext}>Digital Marketing {calculateOverallProgress() === 100 ? 'Expert' : 'Student'}</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{Math.round(calculateOverallProgress())}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completedLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{getStreak()}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Progress Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Learning Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Course Completion</Text>
              <Text style={styles.progressPercentage}>{Math.round(calculateOverallProgress())}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${calculateOverallProgress()}%` }]} />
              </View>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{completedLessons}/{totalLessons}</Text>
                <Text style={styles.progressStatLabel}>Lessons</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{completedQuizzes}</Text>
                <Text style={styles.progressStatLabel}>Quizzes</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{averageScore}%</Text>
                <Text style={styles.progressStatLabel}>Avg Score</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Achievements</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/achievements")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            {getBadges().map((badge) => (
              <View key={badge.name} style={styles.badgeCard}>
                <Text style={styles.badgeCardIcon}>{badge.icon}</Text>
                <Text style={styles.badgeCardName}>{badge.name}</Text>
              </View>
            ))}
            {getBadges().length === 0 && (
              <View style={styles.noBadgesCard}>
                <Star size={24} color="#D1D5DB" />
                <Text style={styles.noBadgesCardText}>Start learning to earn badges!</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Learning Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Learning Analytics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <BookOpen size={24} color="#4F46E5" />
              </View>
              <Text style={styles.statCardValue}>{completedLessons}</Text>
              <Text style={styles.statCardLabel}>Lessons Completed</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Target size={24} color="#10B981" />
              </View>
              <Text style={styles.statCardValue}>{completedQuizzes}</Text>
              <Text style={styles.statCardLabel}>Quizzes Taken</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={24} color="#F59E0B" />
              </View>
              <Text style={styles.statCardValue}>{averageScore}%</Text>
              <Text style={styles.statCardLabel}>Average Score</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Trophy size={24} color="#EF4444" />
              </View>
              <Text style={styles.statCardValue}>{getBadges().length}</Text>
              <Text style={styles.statCardLabel}>Badges Earned</Text>
            </View>
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.content}>
          {profileGroups.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.profileGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupContainer}>
                {group.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <TouchableOpacity
                      key={itemIndex}
                      style={[
                        styles.profileItem,
                        !item.enabled && styles.disabledItem,
                      ]}
                      onPress={item.enabled ? item.onPress : undefined}
                      disabled={!item.enabled}
                    >
                      <View style={styles.profileLeft}>
                        <View
                          style={[
                            styles.profileIcon,
                            !item.enabled && styles.disabledIcon,
                          ]}
                        >
                          <IconComponent
                            size={20}
                            color={item.enabled ? "#667EEA" : "#9CA3AF"}
                          />
                        </View>
                        <View style={styles.profileTextContainer}>
                          <Text
                            style={[
                              styles.profileLabel,
                              !item.enabled && styles.disabledText,
                            ]}
                          >
                            {item.title}
                          </Text>
                          {item.subtitle && (
                            <Text style={styles.profileSubtitle}>{item.subtitle}</Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.profileRight}>
                        <ChevronRight size={20} color={item.enabled ? "#9CA3AF" : "#E5E7EB"} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Member Since */}
        <View style={styles.memberInfo}>
          <Calendar size={16} color="#9CA3AF" />
          <Text style={styles.memberText}>Member since December 2024</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  profileHeader: {
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  editAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  levelContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  levelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  levelSubtext: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#E0E7FF",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#E0E7FF",
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
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
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  progressStat: {
    alignItems: "center",
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  progressStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  badgesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  badgeCard: {
    width: 100,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeCardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  badgeCardName: {
    fontSize: 10,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  noBadgesCard: {
    width: 120,
    height: 100,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  noBadgesCardText: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  profileGroup: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 15,
  },
  groupContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
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
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  disabledItem: {
    opacity: 0.6,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  disabledIcon: {
    backgroundColor: "#F3F4F6",
  },
  profileTextContainer: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  profileSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  disabledText: {
    color: "#9CA3AF",
  },
  profileRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  guestBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  guestBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 30,
  },
  memberText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});