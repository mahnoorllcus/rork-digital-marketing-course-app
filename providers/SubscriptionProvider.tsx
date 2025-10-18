import { useState, useEffect, useMemo, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubscriptionPlan, SubscriptionInfo } from "@/types/course";
import { useAuth } from "./AuthProvider";

interface SubscriptionContextType {
  subscription: SubscriptionInfo;
  isLoading: boolean;
  upgradeToPremium: () => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  canAccessModule: (isPremium?: boolean) => boolean;
  canAccessFeature: (feature: keyof SubscriptionInfo['features']) => boolean | number;
  getAccessibleModulesCount: () => number;
}

const SUBSCRIPTION_STORAGE_KEY = "user_subscription";

const FREE_PLAN_FEATURES = {
  maxModules: 2,
  certificateAccess: false,
  aiLearning: false,
  offlineAccess: false,
  prioritySupport: false,
};

const PREMIUM_PLAN_FEATURES = {
  maxModules: -1, // unlimited
  certificateAccess: true,
  aiLearning: true,
  offlineAccess: true,
  prioritySupport: true,
};

export const [SubscriptionProvider, useSubscription] = createContextHook<SubscriptionContextType>(() => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    plan: 'free',
    features: FREE_PLAN_FEATURES,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSubscription = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(`${SUBSCRIPTION_STORAGE_KEY}_${user.id}`);
      if (stored) {
        const subscriptionData = JSON.parse(stored);
        
        // Check if premium subscription is still valid
        if (subscriptionData.plan === 'premium' && subscriptionData.expiresAt) {
          const expirationDate = new Date(subscriptionData.expiresAt);
          if (expirationDate < new Date()) {
            // Subscription expired, revert to free
            const freeSubscription = {
              plan: 'free' as SubscriptionPlan,
              features: FREE_PLAN_FEATURES,
            };
            setSubscription(freeSubscription);
            await AsyncStorage.setItem(`${SUBSCRIPTION_STORAGE_KEY}_${user.id}`, JSON.stringify(freeSubscription));
          } else {
            setSubscription(subscriptionData);
          }
        } else {
          setSubscription(subscriptionData);
        }
      } else {
        // Default to free plan for new users
        const defaultSubscription = {
          plan: 'free' as SubscriptionPlan,
          features: FREE_PLAN_FEATURES,
        };
        setSubscription(defaultSubscription);
        await AsyncStorage.setItem(`${SUBSCRIPTION_STORAGE_KEY}_${user.id}`, JSON.stringify(defaultSubscription));
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const saveSubscription = useCallback(async (subscriptionData: SubscriptionInfo) => {
    if (!user) return;
    
    try {
      await AsyncStorage.setItem(`${SUBSCRIPTION_STORAGE_KEY}_${user.id}`, JSON.stringify(subscriptionData));
      setSubscription(subscriptionData);
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  }, [user]);

  const upgradeToPremium = useCallback(async () => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate a successful payment
      // In a real app, you'd integrate with payment providers like Stripe, Apple Pay, Google Pay
      
      const premiumSubscription: SubscriptionInfo = {
        plan: 'premium',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        features: PREMIUM_PLAN_FEATURES,
      };

      await saveSubscription(premiumSubscription);
      return { success: true };
    } catch {
      return { success: false, error: "Payment failed. Please try again." };
    }
  }, [saveSubscription]);

  const cancelSubscription = useCallback(async () => {
    try {
      const freeSubscription: SubscriptionInfo = {
        plan: 'free',
        features: FREE_PLAN_FEATURES,
      };

      await saveSubscription(freeSubscription);
      return { success: true };
    } catch {
      return { success: false, error: "Failed to cancel subscription. Please try again." };
    }
  }, [saveSubscription]);

  const canAccessModule = useCallback((isPremium?: boolean) => {
    if (!isPremium) return true; // Free modules are always accessible
    return subscription.plan === 'premium';
  }, [subscription.plan]);

  const canAccessFeature = useCallback((feature: keyof SubscriptionInfo['features']) => {
    return subscription.features[feature];
  }, [subscription.features]);

  const getAccessibleModulesCount = useCallback(() => {
    return subscription.features.maxModules === -1 ? Infinity : subscription.features.maxModules;
  }, [subscription.features.maxModules]);

  return useMemo(() => ({
    subscription,
    isLoading,
    upgradeToPremium,
    cancelSubscription,
    canAccessModule,
    canAccessFeature,
    getAccessibleModulesCount,
  }), [subscription, isLoading, upgradeToPremium, cancelSubscription, canAccessModule, canAccessFeature, getAccessibleModulesCount]);
});