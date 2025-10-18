import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router, useSegments } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      if (isLoading) return;

      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      const inAuthGroup = segments[0] === "auth";
      const inOnboarding = segments[0] === "onboarding";

      // If user hasn't seen onboarding, show onboarding
      if (!hasSeenOnboarding && !inOnboarding) {
        router.replace("/onboarding");
        return;
      }

      // If user is not authenticated and not in auth screen, redirect to auth
      if (!user && !inAuthGroup && hasSeenOnboarding) {
        router.replace("/auth");
        return;
      }

      // If user is authenticated and in auth screen, redirect to tabs
      if (user && inAuthGroup) {
        router.replace("/(tabs)");
        return;
      }
    };

    checkAuthAndOnboarding();
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});