import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../../styles/theme";
import Header from "../../components/Header";
import ProfileGrid from "../../components/ProfileGrid";
import Button from "../../components/Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import { USER_TYPES } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/MainNavigator";

type MusicianProfileScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "MusicianProfile"
>;

interface Location {
  city: string;
  state: string;
}

interface Genre {
  id: string;
  name: string;
}

interface Instrument {
  id: string;
  name: string;
}

interface Band {
  id: string;
  name: string;
  role: string;
}

interface Post {
  id: string;
  imageUrl: string;
  type: "image" | "video";
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  imageCount?: number;
}

interface MusicianProfile {
  id: string;
  name: string;
  type: typeof USER_TYPES.MUSICIAN;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: Location;
  genres: Genre[];
  instruments: Instrument[];
  bands: Band[];
  experienceLevel: string;
  isAvailable: boolean;
  followers: number;
  following: number;
}

// Mock data for musician profile
const mockMusicianProfile: MusicianProfile = {
  id: "101",
  name: "Jane Smith",
  type: USER_TYPES.MUSICIAN,
  profileImage: "https://placehold.co/150",
  coverImage: "https://placehold.co/600x200",
  bio: "Professional saxophonist with over 10 years of experience. Jazz enthusiast with a background in classical music. Available for studio sessions and live performances.",
  location: { city: "Seattle", state: "WA" },
  genres: [
    { id: "jazz", name: "Jazz" },
    { id: "classical", name: "Classical" },
    { id: "soul", name: "Soul" },
  ],
  instruments: [
    { id: "saxophone", name: "Saxophone" },
    { id: "clarinet", name: "Clarinet" },
  ],
  bands: [{ id: "201", name: "Seattle Jazz Collective", role: "Saxophonist" }],
  experienceLevel: "Professional",
  isAvailable: true,
  followers: 215,
  following: 98,
};

// Mock posts data
const mockPosts: Post[] = [
  {
    id: "1",
    imageUrl: "https://placehold.co/300",
    type: "image",
    caption: "Rehearsal day",
    likes: 42,
    comments: 7,
    createdAt: "2023-06-15T14:30:00Z",
  },
  {
    id: "2",
    imageUrl: "https://placehold.co/300",
    type: "video",
    caption: "Live jazz performance",
    likes: 78,
    comments: 12,
    createdAt: "2023-06-10T20:15:00Z",
  },
  {
    id: "3",
    imageUrl: "https://placehold.co/300",
    type: "image",
    imageCount: 3,
    caption: "New sax arrived!",
    likes: 63,
    comments: 9,
    createdAt: "2023-06-05T12:00:00Z",
  },
  {
    id: "4",
    imageUrl: "https://placehold.co/300",
    type: "image",
    caption: "Studio session",
    likes: 51,
    comments: 5,
    createdAt: "2023-05-30T16:45:00Z",
  },
];

