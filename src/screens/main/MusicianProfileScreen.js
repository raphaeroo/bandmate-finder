import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../../styles/theme';
import Header from '../../components/Header';
import ProfileGrid from '../../components/ProfileGrid';
import Button from '../../components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { USER_TYPES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for musician profile
const mockMusicianProfile = {
  id: '101',
  name: 'Jane Smith',
  type: USER_TYPES.MUSICIAN,
  profileImage: 'https://via.placeholder.com/150',
  coverImage: 'https://via.placeholder.com/600x200',
  bio: 'Professional saxophonist with over 10 years of experience. Jazz enthusiast with a background in classical music. Available for studio sessions and live performances.',
  location: { city: 'Seattle', state: 'WA' },
  genres: [
    { id: 'jazz', name: 'Jazz' },
    { id: 'classical', name: 'Classical' },
    { id: 'soul', name: 'Soul' },
  ],
  instruments: [
    { id: 'saxophone', name: 'Saxophone' },
    { id: 'clarinet', name: 'Clarinet' },
  ],
  bands: [
    { id: '201', name: 'Seattle Jazz Collective', role: 'Saxophonist' },
  ],
  experienceLevel: 'Professional',
  isAvailable: true,
  followers: 215,
  following: 98,
};

// Mock posts data
const mockPosts = [
  {
    id: '1',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'image',
    caption: 'Rehearsal day',
    likes: 42,
    comments: 7,
    createdAt: '2023-06-15T14:30:00Z',
  },
  {
    id: '2',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'video',
    caption: 'Live jazz performance',
    likes: 78,
    comments: 12,
    createdAt: '2023-06-10T20:15:00Z',
  },
  {
    id: '3',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'image',
    imageCount: 3,
    caption: 'New sax arrived!',
    likes: 63,
    comments: 9,
    createdAt: '2023-06-05T12:00:00Z',
  },
  {
    id: '4',
    imageUrl: 'https://via.placeholder.com/300',
    type: 'image',
    caption: 'Studio session',
    likes: 51,
    comments: 5,
    createdAt: '2023-05-30T16:45:00Z',
  },
];

const MusicianProfileScreen = ({ route, navigation }) => {
  const { musicianId } = route.params;
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [following, setFollowing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        setProfileData(mockMusicianProfile);
        setPosts(mockPosts);
        setFollowing(Math.random() > 0.5); // Randomly set following status
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

  const handleFollow = () => {
    // In a real app, this would be an API call
    setFollowing(!following);
    
    // Show feedback
    Alert.alert(
      following ? 'Unfollowed' : 'Followed',
      following 
        ? `You no longer follow ${profileData.name}` 
        : `You are now following ${profileData.name}`
    );
  };

  const handleMessage = () => {
    setChatLoading(true);
    
    // In a real app, this would check if a chat exists or create one
    setTimeout(() => {
      setChatLoading(false);
      navigation.navigate('Chat', { 
        chatId: `chat_${musicianId}`,
        user: {
          id: musicianId,
          name: profileData.name,
          type: USER_TYPES.MUSICIAN,
          profileImage: profileData.profileImage,
          instrument: profileData.instruments[0].name,
        }
      });
    }, 1000);
  };

  const handleBandPress = (band) => {
    navigation.navigate('BandProfile', { bandId: band.id });
  };

  const handlePostPress = (post) => {
    // In a real app, navigate to post detail screen
    console.log('Post pressed:', post);
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
          
          {/* Experience Level */}
          <Text style={styles.experienceLevel}>
            <Ionicons name="star-outline" size={16} color={COLORS.GRAY} />
            {' '}
            {profileData.experienceLevel}
          </Text>
          
          {/* Genres */}
          <View style={styles.tagsContainer}>
            {profileData.genres.map((genre) => (
              <View key={genre.id} style={styles.tagChip}>
                <Text style={styles.tagText}>{genre.name}</Text>
              </View>
            ))}
          </View>
          
          {/* Instruments */}
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
          
          {/* Bands */}
          {profileData.bands && profileData.bands.length > 0 && (
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
          )}
          
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
          
          {/* Action Buttons (if not the current user) */}
          {user?.id !== profileData.id && (
            <View style={styles.actionButtonsContainer}>
              <Button
                title={following ? 'Following' : 'Follow'}
                type={following ? 'outline' : 'primary'}
                onPress={handleFollow}
                style={styles.followButton}
              />
              <Button
                title="Message"
                type="secondary"
                onPress={handleMessage}
                loading={chatLoading}
                style={styles.messageButton}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading && !profileData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Musician Profile" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Musician Profile" onBackPress={() => navigation.goBack()} />
      
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
            isOwner={false}
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
  experienceLevel: {
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
  tagText: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.DARK_TEXT,
  },
  instrumentsContainer: {
    marginTop: SPACING.MEDIUM,
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
  followButton: {
    flex: 1,
    marginRight: SPACING.SMALL,
  },
  messageButton: {
    flex: 1,
    marginLeft: SPACING.SMALL,
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

export default MusicianProfileScreen;
