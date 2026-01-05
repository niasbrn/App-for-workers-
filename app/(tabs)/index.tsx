import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { currentWorker, dailyStats, notifications, tasks, weeklyProgress } from '@/data/mockData';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. Import the User Context hook
import { useUser } from '@/hooks/UserContext';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [refreshing, setRefreshing] = React.useState(false);

  // 2. Get the name from the global context
  const { name } = useUser();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // --- Logout Logic ---
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => router.replace('/(auth)') 
        }
      ]
    );
  };

  const todayStats = dailyStats[0];
  const activeTasks = tasks.filter((t) => t.status === 'in_progress');
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Helper to get first name only if needed, or use full name
  const displayName = name ? name.split(' ')[0] : 'Worker';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            {/* 3. Display the dynamic name here */}
            <Text style={[styles.userName, { color: colors.text }]}>
              {displayName} 👋
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.backgroundSecondary }]}
            >
              <IconSymbol name="bell.fill" size={20} color={colors.icon} />
              {unreadNotifications > 0 && (
                <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
                  <Text style={styles.notificationCount}>{unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.iconBtn, { backgroundColor: colors.backgroundSecondary }]}
            >
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={colors.error} />
            </TouchableOpacity>
            
            <Avatar
              source={currentWorker.avatar}
              name={name || currentWorker.name} // Also update avatar initial
              size={44}
              status={currentWorker.status}
            />
          </View>
        </View>

        {/* Weekly Progress Card */}
        <Card variant="elevated" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressTitle, { color: colors.text }]}>Weekly Progress</Text>
              <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                {weeklyProgress.completed} of {weeklyProgress.total} tasks done
              </Text>
            </View>
            <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>
                {weeklyProgress.percentage}%
              </Text>
            </View>
          </View>
          <ProgressBar progress={weeklyProgress.percentage} height={10} variant="primary" />
        </Card>

        {/* Stats Overview */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today&apos;s Overview</Text>
        <View style={styles.statsGrid}>
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todayStats.tasksCompleted}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
          </Card>
          
          <Card variant="outlined" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.warningLight }]}>
              <IconSymbol name="clock.fill" size={24} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todayStats.hoursWorked}h</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hours</Text>
          </Card>
        </View>

        {/* --- ACTIVE TASKS SECTION --- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 0 }]}>Current Jobs</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {activeTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
          >
            <Card
              variant="elevated"
              style={StyleSheet.flatten([
                styles.taskCard, 
                { borderColor: colors.primary }
              ])}
            >
              <View style={styles.taskContentRow}>
                
                {/* 1. Big Icon (Left) */}
                <View style={[styles.taskIconContainer, { backgroundColor: colors.primaryLight }]}>
                  <IconSymbol name="figure.walk" size={28} color={colors.primary} />
                </View>

                {/* 2. Info (Middle) */}
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, { color: colors.text }]}>
                    {task.title}
                  </Text>
                  
                  {/* Location with Icon */}
                  <View style={styles.locationRow}>
                    <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
                    <Text style={[styles.taskLocationText, { color: colors.textSecondary }]}>
                      {task.location.name}
                    </Text>
                  </View>
                </View>

                {/* 3. Status (Right) */}
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>ACTIVE</Text>
                </View>

              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Bottom Logout Session */}
        <TouchableOpacity style={styles.footerLogoutBtn} onPress={handleLogout}>
          <IconSymbol name="power" size={18} color={colors.textSecondary} />
          <Text style={[styles.footerLogoutText, { color: colors.textSecondary }]}>Logout Session</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerLeft: {},
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Spacing.sm 
  },
  greeting: { fontSize: FontSizes.md },
  userName: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold },
  
  iconBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: BorderRadius.full, 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  
  progressCard: { 
    marginHorizontal: Spacing.lg, 
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl 
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  progressTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  progressSubtitle: { fontSize: FontSizes.sm },
  progressCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  progressPercent: { fontSize: FontSizes.md, fontWeight: FontWeights.bold },

  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.semibold, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  seeAll: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },

  statsGrid: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.lg },
  statCard: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg 
  },
  statIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: BorderRadius.full, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: Spacing.sm 
  },
  statValue: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold },
  statLabel: { fontSize: FontSizes.sm },

  // --- TASK STYLES ---
  taskCard: { 
    marginHorizontal: Spacing.lg, 
    marginBottom: Spacing.md, 
    padding: 15,
    borderRadius: BorderRadius.lg,
    borderWidth: 2, 
    borderColor: 'transparent', 
  },
  taskContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  taskInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  taskTitle: { 
    fontSize: FontSizes.md, 
    fontWeight: '800', 
    marginBottom: 4 
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskLocationText: { 
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00C853',
    letterSpacing: 0.5,
  },

  footerLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    gap: 8,
  },
  footerLogoutText: { fontWeight: '600', fontSize: 14 },
});