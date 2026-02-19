import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import {Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';

import Animated, {
    Easing, interpolate, interpolateColor,
    scrollTo,
    SharedValue,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue,
    useSharedValue, withDelay, withSpring, withTiming
} from "react-native-reanimated";

// ==================== ListItem

export const stylesItem:any=(p:any)=>{return StyleSheet.create({
    itemContainer: {
        height: p.PUNKTUM_HEIGHT,
        width: SONG_WIDTH,
        flexDirection: 'row',
        position: 'absolute',
        borderWidth:1,
        borderColor:"white",
    },
    imageContainer: {
        height: p.PUNKTUM_HEIGHT,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '3%',
    },
    descriptionContainer: {
        width: '60%',
        justifyContent: 'space-evenly',
    },
    description1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color_Pallete.crystal_white,
    },
    description2: {color: Color_Pallete.silver_storm},
    draggerContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    marginBottom: {
        marginBottom: 5,
    },
    dragger: {
        width: '30%',
        height: 2,
        backgroundColor: Color_Pallete.crystal_white,
    },
    image: {
        height: p.PUNKTUM_HEIGHT - 20,
        width: '97%',
    },
})};


export const ListItem = ({
                             item,
                             onDragEnd,
                             songNumber,
                             isDragging,
                             draggedItemId,
                             currentPositions,
                             scrollUp,
                             scrollDown,
                             scrollY,
                             isDragInProgress,
                             PUNKTUM_LIST_GLOBAL_HEIGHT,
                             PUNKTUM_HEIGHT,
                         }: TListItem) => {
    const {animatedStyles, gestureController} = useGesture(
        item,
        onDragEnd,
        isDragging,
        draggedItemId,
        currentPositions,
        scrollUp,
        scrollDown,
        scrollY,
        isDragInProgress,
        PUNKTUM_LIST_GLOBAL_HEIGHT,
        PUNKTUM_HEIGHT,
    );

    const s = {PUNKTUM_HEIGHT}

    return (
        <Animated.View key={item.id} style={[
            stylesItem(s).itemContainer, animatedStyles,
        ]}>
            <View style={[stylesItem(s).imageContainer]}>
                <Image
                    source={{
                        uri: item.imageSrc,
                    }}
                    style={stylesItem(s).image}
                    borderRadius={8}
                />
            </View>
            <View style={[stylesItem(s).descriptionContainer, [{backgroundColor: (item?.backgroundColor)?item?.backgroundColor:'transparent'}]]}>
                <Text style={stylesItem(s).description1}>{item.mediaPostGUID}</Text>
                <Text style={stylesItem(s).description2}>{item.mediaPostOwnerGUID}</Text>
            </View>
            <GestureDetector gesture={gestureController}>
                <Animated.View style={stylesItem(s).draggerContainer}>
                    <View style={[stylesItem(s).dragger, stylesItem(s).marginBottom]}/>
                    <View style={[stylesItem(s).dragger, stylesItem(s).marginBottom]}/>
                    <View style={stylesItem(s).dragger}/>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
};

// ==================== useGesture

// optimised1: Constants for idle detection
const IDLE_THRESHOLD = 300; // milliseconds

export const useGesture = (
    item: TItem,
    onDragEnd: (p:any)=>void,
    isDragging: SharedValue<number>,
    draggedItemId: SharedValue<NullableNumber>,
    currentPositions: SharedValue<TSongPositions>,
    scrollUp: () => void,
    scrollDown: () => void,
    scrollY: SharedValue<number>,
    isDragInProgress: SharedValue<boolean>,
    PUNKTUM_LIST_GLOBAL_HEIGHT: number,
    PUNKTUM_HEIGHT: number,
) => {
    //used for swapping with currentIndex
    const newIndex = useSharedValue<NullableNumber>(null);

    //used for swapping with newIndex
    const currentIndex = useSharedValue<NullableNumber>(null);

    const actualMomentPositions = useDerivedValue(() => {
        return currentPositions.value;
    });

    const top = useSharedValue(item.id * PUNKTUM_HEIGHT);

    const isDraggingDerived = useDerivedValue(() => {
        return isDragging.value;
    });

    const draggedItemIdDerived = useDerivedValue(() => {
        return draggedItemId.value;
    });

    const isDragInProgressDerived = useDerivedValue(() => {
        return isDragInProgress.value;
    });

    const scrollYDerived = useDerivedValue(() => {
        return scrollY.value;
    });

    const isCurrentDraggingItem = useDerivedValue(() => {
        return draggedItemIdDerived.value === item.id;
    });

    const totalY = useSharedValue(0);

    // optimised1: Shared values for idle detection and direction tracking
    const lastDragTime = useSharedValue(0);
    const lastDragY = useSharedValue(0);
    const dragDirection = useSharedValue(0); // 1: down, -1: up, 0: unknown

    const getKeyOfValue = (
        value: number,
        obj: TSongPositions,
    ): number | undefined => {
        'worklet';
        for (const [key, val] of Object.entries(obj)) {
            if (val.updatedIndex === value) {
                return Number(key);
            }
        }
        return undefined; // Return undefined if the value is not found
    };

    const onGestureUpdate = (newTop: number) => {
        'worklet';
        let listTopY = scrollYDerived.value;
        let listBottomY =
            scrollYDerived.value + PUNKTUM_LIST_GLOBAL_HEIGHT - EDGE_THRESHOLD * 2.5;
        const focusIsOnTopNow =
            parseInt(newTop.toFixed(2), 10) <= parseInt(listTopY.toFixed(2), 10);
        const focusIsOnBottomNow =
            parseInt(newTop.toFixed(2), 10) >= parseInt(listBottomY.toFixed(2), 10);

        // Clamp the visual position to the visible area when at edges
        if (focusIsOnTopNow) {
            top.value = listTopY;
        } else if (focusIsOnBottomNow) {
            top.value = listBottomY;
        } else {
            //mission1 newTop of draggable
            top.value = newTop;
        }

        // optimised2: Remove early return that blocked auto‑scroll at edges.
        // Instead, we let the rest of the function run even when newTop is out of bounds.
        // The index swapping will be skipped if currentIndex is null (should not happen),
        // but we keep the boundary checks for swapping only if needed.

        // Calculate the new index where drag is headed to (using the clamped top)
        newIndex.value = Math.floor((top.value + PUNKTUM_HEIGHT / 2) / PUNKTUM_HEIGHT);
        if(isDebug) console.log("▄▄▄▄▄▄▄ scrollY newIndex.value and currentIndex",newIndex.value,currentIndex.value )

        // swap the items present at newIndex and currentIndex (only if within valid bounds)
        if (currentIndex.value !== null && newIndex.value !== currentIndex.value) {

            //swap-core-calculate-items-to-change-positions
            //find id of the item that currently resides at newIndex
            const newKey = getKeyOfValue(
                newIndex.value,
                actualMomentPositions.value,
            );

            //find id of the item that currently resides at currentIndex
            const drabbalbeKey = getKeyOfValue(
                currentIndex.value,
                actualMomentPositions.value,
            );

            if(isDebug) console.log("▄▄▄▄▄▄▄ scrollY drabbalbeKey <> newKey",drabbalbeKey, " go to new -> " , newKey )

            if (
                newKey !== undefined &&
                drabbalbeKey !== undefined
            ) {
                //swap-core-change-position for OLD and NEW items
                //we update updatedTop and updatedIndex as next time we want to do calculations from new top value and new index
                //mission3 change draggable with new Item nr. 2 to nr. 3
                currentPositions.value = {
                    ...actualMomentPositions.value,
                    // to nr. 3
                    [newKey]: {
                        // all data from nr. 3
                        ...actualMomentPositions.value[newKey],
                        // new data from nr. 2
                        updatedIndex: currentIndex.value, //=2
                        updatedTop: currentIndex.value * PUNKTUM_HEIGHT, // nr. 2 new data
                    },
                    // to nr. 2
                    [drabbalbeKey]: {
                        // all data from nr. 2
                        ...actualMomentPositions.value[drabbalbeKey],
                        // new data from nr. 3
                        updatedIndex: newIndex.value, //=3
                    },
                };

                //update new index as current index - for next swqp actions
                currentIndex.value = newIndex.value;
            }
        }

        // optimised1: Idle check before auto-scrolling
        if (focusIsOnTopNow) {
            const now = global.performance.now();
            const timeSinceLastMove = now - lastDragTime.value;
            if (timeSinceLastMove <= IDLE_THRESHOLD) {
                scrollUp();
            }
        } else if (focusIsOnBottomNow) {
            const now = global.performance.now();
            const timeSinceLastMove = now - lastDragTime.value;
            if (timeSinceLastMove <= IDLE_THRESHOLD) {
                scrollDown();
            }
        }
    };

    useAnimatedReaction(
        () => {
            return scrollYDerived.value;
        },
        (currentValue, previousValue) => {
            if (!isDragInProgressDerived.value || !isCurrentDraggingItem.value) {
                //useAnimatedReaction executed for every item when scroll happens
                //we don't want to trigger automatic gesture if drag is not happening
                //also we just want to trigger automatic gesture for currently dragged item
                return;
            }
            const isScrolledUp = (previousValue || 0) > currentValue;
            if(isDebug) console.log("isScrolledUp0 === item", item.id)
            if(isDebug) console.log("isScrolledUp0", isScrolledUp, currentValue, previousValue)
            onGestureUpdate(
                isScrolledUp
                    ? top.value - Math.abs(currentValue - (previousValue || 0))
                    : top.value + Math.abs(currentValue - (previousValue || 0)),
            );
        },
    );

    useAnimatedReaction(
        () => {
            return actualMomentPositions.value[item.id].updatedIndex;
        },
        (currentValue, previousValue) => {
            //useAnimatedReaction executed when any of the item's updatedIndex changes
            if (currentValue !== previousValue) {
                if (!isCurrentDraggingItem.value) {

                    if(isDebug) console.log("▄▄▄▄▄▄▄ scrollY RECALC top.value FOR item.id ", item.id)
                    //mission4 rePaint changed nr. 3 !isCurrentDraggingItem.value
                    //for nr. 3
                    top.value = withTiming(
                        //updatedIndex = 3
                        actualMomentPositions.value[item.id].updatedIndex *
                        PUNKTUM_HEIGHT,
                        {duration: 500},
                    );
                }
            }
        },
    );

    const gestureController = Gesture.Pan()
        .onBegin(e => {
            // .onTouchesDown(e => {
            isDragging.value = withSpring(1);
            //keep track of dragged item
            draggedItemId.value = item.id;

            //start dragging
            isDragInProgress.value = true;

            //store dragged item id for future swap !!!!
            currentIndex.value =
                actualMomentPositions.value[item.id].updatedIndex;

            //as soon as user touches the item, store total distance of user's finger from top of list
            totalY.value = scrollYDerived.value + e.absoluteY;
            // totalY.value = scrollYDerived.value + e.allTouches[0].absoluteY;

            // optimised1: Initialize idle and direction tracking
            lastDragTime.value = global.performance.now();
            lastDragY.value = e.absoluteY;
            dragDirection.value = 0;
        })
        .onUpdate(e => {
            if (draggedItemIdDerived.value === null) {
                return;
            }
            //calculate new total distance of user's finger from top of list.
            const newTotalY = scrollYDerived.value + e.absoluteY;
            if(isDebug) console.log("███████ scrollY newTotalY", newTotalY, " = ",scrollYDerived.value," + ",e.absoluteY)
            //calculate difference between the prev and new total distance
            const diff = totalY.value - newTotalY;
            if(isDebug) console.log("======= scrollY diff",diff , " = ",totalY.value, " - ", newTotalY)
            //calculate the updated top of item
            const updatedTop =
                actualMomentPositions.value[draggedItemIdDerived.value]
                    .updatedTop;
            //calculate new top value by negating diff of total distance from updated top
            if(isDebug) console.log("======= scrollY updatedTop ",updatedTop )
            const newTop = updatedTop - diff;
            if(isDebug) console.log("▄▄▄▄▄▄▄ scrollY newTop",newTop , " = ",updatedTop, " - ", diff)

            onGestureUpdate(newTop);

            // optimised1: Update idle and direction tracking
            const now = global.performance.now();
            lastDragTime.value = now;
            const deltaY = e.absoluteY - lastDragY.value;
            if (deltaY > 0) {
                dragDirection.value = 1; // moving down
            } else if (deltaY < 0) {
                dragDirection.value = -1; // moving up
            }
            lastDragY.value = e.absoluteY;
        })
        .onEnd(() => {
            // .onTouchesUp(() => {
            isDragInProgress.value = false;
            draggedItemId.value = null;

            //stop dragging with delay of 200ms to have nice animation consistent with scale animation
            isDragging.value = withDelay(200, withSpring(0));
            if (newIndex.value === null || currentIndex.value === null) {
                return;
            }
            top.value = withSpring(newIndex.value * PUNKTUM_HEIGHT);

            const currentDragIndexItemKey = getKeyOfValue(
                currentIndex.value,
                actualMomentPositions.value,
            );

            if (currentDragIndexItemKey !== undefined) {
                //update the values for item whose drag we just stopped
                currentPositions.value = {
                    ...actualMomentPositions.value,
                    [currentDragIndexItemKey]: {
                        ...actualMomentPositions.value[currentDragIndexItemKey],
                        updatedTop: newIndex.value * PUNKTUM_HEIGHT,
                    },
                };
            }

            onDragEnd({from:item.id,to:newIndex.value})

        });

    //TODO
    const config = {
        duration: 3000,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    };
    //for nr. 2
    const animatedStyles = useAnimatedStyle(() => {
        //█████████████-core-!!! THIS CODE WORKS FOR ALL ITEMS
        if(isDebug) console.log("▄▄▄▄▄▄▄ scrollY animatedStyles top.value FOR draggable Item  ",item.id, top.value)

        return {
            //mission2 rePaint draggable
            //mission7 rePaint ALL OTHER
            top: withTiming(top.value , config),

            transform: [
                {
                    scale: isCurrentDraggingItem.value
                        ? interpolate(isDraggingDerived.value, [0, 1], [1, 1.025])
                        : interpolate(isDraggingDerived.value, [0, 1], [1, 0.98]),
                },
            ],
            backgroundColor: isCurrentDraggingItem.value
                ? interpolateColor(
                    isDraggingDerived.value,
                    [0, 1],
                    [Color_Pallete.metal_black, Color_Pallete.night_shadow],
                )
                : Color_Pallete.metal_black,

            shadowColor: isCurrentDraggingItem.value
                ? interpolateColor(
                    isDraggingDerived.value,
                    [0, 1],
                    [Color_Pallete.metal_black, Color_Pallete.crystal_white],
                )
                : undefined,
            style: {
                shadowOffset: {
                    width: 0,
                    height: isCurrentDraggingItem.value
                        ? interpolate(isDraggingDerived.value, [0, 1], [0, 7])
                        : 0,
                },
            },
            shadowOpacity: isCurrentDraggingItem.value
                ? interpolate(isDraggingDerived.value, [0, 1], [0, 0.2])
                : 0,
            shadowRadius: isCurrentDraggingItem.value
                ? interpolate(isDraggingDerived.value, [0, 1], [0, 10])
                : 0,
            elevation: isCurrentDraggingItem.value
                ? interpolate(isDraggingDerived.value, [0, 1], [0, 5])
                : 0, // For Android,
            zIndex: isCurrentDraggingItem.value ? 1 : 0,
        };
    }, [top.value, isCurrentDraggingItem.value, isDraggingDerived.value]);


    return {
        animatedStyles,
        gestureController,
    };
};

// ==================== types

export type NullableNumber = null | number;

export const isDebug = false

export type TItem = {
    id: number;
    backgroundColor?: string;
    mediaPostGUID: string;
    mediaPostOwnerGUID: string;
    imageSrc: string;
};


export type TListItem = {
    item: TItem;

    onDragEnd: (p:any)=>void;
    songNumber: number;
    isDragging: SharedValue<number>;
    draggedItemId: SharedValue<NullableNumber>;
    currentPositions: SharedValue<TSongPositions>;
    scrollUp: () => void;
    scrollDown: () => void;
    scrollY: SharedValue<number>;
    isDragInProgress: SharedValue<boolean>;
    PUNKTUM_LIST_GLOBAL_HEIGHT: number;
    PUNKTUM_HEIGHT: number;
};

export type TSongPositions = {
    [key: number]: {
        updatedIndex: number;
        updatedTop: number;
    };
};


//================ const
export const randomFunnyColor: any = () => {
    const r = Math.floor(Math.random() * 200 + 30);
    const g = Math.floor(Math.random() * 200 + 30);
    const b = Math.floor(Math.random() * 200 + 30);
    return `rgb(${r}, ${g}, ${b})`;
};

export const PUNKTUM_HEIGHT = 80;
export const SONG_WIDTH = 280;
export let SONGS = [
    {
        backgroundColor:randomFunnyColor(),
        id: 0,
        mediaPostGUID: 'Hymn for the Weekend',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 1,
        mediaPostGUID: 'Paradise',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de0cd11d7b31c3bd1fd5983d',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 2,
        mediaPostGUID: 'Viva La Vida',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc: 'https://i.ytimg.com/vi/dvgZkm1xWPE/maxresdefault.jpg',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 3,
        mediaPostGUID: 'A Sky Full of Stars',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e5a95573f1b91234630fd2cf',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 4,
        mediaPostGUID: 'Clocks',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 5,
        mediaPostGUID: 'The Scientist',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 6,
        mediaPostGUID: 'Dusk Till Dawn (feat. Sia)',
        mediaPostOwnerGUID: 'ZAYN, Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b27323852b7ef0ecfe29d38d97ee',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 7,
        mediaPostGUID: 'Titanium (feat. Sia)',
        mediaPostOwnerGUID: 'David Guetta, Sia',
        imageSrc:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnwB_jMjMFnQkQOPvENr-diiJfDWFripRHBMSdeaHZyA&s',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 8,
        mediaPostGUID: 'Chandelier',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273297b2c53224bd19162f526e3',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 9,
        mediaPostGUID: 'Unstoppable',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273754b2fddebe7039fdb912837',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 10,
        mediaPostGUID: 'Cheap Thrills',
        mediaPostOwnerGUID: 'Sia, Sean Paul',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2731e6901561bb0cd5697cbfded',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 11,
        mediaPostGUID: 'Elastic Heart',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2735d199c9f6e6562aafa5aa357',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 12,
        mediaPostGUID: 'Believer',
        mediaPostOwnerGUID: 'Imagine Dragons',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273156aeddf54ed40b1d9d30c9f',
    },
    {
        id: 13,
        mediaPostGUID: 'Let me love you',
        mediaPostOwnerGUID: 'DJ Snake, Justin Bieber',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273212d776c31027c511f0ee3bc',
    },
    {
        id: 14,
        mediaPostGUID: 'Lean On',
        mediaPostOwnerGUID: 'Major Lazer',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273548910835dbfaf3f79a1dc46',
    },
    {
        id: 15,
        mediaPostGUID: 'Taki Taki',
        mediaPostOwnerGUID: 'DJ Snake',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8',
    },
    {
        id: 16,
        mediaPostGUID: 'Hymn for the Weekend',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6',
    },
    {
        id: 17,
        mediaPostGUID: 'Paradise',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de0cd11d7b31c3bd1fd5983d',
    },
    {
        id: 18,
        mediaPostGUID: 'Viva La Vida',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc: 'https://i.ytimg.com/vi/dvgZkm1xWPE/maxresdefault.jpg',
    },
    {
        id: 19,
        mediaPostGUID: 'A Sky Full of Stars',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e5a95573f1b91234630fd2cf',
    },
    {
        id: 20,
        mediaPostGUID: 'Clocks',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        id: 21,
        mediaPostGUID: 'The Scientist',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        id: 22,
        mediaPostGUID: 'Dusk Till Dawn (feat. Sia)',
        mediaPostOwnerGUID: 'ZAYN, Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b27323852b7ef0ecfe29d38d97ee',
    },
    {
        id: 23,
        mediaPostGUID: 'Titanium (feat. Sia)',
        mediaPostOwnerGUID: 'David Guetta, Sia',
        imageSrc:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnwB_jMjMFnQkQOPvENr-diiJfDWFripRHBMSdeaHZyA&s',
    },
    {
        id: 24,
        mediaPostGUID: 'Chandelier',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273297b2c53224bd19162f526e3',
    },
    {
        id: 25,
        mediaPostGUID: 'Unstoppable',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273754b2fddebe7039fdb912837',
    },
    {
        id: 26,
        mediaPostGUID: 'Cheap Thrills',
        mediaPostOwnerGUID: 'Sia, Sean Paul',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2731e6901561bb0cd5697cbfded',
    },
    {
        id: 27,
        mediaPostGUID: 'Elastic Heart',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2735d199c9f6e6562aafa5aa357',
    },
    {
        id: 28,
        mediaPostGUID: 'Believer',
        mediaPostOwnerGUID: 'Imagine Dragons',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273156aeddf54ed40b1d9d30c9f',
    },
    {
        id: 29,
        mediaPostGUID: 'Let me love you',
        mediaPostOwnerGUID: 'DJ Snake, Justin Bieber',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273212d776c31027c511f0ee3bc',
    },
    {
        id: 30,
        mediaPostGUID: 'Lean On',
        mediaPostOwnerGUID: 'Major Lazer',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273548910835dbfaf3f79a1dc46',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 31,
        mediaPostGUID: 'Taki Taki',
        mediaPostOwnerGUID: 'DJ Snake',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8',
    },
];


if(isDebug) console.log("SONGS",SONGS);

export const getInitialPositions = (p:any): TSongPositions => {
    let songPositions: TSongPositions = {}; //!!! NOT ARRAY BUT OBJECT
    for (let i = 0; i < p.data.length; i++) {
        songPositions[i] = { //TODO ??? songPositions[SONGS[i].id]
            updatedIndex: i,
            updatedTop: i * PUNKTUM_HEIGHT,};
    }
    return songPositions;
};

export const Color_Pallete = {
    metal_black: '#0E0C0A',
    night_shadow: '#1C1C1C',
    crystal_white: '#FFFFFF',
    silver_storm: '#808080',
};

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export const ANIMATION_DURATION = 600;
export const MIN_BOUNDRY = 0;
export const MAX_BOUNDRY = (SONGS.length - 1) * PUNKTUM_HEIGHT;

export const EDGE_THRESHOLD = 40;
export const SCROLL_SPEED_OFFSET = isAndroid ? 2 : 3;

//================== Animated list


type TListProps = {
    height?:number
    cardHeight?:number
    autoScrollStep:number
    data:any
    onDragEnd:(p:any)=>void
}

const AnimatedList = (props:TListProps) => {

    const {height,cardHeight,
        autoScrollStep
    } = props;

    let PUNKTUM_LIST_GLOBAL_HEIGHT=400
    if(height){
        PUNKTUM_LIST_GLOBAL_HEIGHT=height
    }

    let PUNKTUM_HEIGHT=70
    if(cardHeight){
        PUNKTUM_HEIGHT=cardHeight
    }

    const scrollviewRef:any = useAnimatedRef();

    //will hold the songs position in list at every moment
    const currentPositions = useSharedValue<TSongPositions>(
        getInitialPositions({data:props.data}),
    );

    //used to control the animation visual using interpolation
    const isDragging:any = useSharedValue<0 | 1>(0);

    //this will hold id for item which user started dragging
    const draggedItemId = useSharedValue<NullableNumber>(null);

    //used to stop the automatic scroll once drag is ended by user.
    const isDragInProgress = useSharedValue(false);

    const scrollY = useSharedValue(0);

    useAnimatedReaction(
        () => {
            return scrollY.value
        },
        (currentValue, previousValue) => {
            if(isDebug) console.log("scrollY0",currentValue, previousValue)
        },
    );
    const scrollUp = () => {
        'worklet';
        const newY =
            scrollY.value - SCROLL_SPEED_OFFSET < 0
                ? 0
                : scrollY.value - SCROLL_SPEED_OFFSET;
        scrollTo(scrollviewRef, 0, newY-autoScrollStep, isIOS ? false : true);
    };

    const scrollDown = () => {
        'worklet';
        const newY =
            scrollY.value + SCROLL_SPEED_OFFSET > SONGS.length * PUNKTUM_HEIGHT
                ? SONGS.length * PUNKTUM_HEIGHT
                : scrollY.value + SCROLL_SPEED_OFFSET;
        scrollTo(scrollviewRef, 0, newY+autoScrollStep, isIOS ? false : true);
    };

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        //TODO 400
        <View style={{backgroundColor: Color_Pallete.metal_black, height: 400}}>
            <Animated.ScrollView
                scrollEventThrottle={10}
                ref={scrollviewRef}
                onScroll={scrollHandler}
                contentContainerStyle={{height: SONGS.length * PUNKTUM_HEIGHT}}>
                {SONGS.map((eachSong,songNumber) => (
                    <ListItem
                        item={eachSong}
                        onDragEnd={props.onDragEnd}
                        songNumber={songNumber}
                        key={eachSong.id}
                        isDragging={isDragging}
                        draggedItemId={draggedItemId}
                        currentPositions={currentPositions}
                        scrollUp={scrollUp}
                        scrollDown={scrollDown}
                        scrollY={scrollY}
                        isDragInProgress={isDragInProgress}
                        PUNKTUM_LIST_GLOBAL_HEIGHT={PUNKTUM_LIST_GLOBAL_HEIGHT}
                        PUNKTUM_HEIGHT={PUNKTUM_HEIGHT}
                    />
                ))}
            </Animated.ScrollView>
        </View>
    );
};

//============== MAIN █████████████████████████████

function AppListFinal1File(): React.JSX.Element {
    // const isDarkMode = useColorScheme() === 'dark';
    // const backgroundStyle = {
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // };
    // const isDarkMode = useColorScheme() === 'dark';
    // const backgroundStyle = {
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // };

    const [data, setData] = useState(SONGS)

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={{backgroundColor: '#0E0C0A'}}>
                <StatusBar
                    barStyle={'light-content'}
                    backgroundColor={'pink'}
                />
                <AnimatedList
                    autoScrollStep={10}
                    height={500}
                    cardHeight={100}
                    data={data}
                    onDragEnd={(p:any)=>{
                        if(isDebug) if(isDebug) console.log("onDragEnd0",p);
                        setData((prev:any)=>{
                            const newItems = [...prev];

                            newItems.splice(p.to, 0, newItems.splice(p.form, 1)[0]);

                            return newItems;
                        });
                    }}
                    // draggerType={'draggerFullCard'} //draggerDots
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default AppListFinal1File;