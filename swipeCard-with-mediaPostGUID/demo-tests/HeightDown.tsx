// App.tsx - All components in one file
import React, {useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, View,} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import Animated, {
    FadeInDown,
    FadeOut,
    LinearTransition,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

// Step 3: Define the main App component
const App: React.FC = () => {
    // Step 4: Define state and shared values for animation
    const [isAnimating, setIsAnimating] = useState(false);
    const cardHeight = useSharedValue(200);
    const originalHeight = 200;


    // Step 5: Create animated style for the card
    const animatedCardStyle = useAnimatedStyle(() => {
        return {
            height: cardHeight.value,
            overflow: 'hidden' as const,
        };
    });

    // Step 6: Handle button press to trigger animation
    // Step 10: Render the application

    const handleButtonPress = () => {
        setIsAnimating(true);

        if (cardHeight.value === originalHeight) {
            // Step 7: Animate height reduction (top to bottom)
            cardHeight.value = withSpring(50, {
                duration: 2000,
                // easing: Easing.inOut(Easing.ease),
                reduceMotion: ReduceMotion.System,
            });
        } else {
            // Step 8: Reset to original height
            cardHeight.value = withSpring(originalHeight, {
                duration: 900,
                // easing: Easing.inOut(Easing.ease),
                reduceMotion: ReduceMotion.System,
            });
        }

        // Step 9: Reset animation state
        setTimeout(() => setIsAnimating(false), 1000);
    };

    const [showCard, setShowCard] = useState(false)

    const _damping = 14
    const _duration = 3000

    const _entering = FadeInDown.duration(_duration).springify().damping(_damping)
    const _exiting = FadeOut.duration(_duration).springify().damping(_damping)
    const _layout = LinearTransition.springify().damping(_damping)

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Step 11: Header Section */}
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Animated Card Demo
                    </Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Press Button to animate the card height
                    </Text>
                </View>

                {showCard &&
                    <Animated.View
                        entering={_entering}
                        exiting={_exiting}
                        layout={_layout}
                    >
                        <Card>
                            <Card.Content>
                                <View style={{height: 100, width: 300, backgroundColor: 'pink'}}>
                                    <Text variant="labelSmall">
                                        Current Card
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </Animated.View>
                }

                {/* Step 12: Main Content Area */}
                <View style={styles.content}>
                    {/* Step 13: Animated Card */}
                    <Animated.View style={[
                        styles.cardContainer, animatedCardStyle]}
                    >
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <Text variant="titleLarge" style={styles.cardTitle}>
                                    Animated Card
                                </Text>
                                <Text variant="bodyMedium" style={styles.cardText}>
                                    This card will animate its height when you press the button.
                                    The animation reduces height from top to bottom.
                                </Text>
                                <View style={styles.cardIndicator}>
                                    <Text variant="labelSmall" style={styles.indicatorText}>
                                        Current Height: {Math.round(cardHeight.value)}px
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </Animated.View>

                    {/* Step 14: Animation Controls */}
                    <View style={styles.controls}>
                        <Button
                            mode="contained"
                            onPress={() => {
                                setShowCard(!showCard)
                                handleButtonPress()

                            }}
                            loading={isAnimating}
                            disabled={isAnimating}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                            icon="animation-play"
                        >
                            Do It
                        </Button>

                        {/* Step 15: Instructions */}
                        <View style={styles.instructions}>
                            <Text variant="bodySmall" style={styles.instructionText}>
                                • The card height animates from {originalHeight}px to 50px
                            </Text>
                            <Text variant="bodySmall" style={styles.instructionText}>
                                • Animation duration: 1000ms
                            </Text>
                            <Text variant="bodySmall" style={styles.instructionText}>
                                • Press again to reset
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Step 16: Footer */}
                <View style={styles.footer}>
                    <Text variant="labelSmall" style={styles.footerText}>
                        React 19 • Expo • TypeScript
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Step 17: Define responsive styles
const {width, height} = Dimensions.get('window');
const isMobile = width < 768;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        backgroundColor: 'pink',
        flex: 1,
        padding: isMobile ? 16 : 24,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: isMobile ? 24 : 32,
        paddingTop: isMobile ? 8 : 16,
    },
    title: {
        fontWeight: 'bold',
        color: '#6200ee',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
        maxWidth: 400,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: isMobile ? 20 : 40,
    },
    cardContainer: {
        width: isMobile ? width * 0.9 : 400,
        marginBottom: 40,
    },
    card: {
        flex: 1,
        elevation: 4,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    cardContent: {
        flex: 1,
        padding: isMobile ? 16 : 24,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    cardText: {
        color: '#555',
        lineHeight: 20,
        marginBottom: 16,
    },
    cardIndicator: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    indicatorText: {
        color: '#6200ee',
        fontWeight: '500',
    },
    controls: {
        alignItems: 'center',
        width: '100%',
    },
    button: {
        width: isMobile ? width * 0.7 : 300,
        borderRadius: 8,
        backgroundColor: '#6200ee',
        elevation: 2,
    },
    buttonContent: {
        height: isMobile ? 48 : 56,
    },
    instructions: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        width: isMobile ? width * 0.85 : 350,
        elevation: 2,
    },
    instructionText: {
        color: '#666',
        marginBottom: 4,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginTop: 'auto',
    },
    footerText: {
        color: '#888',
    },
});

// Step 18: Export the App component
export default App;

