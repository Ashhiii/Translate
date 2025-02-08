import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const Dashboard = () => {
  const navigation = useNavigation(); 
  const [recentTranslations, setRecentTranslations] = useState([]);
  
  const bounceValue = useState(new Animated.Value(1))[0]; 

  useEffect(() => {
    Animated.loop(
      Animated.sequence([ 
        Animated.spring(bounceValue, { 
          toValue: 1.2, 
          friction: 3, 
          useNativeDriver: true, 
        }), 
        Animated.spring(bounceValue, { 
          toValue: 1, 
          friction: 3, 
          useNativeDriver: true, 
        }), 
      ])
    ).start();
  }, [bounceValue]);

  useFocusEffect(
    useCallback(() => {
      const fetchTranslations = async () => {
        try {
          const storedTranslations = await AsyncStorage.getItem('translations');
          if (storedTranslations) {
            setRecentTranslations(JSON.parse(storedTranslations));
          }
        } catch (error) {
          console.error('Error fetching translations:', error);
        }
      };
  
      fetchTranslations();
    }, [])
  );

  const deleteTranslation = async (index) => {
    try {
      const updatedTranslations = recentTranslations.filter((_, i) => i !== index);
      setRecentTranslations(updatedTranslations);
      await AsyncStorage.setItem('translations', JSON.stringify(updatedTranslations));
    } catch (error) {
      console.error('Error deleting translation:', error);
    }
  };

  const viewTranslationDetails = (translation) => {
    navigation.navigate('Details', { translation });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Translate Everything</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.replace('Translate')}
          >
            <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
              <Text style={styles.startButtonText}>Start</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
        <Image source={require('../../src/assets/cp.jpg')} style={[styles.headerImage, styles.invertedImage]} />
      </View>

      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentText}>Recent Translate</Text>
        </View>

        <ScrollView contentContainerStyle={styles.recentScrollView} showsVerticalScrollIndicator={false}>
          {recentTranslations.length > 0 ? (
            recentTranslations.map((translation, index) => (
              <View key={index} style={styles.translationCard}>
                <TouchableOpacity
                  onPress={() => viewTranslationDetails(translation)} // Navigate to detail screen
                  style={styles.translationRow}
                >
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagText}>{translation.fromFlag}</Text>
                  </View>
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagText}>{translation.toFlag}</Text>
                  </View>
                  <Text style={styles.translationText}>{`${translation.from} to ${translation.to}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTranslation(index)} style={styles.deleteButton}>
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noRecentText}>No recent translations yet.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#a8dadc',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
    top: 30,
  },     
  headerContent: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  startButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    width: 150, 
    alignItems: 'center', 
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  headerImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    top: 20,
    left: 20,
  },
  invertedImage: {
    transform: [{ scaleX: -1 }],
  },
  recentContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    flex: 1,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentScrollView: {
    paddingBottom: 20,
  },
  translationCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#908C8C',
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E7E6E6',
    marginHorizontal: -5,
  },
  flagText: {
    fontSize: 28,
  },
  translationText: {
    fontSize: 18,
    marginLeft: 20,
    color: '#000000',
    flex: 1,
  },
  deleteButton: {
    padding: 10,
  },
  noRecentText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default Dashboard;