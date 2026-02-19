import {
    SharedValue,
    interpolate,
    interpolateColor,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming, Easing,
} from 'react-native-reanimated';
import {
    Color_Pallete,
    EDGE_THRESHOLD,
    MAX_BOUNDRY,
    MIN_BOUNDRY,
    //PUNKTUM_HEIGHT,
} from '../constants';
import {NullableNumber, TSongPositions, TItem, isDebug} from '../types';
import {Gesture} from 'react-native-gesture-handler';

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
        if (
            currentIndex.value === null ||
            newTop <= MIN_BOUNDRY ||
            newTop >= MAX_BOUNDRY
        ) {
            return;
        }

        if (focusIsOnTopNow) {
            top.value = listTopY;
        } else if (focusIsOnBottomNow) {
            top.value = listBottomY;
        } else {
            //mission1 newTop of draggable
            top.value = newTop;
        }

        //█████ core-both newIndex.value and currentIndex are calculated while dragging process
        //calculate the new index where drag is headed to
        newIndex.value = Math.floor((top.value + PUNKTUM_HEIGHT / 2) / PUNKTUM_HEIGHT);
        if(isDebug) console.log("▄▄▄▄▄▄▄ scrollY newIndex.value and currentIndex",newIndex.value,currentIndex.value )

        //swap the items present at newIndex and currentIndex
        if (newIndex.value !== currentIndex.value) {

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

        if (focusIsOnTopNow) {
            scrollUp();
        } else if (focusIsOnBottomNow) {
            scrollDown();
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
