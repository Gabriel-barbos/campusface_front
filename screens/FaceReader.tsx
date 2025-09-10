import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';

const { width, height } = Dimensions.get('window');

interface FaceReaderProps {}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'denied';

const FaceReader: React.FC<FaceReaderProps> = () => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Animated values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const modalScaleAnim = useRef(new Animated.Value(0)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;

  // Face oval dimensions
  const faceOvalWidth = width * 0.7;
  const faceOvalHeight = height * 0.4;

  useEffect(() => {
    getCameraPermissions();
  }, []);

  useEffect(() => {
    if (isScanning) {
      startScanAnimation();
    } else {
      stopScanAnimation();
    }
  }, [isScanning]);

  useEffect(() => {
    if (showResultModal) {
      showModalAnimation();
    }
  }, [showResultModal]);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const startScanAnimation = () => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
  };

  const stopScanAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const showModalAnimation = () => {
    Animated.parallel([
      Animated.spring(modalScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Icon animation with delay
    setTimeout(() => {
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 200);
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowResultModal(false);
      setScanStatus('idle');
    });
  };

  const simulateFaceScan = () => {
    if (isScanning) return;

    setIsScanning(true);
    setScanStatus('scanning');

    // Simulate scanning for 2.5 seconds
    setTimeout(() => {
      setIsScanning(false);
      
      // Randomly simulate success or failure
      const isSuccess = Math.random() > 0.3; // 70% success rate
      const newStatus = isSuccess ? 'success' : 'denied';
      setScanStatus(newStatus);

      // Show result modal
      setShowResultModal(true);
    }, 2500);
  };

  const getFrameColor = () => {
    switch (scanStatus) {
      case 'scanning':
        return '#FFFFFF';
      case 'success':
        return '#00FF00';
      case 'denied':
        return '#FF0000';
      default:
        return '#FFFFFF';
    }
  };

  const getStatusText = () => {
    switch (scanStatus) {
      case 'scanning':
        return 'Analisando rosto...';
      case 'success':
        return 'Rosto reconhecido com sucesso!';
      case 'denied':
        return 'Rosto não reconhecido';
      default:
        return 'Posicione seu rosto dentro da moldura';
    }
  };

  const getResultModalContent = () => {
    const isSuccess = scanStatus === 'success';
    return {
      icon: isSuccess ? '✓' : '⚠',
      title: isSuccess ? 'Acesso Liberado' : 'Acesso Negado',
      message: isSuccess 
        ? 'Seu rosto foi reconhecido com sucesso. Bem-vindo!' 
        : 'Não foi possível reconhecer seu rosto. Tente novamente.',
      backgroundColor: isSuccess ? '#1a5d1a' : '#5d1a1a',
      borderColor: isSuccess ? '#00ff00' : '#ff0000',
      iconColor: isSuccess ? '#00ff00' : '#ff0000',
    };
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Acesso à câmera negado. Por favor, habilite nas configurações.
        </Text>
      </View>
    );
  }

  const modalContent = getResultModalContent();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Camera View */}
      <CameraView 
        style={styles.camera}
        facing="back"
        flash="off"
      >
        {/* Face Detection Frame */}
        <View style={styles.centerContainer}>
          <Animated.View
            style={[
              styles.faceFrame,
              {
                borderColor: getFrameColor(),
                transform: [{ scale: pulseAnim }],
                width: faceOvalWidth,
                height: faceOvalHeight,
              },
            ]}
          >
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft, { borderColor: getFrameColor() }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: getFrameColor() }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: getFrameColor() }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: getFrameColor() }]} />
          </Animated.View>

          {/* Face detection points */}
          {scanStatus === 'scanning' && (
            <View style={styles.detectionPoints}>
              {[...Array(6)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.detectionPoint,
                    {
                      opacity: pulseAnim,
                      top: `${25 + (i % 3) * 25}%`,
                      left: `${25 + (i % 3) * 25}%`,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Status Text */}
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getFrameColor() }]}>
            {getStatusText()}
          </Text>
          
          {scanStatus === 'idle' && (
            <TouchableOpacity style={styles.scanButton} onPress={simulateFaceScan}>
              <Text style={styles.scanButtonText}>Iniciar Reconhecimento</Text>
            </TouchableOpacity>
          )}

          {isScanning && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingDots}>
                <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
              </View>
            </View>
          )}
        </View>
      </CameraView>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: modalContent.backgroundColor,
                borderColor: modalContent.borderColor,
                opacity: modalOpacityAnim,
                transform: [{ scale: modalScaleAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.modalIcon,
                {
                  backgroundColor: modalContent.iconColor,
                  transform: [{ scale: iconScaleAnim }],
                },
              ]}
            >
              <Text style={styles.modalIconText}>{modalContent.icon}</Text>
            </Animated.View>
            
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalMessage}>{modalContent.message}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { borderColor: modalContent.borderColor }]} 
                onPress={hideModal}
              >
                <Text style={[styles.modalButtonText, { color: modalContent.iconColor }]}>
                  OK
                </Text>
              </TouchableOpacity>
              
              {scanStatus === 'denied' && (
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalButtonSecondary, { backgroundColor: modalContent.iconColor }]} 
                  onPress={() => {
                    hideModal();
                    setTimeout(() => simulateFaceScan(), 500);
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                    Tentar Novamente
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    borderWidth: 3,
    borderRadius: 200,
    borderStyle: 'solid',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: {
    top: -15,
    left: -15,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: -15,
    right: -15,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: -15,
    left: -15,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: -15,
    right: -15,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },
  detectionPoints: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectionPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },
  scanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    borderWidth: 2,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalIconText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#000000',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FaceReader;