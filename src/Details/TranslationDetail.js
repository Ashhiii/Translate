import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';


const TranslationDetailScreen = ({ route, navigation }) => {
  const { translation } = route.params;
  if (!translation) return null;

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };
  return (
    <View style={styles.container}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Recents</Text>
          <View style={styles.textBox}>
        <Text style={styles.label}>Original Text</Text>
        <View style={styles.textRow}>
          <Text style={styles.text}>{translation.text}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(translation.text)}>
            <Ionicons name="copy" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textBox1}>
        <Text style={styles.label}>Translated Text</Text>
        <View style={styles.textRow}>
          <Text style={styles.text}>{translation.translated}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(translation.translated)}>
            <Ionicons name="copy" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  textBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  textBox1: {
    width: '100%',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  headerText: {
    position: 'absolute',
    top: 45,
    left: '38%',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    marginRight: 10,
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
});

export default TranslationDetailScreen;
