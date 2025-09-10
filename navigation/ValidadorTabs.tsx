import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import MenuValidador from "../screens/MenuValidador";
import FaceReader from "../screens/FaceReader";
import QrCodeReader from "../screens/QRcodeReader";
import LogoutScreen from "../screens/LogoutScreen";

const Tab = createBottomTabNavigator();

export default function ValidadorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: "#000",   // cor quando selecionado
        tabBarInactiveTintColor: "#888", // cor quando não selecionado
        tabBarStyle: {
          backgroundColor: "#fff",       // fundo da tab bar
          borderTopWidth: 0,             // remove linha superior
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          switch (route.name) {
            case "MenuValidador":
              iconName = "home";
              break;
            case "QrCodeReader":
              iconName = "scan";
              break;
            case "FaceReader":
              iconName = "person";
              break;
            case "Logout":
              iconName = "log-out";
              break;
          }
          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="MenuValidador"
        component={MenuValidador}
        options={{ title: "Menu" }}
      />
      <Tab.Screen
        name="QrCodeReader"
        component={QrCodeReader}
        options={{ title: "Ler QR Code" }}
      />
      <Tab.Screen
        name="FaceReader"
        component={FaceReader}
        options={{ title: "Reconhecimento Facial" }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ title: "Sair" }}
      />
    </Tab.Navigator>
  );
}
