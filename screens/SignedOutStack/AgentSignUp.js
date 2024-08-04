import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import axios from 'axios'; // Ensure you have axios installed
import { auth, db } from '../../firebase';

export default function AgentSignup({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passError, setPassError] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (password !== confirmPassword) {
            setPassError('Passwords do not match');
        } else {
            setPassError('');
        }
        setDisabled(!(email && password && confirmPassword && password === confirmPassword));
    }, [email, password, confirmPassword]);

    const handleRegister = async () => {
        try {
            setLoading(true);
            
            // Register the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Register Response:', user);

            // Save the user profile to Firestore
            const userProfile = {
                email: email,
                uid: user.uid,
                userType: 'agent', // Set user type as 'agent'
            };

            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, userProfile);
            console.log('User profile saved to Firestore');

            // Get the Firebase token
            const token = await user.getIdToken();

            // Send token and profile data to Django backend
            const response = await axios.post('http://192.168.127.91:8000/api/create-or-update-profile/', {
                token,
                email: email,
                name: '', // Pass additional data as needed
                phone: '' // Pass additional data as needed
            });

            if (response.status === 200) {
                setShowModal(true);
            } else {
                Alert.alert('Error', `Failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            Alert.alert('Error', 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <KeyboardAvoidingView style={styles.formInputContainer} behavior='padding' keyboardVerticalOffset={100} enabled>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Email</Text>
                    <TextInput
                        style={styles.formInputField}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Password</Text>
                    <TextInput
                        style={styles.formInputField}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Confirm Password</Text>
                    <TextInput
                        style={styles.formInputField}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>
                {passError && <Text style={styles.formInputError}>{passError}</Text>}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={disabled ? [styles.signUpButton, styles.disabled] : styles.signUpButton}
                    onPress={handleRegister}
                    disabled={disabled}
                >
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.signUpText}>Sign Up</Text>}
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Account Created</Text>
                        <Text style={styles.modalMessage}>Your account has been created successfully</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.modalButton}
                            onPress={() => {
                                setShowModal(false);
                                navigation.navigate('SignIn'); // Navigate to SignIn screen or any other screen
                            }}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'white',
        width: '100%',
    },
    formInputContainer: {
        width: '100%',
        marginTop: 20,
    },
    formInput: {
        marginBottom: 20,
    },
    formInputText: {
        fontSize: 15,
        color: '#666666',
        marginBottom: 5,
    },
    formInputField: {
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: '#666666',
    },
    formInputError: {
        color: 'red',
        marginBottom: 10,
    },
    signUpButton: {
        backgroundColor: '#003366',
        paddingVertical: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        color: 'white',
        fontSize: 15,
    },
    disabled: {
        backgroundColor: '#CCCCCC',
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
