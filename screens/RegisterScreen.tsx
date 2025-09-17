import React, { useState, useEffect } from "react";
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
  Platform,
  ScrollView,
  Image
} from "react-native";
import { useAuth } from "../AuthContext";

export default function RegisterScreen({ navigation, route }) {
//   const { register } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    documento: "",
    acesso: "membro"
  });
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Recebe a foto quando volta do FaceRegister
  useEffect(() => {
    if (route.params?.photoUri) {
      setPhoto(route.params.photoUri);
    }
  }, [route.params?.photoUri]);

  const accessTypes = [
    { value: "membro", label: "Membro" },
    { value: "validador", label: "Validador" },
    { value: "admin", label: "Admin" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = () => {
    navigation.navigate('FaceRegister', { isRegistration: true });
  };

//   const handleRegister = async () => {
//     if (!formData.nome || !formData.email || !formData.senha || !formData.documento) {
//       Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       await register(formData, photo);
//     } catch (error) {
//       // Handle error if needed
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

        {/* Form Section */}
        <View style={styles.formSection}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.formTitle}>Crie sua conta</Text>
            
            {/* Photo Upload */}
            <TouchableOpacity style={styles.photoContainer} onPress={handlePhotoSelect}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <View style={styles.photoIcon}>
                    <Text style={styles.photoIconText}>📸</Text>
                  </View>
                  <Text style={styles.photoText}>Adicionar foto</Text>
                </View>
              )}
              <View style={styles.photoOverlay}>
                <Text style={styles.photoOverlayText}>✏️</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#6B7280"
                value={formData.nome}
                onChangeText={(value) => handleInputChange("nome", value)}
                autoCapitalize="words"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6B7280"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#6B7280"
                secureTextEntry
                value={formData.senha}
                onChangeText={(value) => handleInputChange("senha", value)}
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Documento (CPF/RG)"
                placeholderTextColor="#6B7280"
                value={formData.documento}
                onChangeText={(value) => handleInputChange("documento", value)}
                autoCapitalize="none"
              />

              {/* Access Type Selector */}
              <View style={styles.accessContainer}>
                <Text style={styles.accessLabel}>Tipo de acesso</Text>
                <View style={styles.accessButtons}>
                  {accessTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.accessButton,
                        formData.acesso === type.value && styles.accessButtonActive
                      ]}
                      onPress={() => handleInputChange("acesso", type.value)}
                    >
                      <Text style={[
                        styles.accessButtonText,
                        formData.acesso === type.value && styles.accessButtonTextActive
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Criando conta..." : "Criar conta"}
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
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
            </TouchableOpacity>
          </ScrollView>
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
    flex: 0.3,
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
  
  formSection: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 45,
    flex: 0.7,
  },
  
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },

  photoContainer: {
    alignSelf: "center",
    marginBottom: 24,
    position: "relative",
  },

  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  photoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  photoIconText: {
    fontSize: 16,
  },

  photoText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  photoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  photoOverlayText: {
    fontSize: 14,
  },
  
  inputGroup: {
    gap: 16,
    marginBottom: 24,
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

  accessContainer: {
    marginTop: 8,
  },

  accessLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },

  accessButtons: {
    flexDirection: "row",
    gap: 8,
  },

  accessButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },

  accessButtonActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  accessButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  accessButtonTextActive: {
    color: "#ffffff",
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
    marginBottom: 20,
  },
  
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});