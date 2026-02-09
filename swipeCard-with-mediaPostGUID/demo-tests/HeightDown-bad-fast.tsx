// HeightDown.tsx
// Step 1: Import all required dependencies
import React, {useCallback, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View,} from 'react-native';
import {Button, Card, Text as PaperText,} from 'react-native-paper';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming,} from 'react-native-reanimated';
// react-native-worklets

const finalHeight = 0

// Step 2: Define main functional component
export default function HeightDown() {
    // Step 3: Initialize animation values
    const cardHeight = useSharedValue(200);
    const [animationActive, setAnimationActive] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);

    // Step 4: Get screen dimensions for responsiveness
    const {width, height} = Dimensions.get('window');
    const isMobile = width < 768;

    // Step 5: Define animation function
    const startAnimation = useCallback(() => {
        // Reset animation state
        setAnimationActive(true);
        setAnimationComplete(false);

        // Step 6: Animate card height reduction from top to bottom
        cardHeight.value = withTiming(
            finalHeight,
            {
                duration: 13000,
                easing: Easing.inOut(Easing.ease),
            },
            (finished) => {
                if (finished) {
                    setAnimationComplete(true);
                }
            }
        );
    }, []);

    // Step 7: Reset animation function
    const resetAnimation = useCallback(() => {
        cardHeight.value = withTiming(200, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
        });
        setAnimationActive(false);
        setAnimationComplete(false);
    }, []);

    // Step 8: Create animated style for the card
    const animatedCardStyle = useAnimatedStyle(() => {
        return {
            height: cardHeight.value,
            overflow: 'hidden' as const,
        };
    });

    // Step 9: Render the main application
    return (
        <View style={[
            styles.container,
            {padding: isMobile ? 16 : 32}
        ]}>

            {/* Step 10: App Header */}
            <View style={styles.header}>
                <PaperText variant="headlineMedium" style={styles.title}>
                    Animated Card App
                </PaperText>
                <PaperText variant="bodyMedium" style={styles.subtitle}>
                    Press "Do It" to see the card shrink from top to bottom
                </PaperText>
            </View>

            {/* Step 11: Main content area */}
            <View style={styles.content}>

                {/* Step 12: Only one animated card */}
                <Animated.View style={[animatedCardStyle, styles.cardContainer]}>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <PaperText variant="titleLarge" style={styles.cardTitle}>
                                Animated Card
                            </PaperText>
                            <PaperText variant="bodyMedium" style={styles.cardText}>
                                {animationActive
                                    ? 'Card is shrinking from top to bottom...'
                                    : 'This card will animate when you press the button'}
                            </PaperText>

                            {/* Step 13: Show current height */}
                            <View style={styles.heightIndicator}>
                                <PaperText variant="labelSmall" style={styles.heightText}>
                                    Current Height: {Math.round(cardHeight.value)}px
                                </PaperText>
                            </View>

                            {/* Step 14: Show animation status */}
                            <View style={styles.statusContainer}>
                                <PaperText variant="bodySmall" style={[
                                    styles.statusText,
                                    {color: animationActive ? '#4CAF50' : '#757575'}
                                ]}>
                                    Status: {animationActive
                                    ? (animationComplete ? 'Complete' : 'Animating...')
                                    : 'Ready'}
                                </PaperText>
                            </View>
                        </Card.Content>
                    </Card>
                </Animated.View>

                {/* Step 15: Action buttons container */}
                <View style={[
                    styles.buttonContainer,
                    {marginTop: isMobile ? 24 : 32}
                ]}>

                    {/* Step 16: Only one "Do It" button */}
                    <Button
                        mode="contained"
                        onPress={startAnimation}
                        disabled={animationActive && !animationComplete}
                        style={[
                            styles.button,
                            isMobile && styles.buttonMobile
                        ]}
                        contentStyle={styles.buttonContent}
                    >
                        Do It
                    </Button>

                    {/* Step 17: Reset button (optional, for better UX) */}
                    <Button
                        mode="outlined"
                        onPress={resetAnimation}
                        style={[
                            styles.resetButton,
                            isMobile && styles.buttonMobile,
                            {marginTop: 12}
                        ]}
                        contentStyle={styles.buttonContent}
                    >
                        Reset
                    </Button>

                    {/* Step 18: Instructions section */}
                    <View style={styles.instructions}>
                        <PaperText variant="bodySmall" style={styles.instructionsText}>
                            Press "Do It" to start the animation. The card height will reduce
                            from top to bottom over 2 seconds.
                        </PaperText>
                    </View>
                </View>

                {/* Step 19: Device info display */}
                <View style={styles.deviceInfo}>
                    <PaperText variant="labelSmall" style={styles.deviceInfoText}>
                        {isMobile ? 'Mobile View' : 'Web/Tablet View'} |
                        Screen: {Math.round(width)}x{Math.round(height)}
                    </PaperText>
                </View>
            </View>

            {/* Step 20: Footer */}
            <View style={styles.footer}>
                <PaperText variant="bodySmall" style={styles.footerText}>
                    React 19 + Expo + TypeScript + React Native Paper
                </PaperText>
            </View>
        </View>
    );
}

// Step 21: Define all styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: Platform.OS === 'web' ? 16 : 8,
    },
    title: {
        fontWeight: 'bold',
        color: '#6200ee',
        textAlign: 'center',
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        width: '100%',
        maxWidth: 600,
        marginHorizontal: 'auto',
    },
    card: {
        flex: 1,
        elevation: 4,
        borderRadius: 12,
    },
    cardContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    cardText: {
        color: '#555',
        lineHeight: 20,
        marginBottom: 16,
    },
    heightIndicator: {
        backgroundColor: '#e3f2fd',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 12,
    },
    heightText: {
        color: '#1976d2',
        fontWeight: '500',
    },
    statusContainer: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    statusText: {
        fontWeight: '500',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#6200ee',
    },
    buttonMobile: {
        height: 50,
    },
    buttonContent: {
        height: 48,
    },
    resetButton: {
        width: '100%',
        borderRadius: 8,
        borderColor: '#6200ee',
    },
    instructions: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    instructionsText: {
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 18,
    },
    deviceInfo: {
        marginTop: 24,
        padding: 12,
        backgroundColor: '#e8eaf6',
        borderRadius: 6,
    },
    deviceInfoText: {
        color: '#3949ab',
        textAlign: 'center',
    },
    footer: {
        paddingVertical: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginTop: 24,
    },
    footerText: {
        color: '#666',
    },
});