import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../styles/theme';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/MainNavigator';

type CreatePostScreenProps = NativeStackScreenProps<HomeStackParamList, 'CreatePost'>;

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [posting, setPosting] = useState(false);

  const handleAddMedia = () => {
    // In a real app, this would open image/video picker
    const mockMedia: MediaItem = {
      uri: 'https://placehold.co/300',
      type: 'image',
    };
    setMedia([...media, mockMedia]);
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!caption && media.length === 0) return;

    setPosting(true);
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setPosting(false);
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Create Post"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.captionInput}
          value={caption}
          onChangeText={setCaption}
          placeholder="Write a caption..."
          multiline
          numberOfLines={4}
        />

        {media.length > 0 && (
          <ScrollView
            horizontal
            style={styles.mediaPreviewContainer}
            showsHorizontalScrollIndicator={false}
          >
            {media.map((item, index) => (
              <View key={index} style={styles.mediaPreview}>
                <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMedia(index)}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.ERROR} />
                </TouchableOpacity>
                {item.type === 'video' && (
                  <View style={styles.videoIndicator}>
                    <Ionicons name="videocam" size={20} color={COLORS.WHITE} />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.actionButtons}>
          <Button
            title="Add Photo/Video"
            onPress={handleAddMedia}
            type="outline"
            style={styles.mediaButton}
          />
          <Button
            title="Post"
            onPress={handlePost}
            loading={posting}
            disabled={!caption && media.length === 0}
            style={styles.postButton}
          />
        </View>
      </ScrollView>
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
    padding: SPACING.MEDIUM,
  },
  captionInput: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MEDIUM,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: SPACING.MEDIUM,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.MEDIUM,
  },
  mediaPreview: {
    position: 'relative',
    marginRight: SPACING.SMALL,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.SMALL,
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.MEDIUM,
  },
  mediaButton: {
    flex: 1,
    marginRight: SPACING.SMALL,
  },
  postButton: {
    flex: 1,
    marginLeft: SPACING.SMALL,
  },
});

export default CreatePostScreen; 