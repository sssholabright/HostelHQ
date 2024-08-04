import { Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

export default function HostelDetails({navigation}) {
    const [more, setMore] = useState(false)
    const [visible, setVisible] = useState(false)
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)
    const [showRequestSuccess, setShowRequestSuccess] = useState(false)

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(false);
        setDate(currentDate);
    };
    
    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTime(false);
        setTime(currentTime);
    };

    const requestTour = () => {
        setShowRequestSuccess(true)
    }

    const Message = [
        {
            "text": "This mobile application for Home Rentals. It helps users to visits and rent houses suitable for them. The goal is to bring real estates companies, landlords, and tenants together. That's why I created an easy-to-use application design ",
            "name": "Miami Bay Villa",
            "location": "Westend (Lambo area), Malete",
            "rate": "4.0",
            "reviews": [
                {
                    "user": "Mujeeb",
                    "review": "Good hostel"
                },
                {
                    "user": "Adesola",
                    "review": "Great"
                },
                {
                    "user": "Bright",
                    "review": "Nice rooms"
                }
            ]
        }
    ]
    
    const images = [
        {
        url: require('../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../assets/bg-img.jpg'),
        },
    ]
    const [activeIndex, setActiveIndex] = useState(0)

    const styleFirstAndLastImage = (index) => { 
        if (index === 0) {
            return {borderTopLeftRadius: 25, borderBottomLeftRadius: 25}
        } else if (index === images.length - 1) {
            return {borderTopRightRadius: 15, borderBottomRightRadius: 15}
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity activeOpacity={1}>
                        <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                    </TouchableOpacity>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>Miami Bay Villa</Text>
                    <TouchableOpacity activeOpacity={0.9}>
                        <Ionicons name='share-outline' size={24} color='#003366' />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20, paddingTop: 10 }}>
                    {images.map((image, index) => (
                        <TouchableOpacity key={index} activeOpacity={1} style={[styles.HostelImage, styleFirstAndLastImage(index)]} onPress={() => navigation.navigate('viewimage', {image})}>
                            <Image style={[{width: '100%', height: '100%'}, styleFirstAndLastImage(index)]} source={image.url} />
                        </TouchableOpacity>
                    ))}      
                    <View style={{width: 30}} />                  
                </ScrollView>
                
                <View style={{marginHorizontal: 20, marginVertical: 20}}>
                    <Text style={{fontSize: 14, fontWeight: '500', color: 'gray'}}>Description</Text>
                    <Text style={{fontSize: 25, fontWeight: 'bold', color: '#003366'}}>Miami Bay Villa</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="location" size={17} color="gray" />
                        <Text style={{color: 'gray', marginLeft: 5, fontSize: 12}}>Westend (Lambo area), Malete</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
                        <Ionicons name="star" size={17} color="#003366" />
                        <Text style={{color: '#003366', marginLeft: 5, fontSize: 18, fontWeight: '500'}}>4.0 <Text style={{color: 'gray', fontSize: 12}}>(3 Reviews)</Text></Text>
                    </View>

                    {/* About Hostel */}
                    <Text style={{fontSize: 20, fontWeight: '500', marginVertical: 10}}>About</Text>
                    <Text>{Message[0].text.length > 200 ? Message[0].text.substr(0, 200) : Message[0].text}{"....."}</Text>
                    <TouchableOpacity onPress={() => setMore(true)} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10, marginBottom: 10}}>
                        <Text style={{color: '#003366', fontWeight: '500', marginRight: 5, marginTop: -2}}>Read More</Text>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>

                    {/* Facilities */}
                    <View style={{marginTop: 30, marginBottom: 20}}>
                        <Text style={{fontSize: 20, fontWeight: '500', marginVertical: 10}}>Facilities</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '50%'}}>
                                <Ionicons name="wifi" size={24} style={{color: '#003366', backgroundColor: 'rgba(0, 51, 102, 0.1)', padding: 5, borderRadius: 50}} />
                                <Text style={{marginLeft: 5}}>Wifi</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '50%'}}>
                                <Ionicons name="car-sport" size={24} style={{color: '#003366', backgroundColor: 'rgba(0, 51, 102, 0.1)', padding: 5, borderRadius: 50}} />
                                <Text style={{marginLeft: 5}}>Parking</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '50%', marginTop: 10}}>
                                <Ionicons name="bed" size={24} style={{color: '#003366', backgroundColor: 'rgba(0, 51, 102, 0.1)', padding: 5, borderRadius: 50}} />
                                <Text style={{marginLeft: 5}}>Bed</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setMore(true)} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10, marginBottom: 10}}>
                            <Text style={{color: '#003366', fontWeight: '500', marginRight: 5, marginTop: -2}}>View all facilities</Text>
                            <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>
                    </View>

                    {/* Agent */}
                    <View style={{marginBottom: 20, borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'lightgray', paddingBottom: 20}}>
                        <Text style={{fontSize: 20, fontWeight: '500', marginVertical: 10}}>Agent</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../../assets/bg-img.jpg')} style={{width: 90, height: 90, borderRadius: 50}} />
                            <View style={{marginLeft: 20}}>
                                <Text style={{fontSize: 20, color: '#003366', fontWeight: '500'}}>Mujeeb Adejobi</Text>
                                <Text style={{fontSize: 14, fontWeight: '500', marginTop: 1, color: 'gray'}}>Private Client Advisor</Text>
                            </View>
                        </View>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Response time: 1 hour</Text>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Response rate: 100%</Text>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Languages: English, Yoruba</Text>
                        <TouchableOpacity activeOpacity={0.7} style={{borderWidth: 1, borderColor: '#003366', backgroundColor: '#fff', padding: 10, borderRadius: 5, marginTop: 10}}>
                            <Text style={{color: '#003366', textAlign: 'center', fontWeight: '500'}}>Chat with Agent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, marginTop: 10}} onPress={() => navigation.navigate("AgentProperties", {name: "Mujeeb Adejobi"})}>
                            <Text style={{color: '#fff', textAlign: 'center', fontWeight: '500'}}>View Agent Properties</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Reviews */}
                    <View style={{ marginBottom: 20, paddingLeft: 0}}>
                        <Text style={{fontSize: 20, fontWeight: '500', marginVertical: 10}}>Reviews</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20}}>
                            {Message[0].reviews.map((review, index) => (
                                <View style={{marginVertical: 10, marginRight: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: 'white', elevation: 3, width: 300}} key={index}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{color: 'gray', fontSize: 20, fontWeight: '500', backgroundColor: 'rgba(0, 51, 102, 0.1)', borderRadius: 50, marginRight: 5, width: 50, height: 50, textAlign: 'center', lineHeight: 55}}>{review.user[0]}</Text>
                                            <Text style={{color: '#000', fontSize: 14, fontWeight: 'bold'}}>{review.user}</Text>    
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Ionicons name="star" size={17} color="#003366" />
                                            <Text style={{color: '#003366', marginLeft: 5, fontSize: 18, fontWeight: '500'}}>4.0</Text>
                                        </View>
                                    </View>
                                    <Text style={{fontSize: 14, fontWeight: 'semibold', marginTop: 10}}>{review.review} it we want to over the castle on the hill. Castle on the hill.</Text>
                                </View>
                            ))}
                        </ScrollView>                 
                    </View>
                </View>
                <View style={{height: 30}} />
            </ScrollView>

            {/* Read More Modal */}
            <Modal visible={more} animationType="slide" transparent>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%'}}>
                        <Text style={{fontSize: 20, fontWeight: '500', marginBottom: 10}}>About Miami Bay Villa</Text>
                        <Text>{Message[0].text}</Text>
                        <TouchableOpacity onPress={() => setMore(false)} style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, marginTop: 20}}>
                            <Text style={{color: '#fff', textAlign: 'center', fontWeight: '500'}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Bottom Container */}
             <View style={styles.bottomContainer}>
                <TouchableOpacity activeOpacity={0.7} style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => setVisible(true)}>
                    <Ionicons name="book" size={24} />
                    <Text style={{marginLeft: 5, fontWeight: '700', fontSize: 14, textDecorationLine: 'underline'}}>Request a Room Tour</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.bookButton}>
                    <Text style={{color: '#fff', fontWeight: '500'}}>Rent Now</Text>
                </TouchableOpacity>
            </View>

            {/* Request Room Tour Modal */}
            <Modal visible={visible} animationType="slide" transparent>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%'}}>
                        <Text style={{fontSize: 20, fontWeight: '500', marginBottom: 10}}>Request a Room Tour</Text>
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, marginBottom: 10}} onPress={() => setShowDate(true)}>
                            <Text style={{color: '#fff', textAlign: 'center', fontWeight: '500'}}>Select Date</Text>
                        </TouchableOpacity>
                        {showDate && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                        {showTime && (
                            <DateTimePicker
                                value={time}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: '#003366', padding: 10, borderRadius: 5}} onPress={() => setShowTime(true)}>
                            <Text style={{color: '#fff', textAlign: 'center', fontWeight: '500'}}>Select Time</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Selected Date: {moment(date).format('MMMM Do YYYY')}</Text>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Selected Time: {moment(time).format('LT')}</Text>
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, marginTop: 20}} onPress={() => requestTour()}>
                            <Text style={{color: '#fff', textAlign: 'center', fontWeight: '500'}}>Request Tour</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 10}} onPress={() => setVisible(false)}>
                            <Text style={{color: '#fff', textAlign: 'center', fontWeight: '500'}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {/* Request Room Success Modal */}
            <Modal visible={showRequestSuccess} animationType="slide" transparent>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center'}}>
                        <Ionicons name="checkmark-circle" size={100} color="#003366" />
                        <Text style={{fontSize: 20, color: '#003366', fontWeight: 'bold', marginBottom: 20}}>Request Sent</Text>
                        <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={() => [setShowRequestSuccess(false), setVisible(false)]}>
                            <Text style={{color: '#fff', fontSize: 16}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    HostelImage: {
        height: 200,
        width: 280,
        paddingRight: 10
    },

    bottomContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        elevation: 10,
    },

    bookButton: {
        backgroundColor: "#003366",
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 5,
    }

})



export function ViewImage({route, navigation}) {
    const { image } = route.params
    
    return (
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar hidden />
            <Image source={image.url} style={{ height: "100%", width: "100%" }} />
        </View>
    )
}
            
