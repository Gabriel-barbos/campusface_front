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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CameraCapture'>;

const CameraCaptureScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  // animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) requestPermission();

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
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  };

  const startSpinAnimation = () => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
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

  const confirmPicture = () => {
    if (!capturedPhoto) return;
    // ✅ Retorna para RegisterScreen com a foto
    navigation.navigate('Register', { photoUri: capturedPhoto });
  };

  const retakePicture = () => {
    setCapturedPhoto(null);
    scaleAnim.setValue(0);
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
        <Ionicons name="camera-outline" size={80} color="#666" />
        <Text style={styles.permissionText}>Acesso à câmera negado</Text>
        <Text style={styles.permissionSubtext}>
          Conceda permissão para usar a câmera
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={[styles.buttonText, { color: '#000' }]}>Conceder Permissão</Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>Capturar Foto</Text>
        <Text style={styles.subtitle}>
          {capturedPhoto ? 'Confirme sua foto' : 'Posicione seu rosto na moldura'}
        </Text>
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
            />
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
              onPress={confirmPicture}
              disabled={isProcessing}
            >
              <Ionicons name="checkmark" size={20} color="#000" />
              <Text style={[styles.buttonText, { color: '#000' }]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', lineHeight: 22 },
  cameraContainer: { flex: 1, position: 'relative', marginHorizontal: 20, borderRadius: 20, overflow: 'hidden' },
  camera: { flex: 1 },
  faceFrame: { position: 'absolute', top: '50%', left: '50%', width: 250, height: 300, marginLeft: -125, marginTop: -150, borderRadius: 125, borderWidth: 2, borderColor: '#fff' },
  photoPreview: { flex: 1, position: 'relative' },
  previewImage: { flex: 1, width: '100%', resizeMode: 'cover' },
  buttonContainer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },
  captureButton: { alignSelf: 'center', width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  primaryButton: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButton: { flex: 1, flexDirection: 'row', backgroundColor: 'transparent', borderWidth: 2, borderColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  disabledButton: { opacity: 0.6 },
  processingIndicator: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff', borderTopColor: 'transparent' },
  permissionText: { color: '#fff', fontSize: 18, textAlign: 'center', marginTop: 20 },
  permissionSubtext: { color: '#ccc', fontSize: 14, textAlign: 'center', marginTop: 10, paddingHorizontal: 40 },
});

export default CameraCaptureScreen;
