import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import ProfileGrid from '../../components/ProfileGrid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { USER_TYPES } from '../../utils/constants';

// Mock data for user profile
const mockUserMusician = {
  id: '1',
  name: 'John Doe',
  type: USER_TYPES.MUSICIAN,
  profileImage: 'https://via.placeholder.com/150',
  coverImage: 'https://via.placeholder.com/600x200',
  bio: 'Guitarist with 5+ years of experience. Passionate about rock, blues, and jazz. Looking to join a band for regular gigs.',
  location: { city: 'New York', state: 'NY' },
  genres: [
    { id: 'rock', name: 'Rock' },
    { id: 'blues', name: 'Blues' },
    { id: 'jazz', name: 'Jazz' },
  ],
  instruments: [
    { id: 'guitar', name: 'Guitar' },
    { id: 'bass', name: 'Bass' },
  ],
  bands: [
    { id: '1', name: 'The Rockers', role: 'Lead Guitarist' },
  ],
  isAvailable: true,
  followers: 124,
  following: 87,
};

const mockUserBand = {
  id: '2',
  name: 'Rock Legends',
  type: USER_TYPES.BAND,
  profileImage: 'https://via.placeholder.com/150',
  coverImage: 'https://via.placeholder.com/600x200',
  bio: 'High-energy rock band looking for a lead guitarist. We play regular gigs in the New York area and are working on our first album.',
  location: { city: 'New York', state: 'NY' },
  genres: [
    { id: 'rock', name: 'Rock' },
    { id: 'alternative', name: 'Alternative' },
  ],
  members: [
    { id: '1', name: 'Jane Smith', role: 'Vocals', instrument: 'Vocals' },
    { id: '2', name: 'Mike Johnson', role: 'Drummer', instrument: 'Drums' },
    { id: '3', name: 'Sarah Lee', role: 'Bassist', instrument: 'Bass' },
  ],
  openPositions: [
    { id: 'guitar', name: 'Lead Guitarist' },
  ],
  isAvailable: true,
  followers: 256,
  following: 42,
};

