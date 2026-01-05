import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { BounceIn, FadeIn, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Signup() {
  const router = useRouter();
  
  // --- States ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [heroName, setHeroName] = useState('');

  const avatars = ['👷‍♂️', '👩‍🔧', '⚡', '🛠️', '🦾'];

  // --- Logic ---
  const handleSignup = () => {
    // Show the game-like success animation
    setShowSuccess(true);

    // Wait 2.5 seconds, then navigate back to Login
    setTimeout(() => {
      setShowSuccess(false);
      router.replace('/(auth)'); 
    }, 2500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>NEW WORKER</Text>
          <Text style={styles.subtitle}>Create your profile to start quests</Text>
        </View>

        {/* Avatar Picker */}
        <Text style={styles.sectionLabel}>SELECT YOUR AVATAR</Text>
        <View style={styles.avatarRow}>
          {avatars.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setSelectedAvatar(index)}
              style={[
                styles.avatarCircle, 
                selectedAvatar === index && styles.selectedCircle
              ]}
            >
              <Text style={{ fontSize: 32 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Registration Card */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>HERO NAME</Text>
            <TextInput 
              placeholder="e.g. Felix" 
              placeholderTextColor="#94A3B8"
              style={styles.input} 
              value={heroName}
              onChangeText={setHeroName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput 
              placeholder="worker@quest.com" 
              placeholderTextColor="#94A3B8"
              style={styles.input} 
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput 
              placeholder="••••••••" 
              placeholderTextColor="#94A3B8"
              secureTextEntry 
              style={styles.input} 
            />
          </View>

          <TouchableOpacity 
            style={styles.signupBtn} 
            onPress={handleSignup}
          >
            <Text style={styles.signupBtnText}>REGISTER</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back to Login</Text>
        </TouchableOpacity>

        {/* --- SUCCESS ANIMATION MODAL --- */}
        <Modal transparent visible={showSuccess} animationType="fade">
          <View style={styles.modalOverlay}>
            <Animated.View 
              entering={ZoomIn.duration(500)} 
              style={styles.successCard}
            >
              <Animated.Text 
                entering={BounceIn.delay(300)} 
                style={styles.trophyIcon}
              >
                🏆
              </Animated.Text>
              
              <Text style={styles.successTitle}>QUEST READY!</Text>
              <Text style={styles.successSub}>
                Hero <Text style={{fontWeight: 'bold', color: '#6A5AE0'}}>{heroName || 'Worker'}</Text> has been registered.
              </Text>
              
              {/* Fake Progress Bar Animation */}
              <View style={styles.progressBar}>
                <Animated.View 
                  entering={FadeIn.delay(600)} 
                  style={styles.progressFill} 
                />
              </View>
            </Animated.View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8efdeff',
  },
  scrollContainer: {
    padding: 25,
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#ff82e4ff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#cfa2ffff',
  },
  sectionLabel: {
    color: '#000000ff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(245, 132, 243, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#030101ff',
    transform: [{ scale: 1.15 }],
    borderWidth: 3,
    borderColor: '#ff0000ff',
  },
  card: {
    width: '100%',
    backgroundColor: '#000000ff',
    borderRadius: 30,
    padding: 25,
    shadowColor: '#ff0073ff',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ff00ffff',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
  },
  signupBtn: {
    backgroundColor: '#ff6b6bff',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#ff6b6bff',
  },
  signupBtnText: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 25,
    marginBottom: 30,
  },
  backLinkText: {
    color: '#e50000ff',
    textDecorationLine: 'underline',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    width: width * 0.8,
    backgroundColor: '#fdf978ff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  trophyIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f990f1ff',
  },
  successSub: {
    textAlign: 'center',
    color: '#d587ffff',
    marginTop: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginTop: 25,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
  }
});