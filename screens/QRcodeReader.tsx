import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
  Vibration,
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

interface QRScannerProps {}

const QRScanner: React.FC<QRScannerProps> = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animações
  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  const cornerAnimation = useRef(new Animated.Value(0)).current;
  const successAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isScanning) {
      startScanLineAnimation();
      startCornerAnimation();
    }
  }, [isScanning]);

  const startScanLineAnimation = () => {
    scanLineAnimation.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startCornerAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const showSuccessAnimation = () => {
    successAnimation.setValue(0);
    Animated.spring(successAnimation, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleBarcodeScanned = (data: any) => {
    if (!isScanning) return;

    setIsScanning(false);
    setScannedData(data.data);
    setShowSuccess(true);
    
    // Feedback tátil
    Vibration.vibrate(100);
    
    // Animações de sucesso
    showSuccessAnimation();
    startPulseAnimation();

    // Mostrar alerta com os dados
    setTimeout(() => {
      Alert.alert(
        'QR Code Lido!',
        `Dados: ${data.data}`,
        [
          {
            text: 'Escanear Novamente',
            onPress: resetScanner,
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    }, 1000);
  };

  const resetScanner = () => {
    setIsScanning(true);
    setScannedData(null);
    setShowSuccess(false);
    successAnimation.setValue(0);
    pulseAnimation.setValue(1);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Solicitando permissões da câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color="#666" />
          <Text style={styles.permissionTitle}>Acesso à Câmera Necessário</Text>
          <Text style={styles.permissionDescription}>
            Para escanear códigos QR, precisamos acessar sua câmera
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Permitir Acesso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leitor de QR-code</Text>
        <Text style={styles.headerSubtitle}>
          {isScanning ? 'Aponte para um QR Code' : 'QR Code detectado!'}
        </Text>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          {/* Overlay escuro */}
          <View style={styles.overlay}>
            {/* Top overlay */}
            <View style={styles.overlayTop} />
            
            {/* Middle section com scan area */}
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              
              {/* Scan Area */}
              <View style={styles.scanArea}>
                {/* Moldura do QR Code */}
                <View style={styles.scanFrame}>
                  {/* Cantos da moldura */}
                  <Animated.View 
                    style={[
                      styles.corner, 
                      styles.topLeft,
                      {
                        opacity: cornerAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.corner, 
                      styles.topRight,
                      {
                        opacity: cornerAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.corner, 
                      styles.bottomLeft,
                      {
                        opacity: cornerAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.corner, 
                      styles.bottomRight,
                      {
                        opacity: cornerAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ]} 
                  />

                  {/* Linha de scan animada */}
                  {isScanning && (
                    <Animated.View
                      style={[
                        styles.scanLine,
                        {
                          transform: [
                            {
                              translateY: scanLineAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, SCAN_AREA_SIZE - 4],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  )}

                  {/* Ícone de sucesso */}
                  {showSuccess && (
                    <Animated.View
                      style={[
                        styles.successIcon,
                        {
                          transform: [
                            { scale: successAnimation },
                            { scale: pulseAnimation },
                          ],
                          opacity: successAnimation,
                        },
                      ]}
                    >
                      <Ionicons name="checkmark-circle" size={60} color="#00FF00" />
                    </Animated.View>
                  )}
                </View>
              </View>
              
              <View style={styles.overlaySide} />
            </View>
            
            {/* Bottom overlay */}
            <View style={styles.overlayBottom} />
          </View>
        </CameraView>
      </View>

      {/* Status e instruções */}
      <View style={styles.bottomContainer}>
        {/* Status indicator */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            { backgroundColor: isScanning ? '#00FF00' : showSuccess ? '#00FF00' : '#666' }
          ]} />
          <Text style={styles.statusText}>
            {isScanning ? 'Escaneando...' : showSuccess ? 'Sucesso!' : 'Pronto'}
          </Text>
        </View>

        {/* Dados escaneados */}
        {scannedData && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>QR Code lido:</Text>
            <Text style={styles.dataText} numberOfLines={3}>
              {scannedData}
            </Text>
          </View>
        )}

        {/* Instruções */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>• Mantenha o QR Code dentro da moldura</Text>
       
        </View>

        {/* Botão de reset */}
        {!isScanning && (
          <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
            <Ionicons name="refresh-outline" size={20} color="#FFF" />
            <Text style={styles.resetButtonText}>Escanear Novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CCC',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: SCAN_AREA_SIZE - 40,
    height: SCAN_AREA_SIZE - 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFF',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  successIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  dataContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dataLabel: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 8,
  },
  dataText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  instructionsContainer: {
    marginVertical: 15,
  },
  instructionText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#555',
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  // Styles para tela de permissões
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 16,
  },
  permissionTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionDescription: {
    color: '#CCC',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    minWidth: 200,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRScanner;