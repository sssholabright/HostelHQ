// utils/api.js

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchUserData() {
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
        throw new Error('No authentication token found');
    }

    // Assuming '/api/user-profile/' is the endpoint to fetch user-specific data
    const response = await fetch('http://192.168.89.91:8000/api/users/', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure the content type is correct
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Failed to fetch user data';
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
}

