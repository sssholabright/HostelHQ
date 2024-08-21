import { ActivityIndicator, Modal, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

export default function AboutMe({navigation}) {
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [aboutMe, setAboutMe] = useState('')
    const [showModal, setShowModal] = useState(false)

    function selectImage() {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        }).then(result => {
            if (!result.canceled) {
                setImage(result.assets[0].uri)
            }
        })
    }

    function TakePicture() {
        ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        }).then(result => {
            if (!result.cancelled) {
                setImage(result.assets[0].uri)
            }
        })
    }

    function SaveProfile() {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setShowModal(true)
        }, 2000)

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Agent Profile',
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
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#003366" />
            <Text style={styles.AboutMeText}>About Me</Text>
            <View style={styles.AboutMeContainer}>
                <Text style={styles.AboutMeSubText}>This is your profile. It is a great way to introduce yourself to potential clients. </Text>
                <View style={styles.AboutMeFormInput}>
                    <TextInput style={styles.AboutMeInput} placeholder="Introduce yourself to potential clients. You can include information about your experience, your qualifications, and your interests."  multiline={true} numberOfLines={4} textAlignVertical='top' value={aboutMe} onChangeText={text => setAboutMe(text)} />
                </View>
                <View style={styles.AboutMeImage}>
                    <Text style={styles.AboutMeSubText2}>Add a profile picture</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={selectImage}>
                            <Text style={{color: '#fff', fontSize: 16}}>Select Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={TakePicture}>
                            <Text style={{color: '#fff', fontSize: 16}}>Take Picture</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 20, alignItems: 'center' }}>
                        {image && <Image source={{uri: image}} style={{width: 200, height: 200, borderRadius: 100}} />}
                    </View>
                </View>
                <TouchableOpacity style={styles.AboutMeButton} activeOpacity={0.8} onPress={SaveProfile}>
                    {loading ? <ActivityIndicator color="#fff" style={{marginRight: 10}} />:
                    <Text style={styles.AboutMeButtonText}>Save</Text>}
                </TouchableOpacity>
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },

    AboutMeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 20,
    },

    AboutMeContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
    },

    AboutMeSubText: {
        fontSize: 13,
        color: '#000',
        marginBottom: 10,
    },

    AboutMeSubText2: {
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },

    AboutMeFormInput: {
        marginVertical: 20,
    },

    AboutMeInput: {
        height: 200,
        borderColor: '#003366',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },

    AboutMeImage: {
        marginBottom: 20,
    },

    AboutMeButton: {
        backgroundColor: '#003366',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },

    AboutMeButtonText: {
        color: '#fff',
        fontSize: 16,
    }, 
})