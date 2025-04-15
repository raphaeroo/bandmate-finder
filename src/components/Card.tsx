import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

interface Location {
  city?: string;
  state?: string;
  distance?: number;
}

interface Genre {
  id: string;
  name: string;
}

interface Instrument {
  id: string;
  name: string;
}

interface OpenPosition {
  id: string;
  name: string;
}

interface CardItem {
  id: string;
  name: string;
  profileImage?: string;
  genres?: Genre[];
  location?: Location;
  isAvailable?: boolean;
  instruments?: Instrument[];
  bandName?: string;
  memberCount?: number;
  openPositions?: OpenPosition[];
}

interface CardProps {
  item: CardItem;
  onPress: () => void;
  type?: 'musician' | 'band';
  isSearchResult?: boolean;
}

/**
 * Card component for displaying musician or band profiles
 */
const Card: React.FC<CardProps> = ({ 
  item, 
  onPress, 
  type = 'musician', 
  isSearchResult = false 
}) => {
  const {
    id,
    name,
    profileImage,
    genres = [],
    location = {},
    isAvailable,
    instruments = [], // Only for musicians
    bandName, // Only for musicians
    memberCount, // Only for bands
    openPositions = [], // Only for bands
  } = item;

  // Format distance for display
  const formatDistance = (distance: number): string => {
    if (!distance) return '';
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSearchResult && styles.searchResultCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={
          profileImage
            ? { uri: profileImage }
            : require('../../assets/default-profile.png')
        }
        style={styles.profileImage}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {isAvailable && (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Available</Text>
            </View>
          )}
        </View>

        {/* Display instruments for musicians or open positions for bands */}
        {type === 'musician' && instruments && instruments.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="musical-notes-outline" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.detailText} numberOfLines={1}>
              {instruments.map(instrument => instrument.name).join(', ')}
            </Text>
          </View>
        )}

        {type === 'band' && openPositions && openPositions.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="search-outline" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.detailText} numberOfLines={1}>
              Looking for: {openPositions.map(pos => pos.name).join(', ')}
            </Text>
          </View>
        )}

        {/* Display band affiliation for musicians */}
        {type === 'musician' && bandName && (
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.detailText} numberOfLines={1}>
              {bandName}
            </Text>
          </View>
        )}

        {/* Display member count for bands */}
        {type === 'band' && memberCount && (
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.detailText}>
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </Text>
          </View>
        )}

        {/* Display genres */}
        {genres && genres.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="musical-note-outline" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.detailText} numberOfLines={1}>
              {genres.map(genre => genre.name).join(', ')}
            </Text>
          </View>
        )}

        {/* Display location and distance if available */}
        {location && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.detailText} numberOfLines={1}>
              {location.city || ''}{location.state ? `, ${location.state}` : ''}
              {location.distance ? ` • ${formatDistance(location.distance)}` : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MEDIUM,
    marginVertical: SPACING.SMALL,
    marginHorizontal: SPACING.SMALL,
    ...SHADOWS.MEDIUM,
  },
  searchResultCard: {
    width: '95%',
    alignSelf: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginRight: SPACING.MEDIUM,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  name: {
    fontSize: FONT_SIZE.LARGE,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
    flex: 1,
  },
  availableBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SMALL,
    marginLeft: SPACING.TINY,
  },
  availableText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.TINY,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.TINY,
  },
  detailText: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.DARK_TEXT,
    marginLeft: SPACING.TINY,
    flex: 1,
  },
});

export default Card;