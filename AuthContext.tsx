import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

type UserType = "MEMBER" | "VALIDATOR" | null;

interface AuthContextType {
  user: UserType;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (formData: any, photoUri?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);
export const useAuth = () => useContext(AuthContext);

const API_URL = "https://baef7bb3c366.ngrok-free.app/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null);

  // Carrega usuário do AsyncStorage quando o app inicia
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData.role);
      }
    };
    loadUser();
  }, []);

  // LOGIN - Ajustado para usar 'password' em vez de 'senha'
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { 
        email, 
        password // Mudei de 'senha' para 'password'
      });
      
      const { user: loggedUser, token } = res.data;

      setUser(loggedUser.role);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(loggedUser));
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data || error.message);
      Alert.alert(
        "Erro ao entrar",
        error.response?.data?.message || "Erro de conexão ou usuário/senha inválidos"
      );
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  // REGISTER - Ajustado para usar 'image' em vez de 'foto' e sem hash
  const register = async (formData: any, photoUri?: string) => {
    try {
      const payload = new FormData();

      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email);
      payload.append("hashedPassword", formData.hashedPassword); // Testando se a API aceita senha sem hash
      payload.append("document", formData.document);
      payload.append("role", formData.role);

      if (photoUri) {
        const filename = photoUri.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        payload.append("image", { // Mudei de 'foto' para 'image'
          uri: photoUri,
          name: filename,
          type,
        } as any);
      }

      const res = await axios.post(`${API_URL}/register`, payload, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true" // Adiciona header para ngrok
        },
      });

      // Sucesso no registro
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      
    } catch (error: any) {
      console.error("Erro no registro:", error.response?.data || error.message);
      Alert.alert(
        "Erro ao registrar",
        error.response?.data?.message || "Erro de conexão ou dados inválidos"
      );
      throw new Error(error.response?.data?.message || "Erro ao registrar usuário");
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}