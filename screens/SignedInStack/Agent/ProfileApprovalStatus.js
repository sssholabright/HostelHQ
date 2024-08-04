import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const RemindersScreen = () => {
  const handleSendReminder = () => {
    // Simulate sending a reminder
    Alert.alert('Reminder Sent', 'A reminder has been sent to the guest for the pending payment.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Payment Reminder</Text>
      <Button title="Send Reminder" onPress={handleSendReminder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 16,
  },
});

export default RemindersScreen;
