import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../styles/theme';

interface Sender {
  id: string;
  name: string;
  profileImage?: string;
}

interface Attachment {
  id: string;
  url: string;
  type: string;
}

interface Message {
  id: string;
  text?: string;
  timestamp: string;
  sender: Sender;
  attachments?: Attachment[];
}

type MessageStatus = 'sent' | 'delivered' | 'read';

interface ChatMessageProps {
  message: Message;
  isOwn?: boolean;
  showAvatar?: boolean;
  onLongPress?: () => void;
  status?: MessageStatus;
}

/**
 * ChatMessage component for displaying messages in chat
 */
const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn = false,
  showAvatar = true,
  onLongPress,
  status = 'sent',
}) => {
  const {
    text,
    timestamp,
    sender,
    attachments = [],
  } = message;

  // Format timestamp for display
  const formatTime = (timestamp: string): string => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Status indicator
  const renderStatus = (): React.ReactNode => {
    if (!isOwn) return null;
    
    let statusIcon = '✓';
    let statusColor: string = COLORS.GRAY;
    
    if (status === 'delivered') {
      statusIcon = '✓✓';
    } else if (status === 'read') {
      statusIcon = '✓✓';
      statusColor = COLORS.ACCENT as string;
    }
    
    return (
      <Text style={[styles.statusText, { color: statusColor }]}>
        {statusIcon}
      </Text>
    );
  };

  // Render media attachments
  const renderAttachments = (): React.ReactNode => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <View style={styles.attachmentsContainer}>
        {attachments.map((attachment, index) => (
          <Image
            key={index}
            source={{ uri: attachment.url }}
            style={styles.attachmentImage}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      isOwn ? styles.ownContainer : styles.otherContainer,
    ]}>
      {!isOwn && showAvatar && (
        <Image
          source={
            sender.profileImage
              ? { uri: sender.profileImage }
              : require('../../assets/default-profile.png')
          }
          style={styles.avatar}
        />
      )}
      <TouchableWithoutFeedback onLongPress={onLongPress}>
        <View style={[
          styles.bubble,
          isOwn ? styles.ownBubble : styles.otherBubble,
        ]}>
          {renderAttachments()}
          {text && <Text style={styles.text}>{text}</Text>}
          <View style={styles.footer}>
            <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
            {renderStatus()}
          </View>
        </View>
      </TouchableWithoutFeedback>
      {isOwn && showAvatar && (
        <Image
          source={
            sender.profileImage
              ? { uri: sender.profileImage }
              : require('../../assets/default-profile.png')
          }
          style={styles.avatar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.ROUND,
    marginHorizontal: SPACING.SMALL,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: BORDER_RADIUS.LARGE,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
  },
  ownBubble: {
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
  },
  attachmentsContainer: {
    marginBottom: SPACING.TINY,
  },
  attachmentImage: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.SMALL,
    marginBottom: SPACING.TINY,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: SPACING.TINY,
  },
  timestamp: {
    fontSize: FONT_SIZE.TINY,
    color: COLORS.GRAY,
    marginRight: SPACING.TINY,
  },
  statusText: {
    fontSize: FONT_SIZE.TINY,
  },
});

export default ChatMessage; 