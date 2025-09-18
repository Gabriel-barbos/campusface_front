import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated
} from "react-native";
import { useAuth } from "../AuthContext";
import Logo from "../components/Logo";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fadeAnim = new Animated.Value(0);

  const showError = (message: string) => {
    setErrorMessage(message);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setErrorMessage(""));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showError("Preencha email e senha!");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      showError(error.message || "Erro ao conectar ao servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Logo />
          <View style={styles.logoWrapper}>
            <Text style={styles.logoText}>Campus</Text>
            <Text style={styles.logoAccent}>Face</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Entre em sua conta</Text>

          {/* Feedback visual */}
          {errorMessage ? (
            <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </Animated.View>
          ) : null}

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryButtonText}>Crie sua conta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1b1f" },
  keyboardView: { flex: 1, justifyContent: "space-between" },
  logoSection: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  logoWrapper: { alignItems: "center", marginBottom: 16 },
  logoText: { fontSize: 42, fontWeight: "800", color: "#ffffff", letterSpacing: -1.5 },
  logoAccent: { fontSize: 42, fontWeight: "200", color: "#ffffff", marginTop: -12, letterSpacing: 4 },
  formSection: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 45,
    minHeight: "55%",
  },
  formTitle: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 24, textAlign: "center" },
  inputGroup: { gap: 16, marginBottom: 16 },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { marginHorizontal: 16, color: "#6B7280", fontSize: 14, fontWeight: "500" },
  secondaryButton: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", paddingVertical: 16, borderRadius: 16, alignItems: "center" },
  secondaryButtonText: { color: "#374151", fontSize: 16, fontWeight: "600" },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  errorText: { color: "#b91c1c", fontWeight: "600", textAlign: "center" },
});
