import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { arrayUnion, doc, updateDoc, getDoc, setDoc, onSnapshot, query, where, collection } from 'firebase/firestore';
import { db } from '../../../../firebase';

const RoomManagement = ({ route }) => {
  const [hostelName, setHostelName] = useState('');

  const { item } = route.params;

  // Function to add a user to a community with their data
  async function addToCommunity(hostelId, clientId, userData) {
    const communityRef = doc(db, 'community-chats', hostelId);

    try {
      const communityDoc = await getDoc(communityRef);

      if (!communityDoc.exists()) {
        // If the community document does not exist, create it with the user's data
        await setDoc(communityRef, {
          members: [{ clientId, ...userData }],
        });
        console.log(`Community ${hostelId} created and user ${clientId} added.`);
      } else {
        // If the document exists, update it with the user's data
        const existingMembers = communityDoc.data().members || [];

        // Check if the user is already in the community
        const isUserAlreadyMember = existingMembers.some(member => member.clientId === clientId);

        if (!isUserAlreadyMember) {
          await updateDoc(communityRef, {
            members: arrayUnion({ clientId, ...userData }),
          });
          console.log(`User ${clientId} added to existing community ${hostelId}.`);
        } else {
          console.log(`User ${clientId} is already a member of community ${hostelId}.`);
        }
      }

      Alert.alert('Success', 'User successfully added to the community!');
    } catch (error) {
      console.error('Error adding user to community: ', error);
      Alert.alert('Error', 'There was a problem adding the user to the community.');
    }
  }

  // Function to monitor booking confirmations and add users to communities
  function monitorBookings() {
    const q = query(collection(db, 'bookings'), where('paymentStatus', '==', 'pending'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const bookingData = doc.data();
        if (bookingData && bookingData.hostelId && bookingData.clientId) {
          // Include user's data such as name and email when adding to the community
          const userData = {
            chatId: bookingData.bookingId,
            clientName: bookingData.clientName,
            clientId: bookingData.clientId // Add more fields as needed
          };
          addToCommunity(bookingData.hostelId, bookingData.clientId, userData);
        }
      });
    });

    return unsubscribe;
  }

  const handleMonitorBookings = () => {
    // Call this function when the button is clicked
    const unsubscribe = monitorBookings();

    // Optionally, you could store `unsubscribe` in state and use it later to stop monitoring if needed
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hostel Information Upload</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Hostel Name"
          value={hostelName}
          onChangeText={setHostelName}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleMonitorBookings}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default RoomManagement;
