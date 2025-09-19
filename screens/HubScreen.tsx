import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  FlatList,
  Dimensions 
} from "react-native"; 

import { Users, Shield, Building2, Search, TrendingUp } from "lucide-react-native";

const { width } = Dimensions.get('window');

export default function HubScreen({ navigation }) {
  // Generate 50 hubs with realistic data
  const generateHubs = () => {
    const hubNames = [
      "FATEC Zona Leste", "Campus Sul", "Campus Central", "Campus Leste", "Campus Oeste",
    ];

    return hubNames.map((name, index) => ({
      id: index + 1,
      name: name,
      users: Math.floor(Math.random() * 150) + 10, // 10-159 users
      validators: Math.floor(Math.random() * 8) + 2, // 2-9 validators
      status: Math.random() > 0.1 ? 'active' : 'inactive', // 90% active
      category: index < 15 ? 'academic' : index < 30 ? 'administrative' : index < 40 ? 'research' : 'support'
    }));
  };

  const [hubs] = useState(generateHubs());
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'academic': return <Building2 size={20} color="#ffffff" />;
      case 'administrative': return <Shield size={20} color="#ffffff" />;
      case 'research': return <Search size={20} color="#ffffff" />;
      default: return <Users size={20} color="#ffffff" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'academic': return '#1f2937';
      case 'administrative': return '#374151';
      case 'research': return '#4b5563';
      default: return '#6b7280';
    }
  };

  const renderHubCard = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.hubCard, {
        transform: [{ scale: 1 }],
      }]}
      onPress={() => navigation?.navigate("HubDetails", { hub: item })}
      activeOpacity={0.95}
    >
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category) }]}>
            {getCategoryIcon(item.category)}
          </View>
          
          <View style={styles.hubInfo}>
            <Text style={styles.hubName}>{item.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status === 'active' ? 'Ativo' : 'Inativo'}
              </Text>
            </View>
          </View>

          <View style={styles.hubIdContainer}>
            <Text style={styles.hubId}>#{item.id.toString().padStart(3, '0')}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Users size={16} color="#374151" />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statNumber}>{item.users}</Text>
              <Text style={styles.statLabel}>Usuários</Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Shield size={16} color="#374151" />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statNumber}>{item.validators}</Text>
              <Text style={styles.statLabel}>Validadores</Text>
            </View>
          </View>
        </View>

      
      </View>

      {/* Active status indicator */}
      {item.status === 'active' && (
        <View style={styles.activeIndicator} />
      )}
    </TouchableOpacity>
  );

  const totalUsers = hubs.reduce((sum, hub) => sum + hub.users, 0);
  const totalValidators = hubs.reduce((sum, hub) => sum + hub.validators, 0);
  const activeHubs = hubs.filter(hub => hub.status === 'active').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Hubs Disponíveis</Text>
          
        </View>
      </View>

      {/* Hub List */}
      <FlatList
        data={hubs}
        renderItem={renderHubCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1fff",
  },
  
  header: {
    backgroundColor: "#1f1f1fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  
  headerContent: {
    alignItems: "flex-start",
  },
  
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  
  hubCard: {
    width: width - 40,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
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
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  hubInfo: {
    flex: 1,
  },
  
  hubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 22,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  hubIdContainer: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  hubId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
  },

  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  statIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  statTextContainer: {
    flex: 1,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 20,
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },

  performanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },

  performanceText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 6,
  },
  
  activeIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#10B981',
  },
});