import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// 1. Import the hook to use the global user state
import { useUser } from '@/hooks/UserContext';

const { width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  // 2. Get the setName function from our context
  const { setName } = useUser();
  
  // 3. Add state for the new Name field
  const [inputName, setInputName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Check if Name is filled (along with email/pass)
    if (inputName.trim().length > 0 && email.length > 0 && password.length > 0) {
      // 4. Save the name globally before moving to the next screen
      setName(inputName);
      router.replace('/(tabs)');
    } else {
      Alert.alert("Quest Error", "Please enter your Player Name, Email, and Code!");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.headerArea}>
          <Text style={styles.emoji}>🌴🥥🌱</Text>
          <Text style={styles.title}>WORKER</Text>
          <Text style={styles.titleBold}>QUEST</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          
          {/* --- NEW PLAYER NAME INPUT --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PLAYER NAME</Text>
            <TextInput 
              placeholder="Enter your name" 
              placeholderTextColor="#f298f5ff"
              style={styles.input} 
              autoCapitalize="words"
              value={inputName}
              onChangeText={setInputName}
            />
          </View>
          {/* ----------------------------- */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PLAYER EMAIL</Text>
            <TextInput 
              placeholder="hero@quest.com" 
              placeholderTextColor="#f298f5ff"
              style={styles.input} 
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SECRET CODE</Text>
            <TextInput 
              placeholder="••••••••" 
              placeholderTextColor="#f298f5ff"
              secureTextEntry 
              style={styles.input} 
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>LOGIN

            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer: Links to signup */}
        <TouchableOpacity 
          style={styles.footer} 
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.footerText}>
            New Worker? <Text style={styles.signupLink}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8efdeff' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerArea: { alignItems: 'center', marginBottom: 30 }, // Reduced margin slightly to fit extra input
  emoji: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 20, color: '#000000ff', letterSpacing: 6, fontWeight: '500' },
  titleBold: { fontSize: 50, fontWeight: '900', color: '#ff82e4ff', marginTop: -5 },
  card: { width: width * 0.9, backgroundColor: '#000000ff', borderRadius: 30, padding: 25, elevation: 8 },
  inputGroup: { marginBottom: 15 }, // Reduced margin slightly
  label: { fontSize: 12, fontWeight: 'bold', color: '#ff00ffff', marginBottom: 8 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 15, padding: 15, fontSize: 16 },
  loginBtn: { backgroundColor: '#ff6b6bff', padding: 18, borderRadius: 15, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#D85252', marginTop: 10 },
  loginBtnText: { color: '#000000ff', fontSize: 18, fontWeight: 'bold' },
  footer: { marginTop: 30 },
  footerText: { color: '#ff82e4ff', fontSize: 15 },
  signupLink: { color: '#e5b3fcff', fontWeight: 'bold', textDecorationLine: 'underline' },
});