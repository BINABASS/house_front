import { useState, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  RefreshControl, 
  TextInput, 
  Alert,
  FlatList,
  Animated,
  Dimensions
} from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

type DesignStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface Design {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  status: DesignStatus;
  date: string;
  tags?: string[];
  views?: number;
  likes?: number;
}

const TABS: { id: DesignStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'approved', label: 'Approved' },
  { id: 'pending', label: 'Pending' },
  { id: 'rejected', label: 'Rejected' },
];

const SAMPLE_DESIGNS: Design[] = [
  {
    id: '1',
    title: 'Modern Living Room',
    category: 'Living Room',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    status: 'approved',
    date: '2025-07-01',
    tags: ['Modern', 'Minimalist', 'Luxury'],
    views: 1245,
    likes: 89,
  },
  {
    id: '2',
    title: 'Cozy Bedroom Suite',
    category: 'Bedroom',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    status: 'pending',
    date: '2025-06-28',
    tags: ['Cozy', 'Warm', 'Relaxing'],
    views: 876,
    likes: 64,
  },
];

export default function MyDesigns({ navigation }) {
  const [activeTab, setActiveTab] = useState<DesignStatus>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [designs, setDesigns] = useState<Design[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showFAB, setShowFAB] = useState(true);

  // Load fonts
  // Load fonts
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Load designs (simulated API call)
  const loadDesigns = useCallback(() => {
    setRefreshing(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setDesigns(SAMPLE_DESIGNS);
      setRefreshing(false);
    }, 1000);
  }, []);

  // Initial load and refresh on focus
  useFocusEffect(
    useCallback(() => {
      loadDesigns();
    }, [loadDesigns])
  );

  // Filter designs based on active tab and search query
  const filteredDesigns = designs.filter(design => {
    const matchesTab = activeTab === 'all' || design.status === activeTab;
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (design.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
    return matchesTab && matchesSearch;
  });

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle design press
  const handleDesignPress = (design: Design) => {
    // Navigate to design detail screen
    navigation.navigate('DesignDetail', { designId: design.id });
  };

  // Handle delete design
  const handleDeleteDesign = (designId: string) => {
    Alert.alert(
      'Delete Design',
      'Are you sure you want to delete this design?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle delete action
            setDesigns(prev => prev.filter(d => d.id !== designId));
          },
        },
      ]
    );
  };

  // Render design item
  const renderDesignItem = ({ item }: { item: Design }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleDesignPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.price}>TZS {formatPrice(item.price)}</Text>
        </View>
        
        <Text style={styles.category}>{item.category}</Text>
        
        <View style={styles.tagsContainer}>
          {item.tags?.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags && item.tags.length > 2 && (
            <View style={styles.moreTags}>
              <Text style={styles.moreTagsText}>+{item.tags.length - 2} more</Text>
            </View>
          )}
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.statusBadge}>
            <View 
              style={[
                styles.statusDot, 
                { 
                  backgroundColor: 
                    item.status === 'approved' ? '#4CAF50' : 
                    item.status === 'rejected' ? '#F44336' : '#FFC107' 
                }
              ]} 
            />
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            <View style={[styles.statItem, { marginLeft: 12 }]}>
              <Ionicons name="heart-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => handleDeleteDesign(item.id)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={64} color={Colors.light.primary} />
      <Text style={styles.emptyTitle}>No designs yet</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'all' 
          ? 'Upload your first design to get started!'
          : `No ${activeTab} designs found`}
      </Text>
      {activeTab === 'all' && (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => navigation.navigate('UploadDesign')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload Design</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>My Designs</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={22} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search designs..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id as DesignStatus)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Design List */}
      <FlatList
        data={filteredDesigns}
        renderItem={renderDesignItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadDesigns}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* Floating Action Button */}
      {showFAB && (
        <Animated.View 
          style={[
            styles.fabContainer,
            {
              opacity: scrollY.interpolate({
                inputRange: [0, 50],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 100],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => navigation.navigate('UploadDesign')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  searchButton: {
    padding: 8,
  },
  
  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    height: '100%',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  
  // Tabs
  tabsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    position: 'relative',
  },
  activeTab: {
    position: 'relative',
  },
  tabText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: Colors.light.primary,
    fontFamily: 'Montserrat_600SemiBold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  
  // Design List
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  
  // Design Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  price: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: Colors.light.primary,
  },
  category: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#555',
  },
  moreTags: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  moreTagsText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#888',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#4CAF50',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  menuButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  uploadButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  
  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});