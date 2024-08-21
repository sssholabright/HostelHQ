import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AgentSignUp({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
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
        setDisabled(!(name && phone && email && password && confirmPassword && password === confirmPassword));
    }, [name, phone, email, password, confirmPassword]);

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
                name: name,
                phone: phone,
                uid: user.uid,
                userType: 'agent', // Set user type as 'agent'
            };

            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, userProfile);
            console.log('User profile saved to Firestore');
        } catch (error) {
            console.error('Error registering user:', error);
            Alert.alert('Error', 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Text style={{color: '#003366', fontSize: 25, fontWeight: 'bold'}}>Create a Manager Account</Text>
            <View style={styles.formInputContainer}>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Name</Text>
                    <TextInput 
                        style={styles.formInputField} 
                        placeholder="Enter your full name" 
                        value={name} 
                        onChangeText={setName} 
                    />
                </View>
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
                    <Text style={styles.formInputText}>Phone Number</Text>
                    <TextInput 
                        style={styles.formInputField} 
                        placeholder="Enter your phone number" 
                        value={phone} 
                        onChangeText={setPhone} 
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },

    formInputContainer: {
        width: '100%',
        backgroundColor: '#ECEAFB',
        paddingHorizontal: 25,
        paddingVertical: 30,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20,
        borderTopLeftRadius: 40,
        borderBottomRightRadius: 40,
    },

    formInput: {
        marginBottom: 20,
    },

    formInputText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666666',
        marginBottom: 5,
        //display: 'none',
    },

    formInputField: {
        borderColor: 'lightgray',
        backgroundColor: 'white',
        color: '#666666',
        padding: 10,
        height: 40,
        borderRadius: 5,
    },

    formInputError: {
        color: 'red',
        marginBottom: 10,
    },

    signUpButton: {
        backgroundColor: '#003366',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    signUpText: {
        color: 'white',
        fontWeight: 'bold',
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
        color: '#003366',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 5,
    }
});
