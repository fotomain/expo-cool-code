import {useRef} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {Badge, Card} from 'react-native-paper';
import {PanGestureHandler, State,} from 'react-native-gesture-handler';

import UnderlayButtons from "@/mi/ui/posts/list/demo/UnderlayButtons ";


const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SWIPE_THRESHOLD = 200;
const SWIPE_VELOCITY_THRESHOLD = 500;


const SwipeCardItemComponent: React.FC<any> = ({item, onRemove, onToggleRead}) => {
    // Step 6.1: Setup animated values
    let translateX = useRef(new Animated.Value(0)).current;
    const lastOffset = useRef(0);
    const cardWidth = SCREEN_WIDTH - 32;

    // Step 6.2: Handle gesture events
    const onGestureEvent = Animated.event(
        [{nativeEvent: {translationX: translateX}}],
        {useNativeDriver: true}
    );

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const {translationX, velocityX} = event.nativeEvent;
            const totalTranslation = translationX + lastOffset.current;
            const absTranslation = Math.abs(totalTranslation);
            const absVelocity = Math.abs(velocityX);

            console.log("translationX1", translationX)

            // if (Math.abs(translationX) > 400) {
            //     return
            // }

            // Step 6.3: Determine if swipe should trigger action
            const shouldSwipe =
                absTranslation > SWIPE_THRESHOLD || absVelocity > SWIPE_VELOCITY_THRESHOLD;

            if (shouldSwipe) {
                const toValue = totalTranslation > 0 ? cardWidth : -cardWidth;
                Animated.timing(translateX, {
                    toValue,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    // Step 6.4: Trigger removal after animation
                    setTimeout(() => onRemove(item.id), 100);
                });
                lastOffset.current = 0;
            } else {
                // Step 6.5: Return to original position
                Animated.spring(translateX, {
                    toValue: 0,
                    velocity: velocityX,
                    useNativeDriver: true,
                }).start();
                lastOffset.current = 0;
            }
        }
    };

    // Step 6.6: Render underlay content
    const renderUnderlay = (side: 'left' | 'right') => (
        <UnderlayButtons
            side={side}
            onClose={() => {
                const toValue = side === 'left' ? -cardWidth : cardWidth;
                Animated.timing(translateX, {
                    toValue,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setTimeout(() => onRemove(item.id), 100);
                });
            }}
        />
    );

    return (
        <View style={styles.container}>
            {/* Step 6.7: Left underlay */}
            <View style={styles.leftUnderlay}>
                {renderUnderlay('left')}
            </View>

            {/* Step 6.8: Right underlay */}
            <View style={styles.rightUnderlay}>
                {renderUnderlay('right')}
            </View>

            {/* Step 6.9: Main swipeable card */}
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={[-10, 10]}
            >
                <Animated.View
                    style={[
                        styles.cardWrapper,
                        {
                            transform: [{translateX}],
                        },
                    ]}
                >
                    <Card
                        style={styles.card}
                        onPress={() => onToggleRead(item.id)}
                    >
                        <Card.Content>
                            <View style={styles.header}>
                                <Text style={[styles.title, item.read && styles.readTitle]}>
                                    {item.mediaPostGUID}
                                </Text>
                                {!item.read && (
                                    <Badge size={8} style={styles.unreadBadge}/>
                                )}
                            </View>
                            <Text style={styles.email}>{item.email}</Text>
                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                            <View style={styles.footer}>
                                <Text style={styles.date}>{item.date}</Text>
                                <Text style={styles.status}>
                                    {item.read ? 'Read' : 'Unread'}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 180,
        marginHorizontal: 16,
        marginVertical: 8,
        position: 'relative',
    },
    cardWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    card: {
        height: '100%',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius: 8,
        backgroundColor: 'pink',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    readTitle: {
        opacity: 0.6,
    },
    unreadBadge: {
        backgroundColor: '#2196F3',
        marginLeft: 8,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    status: {
        fontSize: 12,
        color: '#2196F3',
        fontWeight: '500',
    },
    leftUnderlay: {
        position: 'absolute',
        left: 0,
        right: '50%',
        height: '100%',
    },
    rightUnderlay: {
        position: 'absolute',
        left: '50%',
        right: 0,
        height: '100%',
    },
});

export default SwipeCardItemComponent