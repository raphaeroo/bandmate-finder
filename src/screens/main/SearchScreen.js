import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import FilterSection from '../../components/FilterSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { USER_TYPES, INSTRUMENTS, GENRES, SEARCH_RADIUS_OPTIONS } from '../../utils/constants';

// Same mock data from HomeScreen for demo purposes
const mockBands = [
  {
    id: '1',
    name: 'Rock Legends',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'rock', name: 'Rock' }, { id: 'blues', name: 'Blues' }],
    location: { city: 'New York', state: 'NY', distance: 2.5 },
    isAvailable: true,
    memberCount: 4,
    openPositions: [{ id: 'guitar', name: 'Guitarist' }],
  },
  {
    id: '2',
    name: 'Jazz Ensemble',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'jazz', name: 'Jazz' }, { id: 'blues', name: 'Blues' }],
    location: { city: 'Chicago', state: 'IL', distance: 1.7 },
    isAvailable: true,
    memberCount: 6,
    openPositions: [{ id: 'saxophone', name: 'Saxophone' }, { id: 'drums', name: 'Drummer' }],
  },
  {
    id: '3',
    name: 'Indie Vibes',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'indie', name: 'Indie' }, { id: 'alternative', name: 'Alternative' }],
    location: { city: 'Austin', state: 'TX', distance: 3.2 },
    isAvailable: false,
    memberCount: 3,
    openPositions: [],
  },
];

const mockMusicians = [
  {
    id: '1',
    name: 'John Doe',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'rock', name: 'Rock' }, { id: 'blues', name: 'Blues' }],
    location: { city: 'Los Angeles', state: 'CA', distance: 1.8 },
    isAvailable: true,
    instruments: [{ id: 'guitar', name: 'Guitar' }],
    bandName: 'The Rockers',
  },
  {
    id: '2',
    name: 'Jane Smith',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'jazz', name: 'Jazz' }, { id: 'soul', name: 'Soul' }],
    location: { city: 'Seattle', state: 'WA', distance: 4.5 },
    isAvailable: true,
    instruments: [{ id: 'saxophone', name: 'Saxophone' }],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    profileImage: 'https://via.placeholder.com/100',
    genres: [{ id: 'pop', name: 'Pop' }, { id: 'rnb', name: 'R&B' }],
    location: { city: 'Miami', state: 'FL', distance: 2.1 },
    isAvailable: false,
    instruments: [{ id: 'vocals', name: 'Vocals' }, { id: 'keyboard', name: 'Keyboard' }],
    bandName: 'Soul Collective',
  },
];

const SearchScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [searchMode, setSearchMode] = useState(
    user?.type === USER_TYPES.MUSICIAN ? 'bands' : 'musicians'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [searchRadius, setSearchRadius] = useState(SEARCH_RADIUS_OPTIONS[2]); // Default to 25km
  const [availableOnly, setAvailableOnly] = useState(false);

  const toggleSearchMode = () => {
    setSearchMode(searchMode === 'bands' ? 'musicians' : 'bands');
    setResults([]);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Keyboard.dismiss();
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    setIsSearching(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Filter mock data based on search criteria
      let filteredResults = [];
      
      if (searchMode === 'bands') {
        filteredResults = mockBands.filter(band => {
          // Filter by name if search query exists
          if (searchQuery && !band.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          // Filter by genres if selected
          if (selectedGenres.length > 0) {
            const hasMatchingGenre = band.genres.some(genre => 
              selectedGenres.some(selected => selected.id === genre.id)
            );
            if (!hasMatchingGenre) return false;
          }
          
          // Filter by instruments if selected (matching open positions)
          if (selectedInstruments.length > 0) {
            const hasMatchingPosition = band.openPositions.some(position => 
              selectedInstruments.some(selected => selected.id === position.id)
            );
            if (!hasMatchingPosition) return false;
          }
          
          // Filter by availability
          if (availableOnly && !band.isAvailable) {
            return false;
          }
          
          // Filter by distance (searchRadius)
          if (band.location.distance > searchRadius.value) {
            return false;
          }
          
          return true;
        });
      } else {
        // Similar filtering logic for musicians
        filteredResults = mockMusicians.filter(musician => {
          // Filter by name if search query exists
          if (searchQuery && !musician.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          // Filter by genres if selected
          if (selectedGenres.length > 0) {
            const hasMatchingGenre = musician.genres.some(genre => 
              selectedGenres.some(selected => selected.id === genre.id)
            );
            if (!hasMatchingGenre) return false;
          }
          
          // Filter by instruments if selected
          if (selectedInstruments.length > 0) {
            const hasMatchingInstrument = musician.instruments.some(instrument => 
              selectedInstruments.some(selected => selected.id === instrument.id)
            );
            if (!hasMatchingInstrument) return false;
          }
          
          // Filter by availability
          if (availableOnly && !musician.isAvailable) {
            return false;
          }
          
          // Filter by distance (searchRadius)
          if (musician.location.distance > searchRadius.value) {
            return false;
          }
          
          return true;
        });
      }
      
      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleSelectGenre = (genre) => {
    if (selectedGenres.some(selected => selected.id === genre.id)) {
      setSelectedGenres(selectedGenres.filter(selected => selected.id !== genre.id));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSelectInstrument = (instrument) => {
    if (selectedInstruments.some(selected => selected.id === instrument.id)) {
      setSelectedInstruments(selectedInstruments.filter(selected => selected.id !== instrument.id));
    } else {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  const handleSelectRadius = (radius) => {
    setSearchRadius(radius);
  };

  const toggleAvailableOnly = () => {
    setAvailableOnly(!availableOnly);
  };

  const handleCardPress = (item) => {
    if (searchMode === 'bands') {
      navigation.navigate('BandProfile', { bandId: item.id });
    } else {
      navigation.navigate('MusicianProfile', { musicianId: item.id });
    }
  };

  const renderFilters = () => (
    <ScrollView style={styles.filtersContainer}>
      <FilterSection
        title="Genres"
        options={GENRES}
        selectedOptions={selectedGenres}
        onSelectOption={handleSelectGenre}
        multiSelect={true}
      />
      
      <FilterSection
        title={searchMode === 'bands' ? 'Open Positions' : 'Instruments'}
        options={INSTRUMENTS}
        selectedOptions={selectedInstruments}
        onSelectOption={handleSelectInstrument}
        multiSelect={true}
      />
      
      <FilterSection
        title="Search Radius"
        options={SEARCH_RADIUS_OPTIONS}
        selectedOptions={[searchRadius]}
        onSelectOption={handleSelectRadius}
        multiSelect={false}
      />
      
      <View style={styles.availableContainer}>
        <Text style={styles.availableText}>Show available only</Text>
        <TouchableOpacity 
          style={[styles.checkbox, availableOnly && styles.checkboxChecked]}
          onPress={toggleAvailableOnly}
        >
          {availableOnly && <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />}
        </TouchableOpacity>
      </View>
      
      <Button
        title="Apply Filters"
        onPress={() => {
          handleSearch();
          setShowFilters(false);
        }}
        style={styles.applyButton}
      />
    </ScrollView>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {isSearching ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      ) : results.length === 0 && searchQuery ? (
        <>
          <Ionicons name="search-outline" size={50} color={COLORS.LIGHT_GRAY} />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search criteria or filters
          </Text>
        </>
      ) : (
        <>
          <Ionicons name="search-outline" size={50} color={COLORS.LIGHT_GRAY} />
          <Text style={styles.emptyText}>
            Search for {searchMode}
          </Text>
          <Text style={styles.emptySubtext}>
            Use the search bar above to find {searchMode} near you
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.searchToggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                searchMode === 'bands' && styles.activeToggleButton,
              ]}
              onPress={() => setSearchMode('bands')}
            >
              <Text
                style={[
                  styles.toggleText,
                  searchMode === 'bands' && styles.activeToggleText,
                ]}
              >
                Bands
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                searchMode === 'musicians' && styles.activeToggleButton,
              ]}
              onPress={() => setSearchMode('musicians')}
            >
              <Text
                style={[
                  styles.toggleText,
                  searchMode === 'musicians' && styles.activeToggleText,
                ]}
              >
                Musicians
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.GRAY} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search for ${searchMode}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.GRAY} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
            <Ionicons 
              name="options-outline" 
              size={20} 
              color={showFilters ? COLORS.PRIMARY : COLORS.DARK_TEXT} 
            />
          </TouchableOpacity>
        </View>

        {showFilters && renderFilters()}

        <FlatList
          data={results}
          renderItem={({ item }) => (
            <Card
              item={item}
              onPress={() => handleCardPress(item)}
              type={searchMode === 'bands' ? 'band' : 'musician'}
              isSearchResult={true}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState()}
        />
      </View>
    </SafeAreaView>
  );
};

// Dummy Button component since it doesn't auto-import from components
const Button = ({ title, onPress, style, disabled }) => (
  <TouchableOpacity
    style={[
      {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: SPACING.MEDIUM,
        borderRadius: BORDER_RADIUS.MEDIUM,
        alignItems: 'center',
      },
      disabled && { opacity: 0.5 },
      style,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={{ color: COLORS.WHITE, fontWeight: 'bold' }}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  headerTitle: {
    fontSize: FONT_SIZE.EXTRA_LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SMALL,
  },
  searchToggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 25,
    padding: 4,
    marginTop: SPACING.SMALL,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.SMALL,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeToggleButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  toggleText: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: '500',
    color: COLORS.DARK_TEXT,
  },
  activeToggleText: {
    color: COLORS.WHITE,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
  },
  searchIcon: {
    marginRight: SPACING.SMALL,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: FONT_SIZE.REGULAR,
  },
  filterButton: {
    marginLeft: SPACING.MEDIUM,
    padding: SPACING.SMALL,
  },
  filtersContainer: {
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    maxHeight: 300,
  },
  availableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  availableText: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
  },
  applyButton: {
    marginTop: SPACING.MEDIUM,
  },
  listContainer: {
    padding: SPACING.SMALL,
    flexGrow: 1,
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

export default SearchScreen;
