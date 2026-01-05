import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { locations, tasks } from '@/data/mockData';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const getTasksForLocation = (locationId: string) => {
    return tasks.filter((t) => t.location.id === locationId);
  };

  const getLocationStatus = (locationId: string) => {
    const locationTasks = getTasksForLocation(locationId);
    if (locationTasks.some((t) => t.status === 'in_progress')) return 'active';
    if (locationTasks.some((t) => t.status === 'pending')) return 'pending';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.primary;
      case 'pending': return colors.warning;
      case 'completed': return colors.success;
      default: return colors.textMuted;
    }
  };

  const handleGetDirections = () => {
    const location = locations.find((l) => l.id === selectedLocation);
    if (!location) return;
    const query = encodeURIComponent(location.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  const selectedLocationData = locations.find((l) => l.id === selectedLocation);
  const selectedLocationTasks = selectedLocation ? getTasksForLocation(selectedLocation) : [];

  const baseLat = 3.1412; 
  const baseLong = 101.6865;

  return (
    <View style={styles.container}>
      
      {/* Header */}
      {/* FIX: Added 'as any' to fix TypeScript style mismatch error */}
      <View style={[styles.header, { backgroundColor: colors.background } as any]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Work Locations</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {locations.length} locations • {tasks.filter((t) => t.status === 'in_progress').length} active
          </Text>
        </View>
        
        {/* View Toggle Buttons */}
        <View style={[styles.viewToggle, { backgroundColor: colors.backgroundSecondary } as any]}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' ? { backgroundColor: colors.card } : null] as any}
            onPress={() => setViewMode('map')}
          >
            <IconSymbol name="map.fill" size={18} color={viewMode === 'map' ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' ? { backgroundColor: colors.card } : null] as any}
            onPress={() => setViewMode('list')}
          >
            <IconSymbol name="list.bullet" size={18} color={viewMode === 'list' ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: baseLat,
              longitude: baseLong,
              latitudeDelta: 0.09,
              longitudeDelta: 0.04,
            }}
            zoomEnabled={true}
            scrollEnabled={true} 
            rotateEnabled={false}
            onPress={() => setSelectedLocation(null)}
          >
            {locations.map((location, index) => {
              const status = getLocationStatus(location.id);
              const isSelected = selectedLocation === location.id;
              
              // Fake coordinates spread out for demo
              const lat = baseLat + (index % 2 === 0 ? 0.02 : -0.02) * (index + 1) * 0.5;
              const lng = baseLong + (index % 3 === 0 ? 0.02 : -0.02) * (index + 1) * 0.5;

              return (
                <Marker
                  key={location.id}
                  coordinate={{ latitude: lat, longitude: lng }}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(location.id);
                  }}
                >
                  <View style={[
                    styles.mapPin,
                    {
                      backgroundColor: isSelected ? colors.primary : getStatusColor(status),
                      transform: [{ scale: isSelected ? 1.2 : 1 }],
                      zIndex: isSelected ? 99 : 1,
                    } as any
                  ]}>
                    <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
                    {isSelected && <View style={[styles.pinPulse, { borderColor: colors.primary }]} />}
                  </View>
                </Marker>
              );
            })}
          </MapView>

          {/* Map Controls */}
          <View style={styles.mapControls}>
             <TouchableOpacity style={[styles.mapControlBtn, { backgroundColor: colors.card } as any]}>
                <IconSymbol name="plus" size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mapControlBtn, { backgroundColor: colors.card } as any]}>
                <Text style={[styles.minusText, { color: colors.text }]}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mapControlBtn, { backgroundColor: colors.primary } as any]}>
                <IconSymbol name="location.fill" size={18} color="#FFFFFF" />
              </TouchableOpacity>
          </View>

          {/* Details Card */}
          {selectedLocationData && (
            <View style={styles.absoluteDetailsContainer}>
              <Card variant="elevated" style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <View style={[styles.locationIcon, { backgroundColor: colors.primaryLight } as any]}>
                    <IconSymbol name="pin.fill" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.locationInfo}>
                    <Text style={[styles.locationName, { color: colors.text }]}>
                      {selectedLocationData.name}
                    </Text>
                    <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>
                      {selectedLocationData.address}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                    <IconSymbol name="xmark" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.locationTasks}>
                  <Text style={[styles.tasksTitle, { color: colors.text }]}>
                    Tasks at this location ({selectedLocationTasks.length})
                  </Text>
                  {selectedLocationTasks.slice(0, 2).map((task) => (
                    <TouchableOpacity
                      key={task.id}
                      style={[styles.taskItem, { backgroundColor: colors.backgroundSecondary } as any]}
                      onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
                    >
                      <View style={styles.taskItemContent}>
                        <Text style={[styles.taskItemTitle, { color: colors.text }]}>{task.title}</Text>
                        <Badge
                          label={task.status.replace('_', ' ')}
                          variant={task.status === 'completed' ? 'success' : 'primary'}
                          size="sm"
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Button
                  title="Get Directions"
                  onPress={handleGetDirections}
                  variant="primary"
                  fullWidth
                  icon={<IconSymbol name="arrow.right" size={18} color="#FFFFFF" />}
                  iconPosition="right"
                />
              </Card>
            </View>
          )}

          {/* Quick Location Cards */}
          {!selectedLocation && (
            <View style={styles.absoluteQuickContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickLocationsContent}>
                {locations.map((location) => {
                  const status = getLocationStatus(location.id);
                  const taskCount = getTasksForLocation(location.id).length;
                  return (
                    <TouchableOpacity
                      key={location.id}
                      style={[styles.quickCard, { backgroundColor: colors.card } as any]}
                      onPress={() => setSelectedLocation(location.id)}
                    >
                      <View style={[styles.quickStatus, { backgroundColor: getStatusColor(status) } as any]} />
                      <Text style={[styles.quickName, { color: colors.text }]} numberOfLines={1}>{location.name}</Text>
                      <Text style={[styles.quickTasks, { color: colors.textSecondary }]}>{taskCount} tasks</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

        </View>
      ) : (
        /* List View */
        <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
          {locations.map((location) => {
            // FIX: Removed unused 'locationTasks' variable
            const status = getLocationStatus(location.id);
            return (
              <Card
                key={location.id}
                variant="elevated"
                style={styles.listCard}
                onPress={() => setSelectedLocation(location.id)}
              >
               <View style={styles.listCardHeader}>
                  <View style={[styles.listIcon, { backgroundColor: `${getStatusColor(status)}20` } as any]}>
                    <IconSymbol name="location.fill" size={24} color={getStatusColor(status)} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={[styles.listName, { color: colors.text }]}>{location.name}</Text>
                    <Text style={[styles.listAddress, { color: colors.textSecondary }]}>{location.address}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
                </View>
              </Card>
            );
          })}
          <View style={{ height: Spacing.xxl * 2 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  title: { fontSize: FontSizes.xxxl, fontWeight: FontWeights.bold },
  subtitle: { fontSize: FontSizes.md, marginTop: Spacing.xs },
  viewToggle: { flexDirection: 'row', padding: 4, borderRadius: BorderRadius.md },
  toggleBtn: { padding: Spacing.sm, borderRadius: BorderRadius.sm },
  
  mapContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  mapPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinPulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    opacity: 0.5,
  },
  
  mapControls: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    gap: Spacing.xs,
    zIndex: 20,
  },
  mapControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  minusText: { fontSize: 24, fontWeight: FontWeights.bold, lineHeight: 24, textAlign: 'center' },

  absoluteDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    zIndex: 100,
  },
  locationCard: {},
  
  absoluteQuickContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
    zIndex: 90,
  },
  quickLocationsContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },

  locationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  locationIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  locationInfo: { flex: 1 },
  locationName: { fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  locationAddress: { fontSize: FontSizes.sm, marginTop: 2 },
  locationTasks: { marginBottom: Spacing.md },
  tasksTitle: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm },
  taskItem: { padding: Spacing.sm, borderRadius: BorderRadius.md, marginBottom: Spacing.xs },
  taskItemContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskItemTitle: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, flex: 1, marginRight: Spacing.sm },
  quickCard: { width: 150, padding: Spacing.md, borderRadius: BorderRadius.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  quickStatus: { width: 8, height: 8, borderRadius: 4, marginBottom: Spacing.sm },
  quickName: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, marginBottom: 2 },
  quickTasks: { fontSize: FontSizes.xs },
  
  listContainer: { flex: 1, paddingTop: Spacing.sm },
  listCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  listCardHeader: { flexDirection: 'row', alignItems: 'center' },
  listIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  listInfo: { flex: 1 },
  listName: { fontSize: FontSizes.lg, fontWeight: FontWeights.semibold },
  listAddress: { fontSize: FontSizes.sm, marginTop: 2 },
});