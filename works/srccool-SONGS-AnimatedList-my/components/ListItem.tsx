import React from 'react';
import {Image, Text, View} from 'react-native';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {TListItem} from '../types';
import {styles} from './ListItem.styles';
import {useGesture} from '../hooks/useGesture';

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
            styles(s).itemContainer, animatedStyles,
        ]}>
            <View style={[styles(s).imageContainer]}>
                <Image
                    source={{
                        uri: item.imageSrc,
                    }}
                    style={styles(s).image}
                    borderRadius={8}
                />
            </View>
            <View style={[styles(s).descriptionContainer, [{backgroundColor: (item?.backgroundColor)?item?.backgroundColor:'transparent'}]]}>
                <Text style={styles(s).description1}>{item.mediaPostGUID}</Text>
                <Text style={styles(s).description2}>{item.mediaPostOwnerGUID}</Text>
            </View>
            <GestureDetector gesture={gestureController}>
                <Animated.View style={styles(s).draggerContainer}>
                    <View style={[styles(s).dragger, styles(s).marginBottom]}/>
                    <View style={[styles(s).dragger, styles(s).marginBottom]}/>
                    <View style={styles(s).dragger}/>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
};

// const colorFromIndex = (i:number) =>
//     `hsl(${(i * 120) % 360}, 65%, 55%)`;
