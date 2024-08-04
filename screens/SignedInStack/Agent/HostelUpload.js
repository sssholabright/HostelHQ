import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, FlatList, ActivityIndicator, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../../../firebase';
import axios from 'axios';

export default function HostelUpload({ navigation }) {
    const [hostelName, setHostelName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState('Amenities'); // Default value
    const [roomType, setRoomType] = useState('Room Type'); // Default value
    const [availability, setAvailability] = useState('Availability'); // Default value
    const [capacity, setCapacity] = useState(''); // Default empty string
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

        if (!result.canceled) {
            setMedia(result.assets);
        } else {
            Alert.alert('Error', 'No images selected.');
        }
    };

    const handleVideoUpload = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
        });

        if (!result.canceled) {
            setMedia([...media, result.assets[0]]);
        } else {
            Alert.alert('Error', 'No video selected.');
        }
    };

    const validateForm = () => {
        if (!hostelName || !address || !description || !amenities || !roomType || !capacity || availability === 'Availability') {
            Alert.alert('Error', 'Please fill in all fields.');
            return false;
        }
        if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
            Alert.alert('Error', 'Capacity should be a positive number.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
    
        try {
            if (!auth.currentUser) {
                Alert.alert('Error', 'User is not authenticated.');
                return;
            }
    
            const token = await auth.currentUser.getIdToken();
    
            // Prepare and upload the hostel information
            const formData = new FormData();
            formData.append('token', token);
            formData.append('uid', auth.currentUser.uid)
            formData.append('hostelName', hostelName);
            formData.append('address', address);
            formData.append('description', description);
            formData.append('amenities', amenities);
            formData.append('roomType', roomType);
            formData.append('roomsAvailable', 3);
            formData.append('price', 189);
            formData.append('capacity', capacity);
            formData.append('availability', availability === 'Available');
    
            setUploading(true);
    
            // Upload the hostel information
            const response = await axios.post('http://192.168.127.91:8000/api/agent-listings/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });
    
            if (response.status === 201) {
                // Upload images
                const imageData = new FormData();
                media.forEach((item, index) => {
                    const uriParts = item.uri.split('.');
                    const fileType = uriParts[uriParts.length - 1];
                    imageData.append('images', {
                        uri: item.uri,
                        type: `image/${fileType}`,
                        name: `image${index}.${fileType}`,
                    });
                });
    
                const imageResponse = await axios.post('http://192.168.127.91:8000/api/upload-images/', imageData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                    },
                });
    
                if (imageResponse.status === 201) {
                    Alert.alert('Success', 'Hostel data and media uploaded successfully!');
                } else {
                    Alert.alert('Error', `Failed to upload images with status: ${imageResponse.status}`);
                }
            } else {
                Alert.alert('Error', `Failed to create listing with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            Alert.alert('Error', `An error occurred: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };    
    

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#003366" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hostel Information Upload</Text>
                    <TouchableOpacity onPress={handleSubmit} style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>Upload</Text>
                    </TouchableOpacity>
                </View>
                
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
                        style={{ ...styles.input, height: 100, paddingVertical: 8 }}
                        placeholder="Description"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <View style={styles.picker}>
                        <Picker selectedValue={amenities} onValueChange={setAmenities}>
                            <Picker.Item label="Amenities" value="Amenities" color='gray' />
                            <Picker.Item label="WiFi" value="WiFi" />
                            <Picker.Item label="Parking" value="Parking" />
                            <Picker.Item label="Gym" value="Gym" />
                            <Picker.Item label="Pool" value="Pool" />
                        </Picker>
                    </View>
                    <View style={styles.picker}>
                        <Picker selectedValue={roomType} onValueChange={setRoomType}>
                            <Picker.Item label="Room Type" value="Room Type" color='gray' />
                            <Picker.Item label="Single" value="Single" />
                            <Picker.Item label="Double" value="Double" />
                            <Picker.Item label="Triple" value="Triple" />
                            <Picker.Item label="Quad" value="Quad" />
                        </Picker>
                    </View>
                    <View style={styles.picker}>
                        <Picker selectedValue={availability} onValueChange={setAvailability}>
                            <Picker.Item label="Availability" value="Availability" color='gray' />
                            <Picker.Item label="Available" value="Available" />
                            <Picker.Item label="Not Available" value="Not Available" />
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Capacity"
                        keyboardType="numeric"
                        value={capacity}
                        onChangeText={setCapacity}
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
                {uploading && (
                    <View style={styles.progressContainer}>
                        <ActivityIndicator size="large" color="#007bff" />
                        <Text style={styles.progressText}>Uploading... {uploadProgress}%</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        padding: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTitle: {
        color: '#003366',
        fontSize: 18,
        fontWeight: 'bold',
    },

    uploadButton: {
        backgroundColor: '#003366',
        padding: 8,
        borderRadius: 4,
    },

    uploadButtonText: {
        color: '#fff',
    },

    form: {
        marginBottom: 16,
        padding: 20,
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

    picker: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 12,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    mediaContainer: {
        marginBottom: 16,
        paddingHorizontal: 20,
    },
  
    mediaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    button: {
        backgroundColor: '#003366',
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
