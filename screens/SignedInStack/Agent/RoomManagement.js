import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const RoomManagement = () => {
  const [hostelName, setHostelName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState('');
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [rate, setRate] = useState('');
  const [availability, setAvailability] = useState('');
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permission to access media library is required!');
      return false;
    }
    return true;
  };

  const handleImageUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setMedia(result.assets);
    }
  };

  const handleVideoUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.cancelled) {
      setMedia([...media, result.assets[0]]);
    }
  };

  const validateForm = () => {
    if (!hostelName || !address || !description || !amenities || !roomType || !capacity || !rate || !availability) {
      Alert.alert('Error', 'Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);
    try {
      const hostelResponse = await uploadHostelData({
        hostelName,
        address,
        description,
        amenities,
        roomType,
        capacity,
        rate,
        availability,
      });

      if (hostelResponse.success) {
        for (const file of media) {
          await uploadMedia(file.uri);
        }
        Alert.alert('Success', 'Hostel data and media uploaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload hostel data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
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
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Amenities"
          value={amenities}
          onChangeText={setAmenities}
        />
        <TextInput
          style={styles.input}
          placeholder="Room Type"
          value={roomType}
          onChangeText={setRoomType}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacity"
          keyboardType="numeric"
          value={capacity}
          onChangeText={setCapacity}
        />
        <TextInput
          style={styles.input}
          placeholder="Rate"
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
        />
        <TextInput
          style={styles.input}
          placeholder="Availability"
          value={availability}
          onChangeText={setAvailability}
        />
      </View>

      <View style={styles.mediaContainer}>
        <Text style={styles.mediaTitle}>Upload Photos and Videos</Text>
        <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Upload Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleVideoUpload}>
          <Text style={styles.buttonText}>Upload Videos</Text>
        </TouchableOpacity>
        {media.length > 0 && (
          <FlatList
            data={media}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <Image source={{ uri: item.uri }} style={styles.mediaImage} />
            )}
            numColumns={3}
          />
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {uploading && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.progressText}>Uploading... {uploadProgress}%</Text>
        </View>
      )}
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
  mediaContainer: {
    marginBottom: 16,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mediaImage: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
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
  },
  progressContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    color: '#007bff',
  },
});

export default RoomManagement