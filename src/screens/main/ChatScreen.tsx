import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from "../../styles/theme";
import Header from "../../components/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../contexts/AuthContext";
import { MAX_CHAT_MESSAGE_LENGTH } from "../../utils/constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatStackParamList } from "../../navigation/MainNavigator";

type ChatScreenProps = NativeStackScreenProps<ChatStackParamList, "Chat">;

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
  type: "musician" | "band";
  profileImage: string;
}

// Mock data for messages
const generateMockMessages = (
  chatId: string,
  otherUserId: string
): Message[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      id: "1",
      text: "Hey there! I saw your profile and I think you'd be a great fit for our band.",
      sender: otherUserId,
      timestamp: new Date(yesterday.setHours(10, 30)).toISOString(),
      read: true,
    },
    {
      id: "2",
      text: "Thanks! I'm definitely interested. What kind of music do you guys play?",
      sender: "me",
      timestamp: new Date(yesterday.setHours(11, 15)).toISOString(),
      read: true,
    },
    {
      id: "3",
      text: "We're primarily a rock band with some blues influences. We have gigs about twice a month.",
      sender: otherUserId,
      timestamp: new Date(yesterday.setHours(11, 20)).toISOString(),
      read: true,
    },
    {
      id: "4",
      text: "That sounds perfect for me. I've been playing guitar for about 5 years now.",
      sender: "me",
      timestamp: new Date(yesterday.setHours(11, 25)).toISOString(),
      read: true,
    },
    {
      id: "5",
      text: "Great! Would you be available for a jam session this weekend? Say Saturday around 3pm?",
      sender: otherUserId,
      timestamp: new Date(yesterday.setHours(11, 30)).toISOString(),
      read: true,
    },
    {
      id: "6",
      text: "Saturday at 3 works for me. Where do you guys rehearse?",
      sender: "me",
      timestamp: new Date(yesterday.setHours(11, 45)).toISOString(),
      read: true,
    },
    {
      id: "7",
      text: "We have a space at Music Box Studio on 42nd Street. I'll send you the details.",
      sender: otherUserId,
      timestamp: new Date(yesterday.setHours(12, 0)).toISOString(),
      read: true,
    },
    {
      id: "8",
      text: "Perfect! Looking forward to meeting everyone.",
      sender: "me",
      timestamp: new Date(yesterday.setHours(12, 5)).toISOString(),
      read: true,
    },
    {
      id: "9",
      text: "By the way, do you have any recordings of your playing that you could share?",
      sender: otherUserId,
      timestamp: new Date(now.setHours(9, 30)).toISOString(),
      read: false,
    },
  ];
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { chatId, user } = route.params;
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        const mockMessages = generateMockMessages(chatId, user.id);
        setMessages(mockMessages);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading messages:", error);
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    setSending(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "me",
      timestamp: new Date().toISOString(),
      read: false,
    };

    // In a real app, this would be an API call
    setTimeout(() => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setInputText("");
      setSending(false);
    }, 500);
  };

  const formatMessageDate = (timestamp: string): string => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );

    if (messageDay.getTime() === today.getTime()) {
      return "Today";
    } else if (messageDay.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatMessageTime = (timestamp: string): string => {
    const messageDate = new Date(timestamp);
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage: ListRenderItem<Message> = ({ item, index }) => {
    const isMyMessage = item.sender === "me";
    const showDate =
      index === messages.length - 1 ||
      formatMessageDate(item.timestamp) !==
        formatMessageDate(messages[index + 1].timestamp);

    return (
      <>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {formatMessageDate(item.timestamp)}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isMyMessage
              ? styles.myMessageContainer
              : styles.theirMessageContainer,
          ]}
        >
          {!isMyMessage && (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          )}
          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMyMessage && { color: COLORS.WHITE },
              ]}
            >
              {item.text}
            </Text>
            <Text style={styles.messageTime}>
              {formatMessageTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={user.name}
        onBackPress={() => navigation.goBack()}
        rightIcon="information-circle-outline"
        onRightPress={() => {
          if (user.type === "musician") {
            navigation.navigate("MusicianProfile", { musicianId: user.id });
          } else {
            navigation.navigate("BandProfile", { bandId: user.id });
          }
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            inverted={true} // Display messages from bottom to top
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.GRAY}
              multiline
              maxLength={MAX_CHAT_MESSAGE_LENGTH}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (inputText.trim().length === 0 || sending) &&
                styles.disabledSendButton,
            ]}
            onPress={handleSend}
            disabled={inputText.trim().length === 0 || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={COLORS.WHITE} />
            ) : (
              <Ionicons name="send" size={20} color={COLORS.WHITE} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: SPACING.SMALL,
  },
  dateText: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
    backgroundColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: SPACING.TINY,
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  theirMessageContainer: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginRight: SPACING.SMALL,
  },
  messageBubble: {
    padding: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  myMessageBubble: {
    backgroundColor: COLORS.PRIMARY,
  },
  theirMessageBubble: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  messageText: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
  },
  messageTime: {
    fontSize: FONT_SIZE.TINY,
    color: COLORS.GRAY,
    alignSelf: "flex-end",
    marginTop: SPACING.TINY,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.SMALL,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginRight: SPACING.SMALL,
  },
  textInput: {
    padding: SPACING.SMALL,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.MEDIUM,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    backgroundColor: COLORS.GRAY,
  },
});

export default ChatScreen;
