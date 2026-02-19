import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

// Dummy data for 5 items
const data = Array.from({ length: 5 }, (_, i) => ({ id: i, color: `hsl(${i * 72}, 70%, 60%)` }));

export default function AnimatedList() {
    return (
        <View style={styles.container}>
            {data.map((item) => (
                <DraggableItem key={item.id} color={item.color} />
            ))}
        </View>
    );
}

function DraggableItem({ color }: { color: string }) {
    // Each item has its own translation values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    // Pan gesture for this specific item
    const panGesture = Gesture.Pan()
        .onStart(() => {
            // Store the initial position so that we can add deltas
            startX.value = translateX.value;
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateX.value = startX.value + event.translationX;
            translateY.value = startY.value + event.translationY;
        })
        .onEnd(() => {
            // Optional: spring back to original position when released
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        });

    // Animated style bound to this item's shared values
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.box, { backgroundColor: color }, animatedStyle]} />
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    box: {
        width: 80,
        height: 80,
        borderRadius: 12,
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});