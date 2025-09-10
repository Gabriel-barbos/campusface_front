import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { useAuth } from "../AuthContext";

export default function LogoutScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Configurações</Text>
      <Button title="Sair da conta" onPress={logout} color="#FF3B30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