const MusicianProfileScreen: React.FC<MusicianProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const { musicianId } = route.params;
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<MusicianProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
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
      console.error("Error loading profile data:", error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const handleFollow = () => {
    if (!profileData) return;

    // In a real app, this would be an API call
    setFollowing(!following);

    // Show feedback
    Alert.alert(
      following ? "Unfollowed" : "Followed",
      following
        ? `You no longer follow ${profileData.name}`
        : `You are now following ${profileData.name}`
    );
  };

  const handleMessage = () => {
    if (!profileData) return;

    setChatLoading(true);

    // In a real app, this would check if a chat exists or create one
    setTimeout(() => {
      setChatLoading(false);
      navigation.navigate("ChatFromHome", {
        chatId: `chat_${musicianId}`,
        user: {
          id: musicianId,
          name: profileData.name,
          type: USER_TYPES.MUSICIAN,
          profileImage: profileData.profileImage,
        },
      });
    }, 1000);
  };

  const handleBandPress = (band: Band) => {
    navigation.navigate("BandProfile", { bandId: band.id });
  };

  const handlePostPress = (post: Post) => {
    // In a real app, navigate to post detail screen
    console.log("Post pressed:", post);
  };

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      {item.imageCount && item.imageCount > 1 && (
        <View style={styles.imageCountBadge}>
          <Text style={styles.imageCountText}>+{item.imageCount - 1}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderProfileHeader = () => {
    if (!profileData) return null;

    return (
      <View style={styles.profileHeaderContainer}>
        {/* Cover Image */}
        <Image
          source={{ uri: profileData.coverImage }}
          style={styles.coverImage}
          contentFit="cover"
        />

        {/* Profile Info */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileInfoHeader}>
            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: profileData.profileImage }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfoHeaderContent}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{profileData.name}</Text>
                {profileData.isAvailable && (
                  <View style={styles.availabilityBadge}>
                    <Text style={styles.availabilityText}>Available</Text>
                  </View>
                )}
              </View>

              <Text style={styles.location}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.GRAY}
                />{" "}
                {profileData.location.city}, {profileData.location.state}
              </Text>

              {/* Experience Level */}
              <Text style={styles.experienceLevel}>
                <Ionicons name="star-outline" size={16} color={COLORS.GRAY} />{" "}
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
            </View>
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
          <Text style={styles.bio}>{profileData.bio}</Text>

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
          </View>

          {/* Action Buttons */}
          {user?.id !== musicianId && (
            <View style={styles.actionButtons}>
              <Button
                title={following ? "Following" : "Follow"}
                onPress={handleFollow}
                style={{
                  ...styles.actionButton,
                  ...(following ? { backgroundColor: COLORS.LIGHT_GRAY } : {}),
                }}
              />
              <Button
                title="Message"
                onPress={handleMessage}
                loading={chatLoading}
                style={styles.actionButton}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPosts = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      );
    }

    return <ProfileGrid posts={posts} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Musician Profile"
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={posts}
        renderItem={renderItem}
        numColumns={3}
        ListHeaderComponent={renderProfileHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.LARGE,
  },
  columnWrapper: {
    padding: SPACING.TINY,
  },
  profileInfoHeaderContent: {
    paddingTop: SPACING.MEDIUM,
  },
  profileInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  profileHeaderContainer: {
    position: "relative",
    marginBottom: SPACING.MEDIUM,
  },
  coverImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  profileImageContainer: {
    borderRadius: BORDER_RADIUS.LARGE,
    ...SHADOWS.MEDIUM,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.LARGE,
    borderWidth: 3,
    borderColor: COLORS.WHITE,
  },
  profileInfoContainer: {
    padding: SPACING.MEDIUM,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.TINY,
  },
  name: {
    fontSize: FONT_SIZE.LARGE,
    fontWeight: "bold",
    color: COLORS.DARK_TEXT,
    marginRight: SPACING.SMALL,
  },
  availabilityBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  availabilityText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.TINY,
    fontWeight: "bold",
  },
  location: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
    marginBottom: SPACING.SMALL,
  },
  experienceLevel: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
    marginBottom: SPACING.SMALL,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SPACING.MEDIUM,
  },
  tagChip: {
    backgroundColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY,
    borderRadius: BORDER_RADIUS.SMALL,
    marginRight: SPACING.TINY,
    marginBottom: SPACING.TINY,
  },
  tagText: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.DARK_TEXT,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.MEDIUM,
    fontWeight: "bold",
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.SMALL,
  },
  instrumentsContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  bandsContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  bandsList: {
  },
  bandItem: {
    marginBottom: SPACING.SMALL,
  },
  bandName: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.TINY,
  },
  bandRole: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  bio: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.MEDIUM,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: SPACING.MEDIUM,
  },
  statItem: {
    marginRight: SPACING.LARGE,
  },
  statValue: {
    fontSize: FONT_SIZE.MEDIUM,
    fontWeight: "bold",
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.TINY,
  },
  statLabel: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.TINY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.LARGE,
  },
  postItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
  },
  postImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: BORDER_RADIUS.SMALL,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCountText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SMALL,
    fontWeight: "bold",
  },
});

export default MusicianProfileScreen;
