import * as Location from 'expo-location';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../firebase/config';

export default function CheckinScreen() {
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState(null);

  const handleCheckIn = async () => {
    setStatus('');
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setStatus('Permission to access location was denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      await setDoc(doc(db, 'checkins', user.uid), {
        userId: user.uid,
        timestamp: serverTimestamp(),
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setStatus('Check-in successful!');
    } catch (e) {
      setStatus('Check-in failed: ' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym Check-In</Text>
      <Button title="Check In at Gym" onPress={handleCheckIn} />
      {location && (
        <Text>Location: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</Text>
      )}
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  status: { marginTop: 10, color: 'green' },
});
