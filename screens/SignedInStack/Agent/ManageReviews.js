import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const dummyReviews = [
  {
    id: '1',
    guestName: 'John Doe',
    date: '2023-06-15',
    review: 'Great stay, very comfortable! The staff was friendly and helpful.',
    rating: 5,
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    date: '2023-07-20',
    review: 'Good location, but room was a bit noisy. Overall, okay experience.',
    rating: 3,
  },
  {
    id: '3',
    guestName: 'Emily Johnson',
    date: '2023-08-12',
    review: 'Excellent facilities and very clean. Will definitely stay again!',
    rating: 4,
  },
];

const ManageReviews = () => {
  const handleRespondToReview = (reviewId) => {
    Alert.alert('Respond to Review', `Functionality to respond to review ${reviewId} goes here.`);
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.guestName}>{item.guestName}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <Text style={styles.reviewText}>{item.review}</Text>
      <Text style={styles.reviewRating}>
        Rating: <Text style={styles.ratingValue}>{item.rating}</Text> <FontAwesome5 name="star" size={14} color="#ffd700" />
      </Text>
      <TouchableOpacity
        style={styles.respondButton}
        onPress={() => handleRespondToReview(item.id)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="reply" size={24} color="#ffffff" />
        <Text style={styles.respondButtonText}>Respond</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Reviews</Text>
      <FlatList
        data={dummyReviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.reviewList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007bff',
    marginBottom: 16,
  },
  reviewList: {
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: width * 0.9, // Responsive width
    alignSelf: 'center', // Centering the card
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  guestName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
  },
  reviewDate: {
    fontSize: 14,
    color: '#6c757d',
  },
    
  reviewText: {
        fontSize: 16,
        color: '#495057',
        marginBottom: 8,
    },
    
    reviewRating: {
        fontSize: 16,
        color: '#007bff',
        marginBottom: 12,
    },
  
    ratingValue: {
        fontWeight: 'bold',
    },
  
    respondButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ffffff',
        borderWidth: 1,
    },
    
    respondButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default ManageReviews;
