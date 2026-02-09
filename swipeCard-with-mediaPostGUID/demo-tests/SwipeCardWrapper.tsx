import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, PanResponder, StyleSheet, useWindowDimensions, View,} from 'react-native';


const SWIPE_PERCENTAGE_TO_DELETE_ITEM = 50;

export interface SwipeableCardProps {
    item: any;
    itemIndex: number;
    cardView: any;
    onSwipedFully: (id: number) => void;
    uderlayLeft: any;
    uderlayRight: any;
    swipeControllers: any;
}

const SwipeCardWrapper: React.FC<SwipeableCardProps> = (props: SwipeableCardProps) => {

    const {
        cardView,
        uderlayLeft,
        uderlayRight,
        item,
        onSwipedFully
    } = props;

    const {width: SCREEN_WIDTH} = useWindowDimensions();

    useEffect(() => {

        console.log("swipeControllers close0");

        props.swipeControllers.current[props.itemIndex] = {
            close: () => {
                console.log("swipeControllers close1");
                lastOffset.current = {x: 0};
                translateX.setOffset(0);
                translateX.setValue(0);
            },
        };

        return () => {
            delete props.swipeControllers.current[props.itemIndex];
        };
    }, [props.itemIndex]);


    const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4; // 50% threshold
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
                console.log("onPanResponderGrant0");
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
                console.log("onPanResponderRelease0 shouldDismiss", shouldDismiss);

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
                        // see listenet to check percentage !!!
                        setHideCard(true);
                        onSwipedFully(item.id);
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

    const [hideCard, setHideCard] = useState(false);

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

        // if ((Math.abs(currentPercentage) > SWIPE_PERCENTAGE_TO_DELETE_ITEM)) {
        //     // window.alert("Delete Item!!!")
        //     onSwipedFully(item.id);
        // }

        // Clean up listener
        return () => {
            swipePercentage.removeListener(listenerId);
        };
    }, [swipePercentage]);
    // Step 19: Get underlay button based on swipe direction
    const getUnderlayContent = () => {
        let isRightSwipe = (currentPercentage) > 0;

        console.log("currentPercentage1", currentPercentage);

        if (!hideCard) {
            // if (Math.abs(currentPercentage) > 10) {
            return (
                <View style={[
                    stylesToSwipe.underlay,
                    isRightSwipe ? stylesToSwipe.underlayRight : stylesToSwipe.underlayLeft,
                ]}>
                    {isRightSwipe && uderlayLeft}
                    {!isRightSwipe && uderlayRight}
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
        outputRange: ['#FF6B6B', item.color, '#4ECDC4'],
    });

    return (
        <View style={stylesToSwipe.cardWrapper}>
            {getUnderlayContent()}

            <Animated.View
                style={[
                    cardStyle,
                    {backgroundColor}
                ]}
                {...panResponder.panHandlers}
            >
                {cardView}
            </Animated.View>
        </View>
    );
};

// Step 24: Styles
export const stylesToSwipe = StyleSheet.create({
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
        position: 'relative',
    },
    underlay: {
        position: 'absolute',
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

export default SwipeCardWrapper