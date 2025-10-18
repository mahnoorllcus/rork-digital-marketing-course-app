import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Award, Download, Share2, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function CertificateScreen() {
  const handleShare = async () => {
    try {
      await Share.share({
        message: "I just completed the Digital Marketing Mastery course! 🎉",
        title: "Certificate of Completion",
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share certificate");
    }
  };

  const handleDownload = () => {
    Alert.alert("Success", "Certificate saved to your device!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Certificate</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Certificate */}
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.certificate}
        >
          <View style={styles.certificateInner}>
            <Award size={60} color="#4F46E5" />
            
            <Text style={styles.certificateTitle}>Certificate of Completion</Text>
            
            <Text style={styles.certText}>This is to certify that</Text>
            
            <Text style={styles.userName}>Digital Marketer</Text>
            
            <Text style={styles.certText}>has successfully completed</Text>
            
            <Text style={styles.courseName}>Digital Marketing Mastery</Text>
            
            <Text style={styles.certText}>on</Text>
            
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</Text>
            
            <View style={styles.signatureSection}>
              <View style={styles.signature}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Course Instructor</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            <Download size={20} color="#4F46E5" />
            <Text style={styles.actionText}>Download PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleShare}>
            <Share2 size={20} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.primaryText]}>Share</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.congratsText}>
          🎉 Congratulations on completing the course!
        </Text>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  certificate: {
    width: "100%",
    aspectRatio: 0.7,
    borderRadius: 20,
    padding: 3,
    marginBottom: 30,
  },
  certificateInner: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 20,
    marginBottom: 30,
  },
  certText: {
    fontSize: 14,
    color: "#6B7280",
    marginVertical: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F46E5",
    marginVertical: 10,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginVertical: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginTop: 10,
  },
  signatureSection: {
    marginTop: 40,
    width: "100%",
  },
  signature: {
    alignItems: "center",
  },
  signatureLine: {
    width: 150,
    height: 1,
    backgroundColor: "#D1D5DB",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 12,
    color: "#6B7280",
  },
  actions: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  congratsText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },
});