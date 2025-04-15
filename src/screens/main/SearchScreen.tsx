import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from "../../styles/theme";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/Card";
import FilterSection from "../../components/FilterSection";
import Ionicons from "react-native-vector-icons/Ionicons";
import { USER_TYPES, INSTRUMENTS, GENRES } from "../../utils/constants";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchStackParamList } from "../../navigation/MainNavigator";

type SearchScreenProps = NativeStackScreenProps<
  SearchStackParamList,
  "SearchScreen"
>;

interface Location {
  city: string;
  state: string;
  distance: number;
}

interface Genre {
  id: string;
  name: string;
}

interface Instrument {
  id: string;
  name: string;
}

interface Band {
  id: string;
  name: string;
  profileImage: string;
  genres: Genre[];
  location: Location;
  isAvailable: boolean;
  memberCount: number;
  openPositions: Instrument[];
}

interface Musician {
  id: string;
  name: string;
  profileImage: string;
  genres: Genre[];
  location: Location;
  isAvailable: boolean;
  instruments: Instrument[];
  bandName?: string;
}

type SearchType = "bands" | "musicians";
type SearchResult = Band | Musician;

// Reusing the mock data from HomeScreen
const mockBands: Band[] = [
  {
    id: "1",
    name: "Rock Legends",
    profileImage: "https://placehold.co/100",
    genres: [
      { id: "rock", name: "Rock" },
      { id: "blues", name: "Blues" },
    ],
    location: { city: "New York", state: "NY", distance: 2.5 },
    isAvailable: true,
    memberCount: 4,
    openPositions: [{ id: "guitar", name: "Guitarist" }],
  },
  {
    id: "2",
    name: "Jazz Ensemble",
    profileImage: "https://placehold.co/100",
    genres: [
      { id: "jazz", name: "Jazz" },
      { id: "blues", name: "Blues" },
    ],
    location: { city: "Chicago", state: "IL", distance: 1.7 },
    isAvailable: true,
    memberCount: 6,
    openPositions: [
      { id: "saxophone", name: "Saxophone" },
      { id: "drums", name: "Drummer" },
    ],
  },
  {
    id: "3",
    name: "Indie Vibes",
    profileImage: "https://placehold.co/100",
    genres: [
      { id: "indie", name: "Indie" },
      { id: "alternative", name: "Alternative" },
    ],
    location: { city: "Austin", state: "TX", distance: 3.2 },
    isAvailable: false,
    memberCount: 3,
    openPositions: [],
  },
];

