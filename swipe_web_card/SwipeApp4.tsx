// App.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, PanResponder, ScrollView, StyleSheet, Text, View,} from 'react-native';
import {Button, Card, useTheme,} from 'react-native-paper';

const CARD_HEIGHT = 220;
const CARD_BORDER_RADIUS = 12;

// Step 1: Define Card Data Type
type CardData = {
    id: number;
    title: string;
    content: string;
    color: string;
};

// Main App Component
const SwipeApp4 = () => {
    const theme = useTheme();

    // Step 2: Initialize cards state
    const [cards, setCards] = useState<CardData[]>([
        {id: 1, title: 'Card 1', content: 'Swipe me left or right!', color: '#4CAF50'},
        {id: 2, title: 'Card 2', content: 'Try swiping quickly or slowly', color: '#2196F3'},
        {id: 3, title: 'Card 3', content: 'See the smooth animation!', color: '#FF9800'},
    ]);

    console.log("SwipeApp4", cards);

    return (
        <>
            <View style={styles.container}>
                {/* Step 3: Render Card List */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {cards.map((card) => (
                        <SwipeableCard
                            key={card.id}
                            card={card}
                            setCards={setCards}
                            onDismiss={(id) => {
                                // Step 4: Remove card from list when dismissed
                                setCards((prev) => prev.filter((c) => c.id !== id));
                            }}
                        />
                    ))}

                    {cards.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>All cards have been swiped away!</Text>
                            <Button
                                mode="contained"
                                onPress={() => setCards([
                                    {id: 1, title: 'Card 1', content: 'Swipe me left or right!', color: '#4CAF50'},
                                    {
                                        id: 2,
                                        title: 'Card 2',
                                        content: 'Try swiping quickly or slowly',
                                        color: '#2196F3'
                                    },
                                    {id: 3, title: 'Card 3', content: 'See the smooth animation!', color: '#FF9800'},
                                ])}
                                style={styles.resetButton}
                            >
                                Reset Cards
                            </Button>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

// Step 5: Swipeable Card Component
interface SwipeableCardProps {
    card: CardData;
    setCards: any;
    onDismiss: (id: number) => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({setCards, card, onDismiss}) => {
    const {width: SCREEN_WIDTH} = Dimensions.get('window');
    const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5; // 50% threshold
    const PARTIAL_SWIPE = SCREEN_WIDTH * 0.3; // 30% for partial swipe

    // Step 6: Create animated values
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const lastOffset = useRef({x: 0});
    const velocityTracker = useRef({lastX: 0, lastTime: Date.now(), velocity: 0});

    // Step 7: Configure pan responder
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderGrant: () => {
                // Step 8: Reset translation when gesture starts
                lastOffset.current = {x: 0};
                translateX.setOffset(0);
                translateX.setValue(0);
            },
            onPanResponderMove: (_, gestureState) => {
                // Step 9: Calculate velocity
                const currentTime = Date.now();
                const deltaTime = currentTime - velocityTracker.current.lastTime;

                if (deltaTime > 0) {
                    const deltaX = gestureState.dx - velocityTracker.current.lastX;
                    velocityTracker.current.velocity = deltaX / deltaTime;
                }

                velocityTracker.current.lastX = gestureState.dx;
                velocityTracker.current.lastTime = currentTime;

                // Step 10: Apply translation with smooth boundary
                const newX = gestureState.dx;
                const absX = Math.abs(newX);

                // Add rubber band effect at boundaries
                let boundedX = newX;
                if (absX > SCREEN_WIDTH * 0.8) {
                    const overshoot = absX - SCREEN_WIDTH * 0.8;
                    boundedX = newX > 0
                        ? SCREEN_WIDTH * 0.8 + overshoot * 0.3
                        : -SCREEN_WIDTH * 0.8 - overshoot * 0.3;
                }

                translateX.setValue(boundedX);
            },
            onPanResponderRelease: (_, gestureState) => {
                // Step 11: Handle gesture release with velocity consideration
                translateX.flattenOffset();

                const currentX = gestureState.dx;
                const absX = Math.abs(currentX);
                const velocity = velocityTracker.current.velocity;
                const velocityFactor = Math.min(Math.abs(velocity) * 10, 2); // Speed parameter

                // Step 12: Determine if swipe exceeds threshold (with velocity consideration)
                const effectiveDistance = absX * velocityFactor;
                const shouldDismiss = effectiveDistance > SWIPE_THRESHOLD;

                if (shouldDismiss) {
                    // Step 13: Animate card off screen
                    Animated.parallel([
                        Animated.timing(translateX, {
                            toValue: currentX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
                            duration: 300 / velocityFactor, // Speed affects animation duration
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 300 / velocityFactor,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scale, {
                            toValue: 0.8,
                            duration: 300 / velocityFactor,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        // Step 14: Call onDismiss after animation completes
                        onDismiss(card.id);
                    });
                } else {
                    // Step 15: Handle partial swipe (less than 50%)
                    let targetX = 0;

                    if (absX > 10) { // Minimum swipe distance
                        if (currentX > 0) {
                            // Right swipe less than 50%
                            targetX = Math.min(currentX, PARTIAL_SWIPE);
                        } else {
                            // Left swipe less than 50%
                            targetX = Math.max(currentX, -PARTIAL_SWIPE);
                        }
                    }

                    // Step 16: Animate to partial position or back to center
                    Animated.spring(translateX, {
                        toValue: targetX,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }).start(() => {
                        if (targetX !== 0) {
                            lastOffset.current = {x: targetX};
                            translateX.setOffset(targetX);
                            translateX.setValue(0);
                        }
                    });
                }

                // Reset velocity tracker
                velocityTracker.current = {lastX: 0, lastTime: Date.now(), velocity: 0};
            },
        })
    ).current;

    // Step 17: Reset card position
    const resetCard = useCallback(() => {
        Animated.spring(translateX, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start(() => {
            lastOffset.current = {x: 0};
            translateX.setOffset(0);
            translateX.setValue(0);
        });
    }, [translateX]);


    // Step 18: Calculate swipe percentage for visual feedback
    const swipePercentage = translateX.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [-100, 0, 100],
        extrapolate: 'clamp',
    });

    const [currentPercentage, setCurrentPercentage] = useState(0);

    useEffect(() => {
        // Create listener
        const listenerId = swipePercentage.addListener(({value}) => {
            setCurrentPercentage(value);
        });

        if ((Math.abs(currentPercentage) > 50)) {
            // window.alert("Delete Item!!!")
            setCards((prev: any) => prev.filter((c: any) => c.id !== card.id));
        }

        // Clean up listener
        return () => {
            swipePercentage.removeListener(listenerId);
        };
    }, [swipePercentage]);
    // Step 19: Get underlay button based on swipe direction
    const getUnderlayContent = () => {
        let isRightSwipe = (currentPercentage) > 0;

        console.log("currentPercentage1", currentPercentage);

        if (Math.abs(currentPercentage) > 10) {
            return (
                <View style={[
                    styles.underlay,
                    isRightSwipe ? styles.underlayRight : styles.underlayLeft,
                ]}>
                    <Button
                        mode="contained"
                        onPress={resetCard}
                        style={styles.underlayButton}
                        labelStyle={styles.underlayButtonText}
                    >
                        {isRightSwipe ? 'Close2' : 'Close1'}
                    </Button>
                </View>
            );
        }

        return null;
    };

    // Step 20: Interpolate background color based on swipe
    const cardStyle = {
        transform: [
            {translateX},
            {scale}
        ],
        opacity,
    };

    // Step 21: Calculate card color based on swipe direction and speed
    const backgroundColor = swipePercentage.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ['#FF6B6B', card.color, '#4ECDC4'],
    });

    return (
        <View style={styles.cardWrapper}>
            {getUnderlayContent()}

            <Animated.View
                style={[
                    styles.cardContainer,
                    cardStyle,
                    {backgroundColor}
                ]}
                {...panResponder.panHandlers}
            >
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text style={styles.cardContent}>{card.content}</Text>

                        {/* Step 22: Visual indicator for swipe progress */}
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, {
                                paddingLeft: 100,
                                paddingRight: 100,
                            }]}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: Math.trunc(Math.abs(currentPercentage) * 1000 / 100),
                                        }
                                    ]}
                                />
                            </View>
                            <Animated.Text style={styles.percentageText}>
                                {Math.trunc(currentPercentage)}
                            </Animated.Text>
                        </View>

                        {/* Step 23: Instructions */}
                        <View style={styles.instructions}>
                            <Text style={styles.instructionText}>← Swipe left for Close1</Text>
                            <Text style={styles.instructionText}>Swipe right for Close2 →</Text>
                        </View>
                    </Card.Content>
                </Card>
            </Animated.View>
        </View>
    );
};

// Step 24: Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        backgroundColor: 'lightgreen',
        gap: 20,
        // paddingBottom: 30,
    },
    cardWrapper: {
        height: CARD_HEIGHT,
        position: 'relative',
    },
    underlay: {
        position: 'absolute',
        // top: 10,
        // bottom: 0,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        zIndex: 0,
    },
    underlayLeft: {
        // backgroundColor: 'rgba(255, 107, 107, 0.1)',
        backgroundColor: "red",
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    underlayRight: {
        // backgroundColor: 'rgba(78, 205, 196, 0.1)',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: "blue"
    },
    underlayButton: {
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    underlayButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    cardContainer: {
        position: 'absolute',
        width: '100%',
        height: CARD_HEIGHT,
        borderRadius: CARD_BORDER_RADIUS,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: CARD_BORDER_RADIUS,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    cardContent: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    progressContainer: {
        marginTop: 10,
        marginBottom: 15,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 5,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2196F3',
    },
    percentageText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    instructions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 5,
    },
    instructionText: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    resetButton: {
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 25,
    },
});

export default SwipeApp4