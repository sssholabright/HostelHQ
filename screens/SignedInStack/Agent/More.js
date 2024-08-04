import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const menuItems = [
    { id: '5', title: 'Profile', icon: 'person' },
    { id: '1', title: 'Listings', icon: 'list' },
    { id: '2', title: 'Revenue', icon: 'cash' },
    { id: '3', title: 'Settings', icon: 'settings' },
    { id: '4', title: 'Guests', icon: 'people' },
    { id: '6', title: 'Feedback', icon: 'chatbubble' },
    { id: '7', title: 'Rate Us', icon: 'star' },
    { id: '8', title: 'Share App', icon: 'share-social' },
    { id: '9', title: 'Terms & Conditions', icon: 'document-text' },
    { id: '10', title: 'Privacy Policy', icon: 'lock-closed' },
];

export default function More ({navigation}) {
    const handlePress = (title) => {    
        navigation.navigate(title);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePress(item.title)} activeOpacity={0.6}>
            <Ionicons name={item.icon} size={24} color="#003366" style={styles.icon} />
            <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={{ padding: 20, backgroundColor: '#003366', marginBottom: 20 }}>
                <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>More</Text>
            </View>
            <FlatList
                data={menuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 8,
        marginHorizontal: 20,
    },

    icon: {
        marginRight: 12,
    },

    itemText: {
        fontSize: 18,
        color: '#333',
    },
});