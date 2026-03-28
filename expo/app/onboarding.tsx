import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Master Digital Marketing",
    description: "Learn the most in-demand skills from industry experts",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    gradient: ["#667EEA", "#764BA2"] as const,
  },
  {
    id: "2",
    title: "Learn at Your Pace",
    description: "Structured lessons designed for busy entrepreneurs and students",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    gradient: ["#F093FB", "#F5576C"] as const,
  },
  {
    id: "3",
    title: "Test Your Knowledge",
    description: "Interactive quizzes to reinforce your learning",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    gradient: ["#4FACFE", "#00F2FE"] as const,
  },
  {
    id: "4",
    title: "Earn Your Certificate",
    description: "Get certified and boost your career prospects",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    gradient: ["#43E97B", "#38F9D7"] as const,
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/auth");
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/auth");
  };

  const current = slides[currentSlide];

  return (
    <LinearGradient
      colors={current.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Content */}
        <View style={styles.content}>
          <Image source={{ uri: current.image }} style={styles.image} />
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.description}>{current.description}</Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottom}>
          {/* Dots */}
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* Button */}
          {currentSlide === slides.length - 1 ? (
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
  },
  bottom: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeDot: {
    width: 24,
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    minWidth: 200,
  },
  buttonText: {
    color: "#4F46E5",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});