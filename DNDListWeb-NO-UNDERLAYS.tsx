import {useCallback, useEffect, useState} from 'react';
import {LayoutChangeEvent, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';


import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import {runOnJS} from 'react-native-worklets';
import {mediaPostInterface} from "@/mi/state/enities/posts/mediaPostsSlice";
import SwipeableItem from "react-native-swipeable-item";

// type Row = { mediaPostGUID: string; mediaPostOwnerGUID: string };

const SEPARATOR_HEIGHT = 16;


const DNDListWeb = (props: any) => {
    const [items, setItems] = useState<mediaPostInterface[]>(
        props.itemsData
    );

    console.log("█████ items1", items)

    const contentContainerStyle: StyleProp<ViewStyle> = {
        flexDirection: "column",
        gap: SEPARATOR_HEIGHT,
        paddingBottom: SEPARATOR_HEIGHT,
    };

    const draggedIndex = useSharedValue<number | null>(null);
    const offsetY = useSharedValue(0);

    const moveItem = useCallback((fromIndex: number, toIndex: number) => {
        setItems((prev) => {
            const newItems = [...prev];

            newItems.splice(toIndex, 0, newItems.splice(fromIndex, 1)[0]);
            draggedIndex.value = null;
            offsetY.value = 0;

            return newItems;
        });
    }, []);


    useEffect(() => {
        setItems(props.itemsData)
    }, [props.itemsData])

    return (
        <ScrollView contentContainerStyle={contentContainerStyle}>
            <View style={styles.header}>
                <Text>Header</Text>
            </View>
            {items.map((item, index) => (

                <ItemView key={item.mediaPostGUID} item={item} index={index} draggedIndex={draggedIndex}
                          offsetY={offsetY}
                          moveItem={moveItem}
                          ItemCard={props?.ItemCard}
                />
                // <ItemView key={item.mediaPostGUID} item={item} index={index} draggedIndex={draggedIndex}
                //           offsetY={offsetY}
                //           moveItem={moveItem}
                //           ItemCard={props?.ItemCard}
                // />
            ))}
        </ScrollView>
    );
}

type ItemProps = {
    item: mediaPostInterface;
    ItemCard: any;
    index: number;
    draggedIndex: SharedValue<number | null>;
    offsetY: SharedValue<number>;
    moveItem: (fromIndex: number, toIndex: number) => void;
};
const useItem = ({index, draggedIndex, offsetY, moveItem}: ItemProps) => {
    const itemHeight = useSharedValue(0);
    const startY = useSharedValue(0);

    const getUpdatedOffsetY = useCallback(
        (translationY: number) => {
            'worklet';

            return Math.max(-index * (itemHeight.value + SEPARATOR_HEIGHT), translationY + startY.value);
        },
        [index],
    );

    const movingDirection = useDerivedValue(() => {
        'worklet';

        if (draggedIndex.value === null) return 0;

        const initialDraggedY = draggedIndex.value * (itemHeight.value + SEPARATOR_HEIGHT);
        const currentY = index * (itemHeight.value + SEPARATOR_HEIGHT);

        if (initialDraggedY < currentY && currentY < initialDraggedY + offsetY.value + itemHeight.value / 2) return -1;
        if (initialDraggedY + offsetY.value - itemHeight.value / 2 <= currentY && currentY < initialDraggedY) return 1;

        return 0;
    });

    const nextIndexToInsertAt = useDerivedValue(() => {
        'worklet';

        if (draggedIndex.value === null) return index;

        const initialDraggedY = draggedIndex.value * (itemHeight.value + SEPARATOR_HEIGHT);

        return Math.round((initialDraggedY + offsetY.value) / (itemHeight.value + SEPARATOR_HEIGHT));
    });

    const panGesture = Gesture.Pan()
        .minDistance(5)
        .onBegin(() => {
            draggedIndex.value = index;
        })
        .onUpdate((e) => {
            offsetY.value = getUpdatedOffsetY(e.translationY);
        })
        .onEnd(() => {
            if (draggedIndex.value === null) return;

            const indexOffset = nextIndexToInsertAt.value - draggedIndex.value;

            const targetOffsetY = indexOffset * (itemHeight.value + SEPARATOR_HEIGHT);

            offsetY.value = withSpring(targetOffsetY, {}, () => {
                if (draggedIndex.value === null) return;
                runOnJS(moveItem)(draggedIndex.value, nextIndexToInsertAt.value);
            });
        })
        .onFinalize(() => {
        });

    const translateY = useDerivedValue(() => {
        'worklet';

        if (draggedIndex.value === null) return 0;
        if (draggedIndex.value === index) return withSpring(offsetY.value);

        return withSpring(movingDirection.value * (itemHeight.value + SEPARATOR_HEIGHT));
    });

    const animatedStyle = useAnimatedStyle(() => {
        const isBeingDragged = draggedIndex.value === index;

        return {
            transform: [{translateY: translateY.value}],
            zIndex: isBeingDragged ? 10 : 0,
            backgroundColor: isBeingDragged ? '#f9f9f9' : '#d2d2d2',
        };
    });

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        itemHeight.value = event.nativeEvent.layout.height;
    }, []);

    return {
        animatedStyle,
        onLayout,
        panGesture,
    };
};


const ItemView = ({ItemCard, item, index, draggedIndex, offsetY, moveItem}: ItemProps) => {
    const {animatedStyle, onLayout, panGesture} = useItem({ItemCard, item, index, draggedIndex, offsetY, moveItem});

    return (
        <SwipeableItem
            key={item.key}
            item={item}
            renderUnderlayLeft={() => <View
                style={{height: 60, backgroundColor: "red"}}>
                <Text
                    style={{color: 'blue'}}>
                    Delete1
                </Text>
            </View>}
            renderUnderlayRight={() => <View
                style={{height: 50, backgroundColor: 'red'}}>
                <Text
                    style={{color: 'blue'}}>
                    Archive1
                </Text>
            </View>}
            snapPointsLeft={[150]}
            snapPointsRight={[150]}
        >
            <Animated.View onLayout={onLayout} style={[styles.item, animatedStyle]}>
                <GestureDetector gesture={panGesture}>
                    <View style={styles.handle}/>
                </GestureDetector>
                {ItemCard ? <ItemCard item={item}/>
                    : <Text style={styles.text}>{item.mediaPostJSON.mediaPostTitle}</Text>
                }
            </Animated.View>
        </SwipeableItem>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1},
    item: {
        padding: 16,
        backgroundColor: '#d2d2d2',
        borderRadius: 16,
        marginHorizontal: 16,
        flexDirection: 'row',
        gap: 16
    },
    header: {
        padding: 16,
        backgroundColor: '#d2d2d2',
        borderRadius: 16,
        height: 150,
        marginHorizontal: 16,
        marginTop: 16
    },
    text: {fontSize: 16, userSelect: 'none'},
    handle: {width: 16, height: 16, backgroundColor: '#dcdcdc'},
});


// const [items, setItems] = useState<Row[]>(Array.from({length: 20}, (_, i) => ({
//     mediaPostGUID: String(i),
//     mediaPostOwnerGUID: `Row ${i + 1}`
// })));

export default DNDListWeb


// function getColor(i: number) {
//     const multiplier = 255 / (NUM_ITEMS - 1);
//     const colorVal = i * multiplier;
//     return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
// }


const styles2 = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    text: {
        fontWeight: "bold",
        color: "white",
        fontSize: 32,

    },
    underlayLeft: {
        height: 36,
        width: 50,
        flex: 1,
        color: 'red',
        backgroundColor: "tomato",
        justifyContent: "flex-end",
    },
});