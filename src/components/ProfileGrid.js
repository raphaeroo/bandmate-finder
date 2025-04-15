import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - (SPACING.MEDIUM * 2) - (SPACING.TINY * (COLUMN_COUNT - 1))) / COLUMN_COUNT;

/**
 * ProfileGrid component for displaying a grid of posts (images, videos)
 * 
 * @param {array} posts - Array of post objects
 * @param {function} onPressPost - Function to call when a post is pressed
 * @param {function} onPressAdd - Function to call when the add button is pressed
 * @param {boolean} isOwner - Whether the current user owns this profile
 * @param {boolean} loading - Whether posts are loading
 * @param {boolean} refresh - Whether to show pull-to-refresh
 * @param {function} onRefresh - Function to call when grid is pulled to refresh
 */
const ProfileGrid = ({
  posts = [],
  onPressPost,
  onPressAdd,
  isOwner = false,
  loading = false,
  refresh = false,
  onRefresh,
}) => {
  // Render a post grid item
  const renderItem = ({ item, index }) => {
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
        {item.type === 'image' && item.imageCount > 1 && (
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
    paddingVertical: SPACING.EXTRA_LARGE * 2,
  },
  emptyText: {
    color: COLORS.GRAY,
    marginTop: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
    textAlign: 'center',
  },
  addPostButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.LARGE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginTop: SPACING.MEDIUM,
  },
  addPostButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
});

export default ProfileGrid;
