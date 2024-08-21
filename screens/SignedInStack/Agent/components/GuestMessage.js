import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, StatusBar, Linking } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';


export default function GuestMessage({ navigation }) {
    const handleSendMessage = () => {
        // Send message should navige to the user's chat screen
        navigation.navigate('ChatScreen');
    };

    const handleEmailGuest = () => {
        Linking.openURL('mailto: ' + '');
    };

    const handleViewMessages = () => {
        navigation.navigate('ChatScreen');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#fff' />
            <View style={{ padding: 20, paddingVertical: 10, marginBottom: 20, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={{ color: '#003366', fontSize: 20, fontWeight: 'bold' }}>Contact Guest</Text>
                <View style={{ backgroundColor: '#fff',  padding: 8 }} />
            </View>
            
            <View style={styles.header}>
                <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.profileImage} />
                <Text style={styles.guestName}>Jane Doe</Text>
                <Text style={styles.guestInfo}>janedoe@example.com</Text>
                <Text style={styles.guestInfo}>123-456-7890</Text>
            </View>

            <View style={styles.contactOptions}>
                <TouchableOpacity style={styles.optionButton} onPress={handleEmailGuest}>
                    <Ionicons name="mail" size={24} color="#ffffff" />
                    <Text style={styles.optionText}>Email Guest</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={handleViewMessages}>
                    <MaterialIcons name="message" size={24} color="#ffffff" />
                    <Text style={styles.optionText}>View Messages</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.messageSection}>
                <Text style={styles.sectionTitle}>Send a New Message</Text>
                <TextInput
                    style={styles.messageInput}
                    multiline
                    placeholder="Type your message here..."
                    placeholderTextColor="#6c757d"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Send Message</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f8f9fa',
    },
  
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
  
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#003366',
        marginBottom: 10,
    },
  
    guestName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#343a40',
    },

    guestInfo: {
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 4,
    },
    
    contactOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginHorizontal: 20,
    },
    
    optionButton: {
        backgroundColor: '#003366',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
  
    optionText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
  
    messageSection: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginHorizontal: 20,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
  
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#003366',
        marginBottom: 12,
    },
  
    messageInput: {
        height: 150,
        backgroundColor: '#f1f3f4',
        borderRadius: 8,
        padding: 12,
        borderColor: '#ced4da',
        borderWidth: 1,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    
    sendButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    
    sendButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

