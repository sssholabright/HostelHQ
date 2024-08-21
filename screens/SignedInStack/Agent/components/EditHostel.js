import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, FlatList, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function EditHostelScreen({ route, navigation }) {
    const { data } = route.params; // Get the hostel ID from route 

    const [hostelName, setHostelName] = useState(data.hostelName);
    const [address, setAddress] = useState(data.address);
    const [description, setDescription] = useState(data.description);
    const [amenities, setAmenities] = useState(data.amenities); // Default value
    const [availability, setAvailability] = useState(data.availability); // Default value
    const [capacity, setCapacity] = useState(data.capacity); // Default empty string
    const [price, setPrice] = useState(data.price);
    const [media, setMedia] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false) 

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



    const handleSubmit = async () => {
        setUploading(true)

        try {
            const update = doc(db, 'hostels', data.hostel_id)
            await setDoc(update, {// Ensure this creates a unique ID
                hostelName: hostelName,
                address: address,
                description: description,
                amenities: amenities,
                price: price,
                capacity: capacity,
                availability: availability  // Assuming 'availability' is a strin 
            }, { merge: true });

        } catch (error) {
            console.error('Error occurred:', error);
            Alert.alert('Error', `An error occurred: ${error.message}`);
        } finally {
            setUploading(false);
            setShowModal(true)
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
                        onChangeText={(text) => setHostelName(text)}
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
                        placeholder="Capacity"
                        keyboardType="numeric"
                        value={capacity}
                        onChangeText={setCapacity}
                    />
                     <TextInput
                        style={styles.input}
                        placeholder="Price"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
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
        width: 60,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
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
