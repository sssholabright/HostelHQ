import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'react-native';

// Dummy data for hostel listings including room information
const dummyListings = [
  {
    id: '1',
    name: 'Hostel Alpha',
    address: '123 Alpha St',
    available: true,
    availableRooms: 10,
    images: [
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300/ff0000',
      'https://via.placeholder.com/400x300/00ff00',
    ],
  },
  {
    id: '2',
    name: 'Hostel Beta',
    address: '456 Beta Rd',
    available: false,
    availableRooms: 5,
    images: [
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300/0000ff',
    ],
  },
  {
    id: '3',
    name: 'Hostel Gamma',
    address: '789 Gamma Ave',
    available: true,
    availableRooms: 8,
    images: [
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300/ffff00',
      'https://via.placeholder.com/400x300/00ffff',
    ],
  },
];

const Listing = () => {
  const [hostels, setHostels] = useState(dummyListings);
  const [currentHostelId, setCurrentHostelId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigation = useNavigation();

  const handleEdit = (id) => {
    setCurrentHostelId(id);
    navigation.navigate('HostelUpload', { hostelId: id });
  };

  const toggleAvailability = (id) => {
    setHostels((prevHostels) =>
      prevHostels.map((hostel) =>
        hostel.id === id
          ? { ...hostel, available: !hostel.available }
          : hostel
      )
    );
    Alert.alert('Success', 'Hostel availability updated.');
  };

  const handleSwipe = (hostelId, direction) => {
    setCurrentImageIndex((prevIndices) => {
      const currentIndex = prevIndices[hostelId] || 0;
      const hostel = hostels.find((hostel) => hostel.id === hostelId);
      const imagesCount = hostel ? hostel.images.length : 0;

      return {
        ...prevIndices,
        [hostelId]: direction === 'left'
          ? (currentIndex + 1) % imagesCount
          : (currentIndex - 1 + imagesCount) % imagesCount,
      };
    });
  };

  const renderItem = ({ item }) => {
    const imageIndex = currentImageIndex[item.id] || 0;

    return (
      <View style={styles.item}>
        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 && (
            <View style={styles.carousel}>
              <TouchableOpacity
                onPress={() => handleSwipe(item.id, 'left')}
                style={styles.swipeButton}
              >
                <Ionicons name="chevron-back" size={30} color="#003366" />
              </TouchableOpacity>
              <Image source={{ uri: item.images[imageIndex] }} style={styles.image} />
              <TouchableOpacity
                onPress={() => handleSwipe(item.id, 'right')}
                style={styles.swipeButton}
              >
                <Ionicons name="chevron-forward" size={30} color="#003366" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.availability}>
            {item.available ? 'Available' : 'Not Available'}
          </Text>
          <Text style={styles.roomCount}>
            Available Rooms: {item.availableRooms}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleEdit(item.id)}
          >
            <Ionicons name="pencil" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.toggleButton]}
            onPress={() => toggleAvailability(item.id)}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {item.available ? 'Mark as Unavailable' : 'Mark as Available'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hostel Listings</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('HostelUpload')}
          style={styles.uploadButton}
        >
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={hostels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Add New Hostel"
        onPress={() => navigation.navigate('HostelUpload')}
        color="#003366"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  uploadButton: {
    backgroundColor: '#003366',
    padding: 8,
    borderRadius: 4,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003366',
  },
  item: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  imageContainer: {
    marginBottom: 12,
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  swipeButton: {
    padding: 10,
  },
  details: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  address: {
    fontSize: 16,
    color: '#666',
  },
  availability: {
    fontSize: 16,
    color: '#007bff',
  },
  roomCount: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 4,
  },
  toggleButton: {
    backgroundColor: '#007bff',
    marginLeft: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});

export default Listing;
