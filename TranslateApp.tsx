import {useState} from "react"
import {Alert, StyleSheet, View} from "react-native"
import axios from "axios"
import {Button, Card, Provider as PaperProvider, Text, TextInput, Title} from "react-native-paper"

// Supported languages for translation
const SUPPORTED_LANGUAGES = [
    {code: "ar", name: "Arabic"},
    {code: "zh", name: "Chinese"},
    {code: "nl", name: "Dutch"},
    {code: "fr", name: "French"},
    {code: "de", name: "German"},
    {code: "hi", name: "Hindi"},
    {code: "it", name: "Italian"},
    {code: "ja", name: "Japanese"},
    {code: "ko", name: "Korean"},
    {code: "pt", name: "Portuguese"},
    {code: "ru", name: "Russian"},
    {code: "es", name: "Spanish"},
]

const App = () => {
    const [text, setText] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [translationResult, setTranslationResult] = useState("")
    const [loading, setLoading] = useState(false)

    const translateText = async () => {
        if (!text.trim()) {
            Alert.alert("Error", "Please enter test to translate")
            return
        }

        if (!selectedLanguage.trim()) {
            Alert.alert("Error", "Please select a target language")
            return
        }

        const language = SUPPORTED_LANGUAGES.find(
            (lang) =>
                lang.name.toLowerCase() === selectedLanguage.toLowerCase() ||
                lang.code.toLowerCase() === selectedLanguage.toLowerCase(),
        )

        if (!language) {
            Alert.alert("Error", "Unsupported language. Please select from the available options.")
            return
        }

        setLoading(true)
        try {
            // Using LibreTranslate API (free alternative to translated.net)
            const response = await axios.post("https://libretranslate.de/translate", {
                q: text,
                source: "en",
                target: language.code,
                format: "text",
            })

            if (response.data && response.data.translatedText) {
                setTranslationResult(response.data.translatedText)
            } else {
                throw new Error("Translation failed")
            }
        } catch (error) {
            console.error("Translation error:", error)
            Alert.alert("Error", "Translation failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Filter languages for autocomplete
    const filteredLanguages = SUPPORTED_LANGUAGES.filter(
        (lang) =>
            lang.name.toLowerCase().includes(selectedLanguage.toLowerCase()) ||
            lang.code.toLowerCase().includes(selectedLanguage.toLowerCase()),
    )

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>Translation App</Title>

                        {/* Text Input Field */}
                        <TextInput
                            label="Enter text to translate (English)"
                            value={text}
                            onChangeText={setText}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />

                        {/* Language Selection with Autocomplete */}
                        <TextInput
                            label="Select target language"
                            value={selectedLanguage}
                            onChangeText={setSelectedLanguage}
                            mode="outlined"
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            right={
                                <TextInput.Icon
                                    icon="menu-down"
                                    onPress={() => {
                                        // Show first suggestion or clear
                                        if (filteredLanguages.length > 0) {
                                            setSelectedLanguage(filteredLanguages[0].name)
                                        }
                                    }}
                                />
                            }
                        />

                        {/* Language Suggestions */}
                        {selectedLanguage.length > 0 && filteredLanguages.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {filteredLanguages.slice(0, 3).map((lang) => (
                                    <Button
                                        key={lang.code}
                                        mode="outlined"
                                        compact
                                        onPress={() => setSelectedLanguage(lang.name)}
                                        style={styles.suggestionButton}
                                    >
                                        {lang.name} ({lang.code})
                                    </Button>
                                ))}
                            </View>
                        )}

                        {/* Available Languages Hint */}
                        <Text style={styles.hint}>
                            Available: {SUPPORTED_LANGUAGES.map((lang) => lang.name).join(", ")}
                        </Text>

                        {/* Translate Button */}
                        <Button
                            mode="contained"
                            onPress={translateText}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            icon="translate"
                        >
                            Translate
                        </Button>

                        {/* Translation Result */}
                        <TextInput
                            label="Translation Result"
                            value={translationResult}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                            editable={false}
                        />
                    </Card.Content>
                </Card>
            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 16,
    },
    card: {
        marginTop: 40,
    },
    container: {
        backgroundColor: "#f5f5f5",
        flex: 1,
        padding: 16,
    },
    hint: {
        color: "gray",
        fontSize: 12,
        fontStyle: "italic",
        marginBottom: 8,
    },
    input: {
        marginBottom: 16,
    },
    suggestionButton: {
        margin: 2,
    },
    suggestionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    title: {
        marginBottom: 20,
        textAlign: "center",
    },
})

export default App
