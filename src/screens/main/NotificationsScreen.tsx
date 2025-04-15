import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../styles/theme';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/MainNavigator';

type NotificationsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Notifications'>;

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'message' | 'band_invite';
  message: string;
  sender: {
    id: string;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  read: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'follow',
    message: 'started following you',
    sender: {
      id: '101',
      name: 'John Doe',
      profileImage: 'https://placehold.co/50',
    },
    createdAt: '2023-06-15T14:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'like',
    message: 'liked your post',
    sender: {
      id: '102',
      name: 'Jane Smith',
      profileImage: 'https://placehold.co/50',
    },
    createdAt: '2023-06-14T10:15:00Z',
    read: true,
  },
  {
    id: '3',
    type: 'band_invite',
    message: 'invited you to join their band',
    sender: {
      id: '103',
      name: 'Rock Legends',
      profileImage: 'https://placehold.co/50',
    },
    createdAt: '2023-06-13T16:45:00Z',
    read: false,
  },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'follow':
      case 'like':
        navigation.navigate('MusicianProfile', { musicianId: notification.sender.id });
        break;
      case 'band_invite':
        navigation.navigate('BandProfile', { bandId: notification.sender.id });
        break;
      default:
        break;
    }
  };

  const renderNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'follow':
        return <Ionicons name="person-add" size={24} color={COLORS.PRIMARY} />;
      case 'like':
        return <Ionicons name="heart" size={24} color={COLORS.ACCENT} />;
      case 'comment':
        return <Ionicons name="chatbubble" size={24} color={COLORS.INFO} />;
      case 'message':
        return <Ionicons name="mail" size={24} color={COLORS.SUCCESS} />;
      case 'band_invite':
        return <Ionicons name="people" size={24} color={COLORS.WARNING} />;
      default:
        return null;
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
        {renderNotificationIcon(item.type)}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.message}>
          <Text style={styles.senderName}>{item.sender.name}</Text>
          {' '}
          {item.message}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Notifications" onBackPress={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SPACING.MEDIUM,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginBottom: SPACING.SMALL,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MEDIUM,
  },
  contentContainer: {
    flex: 1,
  },
  senderName: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
  },
  message: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.TINY,
  },
  timestamp: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
});

export default NotificationsScreen; 