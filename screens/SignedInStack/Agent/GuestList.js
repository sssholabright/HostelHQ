import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

// Dummy data
const guests = [
  {
    id: '1',
    name: 'Jane Doe',
    bookingDate: '2024-07-20',
    roomType: 'Single',
    contact: 'jane@example.com',
    image: 'https://placekitten.com/200/200',
  },
  {
    id: '2',
    name: 'John Smith',
    bookingDate: '2024-07-22',
    roomType: 'Double',
    contact: 'john@example.com',
    image: 'https://placekitten.com/200/201',
  },
];

const GuestList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Booking Date: {item.bookingDate}</Text>
        <Text style={styles.details}>Room Type: {item.roomType}</Text>
        <Text style={styles.details}>Contact: {item.contact}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={guests}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: '#333',
  },
});

export default GuestList;
