import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, BookmarkPlus, CheckCircle } from "lucide-react-native";
import { useCourse } from "@/providers/CourseProvider";

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams();
  const { modules, markLessonComplete, userProgress } = useCourse();
  const [fontSize, setFontSize] = useState(16);

  // Find the lesson and module
  const lesson = modules
    .flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })))
    .find(l => l.id === lessonId);

  const module = modules.find(m => m.id === lesson?.moduleId);

  useEffect(() => {
    if (!lesson) {
      Alert.alert("Error", "Lesson not found");
      router.back();
    }
  }, [lesson]);

  if (!lesson || !module) {
    return null;
  }

  const handleComplete = () => {
    markLessonComplete(lesson.moduleId, lesson.id);
    
    // Find next lesson
    const currentLessonIndex = module.lessons.findIndex(l => l.id === lesson.id);
    if (currentLessonIndex < module.lessons.length - 1) {
      const nextLesson = module.lessons[currentLessonIndex + 1];
      router.replace(`/lesson/${nextLesson.id}`);
    } else {
      // Module complete, go to quiz
      Alert.alert(
        "Module Complete!",
        "Great job! Ready to test your knowledge?",
        [
          { text: "Later", onPress: () => router.back() },
          { text: "Take Quiz", onPress: () => router.push(`/quiz/${module.id}`) }
        ]
      );
    }
  };

  const isCompleted = userProgress.completedLessons[lesson.moduleId]?.includes(lesson.id);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
        </View>
        <TouchableOpacity style={styles.bookmarkButton}>
          <BookmarkPlus size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Lesson Image */}
        {lesson.image && (
          <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
        )}

        {/* Lesson Content */}
        <View style={styles.content}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={styles.readTime}>📖 {lesson.readTime || "5 min read"}</Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>

          <Text style={[styles.lessonContent, { fontSize }]}>
            {lesson.content}
          </Text>

          {/* Key Takeaways */}
          {lesson.keyTakeaways && (
            <View style={styles.takeawaysCard}>
              <Text style={styles.takeawaysTitle}>💡 Key Takeaways</Text>
              {lesson.keyTakeaways.map((takeaway, index) => (
                <View key={index} style={styles.takeawayItem}>
                  <Text style={styles.takeawayBullet}>•</Text>
                  <Text style={styles.takeawayText}>{takeaway}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.fontSizeControls}>
          <TouchableOpacity
            onPress={() => setFontSize(Math.max(14, fontSize - 2))}
            style={styles.fontButton}
          >
            <Text style={styles.fontButtonText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFontSize(Math.min(22, fontSize + 2))}
            style={styles.fontButton}
          >
            <Text style={styles.fontButtonText}>A+</Text>
          </TouchableOpacity>
        </View>
        
        {!isCompleted && (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  moduleTitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  bookmarkButton: {
    padding: 5,
  },
  lessonImage: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  readTime: {
    fontSize: 14,
    color: "#6B7280",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  completedText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  lessonContent: {
    color: "#374151",
    lineHeight: 28,
    marginBottom: 30,
  },
  takeawaysCard: {
    backgroundColor: "#F0FDF4",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  takeawaysTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065F46",
    marginBottom: 15,
  },
  takeawayItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  takeawayBullet: {
    fontSize: 16,
    color: "#10B981",
    marginRight: 10,
  },
  takeawayText: {
    flex: 1,
    fontSize: 14,
    color: "#047857",
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  fontSizeControls: {
    flexDirection: "row",
    gap: 10,
  },
  fontButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  fontButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  completeButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});