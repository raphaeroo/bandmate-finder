import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../../styles/theme";
import Header from "../../components/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatStackParamList } from "../../navigation/MainNavigator";

type ChatListScreenProps = NativeStackScreenProps<
  ChatStackParamList,
  "ChatList"
>;

interface User {
  id: string;
  name: string;
  type: "musician" | "band";
  profileImage: string;
  instrument?: string;
}

interface Message {
  text: string;
  timestamp: string;
  read: boolean;
  sender: string;
}

interface Chat {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

// Mock data for chats
const mockChats: Chat[] = [
  {
    id: "1",
    user: {
      id: "101",
      name: "Jane Smith",
      type: "musician",
      profileImage: "https://via.placeholder.com/100",
      instrument: "Saxophone",
    },
    lastMessage: {
      text: "Hey, are you still looking for a guitarist?",
      timestamp: "2023-06-15T14:30:00Z",
      read: true,
      sender: "101",
    },
    unreadCount: 0,
  },
  {
    id: "2",
    user: {
      id: "102",
      name: "Rock Legends",
      type: "band",
      profileImage: "https://via.placeholder.com/100",
    },
    lastMessage: {
      text: "We'd love to have you join us for the upcoming show!",
      timestamp: "2023-06-14T18:45:00Z",
      read: false,
      sender: "102",
    },
    unreadCount: 3,
  },
  {
    id: "3",
    user: {
      id: "103",
      name: "Mike Johnson",
      type: "musician",
      profileImage: "https://via.placeholder.com/100",
      instrument: "Drums",
    },
    lastMessage: {
      text: "What time does the practice session start tomorrow?",
      timestamp: "2023-06-12T20:10:00Z",
      read: true,
      sender: "me",
    },
    unreadCount: 0,
  },
  {
    id: "4",
    user: {
      id: "104",
      name: "Jazz Ensemble",
      type: "band",
      profileImage: "https://via.placeholder.com/100",
    },
    lastMessage: {
      text: "Thanks for reaching out! We're currently looking for a saxophonist.",
      timestamp: "2023-06-10T11:20:00Z",
      read: true,
      sender: "104",
    },
    unreadCount: 0,
  },
  {
    id: "5",
    user: {
      id: "105",
      name: "Sarah Lee",
      type: "musician",
      profileImage: "https://via.placeholder.com/100",
      instrument: "Bass",
    },
    lastMessage: {
      text: "Hey, I saw your profile. I'm interested in joining your band.",
      timestamp: "2023-06-08T15:55:00Z",
      read: true,
      sender: "105",
    },
    unreadCount: 0,
  },
];

const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) =>
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
          return (
            new Date(b.lastMessage.timestamp).getTime() -
            new Date(a.lastMessage.timestamp).getTime()
          );
        });

        setChats(sortedChats);
        setFilteredChats(sortedChats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading chats:", error);
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // Today - show time
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      // Yesterday
      return "Yesterday";
    } else if (diffDays < 7) {
      // Last week - show day name
      return messageDate.toLocaleDateString([], { weekday: "short" });
    } else {
      // Older - show date
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleChatPress = (chat: Chat) => {
    navigation.navigate("Chat", { chatId: chat.id, user: chat.user });
  };

  const renderChatItem: ListRenderItem<Chat> = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
        {item.user.type === "musician" && item.user.instrument && (
          <View style={styles.instrumentBadge}>
            <Text style={styles.instrumentText}>
              {item.user.instrument.charAt(0)}
            </Text>
          </View>
        )}
        {item.user.type === "band" && (
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
            {item.lastMessage.sender === "me" ? "You: " : ""}
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
        <Ionicons
          name="chatbubbles-outline"
          size={50}
          color={COLORS.LIGHT_GRAY}
        />
        <Text style={styles.emptyText}>
          {searchQuery ? "No chats match your search" : "No chats yet"}
        </Text>
        <Text style={styles.emptySubtext}>
          {searchQuery
            ? "Try a different search term"
            : "Start a conversation with someone!"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Messages" />

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.GRAY}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LIGHT_GRAY,
    marginHorizontal: SPACING.MEDIUM,
    marginVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    ...SHADOWS.SMALL,
  },
  searchIcon: {
    marginRight: SPACING.SMALL,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.MEDIUM,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  avatarContainer: {
    position: "relative",
    marginRight: SPACING.MEDIUM,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.LARGE,
  },
  instrumentBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.SMALL,
    justifyContent: "center",
    alignItems: "center",
  },
  bandBadge: {
    backgroundColor: COLORS.SECONDARY,
  },
  instrumentText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SMALL,
    fontWeight: "bold",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.TINY,
  },
  chatName: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: "bold",
    color: COLORS.DARK_TEXT,
    flex: 1,
  },
  unreadName: {
    color: COLORS.PRIMARY,
  },
  timestamp: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  unreadMessage: {
    color: COLORS.DARK_TEXT,
    fontWeight: "bold",
  },
  unreadBadge: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.LARGE,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.SMALL,
  },
  unreadCount: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.SMALL,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.EXTRA_LARGE,
  },
  emptyText: {
    fontSize: FONT_SIZE.LARGE,
    color: COLORS.DARK_TEXT,
    marginTop: SPACING.MEDIUM,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.GRAY,
    marginTop: SPACING.SMALL,
    textAlign: "center",
  },
});

export default ChatListScreen;
