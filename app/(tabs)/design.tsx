import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

// Define a type for Design for better type safety
interface DesignItem {
  id: number;
  name: string;
  category: string;
  image: any; // For require('../../assets/...')
  price: number;
  rating: number; // Initial rating
}

// Tumia picha zako za assets kwa icons za miduara
const categories = [
  { key: 'Kitchen', label: 'Kitchen', icon: require('../../assets/kitchen.jpg') },
  { key: 'Bedroom', label: 'Bedroom', icon: require('../../assets/bedroom.jpg') },
  { key: 'Livingroom', label: 'Livingroom', icon: require('../../assets/livingroom.jpg') },
  { key: 'Washingroom', label: 'Washingroom', icon: require('../../assets/washingroom.jpg') },
];

// Define specific gradient colors for each category
const categoryColorsMap: Record<string, string[]> = {
  Kitchen: ['#6DD5ED', '#2193B0'], // Light Blue to Darker Blue
  Bedroom: ['#83F57B', '#0CBF30'], // Light Green to Darker Green
  Livingroom: ['#FDC830', '#F37335'], // Yellow to Orange
  Washingroom: ['#BB377D', '#C84E89'], // Purple-Pink to Darker Pink
};

// Kila design ina price na RATING MPYA
const initialDesigns: DesignItem[] = [
  { id: 1, name: 'Modern Kitchen', category: 'Kitchen', image: require('../../assets/kitchen.jpg'), price: 1000, rating: 4.5 },
  { id: 2, name: 'Classic Kitchen', category: 'Kitchen', image: require('../../assets/kitchen.jpg'), price: 1200, rating: 4.0 },
  { id: 3, name: 'Cozy Bedroom', category: 'Bedroom', image: require('../../assets/bedroom.jpg'), price: 900, rating: 4.8 },
  { id: 4, name: 'Modern Bedroom', category: 'Bedroom', image: require('../../assets/bedroom.jpg'), price: 1100, rating: 4.2 },
  { id: 5, name: 'Elegant Livingroom', category: 'Livingroom', image: require('../../assets/livingroom.jpg'), price: 1300, rating: 5.0 },
  { id: 6, name: 'Modern Livingroom', category: 'Livingroom', image: require('../../assets/livingroom.jpg'), price: 1500, rating: 4.7 },
  { id: 7, name: 'Classic Washingroom', category: 'Washingroom', image: require('../../assets/washingroom.jpg'), price: 800, rating: 3.9 },
  { id: 8, name: 'Modern Washingroom', category: 'Washingroom', image: require('../../assets/washingroom.jpg'), price: 1000, rating: 4.3 },
];

