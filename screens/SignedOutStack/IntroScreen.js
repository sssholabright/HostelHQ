import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function IntroScreen({navigation}) {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/bg-img.jpg')} style={styles.image}>
                <Text style={styles.text}>Enjoy{'\n'}your{'\n'}hostel{'\n'}with fun!</Text>
                <Text style={styles.subText}>Estate App is a complete area to provide entertainment, especially for foreign tourists</Text>
                <View style={styles.getStartedContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.getStartedButton} onPress={() => navigation.navigate("SignIn")}>
                        <Text style={styles.getStartedText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    image: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    
    text: {
        color: 'white',
        fontSize: 70,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'left',
        paddingHorizontal: 20,
        marginTop: -30
    },

    subText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'left',
        paddingHorizontal: 20,
    },
    
    getStartedContainer: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    
    getStartedButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    getStartedText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})