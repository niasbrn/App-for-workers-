import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
// FIX: Revert to namespace import
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { tasks } from '@/data/mockData';
import { useColorScheme } from '@/hooks/use-color-scheme';

// --- GAMING THEME CONSTANTS ---
const NEON_GREEN = '#00FF41';
const NEON_RED = '#FF3131';
const DARK_BG = '#111111';

export default function UploadScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // --- STATE ---
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- ANIMATION REFS ---
  const scanAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const activeTasks = tasks.filter((t) => t.status === 'in_progress' || t.status === 'pending');

  // --- AI SCANNER ANIMATION ---
  const startScanAnimation = () => {
    scanAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopScanAnimation = () => {
    scanAnim.stopAnimation();
    scanAnim.setValue(0);
  };

  // --- CORE LOGIC: ANALYSIS & FILE SAVING ---
  const runAiAnalysis = async (imageUri: string) => {
    setAiStatus('scanning');
    startScanAnimation();

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const fileName = `VERIFIED_LOG_${Date.now()}.jpg`;
      
      // FIX: Cast FileSystem to 'any' to bypass the TypeScript definition error
      // This tells TS: "Trust me, documentDirectory exists here."
      const fs = FileSystem as any;
      const directory = fs.documentDirectory || fs.cacheDirectory;

      if (!directory) {
        throw new Error('Device storage is not available');
      }

      const permanentUri = `${directory}${fileName}`;

      // FIX: Use copyAsync from the 'fs' variable we created
      await fs.copyAsync({
        from: imageUri,
        to: permanentUri,
      });

      // Save a copy to the phone's public gallery
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(permanentUri);
      }

      setAiStatus('success');
      stopScanAnimation();
    } catch (error) {
      console.error('Storage Error:', error);
      setAiStatus('failed');
      stopScanAnimation();
      Alert.alert('Protocol Error', 'Verification failed to write to local disk.');
    }
  };

  // --- IMAGE PICKER HANDLERS ---
  const handlePickImage = async (useCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      quality: 0.8,
    };

    const result = useCamera 
      ? await ImagePicker.launchCameraAsync(options) 
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      runAiAnalysis(uri);
    }
  };

  // --- FINAL UPLOAD & PROGRESS BAR ---
  const handleFinalSubmit = () => {
    setIsUploading(true);
    setUploadProgress(0);
    progressAnim.setValue(0);

    // Visual Progress Animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Percentage Counter
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 120);

    // Completion Logic
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert('Sync Successful', 'Harvest data sent to HQ.');
      setSelectedImage(null);
      setAiStatus('idle');
      setSelectedTask(null);
      setCaption('');
      setUploadProgress(0);
    }, 3000);
  };

  const getStatusColor = () => {
    if (aiStatus === 'scanning') return colors.primary;
    if (aiStatus === 'success') return NEON_GREEN;
    if (aiStatus === 'failed') return NEON_RED;
    return colors.border;
  };

  return (
    <View style={[styles.container, { paddingTop: 10 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Upload Work</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Worker ID: #7712 - AI Verification</Text>
        </View>

        {/* 1. Task Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Protocol</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.taskScroll} contentContainerStyle={styles.taskScrollContent}>
          {activeTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskChip,
                {
                  backgroundColor: selectedTask === task.id ? colors.primary : colors.backgroundSecondary,
                  borderColor: selectedTask === task.id ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedTask(task.id)}
            >
              <Text style={[styles.taskChipText, { color: selectedTask === task.id ? '#FFFFFF' : colors.text }]}>
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 2. Photo Viewport */}
        <View style={styles.photoSection}>
          {selectedImage ? (
            <View style={[styles.scannerContainer, { borderColor: getStatusColor() }]}>
              <Image source={{ uri: selectedImage }} style={styles.scannerImage} contentFit="cover" />
              {aiStatus === 'scanning' && (
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      backgroundColor: getStatusColor(),
                      transform: [{
                        translateY: scanAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 250],
                        }),
                      }],
                    },
                  ]}
                />
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.uploadBox, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={() => {
                Alert.alert("Source", "Select image source", [
                  { text: "Camera", onPress: () => handlePickImage(true) },
                  { text: "Gallery", onPress: () => handlePickImage(false) },
                  { text: "Cancel", style: "cancel" }
                ]);
              }}
            >
              <IconSymbol name="camera.viewfinder" size={32} color={colors.primary} />
              <Text style={[styles.uploadTitle, { color: colors.text }]}>Initiate Scan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. AI Feedback Card */}
        {aiStatus !== 'idle' && (
          <View style={styles.aiResultSection}>
            <View style={[styles.aiCard, { borderColor: getStatusColor() }]}>
              <Text style={[styles.aiCardTitle, { color: getStatusColor() }]}>
                {aiStatus === 'scanning' ? 'COMPUTING...' : 'ANALYSIS REPORT'}
              </Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>OBJECT_VERIFICATION</Text>
                <Text style={[styles.statValue, { color: aiStatus === 'success' ? NEON_GREEN : '#888' }]}>
                  {aiStatus === 'success' ? 'PASS' : '...'}
                </Text>
              </View>
              {aiStatus === 'failed' && <Text style={styles.errorText}>REASON: INSUFFICIENT LIGHTING / BLUR</Text>}
            </View>
          </View>
        )}

        {/* 4. Progress Bar (Shown during upload) */}
        {isUploading && (
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={[styles.progressText, { color: colors.text }]}>SYNCING TO CLOUD...</Text>
              <Text style={[styles.progressText, { color: NEON_GREEN }]}>{uploadProgress}%</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.backgroundSecondary }]}>
              <Animated.View 
                style={[
                  styles.progressBarFill, 
                  { 
                    backgroundColor: NEON_GREEN,
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
            </View>
          </View>
        )}

        {/* 5. Caption & Final Action */}
        <View style={styles.uploadButtonContainer}>
          <TextInput
            style={[styles.captionInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
            placeholder="Log additional notes..."
            placeholderTextColor={colors.textMuted}
            value={caption}
            onChangeText={setCaption}
            multiline
          />
          <Button
            title={isUploading ? 'PLEASE WAIT...' : 'EXECUTE LOG PROTOCOL'}
            onPress={handleFinalSubmit}
            disabled={aiStatus !== 'success' || !selectedTask || isUploading}
            fullWidth
            variant="primary"
          />
          {selectedImage && !isUploading && (
            <TouchableOpacity onPress={() => { setSelectedImage(null); setAiStatus('idle'); }} style={styles.cancelBtn}>
              <Text style={{ color: NEON_RED, fontWeight: 'bold' }}>ABORT PROTOCOL</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.lg },
  title: { fontSize: FontSizes.xxxl, fontWeight: FontWeights.bold },
  subtitle: { fontSize: FontSizes.sm, opacity: 0.6, letterSpacing: 1 },
  sectionTitle: { paddingHorizontal: Spacing.lg, fontWeight: '800', marginBottom: 10, fontSize: 12, textTransform: 'uppercase' },
  taskScroll: { maxHeight: 50 },
  taskScrollContent: { paddingHorizontal: Spacing.lg, gap: 10 },
  taskChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 4, borderWidth: 1 },
  taskChipText: { fontSize: 11, fontWeight: '700' },
  photoSection: { padding: Spacing.lg },
  uploadBox: { height: 200, borderStyle: 'dashed', borderWidth: 2, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  uploadTitle: { marginTop: 10, fontWeight: '800', textTransform: 'uppercase', fontSize: 12 },
  scannerContainer: { height: 250, borderRadius: 8, borderWidth: 2, overflow: 'hidden', backgroundColor: '#000' },
  scannerImage: { width: '100%', height: '100%', opacity: 0.7 },
  scanLine: { position: 'absolute', width: '100%', height: 4, zIndex: 10, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 },
  aiResultSection: { paddingHorizontal: Spacing.lg, marginBottom: 20 },
  aiCard: { backgroundColor: DARK_BG, padding: 15, borderRadius: 4, borderLeftWidth: 4 },
  aiCardTitle: { fontWeight: '900', fontSize: 10, marginBottom: 10, letterSpacing: 2 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: '#555', fontSize: 10, fontWeight: 'bold' },
  statValue: { fontWeight: 'bold', fontSize: 11, fontFamily: 'monospace' },
  errorText: { color: NEON_RED, fontSize: 10, marginTop: 10, fontWeight: 'bold' },
  progressSection: { paddingHorizontal: Spacing.lg, marginBottom: 20 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  progressBarBg: { height: 6, width: '100%', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%' },
  uploadButtonContainer: { paddingHorizontal: Spacing.lg, gap: 15 },
  captionInput: { padding: 15, borderRadius: 8, borderWidth: 1, minHeight: 80, textAlignVertical: 'top', fontSize: 14 },
  cancelBtn: { alignSelf: 'center', padding: 5 }
});