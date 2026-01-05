import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { tasks } from '@/data/mockData';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Simple Badge Component for this screen
const StatusBadge = ({ label, color }: { label: string, color: string }) => (
  <View style={[styles.badge, { backgroundColor: color + '20' }]}> 
    <Text style={[styles.badgeText, { color: color }]}>{label}</Text>
  </View>
);

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Logic: Find the task
  const task = tasks.find((t) => t.id === id) || tasks[0]; 

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const handleUpdateProgress = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      Alert.alert('Progress Updated', 'Task progress has been updated successfully!');
    }, 1500);
  };

  const handleCompleteTask = () => {
    Alert.alert('Complete Task', 'Are you sure you want to mark this task as complete?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: () => Alert.alert('Success', 'Task marked as complete!') },
    ]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return colors.error;
      case 'high': return colors.warning;
      case 'medium': return colors.info;
      default: return colors.text;
    }
  };

  if (!task) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.iconButton, { backgroundColor: colors.backgroundSecondary }]}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Task Details</Text>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.backgroundSecondary }]}>
            <IconSymbol name="gearshape.fill" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View style={[
          styles.cardBase, 
          { backgroundColor: colors.card, borderColor: colors.text, marginBottom: Spacing.lg }
        ]}>
          <Image source={task.assignedTo.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>{task.assignedTo.name}</Text>
              <View style={[styles.onlineBadge, { backgroundColor: '#dcfce7' }]}>
                <Text style={[styles.onlineText, { color: '#166534' }]}>{task.assignedTo.status}</Text>
              </View>
            </View>
            <Text style={[styles.userRole, { color: colors.primary }]}>{task.assignedTo.role}</Text>
          </View>
        </View>

        {/* Task Info & Progress */}
        <View style={{ marginBottom: Spacing.lg }}>
          <View style={styles.badgeRow}>
            <StatusBadge label={task.priority.toUpperCase()} color={getPriorityColor(task.priority)} />
            <StatusBadge label={task.status.replace('_', ' ').toUpperCase()} color={colors.primary} />
          </View>

          <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
          <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>{task.description}</Text>
          
          <View style={styles.progressContainer}>
             <View style={styles.progressLabels}>
                <Text style={[styles.progressLabel, { color: colors.text }]}>Progress</Text>
                <Text style={[styles.progressValue, { color: colors.primary }]}>{task.progress}%</Text>
             </View>
             <ProgressBar progress={task.progress} height={12} variant="primary" />
          </View>
        </View>

        {/* --- RESTORED: Location Card (With Map Direction) --- */}
        <View style={[styles.cardBase, { backgroundColor: colors.card, borderColor: colors.text, padding: Spacing.md, marginBottom: Spacing.md }]}>
           <View style={styles.locationHeader}>
             <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
               <IconSymbol name="location.fill" size={20} color={colors.primary} />
             </View>
             
             <View style={styles.locationContent}>
               <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Location</Text>
               <Text style={[styles.locationName, { color: colors.text }]}>{task.location.name}</Text>
               <Text style={[styles.locationAddress, { color: colors.textMuted }]}>{task.location.address}</Text>
             </View>

             <TouchableOpacity
               style={[styles.directionBtn, { backgroundColor: colors.primary }]}
               onPress={() => router.push('/(tabs)/map')}
             >
               <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
             </TouchableOpacity>
           </View>
        </View>

        {/* Time Grid (Due Date & Time Spent) */}
        <View style={styles.gridContainer}>
          <View style={[styles.gridItem, { borderColor: colors.border }]}>
             <IconSymbol name="calendar" size={24} color={colors.info} />
             <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Due Date</Text>
             <Text style={[styles.gridValue, { color: colors.text }]}>{formatDate(task.dueDate)}</Text>
          </View>
          <View style={[styles.gridItem, { borderColor: colors.border }]}>
             <IconSymbol name="clock.fill" size={24} color={colors.warning} />
             <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Time Spent</Text>
             <Text style={[styles.gridValue, { color: colors.text }]}>{task.actualHours}/{task.estimatedHours}h</Text>
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Work Photos ({task.photos.length})</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/upload')}>
             <Text style={[styles.addPhotoText, { color: colors.primary }]}>+ Add Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State / Photo List */}
        {task.photos.length === 0 ? (
          <View style={[styles.cardBase, { backgroundColor: colors.card, borderColor: colors.text, padding: Spacing.xl, alignItems: 'center', minHeight: 200, justifyContent: 'center' }]}>
            <IconSymbol name="camera.fill" size={32} color={colors.textMuted} style={{ marginBottom: Spacing.md }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No photos uploaded yet</Text>
            
            <View style={styles.uploadButtonWrapper}>
              <TouchableOpacity 
                style={[styles.uploadButton, { backgroundColor: colors.primary, borderColor: colors.text }]}
                onPress={() => router.push('/(tabs)/upload')}
              >
                <IconSymbol name="camera" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
              </TouchableOpacity>
              <View style={[styles.uploadButtonShadow, { backgroundColor: colors.text }]} />
            </View>
          
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.xl }}>
            {task.photos.map(p => (
              <Image key={p.id} source={{ uri: String(p.uri) }} style={styles.photoThumb} />
            ))}
          </ScrollView>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.footerBtn, { backgroundColor: '#000', marginBottom: 12 }]}
          onPress={handleUpdateProgress}
        >
           <IconSymbol name={isUpdating ? "hourglass" : "arrow.up.circle.fill"} size={20} color="#FFF" style={{ marginRight: 8 }} />
           <Text style={styles.footerBtnText}>{isUpdating ? 'Updating...' : 'Update Progress'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerBtn, { backgroundColor: colors.primary }]}
          onPress={handleCompleteTask}
        >
           <IconSymbol name="checkmark.circle.fill" size={20} color="#FFF" style={{ marginRight: 8 }} />
           <Text style={styles.footerBtnText}>Mark as Complete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },

  // Cards
  cardBase: { borderRadius: BorderRadius.xl, borderWidth: 2, padding: Spacing.md },
  
  // User Info
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: Spacing.md, backgroundColor: '#eee' },
  userInfo: { flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 60, marginTop: -50 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userName: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  userRole: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium },
  onlineBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  onlineText: { fontSize: 10, fontWeight: 'bold' },

  // Task Details
  badgeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  taskTitle: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, marginBottom: Spacing.xs },
  taskDescription: { fontSize: FontSizes.md, lineHeight: 22, marginBottom: Spacing.lg },
  progressContainer: { marginTop: Spacing.sm },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: FontSizes.sm, fontWeight: '600' },
  progressValue: { fontSize: FontSizes.sm, fontWeight: 'bold' },

  // Restored Location Card
  locationHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  locationContent: { flex: 1 },
  locationLabel: { fontSize: FontSizes.sm },
  locationName: { fontSize: FontSizes.md, fontWeight: FontWeights.bold },
  locationAddress: { fontSize: FontSizes.sm, marginTop: 2 },
  directionBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  // Grid
  gridContainer: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  gridItem: { flex: 1, borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', justifyContent: 'center' },
  gridLabel: { fontSize: 12, marginTop: 8 },
  gridValue: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginTop: 4 },

  // Photos
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  addPhotoText: { fontSize: FontSizes.sm, fontWeight: 'bold' },
  emptyText: { fontSize: FontSizes.md, marginBottom: Spacing.lg },
  photoThumb: { width: 140, height: 100, borderRadius: 12, marginRight: 10 },

  // Buttons
  uploadButtonWrapper: { width: 180, height: 50, position: 'relative' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 46, borderRadius: 23, borderWidth: 2, zIndex: 2 },
  uploadButtonText: { color: '#FFF', fontWeight: 'bold' },
  uploadButtonShadow: { position: 'absolute', top: 4, left: 4, width: '100%', height: 46, borderRadius: 23, zIndex: 1 },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, paddingBottom: 30, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  footerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 30, borderWidth: 2, borderColor: '#000' },
  footerBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});