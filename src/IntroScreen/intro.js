import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import * as Progress from 'react-native-progress';

export default function App({ navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading process
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 1) {
          return prevProgress + 0.01; // increase by 1%
        } else {
          clearInterval(interval); // Stop the interval when the progress reaches 100%
          // Navigate to the dashboard once loading is complete
          navigation.replace('Dashboard'); // Make sure to set up the 'Dashboard' screen in your navigator
          return 1;
        }
      });
    }, 100); // Update progress every 100ms
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.background}>
        <Image
          source={require('../../src/assets/pixel.jpg')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.flagbackground}>
        <Image
          source={require('../../src/assets/flags.jpg')}
          style={styles.flagbackgroundImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Translate All{'\n'}Type Word</Text>
        <Text style={styles.subtitle}>Help You Communicate in Different{'\n'}Languages</Text>
      </View>

      <View style={styles.progressContainer}>
        <Progress.Circle
          size={100}
          progress={progress}
          thickness={8}
          showsText={true}
          textStyle={styles.progressText}
          color="#fff"
          unfilledColor="rgba(255, 255, 255, 0.3)"
          borderWidth={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  flagbackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flagbackgroundImage: {
    width: '100%',
    height: '30%',
    top: 100,
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '35%',
    top: 30,
  },

  textContainer: {
    alignItems: 'center',
    marginVertical: 280,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 20,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 150,
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
  },
});
