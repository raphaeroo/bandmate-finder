import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import FilterSection from '../../components/FilterSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { USER_TYPES, INSTRUMENTS, GENRES } from '../../utils/constants';

// Reusing the mock data from HomeScreen
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState(
    user?.type === USER_TYPES.MUSICIAN ? 'bands' : 'musicians'
  );
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50); // in km
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSearchType = () => {
    setSearchType(searchType === 'bands' ? 'musicians' : 'bands');
    setSearchQuery('');
    setResults([]);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const toggleAvailableOnly = () => {
    setAvailableOnly(!availableOnly);
  };

  const handleSearch = () => {
    setLoading(true);
    Keyboard.dismiss();

    // In a real app, this would be an API call with filters
    // For now, we'll simulate a search with mock data
    setTimeout(() => {
      let filteredResults = searchType === 'bands' ? [...mockBands] : [...mockMusicians];

      // Filter by search query (name)
      if (searchQuery) {
        filteredResults = filteredResults.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by available only
      if (availableOnly) {
        filteredResults = filteredResults.filter(item => item.isAvailable);
      }

      // Filter by genres
      if (selectedGenres.length > 0) {
        filteredResults = filteredResults.filter(item =>
          item.genres.some(genre => selectedGenres.some(sg => sg.id === genre.id))
        );
      }

      // Filter by instruments (only applicable for certain searches)
      if (selectedInstruments.length > 0) {
        if (searchType === 'musicians') {
          filteredResults = filteredResults.filter(item =>
            item.instruments.some(inst => selectedInstruments.some(si => si.id === inst.id))
          );
        } else if (searchType === 'bands') {
          filteredResults = filteredResults.filter(item =>
            item.openPositions.some(pos => selectedInstruments.some(si => si.id === pos.id))
          );
        }
      }

      // Filter by distance
      filteredResults = filteredResults.filter(
        item => !item.location.distance || item.location.distance <= maxDistance
      );

      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };

  const handleSelectGenre = (genre) => {
    const isSelected = selectedGenres.some(g => g.id === genre.id);
    if (isSelected) {
      setSelectedGenres(selectedGenres.filter(g => g.id !== genre.id));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSelectInstrument = (instrument) => {
    const isSelected = selectedInstruments.some(i => i.id === instrument.id);
    if (isSelected) {
      setSelectedInstruments(selectedInstruments.filter(i => i.id !== instrument.id));
    } else {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedInstruments([]);
    setAvailableOnly(false);
    setMaxDistance(50);
  };

  const handleCardPress = (item) => {
    if (searchType === 'bands') {
      navigation.navigate('BandProfile', { bandId: item.id });
    } else {
      navigation.navigate('MusicianProfile', { musicianId: item.id });
    }
  };

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={COLORS.GRAY} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search for ${searchType}`}
          placeholderTextColor={COLORS.GRAY}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
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
      <TouchableOpacity
        style={styles.filterButton}
        onPress={toggleFilters}
        activeOpacity={0.7}
      >
        <Ionicons
          name={filtersVisible ? 'options' : 'options-outline'}
          size={22}
          color={COLORS.PRIMARY}
        />
      </TouchableOpacity>
    </View>
  );

  const renderSearchTypeToggle = () => (
    <View style={styles.searchTypeContainer}>
      <TouchableOpacity
        style={[
          styles.searchTypeButton,
          searchType === 'musicians' && styles.activeSearchTypeButton,
        ]}
        onPress={() => setSearchType('musicians')}
      >
        <Text
          style={[
            styles.searchTypeText,
            searchType === 'musicians' && styles.activeSearchTypeText,
          ]}
        >
          Musicians
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.searchTypeButton,
          searchType === 'bands' && styles.activeSearchTypeButton,
        ]}
        onPress={() => setSearchType('bands')}
      >
        <Text
          style={[
            styles.searchTypeText,
            searchType === 'bands' && styles.activeSearchTypeText,
          ]}
        >
          Bands
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => {
    if (!filtersVisible) return null;
    
    return (
      <View style={styles.filtersContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        
        <FilterSection
          title="Genres"
          options={GENRES}
          selectedOptions={selectedGenres}
          onSelectOption={handleSelectGenre}
          multiSelect={true}
        />
        
        <FilterSection
          title={searchType === 'musicians' ? 'Instruments' : 'Looking for'}
          options={INSTRUMENTS}
          selectedOptions={selectedInstruments}
          onSelectOption={handleSelectInstrument}
          multiSelect={true}
        />
        
        <View style={styles.availableFilter}>
          <Text style={styles.availableFilterText}>Available Only</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              availableOnly && styles.toggleButtonActive,
            ]}
            onPress={toggleAvailableOnly}
          >
            <View
              style={[
                styles.toggleKnob,
                availableOnly && styles.toggleKnobActive,
              ]}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <Button
            title="Apply Filters"
            onPress={() => {
              handleSearch();
              toggleFilters();
            }}
          />
        </View>
      </View>
    );
  };

  const renderEmptyResults = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (results.length === 0 && searchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={50} color={COLORS.LIGHT_GRAY} />
          <Text style={styles.emptyText}>
            No results found for "{searchQuery}"
          </Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search" size={50} color={COLORS.LIGHT_GRAY} />
        <Text style={styles.emptyText}>
          Search for {searchType}
        </Text>
        <Text style={styles.emptySubtext}>
          Use the search bar above to find {searchType} near you
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
          {renderSearchTypeToggle()}
          {renderSearchBar()}
        </View>
        
        {renderFilters()}
        
        {results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <Card
                item={item}
                onPress={() => handleCardPress(item)}
                type={searchType === 'bands' ? 'band' : 'musician'}
                isSearchResult={true}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyResults()
        )}
      </View>
    </SafeAreaView>
  );
};

// Button component (simplified version just for this screen)
const Button = ({ title, onPress, loading, disabled, style }) => (
  <TouchableOpacity
    style={[
      styles.button,
      disabled && styles.buttonDisabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.7}
  >
    {loading ? (
      <ActivityIndicator color={COLORS.WHITE} size="small" />
    ) : (
      <Text style={styles.buttonText}>{title}</Text>
    )}
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
    marginBottom: SPACING.MEDIUM,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.MEDIUM,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 25,
    padding: 4,
  },
  searchTypeButton: {
    flex: 1,
    paddingVertical: SPACING.SMALL,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeSearchTypeButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  searchTypeText: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: '500',
    color: COLORS.DARK_TEXT,
  },
  activeSearchTypeText: {
    color: COLORS.WHITE,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
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
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.SMALL,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  filtersContainer: {
    padding: SPACING.MEDIUM,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  filterTitle: {
    fontSize: FONT_SIZE.LARGE,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
  },
  clearFiltersText: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  availableFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.MEDIUM,
  },
  availableFilterText: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: '500',
    color: COLORS.DARK_TEXT,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.WHITE,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  buttonRow: {
    marginTop: SPACING.MEDIUM,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: SPACING.SMALL,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LARGE,
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
  loadingText: {
    marginTop: SPACING.MEDIUM,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.GRAY,
  },
});

export default SearchScreen;
