import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {scheduleOnRN} from "react-native-worklets";
import {Dimensions, StyleSheet, View} from "react-native";
// =====================================================
// STEP 1: Imports
// =====================================================
import * as React from "react";

// =====================================================
// STEP 2: Constants
// =====================================================
const {width} = Dimensions.get('window');
// const SHIFT_SIMPLE_MILESTONE = width * 0.3;
// const SHIFT_FULL_MILESTONE = width * 0.5;
// const SHIFT_FOR_ASK_MILESTONE = width * 0.5;

const SwipeCard = ({
                       children,
                       key,
                       item,
                       onRemove,
                       onArchive,
                       onFullSwipe,
                       doOpenModalToAsk,
                       SHIFT_SIMPLE_MILESTONE,
                       SHIFT_FULL_MILESTONE,
                       SHIFT_FOR_ASK_MILESTONE,
                       LeftOverlay,
                       RightOverlay,
                       // SwipableContent
                   }: {
    children: any;
    key: any;
    item: any;
    onRemove: (id: number) => void;
    onArchive: (id: number) => void;
    onFullSwipe: (id: number) => void;
    doOpenModalToAsk: (id: number, x: any, doAfterCancel: any) => void;
    SHIFT_SIMPLE_MILESTONE: number
    SHIFT_FULL_MILESTONE: number
    SHIFT_FOR_ASK_MILESTONE: number
    LeftOverlay: any
    RightOverlay: any
    // SwipableContent: any
}) => {
    // ---------------------------------------------------
    // STEP 4.1: Animation State
    // ---------------------------------------------------
    const translateX = useSharedValue(0);

    // ---------------------------------------------------
    // STEP 4.4: Reset on Card Tap
    // ---------------------------------------------------
    const resetCard = () => {
        translateX.value = withTiming(0);
    };

    // ----------------f-----------------------------------
    // STEP 4.2: Gesture
    // ---------------------------------------------------
    const pan = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
        })
        .onEnd(() => {
            // LEFT > 50% → DELETE IMMEDIATELY
            if (translateX.value < -SHIFT_FULL_MILESTONE) {
                translateX.value = withTiming(-width, {}, () =>
                    scheduleOnRN(onFullSwipe, item.mediaPostGUID)
                );
                console.log("case 1 SHIFT_FULL_MILESTONE")
            }
            // RIGHT > 45% → SHOW MODAL
            else if (translateX.value > SHIFT_FOR_ASK_MILESTONE) {
                translateX.value = withTiming(SHIFT_SIMPLE_MILESTONE);
                scheduleOnRN(doOpenModalToAsk, item.mediaPostGUID, translateX, resetCard);
                console.log("case 2 SHIFT_FOR_ASK_MILESTONE")
            }
            // LEFT < 50% → LOCK AT 30%
            else if (translateX.value < -100) {
                translateX.value = withTiming(-SHIFT_SIMPLE_MILESTONE);
                console.log("case 3")
            }
            // RIGHT < 50% → LOCK AT 30%
            else if (translateX.value > 100) {
                translateX.value = withTiming(SHIFT_SIMPLE_MILESTONE);
                console.log("case 4")
            }
            // RESET
            else {
                translateX.value = withTiming(0);
                console.log("case 5")
            }
        });

    // ---------------------------------------------------
    // STEP 4.3: Animated Styles
    // ---------------------------------------------------
    const cardStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));

    const leftOverlayStyle = useAnimatedStyle(() => ({
        opacity: translateX.value > 0 ? 1 : 0,
    }));

    const rightOverlayStyle = useAnimatedStyle(() => ({
        opacity: translateX.value < 0 ? 1 : 0,
    }));


    return (
        <View key={key} style={swipeSheet.cardWrapper}>
            {/* LEFT OVERLAY — ARCHIVE */}
            <LeftOverlay
                onCancel={resetCard}
                onArchive={() => onArchive(item.mediaPostGUID)}
                leftOverlayStatic={swipeSheet.leftOverlayStatic}
                leftOverlayStyle={leftOverlayStyle}
            />
            <RightOverlay
                onCancel={resetCard}
                onRemove={() => onRemove(item.mediaPostGUID)}
                rightOverlay={swipeSheet.rightOverlay}
                rightOverlayStyle={rightOverlayStyle}
            />

            {/* CARD */}
            <GestureDetector gesture={pan}>
                <Animated.View style={cardStyle}>

                    {children}

                </Animated.View>
            </GestureDetector>
        </View>
    );
};

export const swipeSheet = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12,
    },
    cardWrapper: {
        flex: 1,
        backgroundColor: 'pink',
        position: 'relative',
        marginBottom: 12,
    },
    card: {
        elevation: 3,
    },
    leftOverlayStatic: {
        // ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        left: 0,
        backgroundColor: '#1976d2',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 16,
        borderRadius: 8,
    },
    rightOverlay: {
        // ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        right: 0,
        backgroundColor: '#d32f2f',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 16,
        borderRadius: 8,
    },
    modal: {
        backgroundColor: 'white',
        padding: 24,
        margin: 24,
        borderRadius: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
});

export default SwipeCard