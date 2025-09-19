import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import MenuAluno from "../screens/MenuAluno";
import FaceRegister from "../screens/FaceRegister";
import QrCodePage from "../screens/QrCodePage";
import LogoutScreen from "../screens/LogoutScreen";
import HubScreen from "../screens/HubScreen";


const Tab = createBottomTabNavigator();

export default function AlunoTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: "#000",   
        tabBarInactiveTintColor: "#888", 
        tabBarStyle: {
          backgroundColor: "#fff",       
          borderTopWidth: 0,           
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          switch (route.name) {
            case "MenuAluno":
              iconName = "home";
              break;
            case "QrCodePage":
              iconName = "qr-code";
              break;
            case "FaceRegister":
              iconName = "person-add";
              break;
            case "Logout":
              iconName = "log-out";
              break;
            case "HubScreen":
              iconName = "home";
              break;
          }
          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="MenuAluno"
        component={MenuAluno}
        options={{ title: "Menu" }}
      />
      <Tab.Screen
        name="QrCodePage"
        component={QrCodePage}
        options={{ title: "Ler QR Code" }}
      />
      <Tab.Screen
        name="FaceRegister"
        component={FaceRegister}
        options={{ title: "Atualizar Cadastro" }}
      />
       <Tab.Screen
        name="HubScreen"
        component={HubScreen}
        options={{ title: "Ver Hubs" }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ title: "Sair" }}
      />
    </Tab.Navigator>
  );
}
