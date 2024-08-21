import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

const FilterScreen = ({ navigation, route }) => {
    const { setPriceRange } = route.params; // Get the function to set price range from params
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const applyFilters = () => {
        setPriceRange({ min: parseFloat(minPrice), max: parseFloat(maxPrice) });
        navigation.goBack(); // Navigate back to the listings screen
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#003366' barStyle={'light-content'} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back' size={24} color='#003366' />
                </TouchableOpacity>
                <Text style={{ color: '#003366', fontSize: 25, fontWeight: '600', paddingHorizontal: 20, marginRight: 20 }}>Filter</Text>
                <View />
            </View>

            <Text style={styles.title}>Filter by Price</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TextInput
                    placeholder="Min Price"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    style={styles.input}
                />
                <View style={{width: 50, marginBottom: 10, borderTopWidth: 1, borderColor: 'gray'}} />
                <TextInput
                    placeholder="Max Price"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    style={styles.input}
                />
            </View>
            <TouchableOpacity onPress={applyFilters} style={styles.button}>
                <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: 'lightgray',
        height: 40,
        width: 120,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    
    button: {
        backgroundColor: '#003366',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default FilterScreen;