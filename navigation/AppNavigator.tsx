import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FaceRegister from "../screens/FaceRegister";
import CameraCaptureScreen from "../screens/CameraCaptureScreen"; 
import AlunoTabs from "./AlunoTabs";
import ValidadorTabs from "./ValidadorTabs";

export type RootStackParamList = {
  Login: undefined;
  Register: { photoUri?: string } | undefined;
  CameraCapture: undefined; 
  FaceRegister: { isRegistration?: boolean } | undefined;
  Aluno: undefined;
  Validador: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user === null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} /> 
        </>
      ) : user.role === "MEMBER" ? (  
        <>
          <Stack.Screen name="Aluno" component={AlunoTabs} />
          <Stack.Screen name="FaceRegister" component={FaceRegister} />
        </>
      ) : user.role === "VALIDATOR" ? (
        <>
          <Stack.Screen name="Validador" component={ValidadorTabs} />
          <Stack.Screen name="FaceRegister" component={FaceRegister} />
        </>
      ) : (
        // fallback para ADMIN ou outros
        <>
          <Stack.Screen name="Validador" component={ValidadorTabs} />
        </>
      )}
    </Stack.Navigator>
  );
}
