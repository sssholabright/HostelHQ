import { ActivityIndicator, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'


export default function ForgotPassword({navigation}) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleForgotPassword = () => {
        if (email) {
            setLoading(true)
            // Implement your forgot password logic here
            setLoading(false)
            setSuccess(true)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Forgot Password',
            headerTitleStyle: {
                color: 'white',
            },
            headerStyle: {
                backgroundColor: '#003366',
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
            ),
        })
    }, [navigation])

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <View style={styles.formInputContainer}>
            <Text style={{color: '#000', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10}}>Forgot Password</Text>
                <View style={styles.ForgotPasswordTextSection}>
                    <Text style={styles.ForgotPasswordText}>Please enter your email address to receive a password reset link</Text>
                </View>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Email</Text>
                    <TextInput style={styles.formInputField} placeholder="Enter your email" value={email} onChangeText={text => setEmail(text)} />
                </View>
                <TouchableOpacity activeOpacity={0.8} style={styles.submitButton} onPress={handleForgotPassword}>
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
                </TouchableOpacity>
                {success && <Text style={styles.successText}>Password reset link sent to your email</Text>}
            </View>
        </View>
    )
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
        marginTop: 50,
        marginBottom: 20,
        borderTopLeftRadius: 40,
        borderBottomRightRadius: 40,
    },

    ForgotPasswordTextSection: {
        marginBottom: 20,
    },

    ForgotPasswordText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666666'
    },

    formInput: {
        marginBottom: 20,
    },

    formInputText: {
        color: '#333',
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },

    formInputField: {
        borderColor: 'lightgray',
        backgroundColor: 'white',
        color: '#666666',
        padding: 10,
        borderRadius: 5,
    },

    submitButton: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },

    submitText: {
        color: '#fff',
        fontSize: 16,
    },

    successText: {
        color: '#32CD32',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    }
})