import { ActivityIndicator, Image, Modal, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Personal({navigation}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setphone] = useState('')
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    function SaveProfile() {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setShowModal(true)
        }, 3000)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Edit Details',
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
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 20, backgroundColor: '#003366', paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}}>
                <Image source={require('../../../assets/bg-img.jpg')} style={{width: 70, height: 70, borderRadius: 50, borderWidth: 2, borderColor: '#fff'}} />
                <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', padding: 10, borderRadius: 15, marginLeft: 10}}>
                    <Text style={{color: '#003366', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20}}>Add Photo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.formInputContainer}>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Personal Details</Text>
                    <Text style={styles.formInputSubText}>Please provide your personal details</Text>
                </View>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>First Name</Text>
                    <TextInput style={styles.formInputField} placeholder="Enter your first name" value={firstName} onChangeText={text => setFirstName(text)} />
                </View>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Last Name</Text>
                    <TextInput style={styles.formInputField} placeholder="Enter your last name" value={lastName} onChangeText={text => setLastName(text)} />
                </View>
                <View style={styles.formInput}>
                    <Text style={styles.formInputText}>Phone Number</Text>
                    <TextInput style={styles.formInputField} placeholder="Enter your phone number" value={phone} onChangeText={text => setPhone(text)} />
                </View>
                <View style={styles.formInput}>
                    <TouchableOpacity style={styles.formInputButton} onPress={SaveProfile}>
                        {loading ? <ActivityIndicator color="#fff" style={{marginRight: 10}} /> :
                        <Text style={styles.formInputButtonText}>Save</Text>}
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Modal visible={showModal} transparent={true} animationType="slide">
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center'}}>
                            <Ionicons name="checkmark-circle" size={100} color="#003366" />
                            <Text style={{fontSize: 20, color: '#003366', fontWeight: 'bold', marginBottom: 20}}>Profile Saved</Text>
                            <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={() => setShowModal(false)}>
                                <Text style={{color: '#fff', fontSize: 16}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    
    formInputContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    
    formInput: {
        marginBottom: 20,
    },

    formInputText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    
    formInputSubText: {
        fontSize: 14,
        color: '#666',
    },
    
    formInputField: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
    },
    
    formInputButton: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    
    formInputButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})