const mockMusicians: Musician[] = [
  {
    id: "1",
    name: "John Doe",
    profileImage: "https://placehold.co/100",
    genres: [
      { id: "rock", name: "Rock" },
      { id: "blues", name: "Blues" },
    ],
    location: { city: "Los Angeles", state: "CA", distance: 1.8 },
    isAvailable: true,
    instruments: [{ id: "guitar", name: "Guitar" }],
    bandName: "The Rockers",
  },
  {
    id: "2",
    name: "Jane Smith",
    profileImage: "https://placehold.co/100",
    genres: [
      { id: "jazz", name: "Jazz" },
      { id: "soul", name: "Soul" },
    ],
    location: { city: "Seattle", state: "WA", distance: 4.5 },
    isAvailable: true,
    instruments: [{ id: "saxophone", name: "Saxophone" }],
  },
  {
    id: "3",
    name: "Mike Johnson",
    profileImage: "https://placehold.co/100",
    genres: [
      { id: "pop", name: "Pop" },
      { id: "rnb", name: "R&B" },
    ],
    location: { city: "Miami", state: "FL", distance: 2.1 },
    isAvailable: false,
    instruments: [
      { id: "vocals", name: "Vocals" },
      { id: "keyboard", name: "Keyboard" },
    ],
    bandName: "Soul Collective",
  },
];

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>(
    user?.type === USER_TYPES.MUSICIAN ? "bands" : "musicians"
  );
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(
    []
  );
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50); // in km
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSearchType = () => {
    setSearchType(searchType === "bands" ? "musicians" : "bands");
    setSearchQuery("");
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
      let filteredResults: SearchResult[] = searchType === "bands" ? [...mockBands] : [...mockMusicians];

      // Filter by search query (name)
      if (searchQuery) {
        filteredResults = filteredResults.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by available only
      if (availableOnly) {
        filteredResults = filteredResults.filter((item) => item.isAvailable);
      }

      // Filter by genres
      if (selectedGenres.length > 0) {
        filteredResults = filteredResults.filter((item) =>
          item.genres.some((genre) =>
            selectedGenres.some((sg) => sg.id === genre.id)
          )
        );
      }

      // Filter by instruments (only applicable for certain searches)
      if (selectedInstruments.length > 0) {
        if (searchType === "musicians") {
          filteredResults = (filteredResults as Musician[]).filter((item) =>
            item.instruments.some((inst) =>
              selectedInstruments.some((si) => si.id === inst.id)
            )
          );
        } else if (searchType === "bands") {
          filteredResults = (filteredResults as Band[]).filter((item) =>
            item.openPositions.some((pos) =>
              selectedInstruments.some((si) => si.id === pos.id)
            )
          );
        }
      }

      // Filter by distance
      filteredResults = filteredResults.filter(
        (item) =>
          !item.location.distance || item.location.distance <= maxDistance
      );

      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };

  const handleSelectGenre = (genre: Genre) => {
    const isSelected = selectedGenres.some((g) => g.id === genre.id);
    if (isSelected) {
      setSelectedGenres(selectedGenres.filter((g) => g.id !== genre.id));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSelectInstrument = (instrument: Instrument) => {
    const isSelected = selectedInstruments.some((i) => i.id === instrument.id);
    if (isSelected) {
      setSelectedInstruments(
        selectedInstruments.filter((i) => i.id !== instrument.id)
      );
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

  const handleCardPress = (item: SearchResult) => {
    if (searchType === "bands") {
      navigation.navigate("BandProfile", { bandId: item.id });
    } else {
      navigation.navigate("MusicianProfile", { musicianId: item.id });
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
            onPress={() => setSearchQuery("")}
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
          name={filtersVisible ? "options" : "options-outline"}
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
          searchType === "musicians" && styles.activeSearchTypeButton,
        ]}
        onPress={() => setSearchType("musicians")}
      >
        <Text
          style={[
            styles.searchTypeText,
            searchType === "musicians" && styles.activeSearchTypeText,
          ]}
        >
          Musicians
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.searchTypeButton,
          searchType === "bands" && styles.activeSearchTypeButton,
        ]}
        onPress={() => setSearchType("bands")}
      >
        <Text
          style={[
            styles.searchTypeText,
            searchType === "bands" && styles.activeSearchTypeText,
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
        <FilterSection
          title="Genres"
          options={GENRES.map(genre => ({ id: String(genre.id), name: genre.name }))}
          selectedOptions={selectedGenres.map(genre => ({ id: String(genre.id), name: genre.name }))}
          onSelectOption={(option) => handleSelectGenre({ id: String(option.id), name: option.name })}
        />
        <FilterSection
          title="Instruments"
          options={INSTRUMENTS.map(instrument => ({ id: String(instrument.id), name: instrument.name }))}
          selectedOptions={selectedInstruments.map(instrument => ({ id: String(instrument.id), name: instrument.name }))}
          onSelectOption={(option) => handleSelectInstrument({ id: String(option.id), name: option.name })}
        />
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Available Only</Text>
          <TouchableOpacity
            style={[styles.checkbox, availableOnly && styles.checkboxChecked]}
            onPress={toggleAvailableOnly}
          >
            {availableOnly && (
              <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Max Distance: {maxDistance}km</Text>
          <TextInput
            style={styles.distanceInput}
            value={maxDistance.toString()}
            onChangeText={(value) => setMaxDistance(parseInt(value) || 0)}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={clearFilters}
        >
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyResults = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      );
    }

    if (results.length === 0 && searchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={50} color={COLORS.LIGHT_GRAY} />
          <Text style={styles.emptyText}>
            No {searchType} found matching your search
          </Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search criteria
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search" size={50} color={COLORS.LIGHT_GRAY} />
        <Text style={styles.emptyText}>Search for {searchType}</Text>
        <Text style={styles.emptySubtext}>
          Use filters to refine your search
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderSearchBar()}
        {renderSearchTypeToggle()}
        {renderFilters()}
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <Card
              item={item}
              onPress={() => handleCardPress(item)}
              type={searchType === "bands" ? "band" : "musician"}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyResults()}
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
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.MEDIUM,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    marginRight: SPACING.SMALL,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: SPACING.SMALL,
    color: COLORS.DARK_TEXT,
  },
  filterButton: {
    padding: SPACING.SMALL,
  },
  searchTypeContainer: {
    flexDirection: "row",
    padding: SPACING.SMALL,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginHorizontal: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  searchTypeButton: {
    flex: 1,
    paddingVertical: SPACING.SMALL,
    alignItems: "center",
    borderRadius: BORDER_RADIUS.SMALL,
  },
  activeSearchTypeButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  searchTypeText: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.GRAY,
  },
  activeSearchTypeText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
  filtersContainer: {
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.MEDIUM,
  },
  filterLabel: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.SMALL,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
  },
  distanceInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.SMALL,
    paddingHorizontal: SPACING.SMALL,
    textAlign: "center",
  },
  clearFiltersButton: {
    alignSelf: "center",
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
  },
  clearFiltersText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: "bold",
  },
  listContainer: {
    padding: SPACING.MEDIUM,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.LARGE,
  },
  emptyText: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.DARK_TEXT,
    marginTop: SPACING.MEDIUM,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
    marginTop: SPACING.TINY,
  },
});

export default SearchScreen;