// Msaidizi wa kuonyesha nyota na kuzifanya zibonyezeke
const renderInteractiveStars = (currentRating: number, onStarPress: (newRating: number) => void) => {
  const stars = [];
  const maxStars = 5;

  for (let i = 1; i <= maxStars; i++) {
    let iconName: 'star' | 'star-half' | 'star-outline' = 'star-outline';
    let iconColor = '#CCCCCC'; // Default empty star color

    if (i <= currentRating) {
      iconName = 'star';
      iconColor = '#FFD700'; // Full star color (Gold)
    } else if (i - 0.5 === currentRating) {
      iconName = 'star-half';
      iconColor = '#FFD700'; // Half star color (Gold)
    }

    stars.push(
      <TouchableOpacity key={`star-${i}`} onPress={() => onStarPress(i)} activeOpacity={0.7}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </TouchableOpacity>
    );
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
};

export default function Design() {
  const [selectedCategory, setSelectedCategory] = useState('Kitchen');
  const [selectedDesigns, setSelectedDesigns] = useState<DesignItem[]>([]);
  // State to hold user-modified ratings for designs
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});

  const router = useRouter();

  // Initialize userRatings from initialDesigns on component mount
  useEffect(() => {
    const initialUserRatings: { [key: number]: number } = {};
    initialDesigns.forEach(design => {
      initialUserRatings[design.id] = design.rating;
    });
    setUserRatings(initialUserRatings);
  }, []);

  // Filter designs by selected category
  const filteredDesigns = initialDesigns.filter(d => d.category === selectedCategory);

  // Handle design select/deselect
  const toggleSelectDesign = (design: DesignItem) => {
    setSelectedDesigns(prev =>
      prev.some(d => d.id === design.id) // Check if already selected by ID
        ? prev.filter(d => d.id !== design.id) // Remove if already selected
        : [...prev, design] // Add if not selected
    );
  };

  // Handle user rating change for a specific design
  const handleRatingChange = (designId: number, newRating: number) => {
    setUserRatings(prevRatings => ({
      ...prevRatings,
      [designId]: newRating,
    }));
  };

  // Calculate total payment
  const totalPayment = selectedDesigns.reduce((sum, d) => sum + d.price, 0);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    // Main container with a gradient background
    <LinearGradient
      colors={['#E8EEF8', '#DAE4F0']} // Subtle light blue-grey gradient for background
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Enhanced Title with its own gradient background */}
      <LinearGradient
        colors={['#4A90E2', '#347DCF']} // A vibrant blue gradient for the title background
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleBackground}
      >
        <Text style={styles.title}>Design Showcase Styles</Text>
      </LinearGradient>

      {/* Categories as circles */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map(cat => {
          // Get colors for this category
          const colors = categoryColorsMap[cat.key] || ['#FF7F50', '#FF6347'];
          
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={styles.categoryBtn}
              activeOpacity={0.7}
            >
              <LinearGradient
                // Dynamic colors based on category and active state
                colors={selectedCategory === cat.key ? colors : ['#FFFFFF', '#F8F8F8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.categoryCircle,
                  selectedCategory === cat.key ? styles.categoryCircleActive : styles.categoryCircleInactive,
                ]}
              >
                <Image
                  source={cat.icon}
                  style={styles.categoryIcon}
                />
              </LinearGradient>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === cat.key && styles.categoryLabelActive,
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Images for selected category */}
      <ScrollView contentContainerStyle={styles.designGridContainer}>
        <View style={styles.designGrid}>
          {filteredDesigns.length === 0 ? (
            <Text style={styles.noDesigns}>No designs found for this category.</Text>
          ) : (
            filteredDesigns.map((design: DesignItem) => { // Explicitly type design here
              const isSelected = selectedDesigns.some(d => d.id === design.id);
              const currentDesignRating = userRatings[design.id] || design.rating; // Get user-modified rating or default

              return (
                <TouchableOpacity
                  key={design.id}
                  onPress={() => toggleSelectDesign(design)}
                  style={[
                    styles.designCard,
                    isSelected && styles.designCardSelected,
                  ]}
                  activeOpacity={0.8}
                >
                  <Image source={design.image} style={styles.designImage} />
                  <View style={styles.designInfo}>
                    <Text style={styles.designName}>{design.name}</Text>
                    <View style={styles.priceRatingContainer}>
                      <Text style={styles.designPrice}>Tsh {design.price.toLocaleString()}</Text>
                      {/* Render interactive stars here */}
                      {renderInteractiveStars(currentDesignRating, (newRating) => handleRatingChange(design.id, newRating))}
                    </View>
                  </View>
                  {/* Tick icon with gradient */}
                  {isSelected && (
                    <LinearGradient
                      colors={['#4CAF50', '#6FCF97']} // Green gradient for the tick
                      style={styles.tickIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.tickIconText}>✓</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Book button section */}
      {selectedDesigns.length > 0 && (
        <View style={styles.bookSection}>
          <Text style={styles.totalText}>
            Total: <Text style={styles.totalAmount}>Tsh {totalPayment.toLocaleString()}</Text>
          </Text>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() =>
              router.push({
                pathname: '/booking',
                params: { designs: JSON.stringify(selectedDesigns), total: totalPayment },
              })
            }
          >
            {/* Book button with gradient */}
            <LinearGradient
              colors={['#487eb0', '#273c75']} // Blue gradient for the book button
              style={styles.bookBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.bookBtnText}>Book Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40, // Space for status bar
    backgroundColor: Colors.light.background,
  },
  titleBackground: {
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    alignSelf: 'center',
    width: '95%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.light.primary,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Montserrat_700Bold',
  },
  categoryScroll: {
    marginBottom: 35,
    paddingLeft: 4,
  },
  categoryBtn: {
    alignItems: 'center',
    marginRight: 30,
  },
  categoryCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#535C68',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
  },
  categoryCircleActive: {
    // Border color will now match the gradient's general hue
    borderColor: 'rgba(255,255,255,0.6)', // White border on active gradient for pop
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryCircleInactive: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
  },
  categoryIcon: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  categoryLabel: {
    color: Colors.light.textSecondary,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
    fontFamily: 'Montserrat_400Regular',
  },
  categoryLabelActive: {
    color: Colors.light.primary, // Use a color that complements the active gradient, e.g., a darker blue
    fontWeight: 'bold',
  },
  designGridContainer: {
    paddingBottom: 120,
  },
  designGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  designCard: {
    width: (width - 48) / 2,
    marginBottom: 22,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    elevation: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    overflow: 'hidden',
    borderWidth: 0,
    position: 'relative',
  },
  designCardSelected: {
    borderWidth: 4,
    borderColor: Colors.light.primary,
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 12,
  },
  designImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  designInfo: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  designName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    marginBottom: 4,
    fontFamily: 'Montserrat_700Bold',
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  designPrice: {
    fontSize: 17,
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
  tickIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  tickIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  noDesigns: {
    textAlign: 'center',
    marginTop: 80,
    width: '100%',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    fontFamily: 'Montserrat_400Regular',
  },
  bookSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    paddingVertical: 25,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: Colors.light.textPrimary,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  totalText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: Colors.light.textPrimary,
    fontFamily: 'Montserrat_700Bold',
  },
  totalAmount: {
    color: Colors.light.primary,
    fontWeight: '900',
    fontSize: 26,
    fontFamily: 'Montserrat_700Bold',
  },
  bookBtn: {
    width: '75%',
    borderRadius: 35,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  bookBtnGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat_700Bold',
  },
});