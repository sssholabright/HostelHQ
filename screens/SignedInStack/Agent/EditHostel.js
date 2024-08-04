import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, FlatList, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { auth } from '../../../firebase';
import axios from 'axios';

export default function EditHostelScreen({ route, navigation }) {
    const { id } = route.params; // Get the hostel ID from route 

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
    const [hostelData, setHostelData] = useState(null);
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const fetchHostelData = async () => {
            try {
                const token = await auth.currentUser.getIdToken();
                const response = await axios.get(`http://192.168.127.91:8000/api/agent-listings/${id}/`);
                const data = response.data;
                setHostelData(data);
                setHostelName(data.hostelName);
                setAddress(data.address);
                setDescription(data.description);
                setAmenities(data.amenities);
                setRoomType(data.roomType);
                setAvailability(data.availability ? 'Available' : 'Not Available');
                setCapacity(data.capacity)
                // Load existing media if any
                // You might need to handle this depending on how you manage media in your backend
            } catch (err) {
                console.error(err.message);
                Alert.alert('Error', 'Failed to fetch hostel data');
            }
        };

        fetchHostelData();
    }, [id]);

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
            formData.append('hostelName', hostelName);
            formData.append('address', address);
            formData.append('description', description);
            formData.append('amenities', amenities);
            formData.append('roomType', roomType);
            formData.append('capacity', capacity);
            formData.append('availability', availability === 'Available');

            setUploading(true);

            // Update the hostel information
            const response = await axios.put(`http://192.168.127.91:8000/api/agent-listings/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });

            if (response.status === 200) {
                // Upload images if any
                if (media.length > 0) {
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
                        setShowModal(true)
                    } else {
                        Alert.alert('Error', `Failed to upload images with status: ${imageResponse.status}`);
                    }
                } else {
                    setShowModal(true)
                }
            } else {
                Alert.alert('Error', `Failed to update listing with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            Alert.alert('Error', `An error occurred: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    if (!hostelData) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#003366" />
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#003366" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Hostel Information</Text>
                    <TouchableOpacity onPress={handleSubmit} style={styles.uploadButton}>
                        {uploading ? <ActivityIndicator size={"small"} color="#fff" /> :
                        <Text style={styles.uploadButtonText}>Update</Text>}
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
                <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Hostel Updated</Text>
                        <Text style={styles.modalMessage}>Your hostels has been updated successfully</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.modalButton}
                            onPress={() => {
                                setShowModal(false);
                                navigation.goBack(); 
                            }}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

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
        marginLeft: -30
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

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 15,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#003366',
        paddingVertical: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 15,
    },
});
