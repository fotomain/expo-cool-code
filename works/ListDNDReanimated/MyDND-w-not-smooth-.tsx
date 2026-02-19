import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, LayoutAnimation, UIManager, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_HEIGHT = 80;
const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
];

const initialData = Array.from({ length: 1000 }, (_, i) => ({
    id: `item-${i}`,
    number: i + 1,
    color: COLORS[i % COLORS.length],
}));

// Separate component for each list item – this is where hooks are allowed
// @ts-ignore
const ListItem = React.memo(({ item, index, onReorder, dataLength }) => {
    // Shared values for this item's drag state
    const isDragging = useSharedValue(false);
    const translateY = useSharedValue(0);
    const startY = useSharedValue(0);

    // Reorder function (will be called from UI thread via runOnJS)
    const finishReorder = useCallback((fromIndex: any, toIndex: any) => {
        onReorder(fromIndex, toIndex);
    }, [onReorder]);

    // Create the pan gesture – memoized so it doesn't get recreated on every render
    const panGesture = useMemo(() =>
            Gesture.Pan()
                .onStart(() => {
                    isDragging.value = true;
                    startY.value = translateY.value;
                })
                .onUpdate((event) => {
                    translateY.value = startY.value + event.translationY;
                })
                .onEnd(() => {
                    // Calculate target index based on final translation
                    const finalOffset = translateY.value;
                    const targetIndex = Math.round(index + finalOffset / ITEM_HEIGHT);
                    const clampedIndex = Math.min(Math.max(targetIndex, 0), dataLength - 1);

                    if (clampedIndex !== index) {
                        runOnJS(finishReorder)(index, clampedIndex);
                    }

                    // Spring back to original position
                    translateY.value = withSpring(0);
                    isDragging.value = false;
                })
        , [index, dataLength, finishReorder]);

    // Animated style – only applied when this item is being dragged
    const animatedStyle = useAnimatedStyle(() => {
        if (isDragging.value) {
            return {
                transform: [{ translateY: translateY.value }],
                zIndex: 10,
                elevation: 10,
                shadowOpacity: 0.3,
                shadowRadius: 10,
            };
        }
        return {
            transform: [{ translateY: 0 }],
            zIndex: 0,
            elevation: 0,
            shadowOpacity: 0.1,
            shadowRadius: 4,
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                style={[
                    styles.item,
                    { backgroundColor: item.color },
                    animatedStyle,
                ]}
            >
                <Text style={styles.number}>{item.number}</Text>
            </Animated.View>
        </GestureDetector>
    );
});

export default function ReorderableList() {
    const [data, setData] = useState(initialData);

    const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setData((prev) => {
            const newData = [...prev];
            const [movedItem] = newData.splice(fromIndex, 1);
            newData.splice(toIndex, 0, movedItem);
            return newData;
        });
    }, []);


    const renderItem = ({ item, index }: { item: typeof initialData[0]; index: number }) => (
        <ListItem
            // @ts-ignore
            item={item}
            index={index}
            onReorder={reorderItems}
            dataLength={data.length}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                contentContainerStyle={styles.listContent}
                removeClippedSubviews
                maxToRenderPerBatch={20}
                windowSize={10}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingVertical: 10,
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    number: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});