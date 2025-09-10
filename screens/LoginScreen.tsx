import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  Alert, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar
} from "react-native";
import { useAuth } from "../AuthContext";

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
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
      // Handle error if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Campus</Text>
          <Text style={styles.logoSubText}>Face</Text>
        </View>
        <Text style={styles.welcomeText}>Bem-vindo de volta</Text>
        <Text style={styles.subtitleText}>Entre em sua conta para continuar</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu usuário"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>📧 Entrar com Email</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Não tem uma conta?{" "}
          <Text style={styles.signupText}>Cadastre-se</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  
  header: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  
  logoText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  
  logoSubText: {
    fontSize: 36,
    fontWeight: "300",
    color: "#fff",
    marginTop: -8,
    letterSpacing: 3,
  },
  
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  
  subtitleText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
  
  formContainer: {
    flex: 0.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  
  inputContainer: {
    marginBottom: 20,
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  
  input: {
    borderWidth: 2,
    borderColor: "#f0f0f0",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafafa",
    fontWeight: "500",
  },
  
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
    marginTop: 5,
  },
  
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  loginButtonDisabled: {
    opacity: 0.6,
  },
  
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  
  dividerText: {
    marginHorizontal: 15,
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  
  socialButton: {
    borderWidth: 2,
    borderColor: "#f0f0f0",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  
  socialButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  
  footer: {
    flex: 0.1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },
  
  footerText: {
    color: "#999",
    fontSize: 16,
  },
  
  signupText: {
    color: "#fff",
    fontWeight: "700",
  },
});