import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { db } from '../../firebase/config';
import SwipeCards from './SwipeCards';

export default function MatchScreen() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setProfiles(users);
      } catch (e) {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!profiles.length) {
    return (
      <View style={styles.center}>
        <Text>No profiles found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SwipeCards
        data={profiles}
        renderCard={(profile) => (
          <View style={styles.card}>
            {profile.photoUrl ? (
              <Image source={{ uri: profile.photoUrl }} style={styles.image} />
            ) : null}
            <Text style={styles.name}>{profile.displayName}</Text>
            <Text>Level: {profile.experienceLevel}</Text>
            <Text>Goals: {profile.fitnessGoals}</Text>
            <Text>Gym: {profile.gymLocation}</Text>
            <Text>Times: {profile.workoutTimes}</Text>
            <Text>Fav: {profile.favoriteExercises}</Text>
          </View>
        )}
        onSwipeRight={(profile) => {
          // TODO: Handle like/match logic
        }}
        onSwipeLeft={(profile) => {
          // TODO: Handle pass logic
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', elevation: 3, width: 320, height: 420 },
  image: { width: 200, height: 200, borderRadius: 100, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
