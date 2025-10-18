import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCourse } from "@/providers/CourseProvider";
import { useSubscription } from "@/providers/SubscriptionProvider";
import { Lock, CheckCircle, PlayCircle, Crown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CoursesScreen() {
  const { modules, userProgress, isModuleUnlocked, getModuleProgress } = useCourse();
  const { subscription, canAccessModule } = useSubscription();

  const handleModulePress = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    if (!canAccessModule(module.isPremium)) {
      router.push('/premium');
      return;
    }
    
    if (isModuleUnlocked(moduleId)) {
      if (module.lessons.length > 0) {
        router.push(`/lesson/${module.lessons[0].id}`);
      }
    }
  };

  const handleQuizPress = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    if (!canAccessModule(module.isPremium)) {
      router.push('/premium');
      return;
    }
    
    if (isModuleUnlocked(moduleId)) {
      router.push(`/quiz/${moduleId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Course Modules</Text>
          <Text style={styles.subtitle}>Master digital marketing step by step</Text>
        </View>

        {modules.map((module, index) => {
          const isUnlocked = isModuleUnlocked(module.id);
          const progress = getModuleProgress(module.id);
          const isCompleted = progress === 100;
          const hasAccess = canAccessModule(module.isPremium);
          const isPremiumModule = module.isPremium;

          return (
            <TouchableOpacity
              key={module.id}
              style={[styles.moduleCard, (!isUnlocked || !hasAccess) && styles.lockedCard]}
              onPress={() => handleModulePress(module.id)}
            >
              <Image
                source={{ uri: module.image }}
                style={[styles.moduleImage, !isUnlocked && styles.lockedImage]}
              />
              
              {!hasAccess && (
                <View style={styles.lockOverlay}>
                  <Crown size={32} color="#F59E0B" />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
              
              {hasAccess && !isUnlocked && (
                <View style={styles.lockOverlay}>
                  <Lock size={32} color="#FFFFFF" />
                </View>
              )}

              <View style={styles.moduleContent}>
                <View style={styles.moduleHeader}>
                  <View style={styles.moduleNumberContainer}>
                    <Text style={styles.moduleNumber}>Module {index + 1}</Text>
                    {isPremiumModule && (
                      <View style={styles.premiumBadge}>
                        <Crown size={12} color="#F59E0B" />
                        <Text style={styles.premiumBadgeText}>Premium</Text>
                      </View>
                    )}
                  </View>
                  {isCompleted && <CheckCircle size={20} color="#10B981" />}
                </View>
                
                <Text style={[styles.moduleTitle, (!isUnlocked || !hasAccess) && styles.lockedText]}>
                  {module.title}
                </Text>
                
                <Text style={[styles.moduleDescription, (!isUnlocked || !hasAccess) && styles.lockedText]} numberOfLines={2}>
                  {module.description}
                </Text>

                <View style={styles.moduleFooter}>
                  <View style={styles.lessonInfo}>
                    <PlayCircle size={16} color={(isUnlocked && hasAccess) ? "#6B7280" : "#D1D5DB"} />
                    <Text style={[styles.lessonCount, (!isUnlocked || !hasAccess) && styles.lockedText]}>
                      {module.lessons.length} Lessons
                    </Text>
                  </View>

                  {isUnlocked && hasAccess && (
                    <TouchableOpacity
                      style={styles.quizButton}
                      onPress={() => handleQuizPress(module.id)}
                    >
                      <Text style={styles.quizButtonText}>Take Quiz</Text>
                    </TouchableOpacity>
                  )}
                  
                  {!hasAccess && (
                    <TouchableOpacity
                      style={styles.upgradeButton}
                      onPress={() => router.push('/premium')}
                    >
                      <Crown size={14} color="#F59E0B" />
                      <Text style={styles.upgradeButtonText}>Upgrade</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {isUnlocked && hasAccess && progress > 0 && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={["#4F46E5", "#7C3AED"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${progress}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {subscription.plan === 'premium' 
              ? 'Complete all modules to earn your certificate!' 
              : 'Upgrade to Premium to access all modules and earn certificates!'}
          </Text>
          {subscription.plan === 'free' && (
            <TouchableOpacity
              style={styles.footerUpgradeButton}
              onPress={() => router.push('/premium')}
            >
              <Crown size={16} color="#FFFFFF" />
              <Text style={styles.footerUpgradeText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>
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
  moduleCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
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
  lockedCard: {
    opacity: 0.7,
  },
  moduleImage: {
    width: "100%",
    height: 160,
  },
  lockedImage: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  premiumText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  moduleContent: {
    padding: 20,
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  moduleNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moduleNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#F59E0B",
    textTransform: "uppercase",
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 15,
  },
  lockedText: {
    color: "#D1D5DB",
  },
  moduleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lessonCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  quizButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quizButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  upgradeButton: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  upgradeButtonText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },
  footerUpgradeButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerUpgradeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});