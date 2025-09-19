import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

type UserType = "MEMBER" | "VALIDATOR" | "ADMIN" | null;

interface LoggedUser {
  id: string;
  fullName: string;
  email: string;
  document: string;
  faceImageId: string;
  role: UserType;
}

interface AuthContextType {
  user: LoggedUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (formData: any, photoUri?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);
export const useAuth = () => useContext(AuthContext);

const API_URL = "https://949fbca4150a.ngrok-free.app/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carregar dados salvos no AsyncStorage
  useEffect(() => {
    const loadAuthData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    };
    loadAuthData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password }, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });

      const { success, data } = res.data;
      if (success && data) {
        const { user: loggedUser, token } = data;

        setUser(loggedUser);
        setToken(token);

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(loggedUser));
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data || error.message);
      Alert.alert(
        "Erro ao entrar",
        error.response?.data?.message || "Erro de conexão ou usuário/senha inválidos"
      );
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  const register = async (formData: any, photoUri?: string) => {
    try {
      const payload = new FormData();

      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email);
      payload.append("hashedPassword", formData.hashedPassword); 
      payload.append("document", formData.document);
      payload.append("role", formData.role);

      if (photoUri) {
        const filename = photoUri.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        payload.append("image", { 
          uri: photoUri,
          name: filename,
          type,
        } as any);
      }

      const res = await axios.post(`${API_URL}/register`, payload, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true"
        },
      });

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
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
