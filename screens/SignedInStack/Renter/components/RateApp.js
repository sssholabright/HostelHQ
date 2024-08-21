import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../../../firebase'

export default function RateApp({ navigation }) {
    // State to manage the rating and review
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    // Function to handle star press
    const handleStarPress = (value) => {
        setRating(value);
    };

    // Function to handle review submission
    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a rating before submitting.');
            return;
        }
        
        
        // You can implement the logic to save the rating and review here
        // For example, send it to your backend or Firebase
        const docRef = doc(db, "ratings", auth.currentUser.uid) 
        setDoc(docRef, {
            id: auth.currentUser.uid,
            rating: rating,
            review: review,
            timestamp: new Date(),
        }, {merge: true});
    
        
        Alert.alert('Success', 'Thank you for your feedback!');
        // Reset the form
        setRating(0);
        setReview('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={{ paddingHorizontal: 0, paddingBottom: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#003366' }}>Rate Our App</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginHorizontal: 50 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} activeOpacity={0.9} onPress={() => handleStarPress(star)}>
                        <Ionicons
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={30}
                            color={star <= rating ? 'orange' : 'gray'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ marginTop: 50 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'gray' }}>Add detailed review</Text>
                <TextInput
                    style={{ backgroundColor: 'whitesmoke', fontWeight: 'bold', borderRadius: 5, padding: 10, marginTop: 10, marginHorizontal: 30 }}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical='top'
                    value={review}
                    onChangeText={(text) => setReview(text)}
                />
            </View>
            <TouchableOpacity
                style={{ position: 'absolute', bottom: 30, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 25 }}
                activeOpacity={0.9}
                onPress={handleSubmit}
            >
                <Text style={{ color: '#fff', fontWeight: '500' }}>Submit</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
});
