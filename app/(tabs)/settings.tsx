import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Globe,
  Shield,
  FileText,
  Info,
  Star,
  Mail,
  Trash2,
  Download,
  ChevronRight,
  Smartphone,
  Volume2,
  Eye,
  Wifi,
  HelpCircle,
  Heart,
} from "lucide-react-native";

interface SettingsState {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  autoDownload: boolean;
}

export default function SettingsScreen() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    darkMode: false,
    language: "English",
    autoDownload: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem("appSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: SettingsState) => {
    try {
      await AsyncStorage.setItem("appSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  const toggleSetting = (key: keyof SettingsState) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleLanguageChange = () => {
    Alert.alert(
      "Language Settings",
      "Choose your preferred language",
      [
        { text: "English", onPress: () => updateLanguage("English") },
        { text: "العربية", onPress: () => updateLanguage("Arabic") },
        { text: "বাংলা", onPress: () => updateLanguage("Bengali") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const updateLanguage = (language: string) => {
    const newSettings = { ...settings, language };
    saveSettings(newSettings);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear App Data",
      "This will remove all your progress and settings. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Success", "App data cleared successfully.");
              router.replace("/onboarding");
            } catch (error) {
              Alert.alert("Error", "Failed to clear app data.");
            }
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      "Rate Our App",
      "We'd love to hear your feedback! Would you like to rate us on the app store?",
      [
        { text: "Later", style: "cancel" },
        {
          text: "Rate Now",
          onPress: () => {
            const storeUrl = Platform.select({
              ios: "https://apps.apple.com/app/id123456789",
              android: "https://play.google.com/store/apps/details?id=com.mahnoor.digitalmarketing",
            });
            if (storeUrl) {
              Linking.openURL(storeUrl);
            }
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    const email = "support@mahnoorllc.com";
    const subject = "Digital Marketing Course App - Support Request";
    const body = `Hi Support Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nApp Version: 1.0.0\nDevice: ${Platform.OS}\nUser: ${user?.email || "Guest"}`;
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        "Email Not Available",
        `Please send your support request to: ${email}`
      );
    });
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "Digital Marketing Course App Privacy Policy\n\n" +
      "Last updated: December 2024\n\n" +
      "1. Information We Collect\n" +
      "• Account information (name, email)\n" +
      "• Learning progress and quiz results\n" +
      "• App usage analytics\n\n" +
      "2. How We Use Your Information\n" +
      "• To provide personalized learning experience\n" +
      "• To track your progress and achievements\n" +
      "• To improve our app and services\n\n" +
      "3. Data Security\n" +
      "We use industry-standard encryption to protect your data.\n\n" +
      "4. Contact Us\n" +
      "For privacy concerns, contact: privacy@mahnoorllc.com",
      [{ text: "OK" }]
    );
  };

  const showTermsOfService = () => {
    Alert.alert(
      "Terms of Service",
      "Digital Marketing Course App Terms of Service\n\n" +
      "Last updated: December 2024\n\n" +
      "1. Acceptance of Terms\n" +
      "By using this app, you agree to these terms.\n\n" +
      "2. Use License\n" +
      "We grant you a personal, non-transferable license to use this app for educational purposes.\n\n" +
      "3. User Responsibilities\n" +
      "• Use the app for legitimate educational purposes\n" +
      "• Don't share your account credentials\n" +
      "• Respect intellectual property rights\n\n" +
      "4. Limitation of Liability\n" +
      "The app is provided 'as is' without warranties.\n\n" +
      "5. Contact\n" +
      "For questions: legal@mahnoorllc.com",
      [{ text: "OK" }]
    );
  };

  const showAboutApp = () => {
    Alert.alert(
      "About Digital Marketing Course",
      "Version: 1.0.0\n" +
      "Build: 2024.12.001\n\n" +
      "📚 Comprehensive digital marketing education\n" +
      "🎯 Designed for entrepreneurs and small business owners\n" +
      "🏆 Interactive quizzes and certificates\n" +
      "🤖 AI-powered learning assistant\n\n" +
      "Developed with ❤️ by Mahnoor LLC\n\n" +
      "© 2024 Mahnoor LLC. All rights reserved.\n\n" +
      "Thank you for choosing our app to advance your digital marketing skills!",
      [{ text: "OK" }]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  const settingsGroups = [
    {
      title: "🎯 Learning Preferences",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          subtitle: "Get reminders and updates",
          type: "toggle" as const,
          value: settings.notifications,
          onPress: () => toggleSetting("notifications"),
        },
        {
          icon: Download,
          label: "Auto Download Lessons",
          subtitle: "Download for offline reading",
          type: "toggle" as const,
          value: settings.autoDownload,
          onPress: () => toggleSetting("autoDownload"),
        },
        {
          icon: Volume2,
          label: "Sound Effects",
          subtitle: "Quiz sounds and feedback",
          type: "toggle" as const,
          value: true,
          onPress: () => Alert.alert("Coming Soon", "Sound settings will be available soon!"),
        },
      ],
    },
    {
      title: "🎨 Appearance",
      items: [
        {
          icon: Moon,
          label: "Dark Mode",
          subtitle: "Switch to dark theme",
          type: "toggle" as const,
          value: settings.darkMode,
          onPress: () => toggleSetting("darkMode"),
        },
        {
          icon: Eye,
          label: "Reading Mode",
          subtitle: "Comfortable reading settings",
          type: "action" as const,
          onPress: () => Alert.alert("Coming Soon", "Reading mode customization coming soon!"),
        },
        {
          icon: Globe,
          label: "Language",
          subtitle: "Choose your preferred language",
          type: "action" as const,
          value: settings.language,
          onPress: handleLanguageChange,
        },
      ],
    },
    {
      title: "📱 App Features",
      items: [
        {
          icon: Wifi,
          label: "Offline Mode",
          subtitle: "Learn without internet",
          type: "action" as const,
          onPress: () => Alert.alert("Offline Mode", "Download lessons to access them offline. Enable auto-download above."),
        },

      ],
    },
    {
      title: "💬 Support & Feedback",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          subtitle: "Get help and tutorials",
          type: "action" as const,
          onPress: () => Alert.alert("Help Center", "Visit our help center for tutorials and FAQs."),
        },
        {
          icon: Mail,
          label: "Contact Support",
          subtitle: "Get technical assistance",
          type: "action" as const,
          onPress: handleContactSupport,
        },
        {
          icon: Star,
          label: "Rate Our App",
          subtitle: "Share your experience",
          type: "action" as const,
          onPress: handleRateApp,
        },
        {
          icon: Heart,
          label: "Share with Friends",
          subtitle: "Spread the knowledge",
          type: "action" as const,
          onPress: () => Alert.alert("Share App", "Help your friends learn digital marketing too! 🚀"),
        },
      ],
    },
    {
      title: "📋 Legal & Privacy",
      items: [
        {
          icon: Shield,
          label: "Privacy Policy",
          subtitle: "How we protect your data",
          type: "action" as const,
          onPress: showPrivacyPolicy,
        },
        {
          icon: FileText,
          label: "Terms of Service",
          subtitle: "App usage terms",
          type: "action" as const,
          onPress: showTermsOfService,
        },
        {
          icon: Info,
          label: "About App",
          subtitle: "Version 1.0.0 • Build 2024.12.001",
          type: "action" as const,
          onPress: showAboutApp,
        },
      ],
    },
    {
      title: "⚠️ Data Management",
      items: [
        {
          icon: Trash2,
          label: "Clear App Data",
          subtitle: "Reset all progress and settings",
          type: "danger" as const,
          onPress: handleClearData,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#10B981", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <SettingsIcon size={32} color="#FFFFFF" />
            <Text style={styles.headerTitle}>App Settings</Text>
            <Text style={styles.headerSubtitle}>
              Personalize your app experience
            </Text>
          </View>
        </LinearGradient>

        {/* Settings Groups */}
        <View style={styles.content}>
          {settingsGroups.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupContainer}>
                {group.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <TouchableOpacity
                      key={itemIndex}
                      style={[
                        styles.settingItem,
                        item.type === "danger" && styles.dangerItem,
                      ]}
                      onPress={item.onPress}
                    >
                      <View style={styles.settingLeft}>
                        <View
                          style={[
                            styles.settingIcon,
                            item.type === "danger" && styles.dangerIcon,
                          ]}
                        >
                          <IconComponent
                            size={20}
                            color={item.type === "danger" ? "#EF4444" : "#10B981"}
                          />
                        </View>
                        <View style={styles.settingTextContainer}>
                          <Text
                            style={[
                              styles.settingLabel,
                              item.type === "danger" && styles.dangerLabel,
                            ]}
                          >
                            {item.label}
                          </Text>
                          {item.subtitle && (
                            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.settingRight}>
                        {item.type === "toggle" && (
                          <Switch
                            value={item.value as boolean}
                            onValueChange={item.onPress}
                            trackColor={{ false: "#E5E7EB", true: "#4F46E5" }}
                            thumbColor={"#FFFFFF"}
                          />
                        )}
                        {item.type === "action" && (
                          <View style={styles.actionRight}>
                            {'value' in item && item.value && (
                              <Text style={styles.settingValue}>{item.value}</Text>
                            )}
                            <ChevronRight size={20} color="#9CA3AF" />
                          </View>
                        )}
                        {item.type === "danger" && (
                          <ChevronRight size={20} color="#EF4444" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Mahnoor LLC</Text>
          <Text style={styles.footerSubtext}>
            Empowering entrepreneurs with digital marketing knowledge
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    marginTop: 5,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsGroup: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 15,
  },
  groupContainer: {
    backgroundColor: "#FFFFFF",
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dangerItem: {
    backgroundColor: "#FEF2F2",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dangerIcon: {
    backgroundColor: "#FEE2E2",
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  dangerLabel: {
    color: "#EF4444",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});