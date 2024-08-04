import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, StatusBar, Button, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../firebase';
import axios from 'axios';

export default function Listing({navigation}) {
    const [hostels, setHostels] = useState([]);
    const [currentHostelId, setCurrentHostelId] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserHostels = async() => {
            try {
                const id = auth.currentUser.uid;

                const response = await axios.get('http://192.168.127.91:8000/api/agent-listings/')
                const data = response.data;
                const filteredHostels = data.filter(hostel => hostel.uid === id)
                if (filteredHostels.length === 0) {
                    return (
                        <View>
                            <Text>No Listings </Text>
                        </View>
                    )
                } 
                setHostels(filteredHostels)
            } catch (error) {
                console.error(error.message)
                Alert.alert("Error fetching Hostels")
            } finally {
                setLoading(false)
            }
        }
        fetchUserHostels()
    }, [])
    
    const toggleAvailability = async (id) => {
        try {
            // Optimistically update the state
            setHostels((prevHostels) =>
                prevHostels.map((hostel) =>
                    hostel.id === id
                        ? { ...hostel, available: !hostel.available }
                        : hostel
                )
            );
    
            // Get the authentication token
            const token = await auth.currentUser.getIdToken();
    
            // Send request to update availability in the backend
            const response = await axios.put(`http://192.168.127.91:8000/api/agent-listings/${id}/availability/`, {
                available: !hostels.find(hostel => hostel.id === id).available,
            }, {
            });
    
            if (response.status === 200) {
                Alert.alert('Success', 'Hostel availability updated.');
            } else {
                throw new Error(`Failed to update availability with status: ${response.status}`);
            }
        } catch (error) {
            // Rollback state update if API call fails
            setHostels((prevHostels) =>
                prevHostels.map((hostel) =>
                    hostel.id === id
                        ? { ...hostel, available: !hostel.available }
                        : hostel
                )
            );
            Alert.alert('Error', `Failed to update availability: ${error.message}`);
        }
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
                            <TouchableOpacity onPress={() => handleSwipe(item.id, 'left')} style={styles.swipeButton}>
                                <Ionicons name="chevron-back" size={30} color="#003366" />
                            </TouchableOpacity>
                            <Image source={{ uri: item.images[imageIndex] }} style={styles.image} />
                            <TouchableOpacity onPress={() => handleSwipe(item.id, 'right')} style={styles.swipeButton}>
                                <Ionicons name="chevron-forward" size={30} color="#003366" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.details}>
                    <Text style={styles.name}>{item.hostelName}</Text>
                    <Text style={styles.address}>{item.address}</Text>
                    <Text style={styles.availability}>{item.available ? 'Available' : 'Not Available'}</Text>
                    <Text style={styles.roomCount}>Available Rooms: {item.roomsAvailable}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditHostel', {id: item.id})}>
                        <Ionicons name="pencil" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.toggleButton]} onPress={() => toggleAvailability(item.id)}>
                        <Ionicons name="refresh" size={20} color="#fff" />
                        <Text style={styles.buttonText}>{item.available ? 'Mark as Unavailable' : 'Mark as Available'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hostel Listings</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HostelUpload')} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Add Hostel</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={hostels}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshing={false}
                onRefresh={() => setHostels(hostels)}
                showsVerticalScrollIndicator={false}
            />
        </View>
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
        marginLeft: -50
    },

    uploadButtonText: {
        color: '#fff',
    },
    
    item: {
        padding: 16,
        margin: 20,
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
