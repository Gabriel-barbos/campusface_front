import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../AuthContext";
import LoginScreen from "../screens/LoginScreen";
import AlunoTabs from "./AlunoTabs";
import ValidadorTabs from "./ValidadorTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user === null ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : user === "aluno" ? (
        <Stack.Screen name="Aluno" component={AlunoTabs} />
      ) : (
        <Stack.Screen name="Validador" component={ValidadorTabs} />
      )}
    </Stack.Navigator>
  );
}
