/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Image, StyleSheet, Text, View} from 'react-native';
import Animated, {
    FadeInRight,
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withSpring,
} from 'react-native-reanimated';

const users = [
    {name: 'Alice', score: 100},
    {name: 'Bob', score: 95},
    {name: 'Charlie', score: 50},
    {name: 'David', score: 60},
    {name: 'Eva', score: 30},
    {name: 'Frank', score: 80},
    {name: 'Grace', score: 20},
    {name: 'Hannah', score: 15},
    {name: 'Isaac', score: 60},
    {name: 'Jack', score: 40},
];
const _avatarSize = 30;
const _spacing = 4;
const _stagger = 100;
const Place = (p: any) => {
    const {user, index, onFinish, anim} = p
    const _anim = useDerivedValue(() => {
        return withDelay(
            _stagger * index,
            withSpring(anim.value, {damping: 80, stiffness: 200}),
        );
    });
    const stylez = useAnimatedStyle(() => {
        return {
            height: interpolate(
                _anim.value,
                [0, 1],
                [_avatarSize, Math.max(user.score * 3, _avatarSize + 10)],
            ),
            backgroundColor: interpolateColor(
                _anim.value,
                [0, 1],
                ['white', '#047404'],
            ),
        };
    });
    const styleText = useAnimatedStyle(() => {
        return {opacity: interpolate(_anim.value, [0, 0.5, 1], [0, 0.5, 1])};
    });
    return (
        <Animated.View
            entering={FadeInRight.delay(index * _stagger)
                .springify()
                .damping(80)
                .stiffness(200)
                .withCallback(finished => {
                    if (finished && onFinish) {
                        runOnJS(onFinish)();
                    }
                })}
            style={{alignItems: 'center'}}>
            <Text style={[{fontSize: 16, fontWeight: 500}, styleText]}>
                {user.score}
            </Text>
            <Animated.View
                style={[
                    {
                        height: _avatarSize,
                        padding: 5,
                        borderTopLeftRadius: _avatarSize,
                        borderTopRightRadius: _avatarSize,
                    },
                    stylez,
                ]}>
                <View style={{width: _avatarSize, aspectRatio: 1}}>
                    <Image
                        source={{
                            uri: `https://i.pravatar.cc/50?u=user_${user.name}`,
                        }}
                        style={{flex: 1, borderRadius: _avatarSize}}
                    />
                </View>
            </Animated.View>
        </Animated.View>
    );
};
const LeaderBoard = () => {
    const _anim = useSharedValue(0);
    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    gap: _spacing,
                    alignItems: 'flex-end',
                }}>
                {users.map((user, index) => {
                    return (
                        <Place
                            user={user}
                            key={index.toString()}
                            anim={_anim}
                            index={index}
                            onFinish={
                                index === users.length - 1
                                    ? () => {
                                        _anim.value = 1;
                                        console.log('it finish');
                                        console.log(index);
                                    }
                                    : null
                            }
                        />
                    );
                })}
            </View>
        </View>
    );
};

export default function AnimationDemo() {
    return (
        <View style={styles.container}>
            <LeaderBoard/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});
