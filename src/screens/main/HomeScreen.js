import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { USER_TYPES } from '../../utils/constants';

// Mock data for demonstration purposes
const mockBands = [
  {
    id: '1',
    name: 'Rock Legends',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'rock', name: 'Rock' }, { id: 'blues', name: 'Blues' }],
    location: { city: 'New York', state: 'NY', distance: 2.5 },
    isAvailable: true,
    memberCount: 4,
    openPositions: [{ id: 'guitar', name: 'Guitarist' }],
  },
  {
    id: '2',
    name: 'Jazz Ensemble',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'jazz', name: 'Jazz' }, { id: 'blues', name: 'Blues' }],
    location: { city: 'Chicago', state: 'IL', distance: 1.7 },
    isAvailable: true,
    memberCount: 6,
    openPositions: [{ id: 'saxophone', name: 'Saxophone' }, { id: 'drums', name: 'Drummer' }],
  },
  {
    id: '3',
    name: 'Indie Vibes',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'indie', name: 'Indie' }, { id: 'alternative', name: 'Alternative' }],
    location: { city: 'Austin', state: 'TX', distance: 3.2 },
    isAvailable: false,
    memberCount: 3,
    openPositions: [],
  },
];

const mockMusicians = [
  {
    id: '1',
    name: 'John Doe',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'rock', name: 'Rock' }, { id: 'blues', name: 'Blues' }],
    location: { city: 'Los Angeles', state: 'CA', distance: 1.8 },
    isAvailable: true,
    instruments: [{ id: 'guitar', name: 'Guitar' }],
    bandName: 'The Rockers',
  },
  {
    id: '2',
    name: 'Jane Smith',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'jazz', name: 'Jazz' }, { id: 'soul', name: 'Soul' }],
    location: { city: 'Seattle', state: 'WA', distance: 4.5 },
    isAvailable: true,
    instruments: [{ id: 'saxophone', name: 'Saxophone' }],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'pop', name: 'Pop' }, { id: 'rnb', name: 'R&B' }],
    location: { city: 'Miami', state: 'FL', distance: 2.1 },
    isAvailable: false,
    instruments: [{ id: 'vocals', name: 'Vocals' }, { id: 'keyboard', name: 'Keyboard' }],
    bandName: 'Soul Collective',
  },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState(
    user?.type === USER_TYPES.MUSICIAN ? 'bands' : 'musicians'
  );

  useEffect(() => {
    loadData();
  }, [viewMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        if (viewMode === 'bands') {
          setData(mockBands);
        } else {
          setData(mockMusicians);
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCardPress = (item) => {
    if (viewMode === 'bands') {
      navigation.navigate('BandProfile', { bandId: item.id });
    } else {
      navigation.navigate('MusicianProfile', { musicianId: item.id });
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'bands' ? 'musicians' : 'bands');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>BandMate</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.PRIMARY} />
          {/* Notification badge would go here */}
        </TouchableOpacity>
      </View>
      <Text style={styles.headerSubtitle}>
        Find your perfect musical match!
      </Text>
      
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            viewMode === 'bands' && styles.activeViewToggleButton,
          ]}
          onPress={() => setViewMode('bands')}
        >
          <Text
            style={[
              styles.viewToggleText,
              viewMode === 'bands' && styles.activeViewToggleText,
            ]}
          >
            Bands
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            viewMode === 'musicians' && styles.activeViewToggleButton,
          ]}
          onPress={() => setViewMode('musicians')}
        >
          <Text
            style={[
              styles.viewToggleText,
              viewMode === 'musicians' && styles.activeViewToggleText,
            ]}
          >
            Musicians
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      ) : (
        <>
          <Ionicons name="search" size={50} color={COLORS.LIGHT_GRAY} />
          <Text style={styles.emptyText}>
            No {viewMode} found in your area.
          </Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search criteria.
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card
              item={item}
              onPress={() => handleCardPress(item)}
              type={viewMode === 'bands' ? 'band' : 'musician'}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
          ListEmptyComponent={renderEmptyState()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.HUGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  notificationButton: {
    padding: SPACING.SMALL,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.GRAY,
    marginTop: SPACING.TINY,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    marginTop: SPACING.MEDIUM,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 25,
    padding: 4,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: SPACING.SMALL,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeViewToggleButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  viewToggleText: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: '500',
    color: COLORS.DARK_TEXT,
  },
  activeViewToggleText: {
    color: COLORS.WHITE,
  },
  listContainer: {
    paddingVertical: SPACING.SMALL,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
    marginTop: SPACING.EXTRA_LARGE,
  },
  emptyText: {
    marginTop: SPACING.MEDIUM,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: SPACING.SMALL,
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default HomeScreen;
