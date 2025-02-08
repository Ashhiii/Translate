import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Animated, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

const translateText = async (text, fromLang, toLang) => {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed.";
  }
};

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭' }, 
  { code: 'es', label: 'Spanish', flag: '🇪🇸' }, 
  { code: 'it', label: 'Italian', flag: '🇮🇹' }, 
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' }, 
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' }, 
  { code: 'tr', label: 'Turkish', flag: '🇹🇷' }, 
  { code: 'pl', label: 'Polish', flag: '🇵🇱' },
  { code: 'nl', label: 'Dutch', flag: '🇳🇱' }, 
  { code: 'sv', label: 'Swedish', flag: '🇸🇪' }, 
  { code: 'no', label: 'Norwegian', flag: '🇳🇴' }, 
  { code: 'da', label: 'Danish', flag: '🇩🇰' }, 
  { code: 'fi', label: 'Finnish', flag: '🇫🇮' }, 
  { code: 'cs', label: 'Czech', flag: '🇨🇿' }, 
  { code: 'he', label: 'Hebrew', flag: '🇮🇱' }, 
  { code: 'th', label: 'Thai', flag: '🇹🇭' }, 
  { code: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { code: 'ceb', label: 'Bisaya / Cebuano', flag: '🇵🇭' },
  { code: 'hu', label: 'Hungarian', flag: '🇭🇺' },
  { code: 'ro', label: 'Romanian', flag: '🇷🇴' },
  { code: 'bg', label: 'Bulgarian', flag: '🇧🇬' },
  { code: 'el', label: 'Greek', flag: '🇬🇷' },
  { code: 'uk', label: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ms', label: 'Malay', flag: '🇲🇾' },
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { code: 'bn', label: 'Bengali', flag: '🇧🇩' },
  { code: 'ur', label: 'Urdu', flag: '🇵🇰' },
  { code: 'fa', label: 'Persian', flag: '🇮🇷' },
  { code: 'sr', label: 'Serbian', flag: '🇷🇸' },
  { code: 'sk', label: 'Slovak', flag: '🇸🇰' },
  { code: 'sl', label: 'Slovenian', flag: '🇸🇮' },
  { code: 'et', label: 'Estonian', flag: '🇪🇪' },
  { code: 'lv', label: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', label: 'Lithuanian', flag: '🇱🇹' },
  { code: 'mt', label: 'Maltese', flag: '🇲🇹' },
  { code: 'sw', label: 'Swahili', flag: '🇰🇪' },
  { code: 'xh', label: 'Xhosa', flag: '🇿🇦' },
  { code: 'zu', label: 'Zulu', flag: '🇿🇦' },
  { code: 'sq', label: 'Albanian', flag: '🇦🇱' },
  { code: 'mk', label: 'Macedonian', flag: '🇲🇰' },
  { code: 'hy', label: 'Armenian', flag: '🇦🇲' },
  { code: 'is', label: 'Icelandic', flag: '🇮🇸' },
  { code: 'mn', label: 'Mongolian', flag: '🇲🇳' },
  { code: 'si', label: 'Sinhala', flag: '🇱🇰' },
  { code: 'my', label: 'Burmese', flag: '🇲🇲' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', flag: '🇮🇳' }
];

const Translate = ({ navigation }) => {
  const [fromLanguage, setFromLanguage] = useState(languages[1]);
  const [toLanguage, setToLanguage] = useState(languages[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const fadeAnim = new Animated.Value(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(languages);

  const saveTranslation = async () => {
    if (!inputText.trim() || !translatedText.trim()) return;
  
    const newTranslation = {
      from: fromLanguage.label,
      to: toLanguage.label,
      fromFlag: fromLanguage.flag,
      toFlag: toLanguage.flag,
      text: inputText,
      translated: translatedText,
    };
  
    try {
      const storedTranslations = await AsyncStorage.getItem('translations');
      const translations = storedTranslations ? JSON.parse(storedTranslations) : [];
      const updatedTranslations = [newTranslation, ...translations].slice(0, 10);
  
      await AsyncStorage.setItem('translations', JSON.stringify(updatedTranslations));
  
      console.log('Saved Translations:', updatedTranslations); // Debugging
  
      Alert.alert('Saved!', 'Translation has been saved.');
  
      // Navigate to TranslationDetailScreen and pass the saved translation
      navigation.navigate('Details', { translation: newTranslation });
  
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };
  
  useEffect(() => {
    setFilteredLanguages(
      languages.filter(lang => lang.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);
  
  useEffect(() => {
    if (inputText.trim() !== "") {
      translateText(inputText, fromLanguage.code, toLanguage.code)
        .then(setTranslatedText)
        .catch(() => setTranslatedText("Error in translation"));
    } else {
      setTranslatedText("");
    }
  }, [inputText, fromLanguage, toLanguage]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [translatedText]);

  const toggleModal = (side) => {
    setSelectedSide(side);
    setModalVisible(true);
  };

  const handleLanguageSelect = (language) => {
    if (selectedSide === 'from') {
      setFromLanguage(language);
    } else {
      setToLanguage(language);
    }
    setModalVisible(false);
  };

  const handleSwap = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  };

  const handleCopy = () => {
    Clipboard.setString(translatedText);
  };

  const handleBack = () => {
    navigation.replace('Dashboard');
    setInputText('');
    setTranslatedText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
         <Text style={styles.headerText}>Translate</Text>

        <TouchableOpacity style={styles.languageButton} onPress={() => toggleModal('from')}>
          <Text style={styles.flagText}>{fromLanguage.flag}</Text>
          <Text style={styles.languageText}>{fromLanguage.label}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Icon name="swap-horiz" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.languageButton} onPress={() => toggleModal('to')}>
          <Text style={styles.flagText}>{toLanguage.flag}</Text>
          <Text style={styles.languageText}>{toLanguage.label}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder={`Type in ${fromLanguage.label}...`}
        value={inputText}
        onChangeText={setInputText}
        multiline
      />

      <Animated.View style={[styles.translationContainer, { opacity: fadeAnim }]}>
        <Text style={styles.translationText}>{translatedText}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Icon name="content-copy" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveTranslation}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      </Animated.View>

      <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search language..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredLanguages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageSelect(item)}>
                <Text style={styles.languageOptionText}>{item.flag} {item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
    top: 90,
  },
  backButton: {
    position: 'absolute',
    left: -10,
    top: -60,
    zIndex: 1,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 50,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyButton: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    position: 'absolute',
    bottom: 80,
    left: '38%',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  swapButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 50,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  translationContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  translationText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%', // Limit the modal height
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
    bottom: 30,
  },
  searchInput: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 10,
    top: -5
  },
});

export default Translate;
