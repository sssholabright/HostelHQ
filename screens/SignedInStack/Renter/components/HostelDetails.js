import { Alert, Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { auth, db } from '../../../../firebase'
import { collection, doc, query, getDocs, setDoc, where, onSnapshot } from 'firebase/firestore';

export default function HostelDetails({navigation, route}) {
    const data = route.params.item

    const [user, setUser] = useState([])
    const [agent, setAgent] = useState([])
    const [more, setMore] = useState(false)
    const [visible, setVisible] = useState(false)
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)
    const [showRequestSuccess, setShowRequestSuccess] = useState(false)
    const [comment, setComment] = useState('')
    const [showAlert, setShowAlert] = useState(false)

    function getUser() {
        try {
            const q = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid))
            onSnapshot(q, (snapshot) => {
                const users = []
                snapshot.forEach((doc) => {
                    users.push(doc.data())
                })
                setUser(users)
            })
        } catch (error) {
            console.log("Error: ", error.message)
        }
    }

    function getAgent() {
        try {
            const q = query(collection(db, 'users'), where('uid', '==', data.agent_id))
            onSnapshot(q, (snapshot) => {
                const users = []
                snapshot.forEach((doc) => {
                    users.push(doc.data())
                })
                setAgent(users)
            })
        } catch (error) {
            console.log("Error: ", error.message)
        }
    }

    useEffect(() => {
        getAgent()
        getUser()
    }, [])

    const uid = `${auth.currentUser.uid}-${data.hostel_id}`

    async function handlePress() {
        const q = query(collection(db, "tour-requests"), where("id", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setShowAlert(true);
            setVisible(false);
        } else {
            setShowAlert(false);
            setVisible(true);
        }
    }

    const handleSubmit = async () => {
        try {
            if (!auth.currentUser) {
                Alert.alert('Error', 'User is not authenticated.');
                return;
            }

            const formData = {
                id: uid,
                agent_id: data.agent_id,
                client_id: auth.currentUser.uid,
                client_name: user[0].name,
                client_email: user[0].email,
                agent_name: agent[0].name,
                agent_email: agent[0].email,
                requested_date: moment(date).format('MMMM Do YYYY'),
                requested_time: moment(time).format('LT'),
                comment: comment,
                hostel: data.hostelName,
                status: "pending",
            };

            const addRequest = doc(db, "tour-requests", uid);
            await setDoc(addRequest, formData)

        } catch (error) {
            console.error('Error occurred:', error);
            Alert.alert('Error', `An error occurred: ${error.message}`);
        } finally {
            setShowAlert(false)
            setShowRequestSuccess(true)
        }
    };
     

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

    const Message = [
        {
            "text": "This mobile application for Hostel Rentals. It helps users to visits and rent hostels suitable for them. The goal is to bring real estates companies, landlords, and tenants together. That's why I created an easy-to-use application design ",
            "name": "Miami Bay Villa",
            "location": "Westend (Lambo area), Malete",
            "rate": "4.0",
            "time": '1 month ago',
            "reviews": [
                {
                    "user": "Mujeeb",
                    "review": "Good hostel",
                    "time": '1 month ago',
                },
                {
                    "user": "Adesola",
                    "review": "Great",
                    "time": '1 month ago',
                },
                {
                    "user": "Bright",
                    "review": "Nice rooms",
                    "time": '1 month ago',
                }
            ]
        }
    ]
    
    const images = [
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
        {
        url: require('../../../../assets/bg-img.jpg'),
        },
    ]

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
            <View style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={1}>
                    <Ionicons name="chevron-back" size={24} color="#003366" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#003366'}}>{data.hostelName}</Text>
                <TouchableOpacity activeOpacity={0.9}>
                    <Ionicons name='share-outline' size={24} color='#003366' />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20, paddingTop: 10 }}>
                    {images.map((image, index) => (
                        <TouchableOpacity key={index} activeOpacity={1} style={[styles.HostelImage, styleFirstAndLastImage(index)]} onPress={() => navigation.navigate('viewimage', {image})}>
                            <Image style={[{width: '100%', height: '100%'}, styleFirstAndLastImage(index)]} source={image.url} />
                        </TouchableOpacity>
                    ))}      
                    <View style={{width: 30}} />                  
                </ScrollView>
                <View style={{margin: 20, backgroundColor: 'green', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', width: 80, height: 18, borderRadius: 3}}>
                    <Ionicons name='shield-checkmark' size={15} color='#fff' />
                    <Text style={{color: '#fff', fontWeight: '500', fontSize: 12, letterSpacing: 0.1, textTransform: 'uppercase'}}>Verified</Text>
                </View>
                <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 18, marginBottom: 5, fontWeight: 'bold', color: '#003366'}}>N{data.price}/year</Text>
                    <Text style={{fontSize: 25, fontWeight: 'bold', color: '#003366'}}>{data.hostelName}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="location" size={17} color="gray" />
                        <Text style={{color: 'gray', marginLeft: 5, fontSize: 12}}>{data.address}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
                        <Ionicons name="star" size={17} color="#003366" />
                        <Text style={{color: '#003366', marginLeft: 5, fontSize: 18, fontWeight: '500'}}>4.0 <Text style={{color: 'gray', fontSize: 12}}>(3 Reviews)</Text></Text>
                    </View>

                    {/* About Hostel */}
                    <Text style={{fontSize: 18, fontWeight: '500', marginVertical: 10}}>Description</Text>
                    <Text>{Message[0].text.length > 200 ? Message[0].text.substr(0, 200) : Message[0].text}{"....."}</Text>
                    <TouchableOpacity onPress={() => setMore(true)} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
                        <Text style={{color: '#003366', fontWeight: '500', marginRight: 5, marginTop: -2}}>Read More</Text>
                        <Ionicons name="chevron-forward" size={20} color="#003366" />
                    </TouchableOpacity>

                    {/* Facilities */}
                    <View style={{marginTop: 0, marginBottom: 20}}>
                        <Text style={{fontSize: 18, fontWeight: '500', marginVertical: 10}}>Amenities</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            {data.amenities && <View style={{flexDirection: 'row', alignItems: 'center', width: '50%'}}>
                                <Ionicons name="wifi" size={24} style={{color: '#003366', backgroundColor: 'rgba(0, 51, 102, 0.1)', padding: 5, borderRadius: 50}} />
                                <Text style={{marginLeft: 5}}>{data.amenities}</Text>
                            </View>}
                        </View>
                    </View>

                    {/* Agent */}
                    {agent.map((a) => (
                    <View style={{marginBottom: 20, borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'lightgray', paddingBottom: 20}}>
                        <Text style={{fontSize: 18, fontWeight: '500', marginVertical: 10}}>Agent</Text>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <Image source={require('../../../../assets/bg-img.jpg')} style={{width: 90, height: 90, borderRadius: 50}} />
                            <View style={{marginTop: 5, backgroundColor: 'purple', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', width: 100, height: 18, borderRadius: 3}}>
                                <Ionicons name='star' size={13} color='#fff' />
                                <Text style={{color: '#fff', fontWeight: '500', fontSize: 12, letterSpacing: 0.1, textTransform: 'uppercase'}}>superagent</Text>
                            </View>
                            <View style={{ marginTop: 10, alignItems: 'center'}}>
                                <Text style={{fontSize: 25, color: '#003366', fontWeight: '500'}}>{a.name}</Text>
                                <Text style={{fontSize: 14, fontWeight: '500', marginTop: 1, color: 'gray'}}>Private Client Advisor</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5}}>
                            <Text style={{marginRight: 10}}>4.8</Text>
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='star' size={20} color='orange' />
                            <AntDesign name='staro' size={20} color='orange' />
                            <Text style={{marginLeft: 10}}>20 reviews</Text>
                        </View>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Response time: 1 hour</Text>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Response rate: 100%</Text>
                        <Text style={{fontSize: 14, fontWeight: '500', marginTop: 10}}>Languages: English, Yoruba</Text>
                        <TouchableOpacity activeOpacity={0.7} style={{borderWidth: 1, borderColor: '#003366', backgroundColor: '#fff', padding: 10, borderRadius: 5, marginTop: 10}}>
                            <Text style={{color: '#003366', textAlign: 'center', fontWeight: '500'}}>Chat with Agent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, marginTop: 10}} onPress={() => navigation.navigate("AgentProperties", {agentId: a.uid, agentName: a.name})}>
                            <Text style={{color: '#fff', textAlign: 'center', fontWeight: '500'}}>View Agent Properties</Text>
                        </TouchableOpacity>
                    </View>
                    ))}
                    
                    {/* Reviews */}
                    <View style={{ marginBottom: 20, paddingLeft: 0}}>
                        <Text style={{fontSize: 20, fontWeight: '500', marginVertical: 10}}>Ratings and Reviews</Text>
                        <Text style={{fontSize: 15, fontWeight: '500', color: 'gray', width: '80%', marginVertical: 5}}>Ratings and reviews are verified hostel users only.</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: '50%'}}>
                                <Text style={{fontSize: 60, fontWeight: 'bold'}}>4.2</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                                    <Ionicons name="star" size={15} color='orange' />
                                    <Ionicons name="star" size={15} color='orange' />
                                    <Ionicons name="star" size={15} color='orange' />
                                    <Ionicons name="star-half" size={15} color='orange' />
                                    <Ionicons name="star" size={15} color='lightgray' />
                                </View>
                            </View>
                            <View style={{ width: '50%'}}>
                                <Text style={{fontWeight: 'bold'}}>5</Text>
                                <Text style={{fontWeight: 'bold'}}>4</Text>
                                <Text style={{fontWeight: 'bold'}}>3</Text>
                                <Text style={{fontWeight: 'bold'}}>2</Text>
                                <Text style={{fontWeight: 'bold'}}>1</Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 0}}>
                            {Message[0].reviews.map((review, index) => (
                                <View style={{marginVertical: 10, marginRight: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f2f2f2', width: 300}} key={index}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{color: 'gray', fontSize: 20, fontWeight: '500', backgroundColor: 'rgba(0, 51, 102, 0.1)', borderRadius: 50, marginRight: 5, width: 50, height: 50, textAlign: 'center', lineHeight: 55}}>{review.user[0]}</Text>
                                            <Text style={{color: '#000', fontSize: 14, fontWeight: 'bold'}}>{review.user}</Text>    
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{color: 'gray', marginLeft: 5, fontSize: 13, fontWeight: 'bold'}}>{review.time}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="star" size={15} color="#003366" />
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
                <TouchableOpacity activeOpacity={0.7} style={{flexDirection: 'row', alignItems: 'center'}} onPress={handlePress}>
                    <Ionicons name="book" size={24} />
                    <Text style={{marginLeft: 5, fontWeight: '700', fontSize: 14, textDecorationLine: 'underline'}}>Request a Room Tour</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.bookButton} onPress={() => navigation.navigate('BookingConfirmation', {data: data})}>
                    <Text style={{color: '#fff', fontWeight: '500'}}>Rent Now</Text>
                </TouchableOpacity>
            </View>

            {/* Request Room Tour Modal */}
            <Modal visible={visible} animationType="slide" transparent>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#003366', padding: 20, borderRadius: 10, width: '90%'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10}}>Request a Room Tour</Text>
                        <Text style={{fontSize: 15, color: '#fff', marginBottom: 20}}>Select your time slot for scheduling your tour</Text>
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: '#fff', padding: 10, borderRadius: 5, marginBottom: 10}} onPress={() => setShowDate(true)}>
                            <Text style={{fontSize: 14, fontWeight: '500', textAlign: 'center'}}>Select a date</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize: 14, fontWeight: '500', color: '#fff', marginBottom: 10}}>Selected Date: {moment(date).format('MMMM Do YYYY')}</Text>
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
                        <TouchableOpacity activeOpacity={0.7} style={{backgroundColor: '#fff', padding: 10, borderRadius: 5}} onPress={() => setShowTime(true)}>
                            <Text style={{color: '#000', textAlign: 'center', fontWeight: '500'}}>Select Time</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize: 14, fontWeight: '500', color: '#fff', marginTop: 10}}>Selected Time: {moment(time).format('LT')}</Text>
                        <View style={{backgroundColor: '#fff', padding: 10, borderRadius: 5, marginTop: 20}}>
                            <TextInput
                                placeholder='Comments'
                                value={comment}
                                onChangeText={(text) => setComment(text)}
                                style={{height: 40}}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <TouchableOpacity activeOpacity={0.7} style={{flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 5, marginTop: 10, marginRight: 5}} onPress={() => setVisible(false)}>
                                <Text style={{color: '#003366', textAlign: 'center', fontWeight: 'bold'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} style={{flex: 1, backgroundColor: '#000', padding: 10, borderRadius: 5, marginTop: 10, marginLeft: 5}} onPress={handleSubmit}>
                                <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold'}}>Submit</Text>
                            </TouchableOpacity>
                        </View>
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

            {/* Request Confirm Modal */}
            <Modal visible={showAlert} animationType="slide" transparent>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center'}}>
                        <Ionicons name="help-circle" size={100} color="#003366" />
                        <Text style={{fontSize: 14, color: '#003366', fontWeight: 'bold', marginBottom: 20}}>You have already made a tour request for this hostel. Contact the agent to faciliate your request.</Text>
                        <TouchableOpacity style={{backgroundColor: '#003366', padding: 10, borderRadius: 5, alignItems: 'center'}} activeOpacity={0.8} onPress={() => setShowAlert(false)}>
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
            
