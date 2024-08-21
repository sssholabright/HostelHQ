
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../../firebase'; // Adjust the import path as necessary
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons'

export default function TourRequestDetails({ route, navigation }) {
    const { requestId , sta} = route.params;
    const [formData, setFormData] = useState({
        requested_date: '',
        requested_time: '',
        comment: '',
        status: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [notify, setNotify] = useState('')


    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                const requestRef = doc(db, "tour-requests", requestId);
                const docSnap = await getDoc(requestRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    Alert.alert('Error', 'No such request!');
                }
            } catch (error) {
                console.error('Error fetching request details:', error);
                Alert.alert('Error', `An error occurred: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [requestId]);

    const handleEdit = () => {
        if (sta === 'pending') {
            setIsEditing(true)
        } else {
            setIsEditing(false)
            setNotify("Your request has been approved. You can't edit again!")
        }
    } 
    
    const handleInputChange = (name, value) => {
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!auth.currentUser) {
                Alert.alert('Error', 'User is not authenticated.');
                return;
            }

            const updatedData = {
                ...formData,
                requested_date: moment(formData.requested_date, 'MMMM Do YYYY').format('MMMM Do YYYY'),
                requested_time: moment(formData.requested_time, 'LT').format('LT'),
            };

            const requestRef = doc(db, "tour-requests", requestId);
            await setDoc(requestRef, updatedData, {merge: true});

            Alert.alert('Success', 'Tour request updated successfully.');
            navigation.goBack(); // Navigate back to the previous screen
        } catch (error) {
            console.error('Error updating request:', error);
            Alert.alert('Error', `An error occurred: ${error.message}`);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color='#003366' style={styles.loader} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{paddingHorizontal: 0, paddingBottom: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={1}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Request Tour Details</Text>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name='share-outline' size={24} color='#003366' />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontWeight: 'bold', color: '#003366', width: 90}}>Hostel Name: </Text>
                <Text style={{fontWeight: 'bold', color: '#003366', width: 90, fontSize: 20}}>{formData.hostel}</Text>
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontWeight: 'bold', color: '#003366', width: 90}}>Requested Date: </Text>
                <TextInput
                    style={styles.input}
                    value={formData.requested_date}
                    onChangeText={(text) => handleInputChange('requested_date', text)}
                    placeholder="Requested Date (MMMM Do YYYY)"
                    editable={isEditing}
                />
            </View>
                        
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontWeight: 'bold', color: '#003366', width: 90}}>Requested Time: </Text>
                <TextInput
                    style={styles.input}
                    value={formData.requested_time}
                    onChangeText={(text) => handleInputChange('requested_time', text)}
                    placeholder="Requested Time (LT)"
                    editable={isEditing}
                />
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontWeight: 'bold', color: '#003366', width: 90}}>Comment: </Text>
                <TextInput
                    style={styles.input}
                    value={formData.comment}
                    onChangeText={(text) => handleInputChange('comment', text)}
                    placeholder="Comment"
                    multiline
                    numberOfLines={4}
                    textAlignVertical='top'
                    editable={isEditing}
                />
            </View>
            
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text style={{fontWeight: 'bold', color: '#003366'}}>Request Status: </Text>
                <Text style={[{fontWeight: 'bold', textTransform: 'capitalize'}, formData.status === 'pending' ? {color: 'red'} : {color: 'green'}]}>{formData.status}</Text>
            </View>

            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <TouchableOpacity style={{ padding: 10, backgroundColor: '#003366', borderRadius: 5 }} activeOpacity={0.8} onPress={handleSubmit}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Save Changes</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{ padding: 10, backgroundColor: '#003366', borderRadius: 5 }} activeOpacity={0.8} onPress={handleEdit}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Edit</Text>
                    </TouchableOpacity>
                )}
                {notify && <Text style={{color: 'red', marginVertical: 5}}>{notify}</Text>}
                <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, marginTop: 10 }} activeOpacity={0.8} onPress={() => setIsEditing(false)}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },

    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    input: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 8,
        flex: 1,
        borderRadius: 5,
    },
    
    buttonContainer: {
        marginTop: 16,
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
