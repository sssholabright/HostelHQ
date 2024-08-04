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
                <View style={styles.ForgotPasswordTextSection}>
                    <Text style={styles.ForgotPasswordText}>Enter your email to receive a password reset link</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },

    formInputContainer: {
        width: '100%',
        marginTop: 50,
    },

    ForgotPasswordTextSection: {
        marginBottom: 20,
    },

    ForgotPasswordText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },

        formInput: {
        marginBottom: 20,
    },

    formInputText: {
        color: '#333',
        fontSize: 16,
        marginBottom: 5,
    },

    formInputField: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
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