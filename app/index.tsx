import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IndexScreen() {
  const { user, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (isLoading || isRedirecting) return;

      setIsRedirecting(true);
      
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        
        // If user hasn't seen onboarding, show onboarding
        if (!hasSeenOnboarding) {
          router.replace("/onboarding");
          return;
        }

        // If user is not authenticated, redirect to auth
        if (!user) {
          router.replace("/auth");
          return;
        }

        // If user is authenticated, redirect to tabs
        router.replace("/(tabs)/home");
      } catch (error) {
        console.error("Error checking auth state:", error);
        router.replace("/onboarding");
      }
    };

    checkAuthAndRedirect();
  }, [user, isLoading, isRedirecting]);

  if (isLoading || isRedirecting) {
    return (
      <LinearGradient
        colors={["#4F46E5", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* App Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>📚</Text>
            </View>
          </View>
          
          {/* App Title */}
          <Text style={styles.appTitle}>Digital Marketing</Text>
          <Text style={styles.appSubtitle}>Master Your Skills</Text>
          
          {/* Loading Indicator */}
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading your experience...</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by</Text>
          <Text style={styles.footerBrand}>Mahnoor LLC</Text>
        </View>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoText: {
    fontSize: 48,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 60,
  },
  loadingSection: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 16,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  footerBrand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});