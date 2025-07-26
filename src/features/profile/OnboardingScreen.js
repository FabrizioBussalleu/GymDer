import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebase/config';

const workoutTimesOptions = [
  'Morning (6-9am)',
  'Midday (11am-2pm)',
  'Afternoon (3-6pm)',
  'Evening (7-10pm)',
];

const favoriteExercisesOptions = [
  'Squats', 'Bench Press', 'Deadlift', 'Pull-ups', 'Running', 'Cycling', 'Yoga', 'HIIT'
];

const scheduleOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];
const fitnessGoals = ['Strength', 'Cardio', 'Weight Loss', 'Muscle Gain'];

const OnboardingScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [gym, setGym] = useState('');
  const [workoutTimes, setWorkoutTimes] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [photos, setPhotos] = useState([]);

  const toggleChoice = (value, arr, setter) => {
    if (arr.includes(value)) {
      setter(arr.filter(item => item !== value));
    } else {
      setter([...arr, value]);
    }
  };

  const pickPhoto = async () => {
    if (photos.length >= 6) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setPhotos([...photos, result.assets ? result.assets[0].uri : result.uri]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleFinish = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const profile = {
      name,
      age,
      gender,
      location,
      experience,
      goal,
      gym,
      workoutTimes,
      favoriteExercises,
      schedule,
      photos,
      createdAt: new Date(),
    };
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    if (navigation && navigation.replace) navigation.replace('Home');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>What's your name?</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <Text style={styles.title}>How old are you?</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" />
            <Text style={styles.title}>Gender</Text>
            <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Gender" />
            <Text style={styles.title}>Where are you located?</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="City, State" />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.title}>Experience Level</Text>
            <View style={styles.choicesRow}>
              {experienceLevels.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[styles.choice, experience === level && styles.choiceSelected]}
                  onPress={() => setExperience(level)}
                >
                  <Text style={styles.choiceText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.title}>Fitness Goal</Text>
            <View style={styles.choicesRow}>
              {fitnessGoals.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.choice, goal === g && styles.choiceSelected]}
                  onPress={() => setGoal(g)}
                >
                  <Text style={styles.choiceText}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.title}>Current Gym Membership</Text>
            <TextInput style={styles.input} value={gym} onChangeText={setGym} placeholder="Gym Name" />
            <Text style={styles.title}>Preferred Workout Times</Text>
            <View style={styles.choicesWrap}>
              {workoutTimesOptions.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[styles.choice, workoutTimes.includes(time) && styles.choiceSelected]}
                  onPress={() => toggleChoice(time, workoutTimes, setWorkoutTimes)}
                >
                  <Text style={styles.choiceText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.title}>Favorite Exercises</Text>
            <View style={styles.choicesWrap}>
              {favoriteExercisesOptions.map(ex => (
                <TouchableOpacity
                  key={ex}
                  style={[styles.choice, favoriteExercises.includes(ex) && styles.choiceSelected]}
                  onPress={() => toggleChoice(ex, favoriteExercises, setFavoriteExercises)}
                >
                  <Text style={styles.choiceText}>{ex}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.title}>Workout Schedule</Text>
            <View style={styles.choicesWrap}>
              {scheduleOptions.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[styles.choice, schedule.includes(day) && styles.choiceSelected]}
                  onPress={() => toggleChoice(day, schedule, setSchedule)}
                >
                  <Text style={styles.choiceText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 6:
        return (
          <View>
            <Text style={styles.title}>Add up to 6 profile photos</Text>
            <View style={styles.photoRow}>
              {photos.map((uri, idx) => (
                <View key={idx} style={styles.photoContainer}>
                  <Image source={{ uri }} style={styles.photo} />
                  <TouchableOpacity style={styles.removePhoto} onPress={() => removePhoto(idx)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {photos.length < 6 && (
                <TouchableOpacity style={styles.addPhoto} onPress={pickPhoto}>
                  <Text style={{ fontSize: 32, color: '#888' }}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderStep()}
      <View style={styles.navRow}>
        {step > 1 && (
          <TouchableOpacity style={styles.navBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 6 ? (
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => setStep(step + 1)}
            disabled={
              (step === 1 && (!name || !age || !gender || !location)) ||
              (step === 2 && (!experience || !goal)) ||
              (step === 3 && (!gym || workoutTimes.length === 0)) ||
              (step === 4 && favoriteExercises.length === 0) ||
              (step === 5 && schedule.length === 0)
            }
          >
            <Text style={styles.navText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navBtn} onPress={handleFinish} disabled={photos.length === 0}>
            <Text style={styles.navText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.progress}>{step} / 6</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  choicesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  choicesWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  choice: {
    borderWidth: 1, borderColor: '#888', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16,
    margin: 4, backgroundColor: '#f5f5f5'
  },
  choiceSelected: { backgroundColor: '#4caf50', borderColor: '#388e3c' },
  choiceText: { color: '#222' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  navBtn: { backgroundColor: '#4caf50', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  navText: { color: '#fff', fontWeight: 'bold' },
  progress: { textAlign: 'center', marginTop: 16, color: '#888' },
  photoRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  photoContainer: { position: 'relative', marginRight: 8, marginBottom: 8 },
  photo: { width: 80, height: 80, borderRadius: 10 },
  removePhoto: {
    position: 'absolute', top: -8, right: -8, backgroundColor: '#e53935', borderRadius: 12, width: 24, height: 24,
    alignItems: 'center', justifyContent: 'center'
  },
  addPhoto: {
    width: 80, height: 80, borderRadius: 10, borderWidth: 1, borderColor: '#ccc', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#fafafa'
  }
});

export default OnboardingScreen;
