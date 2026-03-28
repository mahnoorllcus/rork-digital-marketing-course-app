import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Check, Crown, Star, Zap } from "lucide-react-native";
import { useSubscription } from "@/providers/SubscriptionProvider";

export default function PremiumUpgradeScreen() {
  const { subscription, upgradeToPremium } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const result = await upgradeToPremium();
      if (result.success) {
        Alert.alert(
          "Welcome to Premium! 🎉",
          "You now have access to all premium features. Enjoy your learning journey!",
          [
            {
              text: "Start Learning",
              onPress: () => router.replace("/(tabs)/courses"),
            },
          ]
        );
      } else {
        Alert.alert("Upgrade Failed", result.error || "Please try again later.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };



  const premiumFeatures = [
    "🤖 AI Learning Chat - 24/7 marketing expert",
    "📚 Unlimited access to all modules",
    "🎯 AI-powered learning recommendations",
    "🏆 Downloadable certificates",
    "📱 Offline access to content",
    "⚡ Priority customer support",
    "🎁 Exclusive bonus content",
    "📊 Advanced analytics dashboard",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Crown size={48} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Unlock AI-Powered Learning</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited access to all courses plus your personal AI marketing tutor
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <Text style={styles.planName}>Premium Plan</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>$5</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.priceDescription}>
              Cancel anytime • 30-day money-back guarantee
            </Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Everything in Premium:</Text>
            {premiumFeatures.map((feature) => (
              <View key={feature} style={styles.featureItem}>
                <Check size={20} color="#10B981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.upgradeButton, isUpgrading && styles.upgradeButtonDisabled]}
            onPress={handleUpgrade}
            disabled={isUpgrading || subscription.plan === 'premium'}
            testID="upgrade-button"
          >
            {isUpgrading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : subscription.plan === 'premium' ? (
              <>
                <Crown size={20} color="#FFFFFF" />
                <Text style={styles.upgradeButtonText}>Already Premium</Text>
              </>
            ) : (
              <>
                <Zap size={20} color="#FFFFFF" />
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Comparison Section */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Free vs Premium</Text>
          
          <View style={styles.comparisonTable}>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Course Modules</Text>
              <Text style={styles.freeValue}>2 modules</Text>
              <Text style={styles.premiumValue}>All modules</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Certificates</Text>
              <Text style={styles.freeValue}>❌</Text>
              <Text style={styles.premiumValue}>✅</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>AI Learning Chat</Text>
              <Text style={styles.freeValue}>❌</Text>
              <Text style={styles.premiumValue}>✅ 24/7</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Offline Access</Text>
              <Text style={styles.freeValue}>❌</Text>
              <Text style={styles.premiumValue}>✅</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Priority Support</Text>
              <Text style={styles.freeValue}>❌</Text>
              <Text style={styles.premiumValue}>✅</Text>
            </View>
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.testimonialsTitle}>What Our Premium Users Say</Text>
          
          <View style={styles.testimonialCard}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={styles.testimonialText}>
              &ldquo;The AI learning chat is incredible! It's like having a marketing expert available 24/7. I get instant answers to all my questions.&rdquo;
            </Text>
            <Text style={styles.testimonialAuthor}>- Sarah M., Marketing Manager</Text>
          </View>
          
          <View style={styles.testimonialCard}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} color="#F59E0B" fill="#F59E0B" />
              ))}
            </View>
            <Text style={styles.testimonialText}>
              &ldquo;The AI tutor gives me personalized strategies for my business. It's like having a marketing consultant in my pocket!&rdquo;
            </Text>
            <Text style={styles.testimonialAuthor}>- Mike R., Entrepreneur</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  pricingCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pricingHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  planName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: "700",
    color: "#4F46E5",
  },
  pricePeriod: {
    fontSize: 18,
    color: "#6B7280",
    marginLeft: 4,
  },
  priceDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  upgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  comparisonSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 24,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  comparisonTable: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  comparisonRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  comparisonFeature: {
    flex: 2,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  freeValue: {
    flex: 1,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  premiumValue: {
    flex: 1,
    fontSize: 16,
    color: "#10B981",
    textAlign: "center",
    fontWeight: "600",
  },
  testimonialsSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  testimonialsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  testimonialCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 8,
    fontStyle: "italic",
  },
  testimonialAuthor: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 32,
  },
});