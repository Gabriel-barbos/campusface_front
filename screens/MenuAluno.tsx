import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Dimensions 
} from "react-native";
import { QrCode, Camera } from "lucide-react-native";
const { width } = Dimensions.get('window');

export default function MenuAluno({ navigation }) {
  const menuItems = [
    {
      id: 1,
      title: "QR Code",
      subtitle: "Escaneie seu código de acesso",
      icon: <QrCode />,
      action: () => navigation.navigate("QrCodePage"),
      gradient: ["#000", "#333"],
      description: "Acesso via QR Code"
    },
    {
      id: 2,
      title: "Atualizar Foto",
      subtitle: "Atualize sua foto de perfil",
      icon: <Camera/>,
      action: () => navigation.navigate("FaceRegister", { 
        isRegistration: false,
        // Você pode passar a foto atual do usuário se tiver:
        // currentPhoto: user.photoUri 
      }),
      gradient: ["#333", "#333"],
      description: "Capture uma nova foto para seu perfil"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Campus</Text>
          <Text style={styles.logoSubText}>Face</Text>
        </View>
        <Text style={styles.welcomeText}>Menu do Aluno</Text>
        <Text style={styles.subtitleText}>Escolha uma ação para continuar</Text>
      </View>

      {/* Menu Cards */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              index === 0 ? styles.firstCard : styles.secondCard
            ]}
            onPress={item.action}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.cardIcon}>{item.icon}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              
              <Text style={styles.cardDescription}>{item.description}</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.actionText}>Tocar para acessar</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
            
            {/* Card decoration */}
            <View style={[styles.cardDecoration, index === 0 ? styles.decoration1 : styles.decoration2]} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1fff",
  },
  
  header: {
    paddingTop: 20,
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: "center",
  },
  
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  
  logoText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  
  logoSubText: {
    fontSize: 28,
    fontWeight: "300",
    color: "#fff",
    marginTop: -6,
    letterSpacing: 2,
  },
  
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  
  subtitleText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  card: {
    borderRadius: 24,
    marginBottom: 20,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  
  firstCard: {
    backgroundColor: "#fff",
  },
  
  secondCard: {
    backgroundColor: "#ffffffff",
  },
  
  cardContent: {
    zIndex: 2,
  },
  
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  
  cardIcon: {
    fontSize: 28,
  },
  
  cardInfo: {
    flex: 1,
    paddingTop: 4,
  },
  
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  
  cardSubtitle: {
    fontSize: 15,
    opacity: 0.7,
    lineHeight: 20,
  },
  
  cardDescription: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 20,
  },
  
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  
  arrow: {
    fontSize: 18,
    fontWeight: "300",
    opacity: 0.6,
  },
  
  cardDecoration: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.05,
  },
  
  decoration1: {
    backgroundColor: "#000",
  },
  
  decoration2: {
    backgroundColor: "#fff",
  },
  
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: "center",
  },
  
  footerText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  
  footerSubtext: {
    color: "#444",
    fontSize: 12,
    fontWeight: "400",
  },
});