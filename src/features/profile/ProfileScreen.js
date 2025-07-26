import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { auth, db } from '../../firebase/config';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    displayName: '',
    photoUrl: '',
    workoutPreferences: '',
    experienceLevel: '',
    gymLocation: '',
    workoutTimes: '',
    fitnessGoals: '',
    favoriteExercises: '',
    gymMembership: '',
    workoutSchedule: '',
  });
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  const handleChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!userId) return setStatus('User not authenticated');
    try {
      await setDoc(doc(db, 'users', userId), profile);
      setStatus('Profile saved!');
    } catch (e) {
      setStatus('Error saving profile: ' + e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create/Edit Profile</Text>
      <TextInput style={styles.input} placeholder="Display Name" value={profile.displayName} onChangeText={v => handleChange('displayName', v)} />
      <TextInput style={styles.input} placeholder="Photo URL" value={profile.photoUrl} onChangeText={v => handleChange('photoUrl', v)} />
      <TextInput style={styles.input} placeholder="Workout Preferences" value={profile.workoutPreferences} onChangeText={v => handleChange('workoutPreferences', v)} />
      <TextInput style={styles.input} placeholder="Experience Level (beginner/intermediate/advanced)" value={profile.experienceLevel} onChangeText={v => handleChange('experienceLevel', v)} />
      <TextInput style={styles.input} placeholder="Gym Location" value={profile.gymLocation} onChangeText={v => handleChange('gymLocation', v)} />
      <TextInput style={styles.input} placeholder="Preferred Workout Times" value={profile.workoutTimes} onChangeText={v => handleChange('workoutTimes', v)} />
      <TextInput style={styles.input} placeholder="Fitness Goals" value={profile.fitnessGoals} onChangeText={v => handleChange('fitnessGoals', v)} />
      <TextInput style={styles.input} placeholder="Favorite Exercises" value={profile.favoriteExercises} onChangeText={v => handleChange('favoriteExercises', v)} />
      <TextInput style={styles.input} placeholder="Current Gym Membership" value={profile.gymMembership} onChangeText={v => handleChange('gymMembership', v)} />
      <TextInput style={styles.input} placeholder="Workout Schedule" value={profile.workoutSchedule} onChangeText={v => handleChange('workoutSchedule', v)} />
      <Button title="Save Profile" onPress={handleSave} />
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  input: { width: '100%', maxWidth: 350, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  status: { marginTop: 10, color: 'green' },
});
