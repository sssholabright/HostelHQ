import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const guestData = {
    Hostel1: [
        { id: '1', name: 'Jane Doe' },
        { id: '2', name: 'John Smith' },
    ],
    
    Hostel2: [
        { id: '3', name: 'Alice Johnson' },
        { id: '4', name: 'Bob Brown' },
    ],
};

  
export default function GuestHostel({navigation}) {
    const [selectedHostel, setSelectedHostel] = useState('');
    const [selectedGuest, setSelectedGuest] = useState('');

    const handleHostelChange = (hostel) => {
        setSelectedHostel(hostel);
        setSelectedGuest(''); // Reset guest selection when hostel changes
    };

    const handleGuestChange = (guest) => {
        setSelectedGuest(guest);
    };

    const selectGuest = () => {
        if (!selectedGuest) {
            Alert.alert('Error', 'Please select a guest.');
        return;
        }
        navigation.navigate('GuestProfile', { guestName: selectedGuest });
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <View style={{ padding: 20, paddingVertical: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={{ color: '#003366', fontSize: 20, fontWeight: 'bold' }}>Guest Management</Text>
                <View style={{ backgroundColor: '#fff',  padding: 8 }} />
            </View>
            
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Hostel:</Text>
                <Picker
                    selectedValue={selectedHostel}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleHostelChange(itemValue)}>
                        {Object.keys(guestData).map((hostel) => (
                            <Picker.Item key={hostel} label={hostel} value={hostel} />
                        ))}
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Guest:</Text>
                <Picker
                    selectedValue={selectedGuest}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleGuestChange(itemValue)}
                    enabled={selectedHostel ? true : false}> 
                    {guestData[selectedHostel]?.map((guest) => (
                        <Picker.Item key={guest.id} label={guest.name} value={guest.name} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={selectGuest}>
                <Text style={styles.buttonText}>Show Selected Guest</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
  
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366'
    },
  
    pickerContainer: {
        marginVertical: 10,
        paddingHorizontal: 20
    },
  
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#003366'
    },
  
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
  
    button: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
