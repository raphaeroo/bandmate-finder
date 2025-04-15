/**
 * Constants for the BandMate Finder app
 */

// User types
export const USER_TYPES = {
  MUSICIAN: 'musician',
  BAND: 'band',
};

// Instruments list
export const INSTRUMENTS = [
  { id: 'guitar', name: 'Guitar' },
  { id: 'bass', name: 'Bass' },
  { id: 'drums', name: 'Drums' },
  { id: 'vocals', name: 'Vocals' },
  { id: 'keyboard', name: 'Keyboard' },
  { id: 'saxophone', name: 'Saxophone' },
  { id: 'trumpet', name: 'Trumpet' },
  { id: 'violin', name: 'Violin' },
  { id: 'cello', name: 'Cello' },
  { id: 'flute', name: 'Flute' },
  { id: 'clarinet', name: 'Clarinet' },
  { id: 'trombone', name: 'Trombone' },
  { id: 'harmonica', name: 'Harmonica' },
  { id: 'percussion', name: 'Percussion' },
  { id: 'dj', name: 'DJ' },
  { id: 'producer', name: 'Producer' },
  { id: 'other', name: 'Other' },
];

// Music genres
export const GENRES = [
  { id: 'rock', name: 'Rock' },
  { id: 'pop', name: 'Pop' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'blues', name: 'Blues' },
  { id: 'classical', name: 'Classical' },
  { id: 'country', name: 'Country' },
  { id: 'electronic', name: 'Electronic' },
  { id: 'hiphop', name: 'Hip Hop' },
  { id: 'rap', name: 'Rap' },
  { id: 'metal', name: 'Metal' },
  { id: 'folk', name: 'Folk' },
  { id: 'reggae', name: 'Reggae' },
  { id: 'punk', name: 'Punk' },
  { id: 'rnb', name: 'R&B' },
  { id: 'soul', name: 'Soul' },
  { id: 'indie', name: 'Indie' },
  { id: 'alternative', name: 'Alternative' },
  { id: 'funk', name: 'Funk' },
  { id: 'latin', name: 'Latin' },
  { id: 'world', name: 'World' },
  { id: 'other', name: 'Other' },
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'professional', name: 'Professional' },
];

// Availability status
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  NOT_AVAILABLE: 'not_available',
  OPEN_TO_OFFERS: 'open_to_offers',
};

// Search radius options (in kilometers)
export const SEARCH_RADIUS_OPTIONS = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
  { value: 200, label: '200 km' },
];

// Maximum number of bands a musician can be part of
export const MAX_BANDS_PER_MUSICIAN = 5;

// Maximum post description length
export const MAX_POST_DESCRIPTION_LENGTH = 500;

// Maximum number of photos per post
export const MAX_PHOTOS_PER_POST = 10;

// Maximum chat message length
export const MAX_CHAT_MESSAGE_LENGTH = 1000;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  SEARCH_HISTORY: 'search_history',
  CHAT_HISTORY: 'chat_history',
  APP_SETTINGS: 'app_settings',
};

export default {
  USER_TYPES,
  INSTRUMENTS,
  GENRES,
  EXPERIENCE_LEVELS,
  AVAILABILITY_STATUS,
  SEARCH_RADIUS_OPTIONS,
  MAX_BANDS_PER_MUSICIAN,
  MAX_POST_DESCRIPTION_LENGTH,
  MAX_PHOTOS_PER_POST,
  MAX_CHAT_MESSAGE_LENGTH,
  STORAGE_KEYS,
};
