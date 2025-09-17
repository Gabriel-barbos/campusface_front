import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function FaceRegister({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const cameraRef = useRef(null);

  // Verifica se é cadastro ou atualização de perfil
  const isRegistration = route.params?.isRegistration || false;
  const currentPhoto = route.params?.currentPhoto || null;

  // Animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) requestPermission();

    // animação de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    startPulseAnimation();
    startSpinAnimation();
  }, [permission]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startSpinAnimation = () => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo?.uri ?? null);

        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível capturar a foto. Tente novamente.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const retakePicture = () => {
    setCapturedPhoto(null);
    scaleAnim.setValue(0);
  };

  const confirmPhoto = async () => {
    if (!capturedPhoto) return;

    setIsProcessing(true);

    // Simula processamento
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);

      Animated.sequence([
        Animated.spring(successAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSuccess(false);
        
        if (isRegistration) {
          // Caso cadastro: volta para Register
          navigation.navigate('Register', { photoUri: capturedPhoto });
        } else {
          // Caso atualização: volta para a tela anterior com a foto
          navigation.goBack();
          // Se você usar callback, pode fazer assim:
          // route.params?.onPhotoUpdate?.(capturedPhoto);
        }
      });
    }, 1000);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color="#666" />
          <Text style={styles.permissionText}>Acesso à câmera negado</Text>
          <Text style={styles.permissionSubtext}>
            Conceda permissão para usar a câmera
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={[styles.buttonText, { color: '#000' }]}>Conceder Permissão</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {isRegistration ? 'Cadastro Facial' : 'Atualizar Foto'}
          </Text>
          <Text style={styles.subtitle}>
            {capturedPhoto 
              ? 'Confirme sua foto' 
              : isRegistration 
                ? 'Posicione seu rosto na moldura'
                : 'Capture sua nova foto de perfil'
            }
          </Text>
        </View>
      </Animated.View>

      <View style={styles.cameraContainer}>
        {!capturedPhoto ? (
          <>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
            />

            <Animated.View
              style={[
                styles.faceFrame,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <View style={styles.frameCorner} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />
            </Animated.View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Centralize seu rosto na moldura
              </Text>
            </View>
          </>
        ) : (
          <Animated.View
            style={[
              styles.photoPreview,
              {
                opacity: scaleAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
            <View style={styles.photoOverlay}>
              <Text style={styles.photoConfirmText}>Foto capturada com sucesso!</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
        {!capturedPhoto ? (
          <TouchableOpacity
            style={[styles.captureButton, isProcessing && styles.disabledButton]}
            onPress={takePicture}
            disabled={isProcessing}
          >
            <View style={styles.captureButtonInner}>
              {isProcessing ? (
                <Animated.View style={[styles.processingIndicator, { transform: [{ rotate: spin }] }]} />
              ) : (
                <Ionicons name="camera" size={30} color="#000" />
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={retakePicture}
              disabled={isProcessing}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.buttonText}>Tentar Novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, isProcessing && styles.disabledButton]}
              onPress={confirmPhoto}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Animated.View style={[styles.processingIndicator, { transform: [{ rotate: spin }] }]} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#000" />
                  <Text style={[styles.buttonText, { color: '#000' }]}>Confirmar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {showSuccess && (
        <Animated.View
          style={[
            styles.successOverlay,
            {
              opacity: successAnim,
              transform: [{ scale: successAnim }]
            }
          ]}
        >
          <View style={styles.successContent}>
            <Animated.View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </Animated.View>
            <Text style={styles.successTitle}>
              {isRegistration ? 'Foto Confirmada!' : 'Foto Atualizada!'}
            </Text>
            <Text style={styles.successMessage}>
              {isRegistration 
                ? 'Retornando para o cadastro...' 
                : 'Sua foto de perfil foi atualizada!'
              }
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40, // Compensa o espaço do botão para centralizar
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', lineHeight: 22 },
  
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  cameraContainer: { flex: 1, position: 'relative', marginHorizontal: 20, borderRadius: 20, overflow: 'hidden' },
  camera: { flex: 1 },
  faceFrame: { position: 'absolute', top: '50%', left: '50%', width: 250, height: 300, marginLeft: -125, marginTop: -150, borderRadius: 125 },
  frameCorner: { position: 'absolute', width: 40, height: 40, top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#fff', borderTopLeftRadius: 20 },
  topRight: { top: 0, right: 0, left: 'auto', borderTopWidth: 3, borderRightWidth: 3, borderLeftWidth: 0, borderTopRightRadius: 20, borderTopLeftRadius: 0 },
  bottomLeft: { bottom: 0, top: 'auto', borderBottomWidth: 3, borderLeftWidth: 3, borderTopWidth: 0, borderBottomLeftRadius: 20, borderTopLeftRadius: 0 },
  bottomRight: { bottom: 0, right: 0, top: 'auto', left: 'auto', borderBottomWidth: 3, borderRightWidth: 3, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 20, borderTopLeftRadius: 0 },
  instructionContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  instructionText: { color: '#fff', fontSize: 16, textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  photoPreview: { flex: 1, position: 'relative' },
  previewImage: { flex: 1, width: '100%', resizeMode: 'cover' },
  photoOverlay: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  photoConfirmText: { color: '#fff', fontSize: 16, backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  buttonContainer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },
  captureButton: { alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  primaryButton: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButton: { flex: 1, flexDirection: 'row', backgroundColor: 'transparent', borderWidth: 2, borderColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  disabledButton: { opacity: 0.6 },
  processingIndicator: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff', borderTopColor: 'transparent' },
  successOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  successContent: { alignItems: 'center', padding: 40 },
  successIcon: { marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  successMessage: { fontSize: 16, color: '#ccc', textAlign: 'center', lineHeight: 22 },
  permissionText: { color: '#fff', fontSize: 18, textAlign: 'center', marginTop: 20 },
  permissionSubtext: { color: '#ccc', fontSize: 14, textAlign: 'center', marginTop: 10, paddingHorizontal: 40, marginBottom: 30 },
});