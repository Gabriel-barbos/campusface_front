import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const QrCodePage = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [qrCodeData, setQrCodeData] = useState('');
  const [userName] = useState('Gabriel Barbosa'); 
  const [studentId] = useState('2024001234'); 
  
  // Animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Gera um novo QR Code 
  const generateQRCode = () => {
    const timestamp = Date.now();
    const sessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setQrCodeData(`CAMPUS_ACCESS|${studentId}|${userName}|${timestamp}|${sessionId}`);
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
  };

  // Timer e regeneração automática
  useEffect(() => {
    generateQRCode();

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Atualiza barra de progresso
        progressAnim.setValue(newTime / 30);
        
        if (newTime <= 0) {
          generateQRCode();
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
    const size = 25; 
    const pattern = [];
    
    const seed = qrCodeData.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const index = row * size + col;
        let isBlack = false;
        
        if ((row < 7 && col < 7) || (row < 7 && col >= size - 7) || (row >= size - 7 && col < 7)) {
          if ((row === 0 || row === 6 || col === 0 || col === 6) ||
              (row >= 2 && row <= 4 && col >= 2 && col <= 4)) {
            isBlack = true;
          }
        }
        else if (row >= size - 7 && row < size - 2 && col >= size - 7 && col < size - 2) {
          if ((row === size - 7 || row === size - 3 || col === size - 7 || col === size - 3) ||
              (row === size - 5 && col === size - 5)) {
            isBlack = true;
          }
        }
        else if (row === 6 && col >= 8 && col < size - 8) {
          isBlack = col % 2 === 0;
        }
        else if (col === 6 && row >= 8 && row < size - 8) {
          isBlack = row % 2 === 0;
        }
        else if ((row === 7 && col < 9) || (col === 7 && row < 9)) {
          isBlack = false;
        }
        else {
          const pseudoRandom = (seed * 9301 + 49297) % 233280;
          const normalized = (pseudoRandom / 233280.0 + index * 0.1) % 1;
          isBlack = normalized > 0.5;
          
          if ((row + col) % 3 === 0 && (seed + index) % 7 === 0) {
            isBlack = !isBlack;
          }
        }
        
        pattern.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.qrBlock,
              { backgroundColor: isBlack ? '#000' : '#fff' }
            ]}
          />
        );
      }
    }
    
    return pattern;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Carteirinha */}
      <Animated.View style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        {/* Header da carteirinha */}
        <View style={styles.cardHeader}>
          <Text style={styles.institutionName}>CAMPUS ZONA LESTE</Text>
          <Text style={styles.cardType}>QR Code de entrada</Text>
        </View>

        {/* Informações do estudante */}
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{userName}</Text>
          <Text style={styles.studentId}>Matrícula: {studentId}</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>QR Code</Text>
          <View style={styles.qrDisplay}>
            <View style={styles.qrCodeArea}>
              <View style={styles.qrPattern}>
                {renderQRCode()}
              </View>
            </View>
          </View>
        </View>

        {/* Timer com barra de progresso */}
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

          {/* Barra de progresso */}
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
  validity: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
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
  qrBlock: {
    width: '4%', // 25x25 grid
    height: '4%',
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
  cardFooter: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  warningText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  warningIcon: {
    fontSize: 11,
  },
});

export default QrCodePage;