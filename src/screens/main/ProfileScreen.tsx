import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import ProfileGrid from "../../components/ProfileGrid";
import Ionicons from "react-native-vector-icons/Ionicons";
import { USER_TYPES } from "../../utils/constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/MainNavigator";

type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  "ProfileScreen"
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

interface BandMember {
  id: string;
  name: string;
  role: string;
  instrument: string;
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

interface BaseUser {
  id: string;
  name: string;
  type: (typeof USER_TYPES)[keyof typeof USER_TYPES];
  profileImage: string;
  coverImage: string;
  bio: string;
  location: Location;
  genres: Genre[];
  isAvailable: boolean;
  followers: number;
  following: number;
}

interface MusicianUser extends BaseUser {
  type: typeof USER_TYPES.MUSICIAN;
  instruments: Instrument[];
  bands: Band[];
}

interface BandUser extends BaseUser {
  type: typeof USER_TYPES.BAND;
  members: BandMember[];
  openPositions: Instrument[];
}

type UserProfile = MusicianUser | BandUser;

// Mock data for user profile
const mockUserMusician: MusicianUser = {
  id: "1",
  name: "John Doe",
  type: USER_TYPES.MUSICIAN,
  profileImage: "https://placehold.co/150",
  coverImage: "https://placehold.co/600x200",
  bio: "Guitarist with 5+ years of experience. Passionate about rock, blues, and jazz. Looking to join a band for regular gigs.",
  location: { city: "New York", state: "NY" },
  genres: [
    { id: "rock", name: "Rock" },
    { id: "blues", name: "Blues" },
    { id: "jazz", name: "Jazz" },
  ],
  instruments: [
    { id: "guitar", name: "Guitar" },
    { id: "bass", name: "Bass" },
  ],
  bands: [{ id: "1", name: "The Rockers", role: "Lead Guitarist" }],
  isAvailable: true,
  followers: 124,
  following: 87,
};

const mockUserBand: BandUser = {
  id: "2",
  name: "Rock Legends",
  type: USER_TYPES.BAND,
  profileImage: "https://placehold.co/150",
  coverImage: "https://placehold.co/600x200",
  bio: "High-energy rock band looking for a lead guitarist. We play regular gigs in the New York area and are working on our first album.",
  location: { city: "New York", state: "NY" },
  genres: [
    { id: "rock", name: "Rock" },
    { id: "alternative", name: "Alternative" },
  ],
  members: [
    { id: "1", name: "Jane Smith", role: "Vocals", instrument: "Vocals" },
    { id: "2", name: "Mike Johnson", role: "Drummer", instrument: "Drums" },
    { id: "3", name: "Sarah Lee", role: "Bassist", instrument: "Bass" },
  ],
  openPositions: [{ id: "guitar", name: "Lead Guitarist" }],
  isAvailable: true,
  followers: 256,
  following: 42,
};

// Mock posts data
const mockPosts: Post[] = [
  {
    id: "1",
    imageUrl: "https://placehold.co/300",
    type: "image",
    caption: "Rehearsal session",
    likes: 45,
    comments: 12,
    createdAt: "2023-06-15T14:30:00Z",
  },
  {
    id: "2",
    imageUrl: "https://placehold.co/300",
    type: "video",
    caption: "Live at The Venue",
    likes: 78,
    comments: 24,
    createdAt: "2023-06-10T20:15:00Z",
  },
  {
    id: "3",
    imageUrl: "https://placehold.co/300",
    type: "image",
    imageCount: 3,
    caption: "New gear day!",
    likes: 56,
    comments: 8,
    createdAt: "2023-06-05T12:00:00Z",
  },
  {
    id: "4",
    imageUrl: "https://placehold.co/300",
    type: "image",
    caption: "Studio session",
    likes: 34,
    comments: 5,
    createdAt: "2023-05-30T16:45:00Z",
  },
  {
    id: "5",
    imageUrl: "https://placehold.co/300",
    type: "video",
    caption: "Backstage moments",
    likes: 67,
    comments: 15,
    createdAt: "2023-05-25T19:20:00Z",
  },
  {
    id: "6",
    imageUrl: "https://placehold.co/300",
    type: "image",
    caption: "Jam session with friends",
    likes: 42,
    comments: 7,
    createdAt: "2023-05-20T15:10:00Z",
  },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
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
        const mockData =
          user?.type === USER_TYPES.MUSICIAN ? mockUserMusician : mockUserBand;
        setProfileData(mockData);
        setPosts(mockPosts);
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

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  const handlePostPress = (post: Post) => {
    // In a real app, navigate to post detail screen
    console.log("Post pressed:", post);
  };

  const handleAddPost = () => {
    // TODO: Implement CreatePost navigation when screen is added to navigator
    console.log("Add post pressed");
  };

  const handleMemberPress = (member: BandMember) => {
    // TODO: Implement MusicianProfile navigation when screen is added to navigator
    console.log("Member pressed:", member);
  };

  const handleBandPress = (band: Band) => {
    // TODO: Implement BandProfile navigation when screen is added to navigator
    console.log("Band pressed:", band);
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
                    <Image
                      source={{ uri: "https://placehold.co/50" }}
                      style={styles.memberImage}
                    />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
        title="Profile"
        rightIcon="settings-outline"
        onRightPress={handleSettings}
      />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
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
        )}
        keyExtractor={(item) => item.id}
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
  profileHeaderContainer: {
    position: "relative",
    marginBottom: SPACING.MEDIUM,
  },
  coverImage: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.LIGHT_GRAY,
    resizeMode: "cover",
  },
  profileInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SMALL,
    marginBottom: SPACING.MEDIUM,
  },
  profileInfoHeaderContent: {
    paddingTop: SPACING.MEDIUM,
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
  instrumentsContainer: {},
  membersContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  membersList: {
    marginTop: SPACING.SMALL,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SMALL,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginRight: SPACING.SMALL,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.TINY,
  },
  memberRole: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: BORDER_RADIUS.SMALL,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCountText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SMALL,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
