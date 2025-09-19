import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useQrCodeService } from '../services/QRcodeService';
import { useAuth } from '../AuthContext';

const { width } = Dimensions.get('window');

const QrCodePage = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { generateQrCode } = useQrCodeService();
  const { user } = useAuth();
  
  // Animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Gera um novo QR Code via API
  const fetchNewQRCode = async () => {
    try {
      setIsLoading(true);
      const response = await generateQrCode();
      
      if (response.success && response.data?.code) {
        setQrCodeData(response.data.code);
        setTimeLeft(30);
        
        // Reset das animações
        progressAnim.setValue(1);
        fadeAnim.setValue(0);
        
        // Animação de entrada do novo QR
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
          })
        ]).start();
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      Alert.alert('Erro', 'Não foi possível gerar o QR Code. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Timer e regeneração automática
  useEffect(() => {
    fetchNewQRCode();

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Atualiza barra de progresso
        progressAnim.setValue(newTime / 30);
        
        if (newTime <= 0) {
          fetchNewQRCode();
          return 30;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animação de pulse para timer crítico
  useEffect(() => {
    if (timeLeft <= 5) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft]);

  const renderQRCode = () => {
    if (!qrCodeData) return null;
    
    return (
      <QRCode
        value={qrCodeData}
        size={160}
        backgroundColor="white"
        color="black"
        logoBackgroundColor="transparent"
      />
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <Animated.View style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <View style={styles.cardHeader}>
          <Text style={styles.institutionName}>CAMPUS ZONA LESTE</Text>
          <Text style={styles.cardType}>QR Code de entrada</Text>
        </View>

        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{user?.fullName || 'Usuário'}</Text>
          <Text style={styles.studentId}>CPF: {user?.document || 'N/A'}</Text>
        </View>

        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>QR Code</Text>
          <View style={styles.qrDisplay}>
            <View style={styles.qrCodeArea}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Carregando...</Text>
                </View>
              ) : (
                renderQRCode()
              )}
            </View>
          </View>
        </View>

        <View style={styles.timerSection}>
          <Text style={styles.timerLabel}>Expira em:</Text>
          
          <Animated.View 
            style={[
              styles.timerContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Text style={[
              styles.timerText,
              timeLeft <= 5 && styles.timerTextCritical
            ]}>
              {String(timeLeft).padStart(2, '0')}s
            </Text>
          </Animated.View>

          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { 
                  width: progressWidth,
                  backgroundColor: timeLeft <= 5 ? '#FF3B30' : '#000'
                }
              ]} 
            />
            <View style={styles.progressBarBg} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: width * 0.9,
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  cardHeader: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 16,
    marginBottom: 20,
  },
  institutionName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  studentInfo: {
    marginBottom: 24,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  studentId: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  qrDisplay: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeArea: {
    width: 180,
    height: 180,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  qrPattern: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  timerContainer: {
    marginBottom: 12,
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace',
  },
  timerTextCritical: {
    color: '#FF3B30',
  },
  progressBarContainer: {
    position: 'relative',
    width: width * 0.7,
    height: 6,
  },
  progressBarBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    zIndex: 1,
  },
});

export default QrCodePage;