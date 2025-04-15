import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../../styles/theme';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for chats
const mockChats = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Jane Smith',
      type: 'musician',
      profileImage: 'https://via.placeholder.com/100',
      instrument: 'Saxophone',
    },
    lastMessage: {
      text: 'Hey, are you still looking for a guitarist?',
      timestamp: '2023-06-15T14:30:00Z',
      read: true,
      sender: '101',
    },
    unreadCount: 0,
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Rock Legends',
      type: 'band',
      profileImage: 'https://via.placeholder.com/100',
    },
    lastMessage: {
      text: 'We'd love to have you join us for the upcoming show!',
      timestamp: '2023-06-14T18:45:00Z',
      read: false,
      sender: '102',
    },
    unreadCount: 3,
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Mike Johnson',
      type: 'musician',
      profileImage: 'https://via.placeholder.com/100',
      instrument: 'Drums',
    },
    lastMessage: {
      text: 'What time does the practice session start tomorrow?',
      timestamp: '2023-06-12T20:10:00Z',
      read: true,
      sender: 'me',
    },
    unreadCount: 0,
  },
  {
    id: '4',
    user: {
      id: '104',
      name: 'Jazz Ensemble',
      type: 'band',
      profileImage: 'https://via.placeholder.com/100',
    },
    lastMessage: {
      text: 'Thanks for reaching out! We're currently looking for a saxophonist.',
      timestamp: '2023-06-10T11:20:00Z',
      read: true,
      sender: '104',
    },
    unreadCount: 0,
  },
  {
    id: '5',
    user: {
      id: '105',
      name: 'Sarah Lee',
      type: 'musician',
      profileImage: 'https://via.placeholder.com/100',
      instrument: 'Bass',
    },
    lastMessage: {
      text: 'Hey, I saw your profile. I'm interested in joining your band.',
      timestamp: '2023-06-08T15:55:00Z',
      read: true,
      sender: '105',
    },
    unreadCount: 0,
  },
];

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);

  const loadChats = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        // Sort chats by timestamp (most recent first) and then by unread count
        const sortedChats = [...mockChats].sort((a, b) => {
          // First sort by unread count (higher first)
          if (b.unreadCount !== a.unreadCount) {
            return b.unreadCount - a.unreadCount;
          }
          // Then sort by timestamp (recent first)
          return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
        });
        
        setChats(sortedChats);
        setFilteredChats(sortedChats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading chats:', error);
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Last week - show day name
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleChatPress = (chat) => {
    navigation.navigate('Chat', { chatId: chat.id, user: chat.user });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.user.profileImage }}
          style={styles.avatar}
        />
        {item.user.type === 'musician' && item.user.instrument && (
          <View style={styles.instrumentBadge}>
            <Text style={styles.instrumentText}>
              {item.user.instrument.charAt(0)}
            </Text>
          </View>
        )}
        {item.user.type === 'band' && (
          <View style={[styles.instrumentBadge, styles.bandBadge]}>
            <Text style={styles.instrumentText}>B</Text>
          </View>
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text
            style={[styles.chatName, item.unreadCount > 0 && styles.unreadName]}
            numberOfLines={1}
          >
            {item.user.name}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.lastMessage.timestamp)}
          </Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.sender === 'me' ? 'You: ' : ''}
            {item.lastMessage.text}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubbles-outline" size={50} color={COLORS.LIGHT_GRAY} />
        <Text style={styles.emptyText}>
          {searchQuery ? 'No chats match your search' : 'No chats yet'}
        </Text>
        <Text style={styles.emptySubtext}>
          {searchQuery
            ? 'Try a different search term'
            : 'Start connecting with musicians and bands!'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Messages" />
      
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.GRAY} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search conversations"
              placeholderTextColor={COLORS.GRAY}
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={18} color={COLORS.GRAY} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
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
  searchContainer: {
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  searchInputContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: SPACING.SMALL,
    color: COLORS.DARK_TEXT,
    fontSize: FONT_SIZE.REGULAR,
  },
  listContainer: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.MEDIUM,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  instrumentBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  bandBadge: {
    backgroundColor: COLORS.PRIMARY,
  },
  instrumentText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.TINY,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.TINY,
  },
  chatName: {
    flex: 1,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    fontWeight: '500',
    marginRight: SPACING.TINY,
  },
  unreadName: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
    marginRight: SPACING.SMALL,
  },
  unreadMessage: {
    color: COLORS.DARK_TEXT,
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadCount: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.TINY,
    fontWeight: 'bold',
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

export default ChatListScreen;
