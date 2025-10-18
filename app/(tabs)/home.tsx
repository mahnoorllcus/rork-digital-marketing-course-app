import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCourse } from "@/providers/CourseProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useSubscription } from "@/providers/SubscriptionProvider";
import { ArrowRight, BookOpen, Clock, Award, Bot, Send, Sparkles, MessageCircle, Crown } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { modules, userProgress, calculateOverallProgress, isLoading } = useCourse();
  const { user } = useAuth();
  const { subscription, canAccessFeature } = useSubscription();
  const overallProgress = calculateOverallProgress();
  
  const [aiQuestion, setAiQuestion] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiChat, setShowAiChat] = useState<boolean>(false);



  const continueLesson = () => {
    const lastModule = userProgress.lastModuleId || modules[0].id;
    const module = modules.find(m => m.id === lastModule);
    if (module) {
      const lastLessonIndex = userProgress.completedLessons[lastModule]?.length || 0;
      const nextLesson = module.lessons[lastLessonIndex] || module.lessons[0];
      router.push(`/lesson/${nextLesson.id}`);
    }
  };

  const handleAiQuestion = async () => {
    if (!aiQuestion.trim()) {
      Alert.alert("Please enter a question", "Ask me anything about digital marketing!");
      return;
    }

    setIsAiLoading(true);
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert digital marketing tutor. Provide clear, actionable advice for small business owners, entrepreneurs, and students. Keep responses concise but helpful, focusing on practical tips they can implement immediately. Always encourage learning and suggest relevant topics they should explore further.'
            },
            {
              role: 'user',
              content: aiQuestion
            }
          ]
        })
      });

      const data = await response.json();
      setAiResponse(data.completion);
      setAiQuestion("");
    } catch (error) {
      console.error('AI request failed:', error);
      Alert.alert("Error", "Failed to get AI response. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const aiSuggestions = [
    "How do I start with SEO for my small business?",
    "What's the best social media platform for beginners?",
    "How to create effective Google Ads on a budget?",
    "Email marketing tips for entrepreneurs"
  ];

  const featuredCategories = [
    { id: "seo", title: "SEO", icon: "🔍", color: ["#667EEA", "#764BA2"] as const },
    { id: "social", title: "Social Media", icon: "📱", color: ["#F093FB", "#F5576C"] as const },
    { id: "ads", title: "Google Ads", icon: "💰", color: ["#4FACFE", "#00F2FE"] as const },
    { id: "analytics", title: "Analytics", icon: "📊", color: ["#43E97B", "#38F9D7"] as const },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
          </Text>
          <Text style={styles.subtitle}>
            {user?.isGuest 
              ? "Exploring as a guest - sign up to save your progress!" 
              : "Ready to master digital marketing?"}
          </Text>
          {user?.isGuest && (
            <TouchableOpacity 
              style={styles.signupPrompt}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.signupPromptText}>Create Account to Save Progress</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress Card */}
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(overallProgress)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <BookOpen size={16} color="#E0E7FF" />
              <Text style={styles.statText}>
                {Object.values(userProgress.completedLessons).flat().length} Lessons
              </Text>
            </View>
            <View style={styles.stat}>
              <Clock size={16} color="#E0E7FF" />
              <Text style={styles.statText}>~2h 30m</Text>
            </View>
            <View style={styles.stat}>
              <Award size={16} color="#E0E7FF" />
              <Text style={styles.statText}>3 Badges</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Continue Learning */}
        {overallProgress > 0 && overallProgress < 100 && (
          <TouchableOpacity style={styles.continueCard} onPress={continueLesson}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1c9?w=400" }}
              style={styles.continueImage}
            />
            <View style={styles.continueContent}>
              <Text style={styles.continueLabel}>CONTINUE LEARNING</Text>
              <Text style={styles.continueTitle}>Pick up where you left off</Text>
              <Text style={styles.continueSubtitle}>Next: Content Marketing Basics</Text>
            </View>
            <ArrowRight size={24} color="#4F46E5" />
          </TouchableOpacity>
        )}

        {/* Featured Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.categoriesGrid}>
            {featuredCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push("/courses")}
              >
                <LinearGradient
                  colors={category.color}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </LinearGradient>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Learn AI Basic Course */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Course</Text>
          <TouchableOpacity 
            style={styles.aiBasicCard}
            onPress={() => router.push("/courses")}
          >
            <LinearGradient
              colors={["#667EEA", "#764BA2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiBasicGradient}
            >
              <View style={styles.aiBasicContent}>
                <View style={styles.aiBasicHeader}>
                  <View style={styles.aiBasicIconContainer}>
                    <Bot size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.aiBasicBadge}>
                    <Sparkles size={12} color="#F59E0B" />
                    <Text style={styles.aiBasicBadgeText}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.aiBasicTitle}>Learn AI Basic</Text>
                <Text style={styles.aiBasicDescription}>
                  Master the fundamentals of Artificial Intelligence and machine learning concepts
                </Text>
                <View style={styles.aiBasicFeatures}>
                  <View style={styles.aiBasicFeature}>
                    <BookOpen size={14} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.aiBasicFeatureText}>8 Lessons</Text>
                  </View>
                  <View style={styles.aiBasicFeature}>
                    <Clock size={14} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.aiBasicFeatureText}>2h 30m</Text>
                  </View>
                  <View style={styles.aiBasicFeature}>
                    <Award size={14} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.aiBasicFeatureText}>Certificate</Text>
                  </View>
                </View>
                <View style={styles.aiBasicCTA}>
                  <Text style={styles.aiBasicCTAText}>Start Learning</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Subscription Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Plan</Text>
          <LinearGradient
            colors={subscription.plan === 'premium' ? ["#F59E0B", "#D97706"] : ["#6B7280", "#4B5563"]}
            style={styles.subscriptionCard}
          >
            <View style={styles.subscriptionHeader}>
              <View style={styles.subscriptionTitleContainer}>
                <Crown size={24} color="#FFFFFF" />
                <Text style={styles.subscriptionTitle}>
                  {subscription.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                </Text>
              </View>
              {subscription.plan === 'free' && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => router.push('/premium')}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.subscriptionDescription}>
              {subscription.plan === 'premium' 
                ? 'Enjoy unlimited access to all courses, AI learning, and certificates!'
                : 'Access to 2 free modules. Upgrade for unlimited learning!'}
            </Text>
            
            <View style={styles.featuresRow}>
              <View style={styles.feature}>
                <Text style={styles.featureText}>
                  📚 {subscription.features.maxModules === -1 ? 'All' : subscription.features.maxModules} Modules
                </Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureText}>
                  {subscription.features.certificateAccess ? '🏆' : '❌'} Certificates
                </Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureText}>
                  {subscription.features.aiLearning ? '🤖' : '❌'} AI Learning
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* AI Learning Assistant - Premium Feature */}
        <View style={styles.section}>
          <View style={styles.aiHeader}>
            <View style={styles.aiTitleContainer}>
              <Bot size={24} color={canAccessFeature('aiLearning') ? "#4F46E5" : "#9CA3AF"} />
              <Text style={[styles.sectionTitle, !canAccessFeature('aiLearning') && styles.disabledText]}>AI Learning Chat</Text>
              {canAccessFeature('aiLearning') && <Sparkles size={20} color="#F59E0B" />}
              {!canAccessFeature('aiLearning') && (
                <View style={styles.premiumBadge}>
                  <Crown size={12} color="#F59E0B" />
                  <Text style={styles.premiumBadgeText}>Premium Only</Text>
                </View>
              )}
            </View>
            {canAccessFeature('aiLearning') && (
              <TouchableOpacity 
                style={styles.aiToggle}
                onPress={() => setShowAiChat(!showAiChat)}
              >
                <MessageCircle size={20} color={showAiChat ? "#4F46E5" : "#6B7280"} />
              </TouchableOpacity>
            )}
          </View>
          
          <LinearGradient
            colors={canAccessFeature('aiLearning') ? ["#F0F9FF", "#E0F2FE"] : ["#FEF3C7", "#FDE68A"]}
            style={[styles.aiCard, !canAccessFeature('aiLearning') && styles.premiumLockedCard]}
          >
            {!canAccessFeature('aiLearning') ? (
              <View style={styles.premiumFeaturePreview}>
                <View style={styles.premiumIconContainer}>
                  <Crown size={32} color="#F59E0B" />
                </View>
                <Text style={styles.premiumFeatureTitle}>AI Learning Chat</Text>
                <Text style={styles.premiumFeatureDescription}>
                  Get instant, personalized answers to your digital marketing questions with our AI-powered learning assistant.
                </Text>
                <View style={styles.premiumFeaturesList}>
                  <View style={styles.premiumFeatureItem}>
                    <Text style={styles.premiumFeatureBullet}>✨</Text>
                    <Text style={styles.premiumFeatureText}>24/7 AI marketing expert</Text>
                  </View>
                  <View style={styles.premiumFeatureItem}>
                    <Text style={styles.premiumFeatureBullet}>🎯</Text>
                    <Text style={styles.premiumFeatureText}>Personalized learning recommendations</Text>
                  </View>
                  <View style={styles.premiumFeatureItem}>
                    <Text style={styles.premiumFeatureBullet}>💡</Text>
                    <Text style={styles.premiumFeatureText}>Instant strategy suggestions</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.premiumUpgradeButton}
                  onPress={() => router.push('/premium')}
                >
                  <Crown size={18} color="#FFFFFF" />
                  <Text style={styles.premiumUpgradeButtonText}>Unlock with Premium</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.aiDescription}>
                  Your personal AI marketing tutor is ready to help! Ask anything about digital marketing.
                </Text>
                
                {!showAiChat ? (
                  <View>
                    <Text style={styles.aiSuggestionsTitle}>Popular Questions:</Text>
                    <View style={styles.aiSuggestions}>
                      {aiSuggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionChip}
                          onPress={() => {
                            setAiQuestion(suggestion);
                            setShowAiChat(true);
                          }}
                        >
                          <Text style={styles.suggestionText}>{suggestion}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={styles.startChatButton}
                      onPress={() => setShowAiChat(true)}
                    >
                      <MessageCircle size={18} color="#FFFFFF" />
                      <Text style={styles.startChatButtonText}>Start AI Chat</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.aiChatContainer}>
                    <View style={styles.aiInputContainer}>
                      <TextInput
                        style={styles.aiInput}
                        placeholder="Ask me anything about digital marketing..."
                        placeholderTextColor="#9CA3AF"
                        value={aiQuestion}
                        onChangeText={setAiQuestion}
                        multiline
                        maxLength={200}
                      />
                      <TouchableOpacity
                        style={[styles.aiSendButton, { opacity: isAiLoading ? 0.5 : 1 }]}
                        onPress={handleAiQuestion}
                        disabled={isAiLoading}
                      >
                        {isAiLoading ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Send size={18} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>
                    </View>
                    
                    {aiResponse && (
                      <View style={styles.aiResponseContainer}>
                        <View style={styles.aiResponseHeader}>
                          <Bot size={16} color="#4F46E5" />
                          <Text style={styles.aiResponseTitle}>AI Marketing Expert</Text>
                          <Sparkles size={14} color="#F59E0B" />
                        </View>
                        <Text style={styles.aiResponseText}>{aiResponse}</Text>
                        <TouchableOpacity
                          style={styles.newQuestionButton}
                          onPress={() => {
                            setAiResponse("");
                            setAiQuestion("");
                          }}
                        >
                          <Text style={styles.newQuestionButtonText}>Ask Another Question</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Daily Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Marketing Tip of the Day</Text>
            <Text style={styles.tipText}>
              Focus on creating value-driven content. Your audience wants solutions to their problems, not just product features.
            </Text>
          </View>
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
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  progressCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
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
    color: "#FFFFFF",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: "#E0E7FF",
  },
  continueCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
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
  continueImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  continueContent: {
    flex: 1,
    marginLeft: 15,
  },
  continueLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4F46E5",
    letterSpacing: 1,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },
  continueSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: (width - 50) / 2,
    alignItems: "center",
    marginBottom: 15,
  },
  categoryGradient: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 40,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FEF3C7",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: "#78350F",
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  signupPrompt: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  signupPromptText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  aiTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  aiCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  aiDescription: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 15,
    textAlign: "center",
  },
  aiSuggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  aiSuggestions: {
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 6,
  },
  suggestionText: {
    fontSize: 13,
    color: "#4F46E5",
    textAlign: "center",
  },
  aiChatContainer: {
    gap: 15,
  },
  aiInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  aiInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#374151",
    maxHeight: 80,
  },
  aiSendButton: {
    backgroundColor: "#4F46E5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  aiResponseContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  aiResponseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  aiResponseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  aiResponseText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  subscriptionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  subscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subscriptionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subscriptionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
    lineHeight: 20,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feature: {
    flex: 1,
    alignItems: "center",
  },
  featureText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  upgradeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  upgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  disabledText: {
    color: "#9CA3AF",
  },
  disabledCard: {
    opacity: 0.6,
  },
  premiumLockedCard: {
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  premiumFeaturePreview: {
    alignItems: "center",
    paddingVertical: 10,
  },
  premiumIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  premiumFeatureTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 8,
  },
  premiumFeatureDescription: {
    fontSize: 14,
    color: "#78350F",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  premiumFeaturesList: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
  premiumFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  premiumFeatureBullet: {
    fontSize: 16,
    marginRight: 12,
  },
  premiumFeatureText: {
    fontSize: 14,
    color: "#78350F",
    fontWeight: "500",
  },
  premiumUpgradeButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  premiumUpgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  startChatButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  startChatButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  newQuestionButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "center",
  },
  newQuestionButtonText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "600",
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
  upgradePrompt: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  upgradePromptText: {
    color: "#F59E0B",
    fontSize: 16,
    fontWeight: "600",
  },
  aiBasicCard: {
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#667EEA",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  aiBasicGradient: {
    padding: 24,
  },
  aiBasicContent: {
    gap: 16,
  },
  aiBasicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  aiBasicIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiBasicBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiBasicBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  aiBasicTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  aiBasicDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
  },
  aiBasicFeatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  aiBasicFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aiBasicFeatureText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  aiBasicCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  aiBasicCTAText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});