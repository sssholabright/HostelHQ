import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, FlatList, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function HostelUpload({ navigation }) {
    const [hostelName, setHostelName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState('Amenities'); // Default value
    const [availability, setAvailability] = useState('Availability'); // Default value
    const [capacity, setCapacity] = useState(''); // Default empty string
    const [media, setMedia] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [price, setPrice] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

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
            setError('Error', 'No images selected.');
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
            setError('Error', 'No video selected.');
        }
    };

    const validateForm = () => {
        if (!hostelName || !address || !description || !amenities || !capacity || availability === 'Availability') {
            setError('Please fill in all fields.');
            return false;
        }
        if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
            setError('Capacity should be a positive number.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        // Validate the form before proceeding
        if (!validateForm()) return;
        
        try {
            // Check if the user is authenticated
            if (!auth.currentUser) {
                setError('Error', 'User is not authenticated.');
                return;
            }
            
            // Set uploading state to true
            setUploading(true);
    
            // Prepare data to be uploaded
            const Data = {
                agent_id: auth.currentUser.uid,
                hostel_id: `${auth.currentUser.uid}-${hostelName}`,  // Ensure this creates a unique ID
                hostelName: hostelName,
                address: address,
                description: description,
                amenities: amenities,
                price: price,
                capacity: capacity,
                availability: availability // Assuming 'availability' is a string
            };
    
            // Upload data to Firestore
            const uploadRef = doc(db, "hostels", `${auth.currentUser.uid}-${hostelName}`);
            await setDoc(uploadRef, Data);
    
            // Show success modal
            setShowModal(true);
        } catch (error) {
            // Log and display error
            console.error('Error occurred:', error);
            setError('Error', `An error occurred: ${error.message}`);
        } finally {
            // Reset uploading state
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
                    {uploading ? (
                        <ActivityIndicator size="small" color="#fff" />) : (
                        <Text style={styles.uploadButtonText}>Upload</Text>)}
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
                        <Picker selectedValue={availability} onValueChange={setAvailability}>
                            <Picker.Item label="Availability" value="Availability" color='gray' />
                            <Picker.Item label="Available" value="Available" />
                            <Picker.Item label="Not Available" value="Not Available" />
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Rooms Available"
                        keyboardType="numeric"
                        value={capacity}
                        onChangeText={setCapacity}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={(text) => setPrice(text)}
                    />
                    {error && <Text style={styles.error}>{error}</Text>}
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
                
            </ScrollView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Modal visible={showModal} transparent={true} animationType="slide">
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center'}}>
                            <Ionicons name="checkmark-circle" size={100} color="#003366" />
                            <Text style={{fontSize: 20, color: '#003366', fontWeight: 'bold', marginBottom: 20}}>Hostel Uploaded</Text>
                            <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={() => [setShowModal(false), navigation.goBack()]}>
                                <Text style={{color: '#fff', fontSize: 16}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
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
        width: 60,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginLeft: -20
    },

    uploadButtonText: {
        color: '#fff',
        fontWeight: '500'
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

    error: {
        color: '#FF0000',
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
    }
});
