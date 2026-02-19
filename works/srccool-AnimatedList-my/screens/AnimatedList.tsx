import React from 'react';
import {View} from 'react-native';

import Animated, {
    scrollTo, useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue, withTiming,
} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {
    getInitialPositions,
    SONGS,
    SCROLL_SPEED_OFFSET,
    isIOS, Color_Pallete,
} from '../constants';
import {styles} from './AnimatedList.styles';
import {isDebug, NullableNumber, TSongPositions} from '../types';

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


// const renderCell = useCallback(
//   ({index, style, ...props}: any) => {
//     if(isDebug) console.log('In renderCell', index);
//     const zIndex = {
//       zIndex: index === currentDragIndex ? 2 : 0,
//     };

//     return <View style={[style, zIndex]} {...props} />;
//   },
//   [currentDragIndex],
// );


export default AnimatedList