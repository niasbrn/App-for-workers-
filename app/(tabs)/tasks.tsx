import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { tasks } from '@/data/mockData';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';

type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed';

export default function TasksScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const filters: { label: string; value: FilterStatus }[] = [
    //{ label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'verified':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffHours < 0) return 'Overdue';
    if (diffHours < 24) return `${diffHours}h left`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d left`;
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  return (
    <View style={[styles.container, { paddingTop: 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {stats.inProgress} in progress, {stats.pending} pending
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search tasks or locations..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterTab,
              {
                backgroundColor:
                  activeFilter === filter.value ? colors.primary : colors.backgroundSecondary,
              },
            ]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: activeFilter === filter.value ? '#ec77b7ff' : colors.textSecondary,
                },
              ]}
            >
              {filter.label}
            </Text>
            {filter.value !== 'all' && (
              <View
                style={[
                  styles.filterCount,
                  {
                    backgroundColor:
                      activeFilter === filter.value ? 'rgba(255,255,255,0.2)' : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    {
                      color: activeFilter === filter.value ? '#f90d0dff' : colors.textMuted,
                    },
                  ]}
                >
                  {filter.value === 'pending'
                    ? stats.pending
                    : filter.value === 'in_progress'
                    ? stats.inProgress
                    : stats.completed}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.taskList}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              variant="elevated"
              style={styles.taskCard}
              onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
            >
              <View style={styles.taskHeader}>
                <View style={styles.badges}>
                  <Badge
                    label={task.priority}
                    variant={getPriorityColor(task.priority) as any}
                    size="sm"
                  />
                  <Badge
                    label={task.status.replace('_', ' ')}
                    variant={getStatusColor(task.status) as any}
                    size="sm"
                  />
                </View>
                <Text
                  style={[
                    styles.dueDate,
                    {
                      color:
                        formatDueDate(task.dueDate) === 'Overdue'
                          ? colors.error
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {formatDueDate(task.dueDate)}
                </Text>
              </View>

              <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
              <Text style={[styles.taskDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {task.description}
              </Text>

              <View style={styles.taskMeta}>
                <View style={styles.metaItem}>
                  <IconSymbol name="location.fill" size={16} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {task.location.name}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <IconSymbol name="clock.fill" size={16} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {task.actualHours || 0}/{task.estimatedHours}h
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <IconSymbol name="camera.fill" size={16} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {task.photos.length}
                  </Text>
                </View>
              </View>

              {task.status !== 'pending' && (
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: colors.textMuted }]}>Progress</Text>
                    <Text style={[styles.progressValue, { color: colors.text }]}>{task.progress}%</Text>
                  </View>
                  <ProgressBar
                    progress={task.progress}
                    height={6}
                    variant={task.progress === 100 ? 'success' : 'primary'}
                  />
                </View>
              )}

              <View style={styles.taskFooter}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]}
                  onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
                >
                  <IconSymbol name="arrow.right" size={18} color={colors.primary} />
                  <Text style={[styles.actionButtonText, { color: colors.primary }]}>View Details</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="checklist" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No tasks found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {searchQuery ? 'Try a different search term' : 'No tasks match this filter'}
            </Text>
          </View>
        )}
        <View style={{ height: Spacing.xxl * 2 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginTop: Spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    padding: 0,
  },
  filterContainer: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  filterCount: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  filterCountText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  taskList: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  taskCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  dueDate: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  taskTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  taskDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSizes.sm,
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: FontSizes.sm,
  },
  progressValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    marginTop: Spacing.xs,
  },
});

