import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Modal, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, StatusBar, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';

const HostelsScreen = ({ navigation }) => {
    const [hostels, setHostels] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedHostelId, setSelectedHostelId] = useState(null);

    useEffect(() => {
        const fetchUserHostels = async () => {
            try {
                const id = auth.currentUser.uid;
                const q = query(collection(db, 'hostels'), where("agent_id", "==", id));
                onSnapshot(q, (snapshot) => {
                    const data = [];
                    snapshot.forEach((doc) => {
                        data.push({ id: doc.id, ...doc.data() });
                    });
                    setHostels(data);
                });
            } catch (error) {
                console.error(error.message);
                Alert.alert("Error fetching Hostels");
            } finally {
                setLoading(false);
            }
        };
        fetchUserHostels();
    }, []);

    const handleDelete = async (id) => {
        const unsub = doc(db, "hostels", id);
        const docSnap = await getDoc(unsub);
        if (!docSnap.exists()) {
            Alert.alert('Error', 'Hostel not found.');
            return;
        }
        try {
            console.log(id);
            // await deleteDoc(unsub)
        } catch (error) {
            Alert.alert("Error deleting Hostel", error.message);
        } finally {
            setIsModalVisible(false);
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

    const openDeleteModal = (id) => {
        setSelectedHostelId(id);
        setIsModalVisible(true);
    };

    const renderItem = ({ item }) => {
        const imageIndex = currentImageIndex[item.id] || 0;
        const currentImage = item.images && item.images[imageIndex] ? { uri: item.images[imageIndex] } : require('../../../../assets/bg-img.jpg');

        return (
            <View key={item.id} style={styles.item}>
                <View style={styles.imageContainer}>
                        <ImageBackground source={currentImage} style={styles.image}>
                    <View style={styles.carousel}>
                        <TouchableOpacity onPress={() => handleSwipe(item.id, 'left')} style={styles.swipeButton}>
                            <Ionicons name="chevron-back" size={30} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSwipe(item.id, 'right')} style={styles.swipeButton}>
                            <Ionicons name="chevron-forward" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                        </ImageBackground>
                </View>

                <View style={styles.details}>
                    <Text style={styles.name}>{item.hostelName}</Text>
                    <Text style={styles.address}>{item.address}</Text>
                    <Text style={styles.availability}>{item.available ? 'Available' : 'Not Available'}</Text>
                    <Text style={styles.roomCount}>Available Rooms: {item.capacity}</Text>
                    <Text style={styles.price}>N{item.price}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditHostel', { data: item })}>
                        <Ionicons name="pencil" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => openDeleteModal(item.hostel_id)}>
                        <Ionicons name="trash" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>

                {selectedHostelId === item.id && (
                    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Delete Hostel</Text>
                                <Text style={styles.modalMessage}>Are you sure you want to delete this hostel?</Text>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                                    <Text style={styles.modalButtonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#003366" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hostel Listings</Text>
                <TouchableOpacity onPress={() => navigation.navigate('HostelUpload')} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Add Hostel</Text>
                </TouchableOpacity>
            </View>
            {hostels.length > 0 ? (
                <FlatList
                    data={hostels}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.emptyMessage}>No hostels found.</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
    },
     header: {
        padding: 20,
        paddingVertical: 10,
        backgroundColor: '#003366',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    uploadButton: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4,
        marginLeft: -50
    },

    uploadButtonText: {
        color: '#003366',
        fontWeight: '500'
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 10,
        overflow: 'hidden',
        elevation: 2,
        marginHorizontal: 20,
    },
    imageContainer: {
        height: 200,
    },
    carousel: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    swipeButton: {
        padding: 10,
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        height: '100%',
        resizeMode: 'cover',
    },
    details: {
        padding: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#003366',
    },
    address: {
        fontSize: 16,
        color: '#777',
        marginVertical: 5,
    },
    availability: {
        fontSize: 16,
        color: '#009688',
    },
    roomCount: {
        fontSize: 16,
        color: '#003366',
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#003366',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#003366',
    },
    buttonText: {
        marginLeft: 5,
        color: '#fff',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#003366',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#003366',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 18,
        color: '#555',
        marginTop: 20,
    },
});

export default HostelsScreen;