// Mock posts data
const mockPosts = [
  {
    id: '1',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'image',
    caption: 'Rehearsal session',
    likes: 45,
    comments: 12,
    createdAt: '2023-06-15T14:30:00Z',
  },
  {
    id: '2',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'video',
    caption: 'Live at The Venue',
    likes: 78,
    comments: 24,
    createdAt: '2023-06-10T20:15:00Z',
  },
  {
    id: '3',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'image',
    imageCount: 3,
    caption: 'New gear day!',
    likes: 56,
    comments: 8,
    createdAt: '2023-06-05T12:00:00Z',
  },
  {
    id: '4',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'image',
    caption: 'Studio session',
    likes: 34,
    comments: 5,
    createdAt: '2023-05-30T16:45:00Z',
  },
  {
    id: '5',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'video',
    caption: 'Backstage moments',
    likes: 67,
    comments: 15,
    createdAt: '2023-05-25T19:20:00Z',
  },
  {
    id: '6',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'image',
    caption: 'Jam session with friends',
    likes: 42,
    comments: 7,
    createdAt: '2023-05-20T15:10:00Z',
  },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        // Choose profile data based on user type
        const mockData = user?.type === USER_TYPES.MUSICIAN ? mockUserMusician : mockUserBand;
        setProfileData(mockData);
        setPosts(mockPosts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handlePostPress = (post) => {
    // In a real app, navigate to post detail screen
    console.log('Post pressed:', post);
  };

  const handleAddPost = () => {
    navigation.navigate('CreatePost');
  };

  const handleMemberPress = (member) => {
    navigation.navigate('MusicianProfile', { musicianId: member.id });
  };

  const handleBandPress = (band) => {
    navigation.navigate('BandProfile', { bandId: band.id });
  };

  const renderProfileHeader = () => {
    if (!profileData) return null;

    return (
      <View style={styles.profileHeaderContainer}>
        {/* Cover Image */}
        <Image
          source={{ uri: profileData.coverImage }}
          style={styles.coverImage}
        />
        
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profileData.profileImage }}
            style={styles.profileImage}
          />
        </View>
        
        {/* Profile Info */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profileData.name}</Text>
            {profileData.isAvailable && (
              <View style={styles.availabilityBadge}>
                <Text style={styles.availabilityText}>Available</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={16} color={COLORS.GRAY} />
            {' '}
            {profileData.location.city}, {profileData.location.state}
          </Text>
          
          {/* Genres */}
          <View style={styles.tagsContainer}>
            {profileData.genres.map((genre) => (
              <View key={genre.id} style={styles.tagChip}>
                <Text style={styles.tagText}>{genre.name}</Text>
              </View>
            ))}
          </View>
          
          {/* Instruments or Band Members */}
          {profileData.type === USER_TYPES.MUSICIAN ? (
            <View style={styles.instrumentsContainer}>
              <Text style={styles.sectionTitle}>Instruments:</Text>
              <View style={styles.tagsContainer}>
                {profileData.instruments.map((instrument) => (
                  <View key={instrument.id} style={styles.tagChip}>
                    <Text style={styles.tagText}>{instrument.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.membersContainer}>
              <Text style={styles.sectionTitle}>Band Members:</Text>
              <View style={styles.membersList}>
                {profileData.members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberItem}
                    onPress={() => handleMemberPress(member)}
                  >
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {/* Bands (for musicians) or Open Positions (for bands) */}
          {profileData.type === USER_TYPES.MUSICIAN && profileData.bands && profileData.bands.length > 0 ? (
            <View style={styles.bandsContainer}>
              <Text style={styles.sectionTitle}>Bands:</Text>
              <View style={styles.bandsList}>
                {profileData.bands.map((band) => (
                  <TouchableOpacity
                    key={band.id}
                    style={styles.bandItem}
                    onPress={() => handleBandPress(band)}
                  >
                    <Text style={styles.bandName}>{band.name}</Text>
                    <Text style={styles.bandRole}>{band.role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : profileData.type === USER_TYPES.BAND && profileData.openPositions && profileData.openPositions.length > 0 ? (
            <View style={styles.openPositionsContainer}>
              <Text style={styles.sectionTitle}>Looking for:</Text>
              <View style={styles.tagsContainer}>
                {profileData.openPositions.map((position) => (
                  <View key={position.id} style={[styles.tagChip, styles.openPositionChip]}>
                    <Text style={styles.tagText}>{position.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          
          {/* Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.sectionTitle}>Bio:</Text>
            <Text style={styles.bioText}>{profileData.bio}</Text>
          </View>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleSettings}
            >
              <Ionicons name="settings-outline" size={24} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !profileData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Profile" 
        rightIcon="log-out-outline" 
        onRightPress={logout} 
      />
      
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        
        <View style={styles.postsContainer}>
          <Text style={styles.postsTitle}>Posts</Text>
          <ProfileGrid
            posts={posts}
            onPressPost={handlePostPress}
            onPressAdd={handleAddPost}
            isOwner={true}
            refresh={refreshing}
            onRefresh={handleRefresh}
          />
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderContainer: {
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    margin: SPACING.MEDIUM,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 100,
    left: SPACING.MEDIUM,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: COLORS.WHITE,
    ...SHADOWS.MEDIUM,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfoContainer: {
    marginTop: 60,
    padding: SPACING.MEDIUM,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: FONT_SIZE.EXTRA_LARGE,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
    marginRight: SPACING.SMALL,
  },
  availabilityBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  availabilityText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.TINY,
    fontWeight: 'bold',
  },
  location: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.GRAY,
    marginTop: SPACING.TINY,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.SMALL,
  },
  tagChip: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY,
    borderRadius: BORDER_RADIUS.ROUND,
    marginRight: SPACING.SMALL,
    marginBottom: SPACING.SMALL,
  },
  openPositionChip: {
    backgroundColor: COLORS.ACCENT,
  },
  tagText: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.DARK_TEXT,
  },
  instrumentsContainer: {
    marginTop: SPACING.MEDIUM,
  },
  membersContainer: {
    marginTop: SPACING.MEDIUM,
  },
  membersList: {
    marginTop: SPACING.SMALL,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  memberName: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  bandsContainer: {
    marginTop: SPACING.MEDIUM,
  },
  bandsList: {
    marginTop: SPACING.SMALL,
  },
  bandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  bandName: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    fontWeight: '500',
  },
  bandRole: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  openPositionsContainer: {
    marginTop: SPACING.MEDIUM,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.TINY,
  },
  bioContainer: {
    marginTop: SPACING.MEDIUM,
  },
  bioText: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.DARK_TEXT,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.LARGE,
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
    marginTop: SPACING.TINY,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.LARGE,
  },
  editProfileButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
    alignItems: 'center',
    marginRight: SPACING.MEDIUM,
  },
  editProfileButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsContainer: {
    flex: 1,
    marginTop: SPACING.MEDIUM,
  },
  postsTitle: {
    fontSize: FONT_SIZE.LARGE,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
    marginHorizontal: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
  },
});

export default ProfileScreen;
