import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Logout confirmation logic
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to quit your session?",
      [
        { text: "Stay", style: "cancel" },
        { 
          text: "QUIT", 
          style: "destructive", 
          onPress: () => router.replace('/(auth)') 
        }
      ]
    );
  };

  return (
    <Tabs
      screenOptions={{
        // FIX: Change active color to Primary (Pink) so the TEXT label is visible
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.tabIconDefault,
        
        // --- GLOBAL HEADER SETTINGS ---
        headerShown: true, 
        headerStyle: {
          backgroundColor: colors.card,
          // FIX: Manually reduce the height to pull content up
          height: Platform.OS === 'ios' ? 90 : 60, 
          // FIX: Remove shadow/elevation to remove the "gap" appearance
          shadowOpacity: 0, // Remove shadow
          elevation: 0, //remove shadow on Android
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
        },
        headerTitleStyle: {
          fontWeight: '900',
          color: colors.text,
        },
        // Show QUIT button on all pages by default
        headerRight: () => (
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.quitButton}
          >
            <Text style={styles.quitText}>QUIT</Text>
          </TouchableOpacity>
        ),

        // --- GAME TAB BAR STYLING ---
        tabBarButton: HapticTab,
        // FIX: Turn labels ON
        tabBarShowLabel: true,
        // FIX: Style the labels to be bold and small
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '800',
            marginBottom: 5,
            marginTop: 4, // <--- ADDED SPACE HERE
        },
        
        tabBarStyle: {
          backgroundColor: colors.card,
          position: 'absolute', // FLOAT
          bottom: 25,           // Lift from bottom
          left: 15,             // Margin left
          right: 15,            // Margin right
          
          // FIX: Increased height slightly to accommodate labels
          height: Platform.OS === 'ios' ? 90 : 80,           
          
          borderRadius: BorderRadius.xl,     
          
          // GAME BORDER
          borderWidth: 3,
          borderColor: '#000000',
          borderTopWidth: 3,
          borderTopColor: '#000000',

          // GAME HARD SHADOW
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 5,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10, // Adjust padding for labels
        },
      }}
    >
      {/* 1. HOME SCREEN */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false, 
          headerRight: () => null,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {/* CHANGED SIZE TO 28 */}
              <IconSymbol size={28} name="house.fill" color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />

      {/* 2. TASKS SCREEN */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {/* CHANGED SIZE TO 28 */}
              <IconSymbol size={28} name="checklist" color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />

      {/* 3. UPLOAD SCREEN */}
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {/* CHANGED SIZE TO 28 */}
              <IconSymbol size={28} name="camera.fill" color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />

      {/* 4. MAP SCREEN */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {/* CHANGED SIZE TO 28 */}
              <IconSymbol size={28} name="map.fill" color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />

      {/* 5. AI CHAT SCREEN */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              {/* CHANGED SIZE TO 28 */}
              <IconSymbol size={28} name="brain.head.profile" color={focused ? '#FFFFFF' : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 6, 
    borderRadius: BorderRadius.md, 
    alignItems: 'center',
    justifyContent: 'center',
    // REMOVED NEGATIVE MARGIN TO FIX SPACING
  },
  activeIconContainer: {
    backgroundColor: Colors.light.primary, 
    transform: [{ scale: 1.1 }], 
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: BorderRadius.md, 
  },
  quitButton: {
    marginRight: 15,
    backgroundColor: '#FF003C', // Game Red
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm, 
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  quitText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
  },
});