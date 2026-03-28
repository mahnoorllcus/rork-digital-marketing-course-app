import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCourse } from "@/providers/CourseProvider";

export default function QuizScreen() {
  const { moduleId } = useLocalSearchParams();
  const { modules, saveQuizScore } = useCourse();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const module = modules.find(m => m.id === moduleId);

  if (!module || !module.quiz) {
    return null;
  }

  const quiz = module.quiz;
  const question = quiz.questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / quiz.questions.length) * 100);
    saveQuizScore(module.id, score);
    setShowResults(true);
  };

  const getScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (showResults) {
    const score = getScore();
    const passed = score >= 70;

    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={passed ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.resultsContainer}
        >
          <View style={styles.resultsContent}>
            {passed ? (
              <CheckCircle size={80} color="#FFFFFF" />
            ) : (
              <XCircle size={80} color="#FFFFFF" />
            )}
            
            <Text style={styles.resultsTitle}>
              {passed ? "Congratulations!" : "Keep Learning!"}
            </Text>
            
            <Text style={styles.scoreText}>{score}%</Text>
            
            <Text style={styles.resultsMessage}>
              {passed 
                ? "You've passed the quiz! Great job on mastering this module."
                : "You need 70% to pass. Review the lessons and try again!"}
            </Text>

            <View style={styles.resultsStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {quiz.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length}
                </Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {quiz.questions.filter((q, i) => selectedAnswers[i] !== q.correctAnswer).length}
                </Text>
                <Text style={styles.statLabel}>Incorrect</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.resultsButton}
              onPress={() => router.back()}
            >
              <Text style={styles.resultsButtonText}>Continue Learning</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{module.title} Quiz</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                selectedAnswers[currentQuestion] === index && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(index)}
            >
              <View style={[
                styles.optionRadio,
                selectedAnswers[currentQuestion] === index && styles.selectedRadio,
              ]}>
                {selectedAnswers[currentQuestion] === index && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswers[currentQuestion] === index && styles.selectedOptionText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text style={[styles.navButtonText, currentQuestion === 0 && styles.disabledText]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.primaryButton,
            selectedAnswers[currentQuestion] === undefined && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
        >
          <Text style={[
            styles.navButtonText,
            styles.primaryButtonText,
            selectedAnswers[currentQuestion] === undefined && styles.disabledText,
          ]}>
            {currentQuestion === quiz.questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 34,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
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
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedOption: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: "#4F46E5",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4F46E5",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  selectedOptionText: {
    color: "#4F46E5",
    fontWeight: "500",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  navButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  disabledText: {
    color: "#9CA3AF",
  },
  resultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultsContent: {
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  resultsMessage: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  resultsStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  resultsButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  resultsButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F46E5",
  },
});