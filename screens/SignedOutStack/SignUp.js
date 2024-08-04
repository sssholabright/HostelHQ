import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp({ navigation }) {
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

    async function handleRegister() {
        try {
            setLoading(true);
            
            // Register the user
            const register = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Register Response:', register)
            setShowModal(true);
            
            const userProfile = {
                email: email,
                uid: register.user.uid,
                password: password,
                userType: 'client',
            };

            // Save the user profile to the firestore
            
            const docRef = await setDoc(doc(db, 'users', register.user.uid), userProfile);
            console.log('Document written with ID:', docRef);

        } catch (error) {
            console.error('Error registering user:', error);
            Alert.alert('Error', 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    }
            
    function CloseModal() { 
        setShowModal(false);
    }
    
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
                <View style={styles.signInContainer}>
                    <Text style={styles.signInText}>Already have an account?</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("SignIn")}>
                        <Text style={styles.signInButton}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Account Created</Text>
                        <Text style={styles.modalMessage}>Your account has been created successfully</Text>
                        <TouchableOpacity activeOpacity={0.8} style={styles.modalButton} onPress={CloseModal}>
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

    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },

    disabled: {
        backgroundColor: '#CCCCCC',
    },

    signInText: {
        fontSize: 15,
    },

    signInButton: {
        color: '#00BFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 5,
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
        alignItems: 'center',
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
        width: '100%',
    },

    modalButtonText: {
        color: 'white',
        fontSize: 15,
    },
});
