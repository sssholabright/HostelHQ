import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios'; // Ensure you have axios installed

export default function SignIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (email && password) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [email, password]);

    async function handleSignIn() {
        try {
            setLoading(true);
    
            // Login the user
            const login = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login Response:', login);

            // Get the Firebase token
            const token = await login.user.getIdToken();
            console.log('Firebase Token:', token);

            // Send token to Django backend
            const response = await axios.post('http://192.168.127.91:8000/api/authenticate/', {
                token,
            });

            if (response.status === 200) {
                // Handle successful response from Django backend
                console.log('Backend Response:', response.data);
                // Navigate to the next screen
                navigation.navigate('Home'); // Update with your next screen
            } else {
                Alert.alert('Error', 'Failed to authenticate with the backend');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    }    

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Login',
            headerTitleStyle: {
                color: 'white',
            },
            headerStyle: {
                backgroundColor: '#003366',
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Intro")}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={styles.formInputContainer}>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Email</Text>
                    <TextInput
                        style={!focused ? styles.formInputField : [styles.formInputField, { borderColor: '#00BFFF' }]}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                </View>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Password</Text>
                    <TextInput
                        style={!focused2 ? styles.formInputField : [styles.formInputField, { borderColor: '#00BFFF' }]}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry
                        onFocus={() => setFocused2(true)}
                        onBlur={() => setFocused2(false)}
                    />
                </View>
                {error ? <Text style={styles.formInputError}>{error}</Text> : null}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.formInput}
                    onPress={() => navigation.navigate("ForgotPassword")}
                >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={!disabled ? styles.signInButton : styles.disabled}
                    onPress={handleSignIn}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator size="small" color="#fff" /> :
                        <Text style={styles.signInText}>Login</Text>}
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.signInWith, { borderColor: "#003366" }]}
                    onPress={() => navigation.navigate("SignUp")}
                >
                    <Ionicons name="logo-google" size={24} color="#003366" />
                    <Text style={styles.signInWithText}>Continue with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.signInWith, { borderColor: "#003366" }]}
                    onPress={() => navigation.navigate("SignUp")}
                >
                    <Ionicons name="logo-facebook" size={24} color="#003366" />
                    <Text style={styles.signInWithText}>Continue with Facebook</Text>
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don't have an account?</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("RegisterTab")}>
                        <Text style={styles.signUpButton}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    formInputContainer: {
        width: '100%',
    },
    formInput: {
        marginBottom: 20,
    },
    formInputText: {
        fontSize: 15,
        color: 'black',
        marginBottom: 5,
    },
    formInputError: {
        color: 'red',
        marginBottom: 10,
    },
    formInputField: {
        borderWidth: 1,
        borderColor: 'lightgray',
        backgroundColor: 'white',
        color: '#666666',
        padding: 10,
        borderRadius: 5,
    },
    forgotPasswordText: {
        textAlign: 'right',
        marginTop: -10,
        color: '#00BFFF',
    },
    signInButton: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    signInText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    disabled: {
        backgroundColor: 'lightgray',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    orText: {
        textAlign: 'center',
        marginVertical: 10,
        color: 'black',
    },
    signInWith: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    signInWithText: {
        color: '#003366',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signUpText: {
        fontSize: 15,
        color: 'black',
    },
    signUpButton: {
        fontSize: 15,
        color: '#00BFFF',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
