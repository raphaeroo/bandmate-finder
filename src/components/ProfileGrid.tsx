import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
  ListRenderItem,
  RefreshControlProps,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - (SPACING.MEDIUM * 2) - (SPACING.TINY * (COLUMN_COUNT - 1))) / COLUMN_COUNT;

interface Post {
  id: string | number;
  imageUrl: string;
  type: 'image' | 'video';
  imageCount?: number;
}

interface ProfileGridProps {
  posts?: Post[];
  onPressPost?: (post: Post) => void;
  onPressAdd?: () => void;
  isOwner?: boolean;
  loading?: boolean;
  refresh?: boolean;
  onRefresh?: () => void;
}

/**
 * ProfileGrid component for displaying a grid of posts (images, videos)
 */
const ProfileGrid: React.FC<ProfileGridProps> = ({
  posts = [],
  onPressPost,
  onPressAdd,
  isOwner = false,
  loading = false,
  refresh = false,
  onRefresh,
}) => {
  // Render a post grid item
  const renderItem: ListRenderItem<Post> = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => onPressPost && onPressPost(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Show video indicator if it's a video post */}
        {item.type === 'video' && (
          <View style={styles.videoIndicator}>
            <Ionicons name="play" size={20} color={COLORS.WHITE} />
          </View>
        )}
        
        {/* Show multi-image indicator if post has multiple images */}
        {item.type === 'image' && item.imageCount && item.imageCount > 1 && (
          <View style={styles.multiImageIndicator}>
            <Ionicons name="images-outline" size={18} color={COLORS.WHITE} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render "Add New" button for profile owners
  const renderAddButton = () => {
    if (!isOwner) return null;
    
    return (
      <TouchableOpacity
        style={[styles.gridItem, styles.addButton]}
        onPress={onPressAdd}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={40} color={COLORS.PRIMARY} />
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="images-outline"
          size={50}
          color={COLORS.LIGHT_GRAY}
        />
        <Text style={styles.emptyText}>
          {isOwner
            ? 'Add your first post to showcase your skills!'
            : 'No posts to display yet.'}
        </Text>
        {isOwner && (
          <TouchableOpacity
            style={styles.addPostButton}
            onPress={onPressAdd}
            activeOpacity={0.7}
          >
            <Text style={styles.addPostButtonText}>Add Post</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const headerComponent = () => {
    return isOwner ? renderAddButton() : null;
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={COLUMN_COUNT}
      contentContainerStyle={styles.gridContainer}
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={renderEmptyState}
      onRefresh={onRefresh}
      refreshing={refresh}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingTop: SPACING.MEDIUM,
    paddingBottom: SPACING.EXTRA_LARGE,
    flexGrow: 1,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginBottom: SPACING.TINY,
    marginRight: SPACING.TINY,
    borderRadius: BORDER_RADIUS.SMALL,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    right: SPACING.TINY,
    top: SPACING.TINY,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.ROUND,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiImageIndicator: {
    position: 'absolute',
    right: SPACING.TINY,
    top: SPACING.TINY,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.ROUND,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.GRAY,
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
    textAlign: 'center',
    color: COLORS.GRAY,
  },
  addPostButton: {
    marginTop: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.LARGE,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  addPostButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
});

export default ProfileGrid; 