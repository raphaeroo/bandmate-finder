import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import Header from "../../components/Header";
import ProfileGrid from "../../components/ProfileGrid";
import Button from "../../components/Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import { USER_TYPES } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/MainNavigator";

type BandProfileScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "BandProfile"
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
  profileImage: string;
}

interface Post {
  id: string | number;
  imageUrl: string;
  type: "image" | "video";
  imageCount?: number;
}

interface BandProfile {
  id: string;
  name: string;
  type: typeof USER_TYPES.BAND;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: Location;
  genres: Genre[];
  members: BandMember[];
  openPositions: Instrument[];
  isAvailable: boolean;
  followers: number;
  following: number;
}

// Mock data for band profile
const mockBandProfile: BandProfile = {
  id: "201",
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
    {
      id: "1",
      name: "Jane Smith",
      role: "Vocals",
      instrument: "Vocals",
      profileImage: "https://placehold.co/50",
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Drummer",
      instrument: "Drums",
      profileImage: "https://placehold.co/50",
    },
    {
      id: "3",
      name: "Sarah Lee",
      role: "Bassist",
      instrument: "Bass",
      profileImage: "https://placehold.co/50",
    },
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
    imageCount: 3,
  },
  {
    id: "2",
    imageUrl: "https://placehold.co/300",
    type: "video",
  },
  {
    id: "3",
    imageUrl: "https://placehold.co/300",
    type: "image",
    imageCount: 3,
  },
];

const BandProfileScreen: React.FC<BandProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const { bandId } = route.params;
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<BandProfile | null>(null);
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
        setProfileData(mockBandProfile);
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
  };

  const handleMessage = () => {
    if (!profileData) return;

    setChatLoading(true);

    // In a real app, this would check if a chat exists or create one
    setTimeout(() => {
      setChatLoading(false);
      navigation.navigate("ChatFromHome", {
        chatId: `chat_${bandId}`,
        user: {
          id: bandId,
          name: profileData.name,
          type: USER_TYPES.BAND,
          profileImage: profileData.profileImage,
        },
      });
    }, 1000);
  };

  const handleMemberPress = (member: BandMember) => {
    navigation.navigate("MusicianProfile", { musicianId: member.id });
  };

  const handlePostPress = (post: Post) => {
    // In a real app, navigate to post detail screen
    console.log("Post pressed:", post);
  };

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

          {/* Members */}
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
                    source={{ uri: member.profileImage }}
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

          {/* Open Positions */}
          {profileData.openPositions.length > 0 && (
            <View style={styles.positionsContainer}>
              <Text style={styles.sectionTitle}>Open Positions:</Text>
              <View style={styles.tagsContainer}>
                {profileData.openPositions.map((position) => (
                  <View key={position.id} style={styles.tagChip}>
                    <Text style={styles.tagText}>{position.name}</Text>
                  </View>
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
          {user?.id !== bandId && (
            <View style={styles.actionButtons}>
              <Button
                title={following ? "Following" : "Follow"}
                onPress={handleFollow}
                type={following ? "outline" : "primary"}
                style={styles.actionButton}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Band Profile" onBackPress={() => navigation.goBack()} />
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
  profileInfoHeaderContent: {
    paddingTop: SPACING.MEDIUM,
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
  positionsContainer: {
    marginBottom: SPACING.MEDIUM,
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

export default BandProfileScreen;
