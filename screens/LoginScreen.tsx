import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useAuth } from "../AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erro", "Preencha usuário e senha!");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
    } catch (error) {
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
          <View style={styles.logoWrapper}>
            <Text style={styles.logoText}>Campus</Text>
            <Text style={styles.logoAccent}>Face</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Entre em sua conta</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor="#6B7280"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
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
    onPress={() => navigation.navigate('Register')}
  >
    <Text style={styles.secondaryButtonText}>Crie sua conta</Text>
  </TouchableOpacity>
        </View>


      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },

  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
  },

  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },

  logoText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -1.5,
  },

  logoAccent: {
    fontSize: 42,
    fontWeight: "200",
    color: "#ffffff",
    marginTop: -12,
    letterSpacing: 4,
  },

  tagline: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "400",
  },

  formSection: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 45,
    minHeight: "55%",
  },

  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 32,
    textAlign: "center",
  },

  inputGroup: {
    gap: 16,
    marginBottom: 16,
  },

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

  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },

  forgotText: {
    color: "#6B7280",
    fontSize: 14,
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

  buttonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  dividerText: {
    marginHorizontal: 16,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },

  secondaryButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
    paddingBottom: 32,
  },

  footerText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "400",
  },

  signupLink: {
    color: "#ffffff",
    fontWeight: "600",
  },
});