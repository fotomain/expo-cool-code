import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Card, FAB, Menu, Portal, Title} from 'react-native-paper';
import {useFabMenus} from './useFabMenus';

const FabGroupAdvanced = () => {
    const FAB_COUNT = 4;
    const {
        fabRefs,
        menuStates,
        activeMenuIndex,
        setFabRef,
        toggleMenu,
        closeAllMenus,
    } = useFabMenus(FAB_COUNT);

    // Animation values
    const fabAnimations = useRef(
        Array(FAB_COUNT).fill(null).map(() => new Animated.Value(0))
    ).current;

    // Animate FABs when menu opens/closes
    useEffect(() => {
        fabAnimations.forEach((anim, index) => {
            Animated.spring(anim, {
                toValue: menuStates[index] ? 1 : 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        });
    }, [menuStates, fabAnimations]);

    const fabConfigs = [
        {
            icon: 'palette',
            color: '#FF9800',
            label: 'Design',
            menuContent: (
                <Card style={styles.menuCard}>
                    <Card.Content>
                        <Title>Design Tools</Title>
                        <FAB
                            icon="brush"
                            label="Paint"
                            style={styles.menuFab}
                            onPress={() => console.log('Paint')}
                            small
                        />
                        <FAB
                            icon="vector-square"
                            label="Vector"
                            style={styles.menuFab}
                            onPress={() => console.log('Vector')}
                            small
                        />
                    </Card.Content>
                </Card>
            ),
        },
        {
            icon: 'chart-bar',
            color: '#3F51B5',
            label: 'Analytics',
            menuContent: (
                <Card style={styles.menuCard}>
                    <Card.Content>
                        <Title>Analytics</Title>
                        <FAB
                            icon="chart-line"
                            label="Charts"
                            style={styles.menuFab}
                            onPress={() => console.log('Charts')}
                            small
                        />
                        <FAB
                            icon="table"
                            label="Reports"
                            style={styles.menuFab}
                            onPress={() => console.log('Reports')}
                            small
                        />
                    </Card.Content>
                </Card>
            ),
        },
        {
            icon: 'cloud',
            color: '#009688',
            label: 'Cloud',
            menuContent: (
                <Card style={styles.menuCard}>
                    <Card.Content>
                        <Title>Cloud Services</Title>
                        <FAB
                            icon="upload"
                            label="Upload"
                            style={styles.menuFab}
                            onPress={() => console.log('Upload')}
                            small
                        />
                        <FAB
                            icon="download"
                            label="Download"
                            style={styles.menuFab}
                            onPress={() => console.log('Download')}
                            small
                        />
                    </Card.Content>
                </Card>
            ),
        },
        {
            icon: 'cog',
            color: '#607D8B',
            label: 'Settings',
            menuContent: (
                <Card style={styles.menuCard}>
                    <Card.Content>
                        <Title>Settings</Title>
                        <FAB
                            icon="account"
                            label="Account"
                            style={styles.menuFab}
                            onPress={() => console.log('Account')}
                            small
                        />
                        <FAB
                            icon="bell"
                            label="Notifications"
                            style={styles.menuFab}
                            onPress={() => console.log('Notifications')}
                            small
                        />
                    </Card.Content>
                </Card>
            ),
        },
    ];

    return (
        <Portal>
            <View style={styles.container}>
                {fabConfigs.map((config, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.fabWrapper,
                            {
                                transform: [
                                    {
                                        translateY: fabAnimations[index].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -10],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        {/* FAB Button */}
                        <FAB
                            ref={setFabRef(index)}
                            icon={config.icon}
                            style={[
                                styles.fab,
                                {
                                    backgroundColor: config.color,
                                    transform: [
                                        {
                                            scale: fabAnimations[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.15],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                            onPress={() => toggleMenu(index)}
                            color="white"
                            small
                        />

                        {/* Menu */}
                        <Menu
                            visible={menuStates[index]}
                            onDismiss={closeAllMenus}
                            anchor={
                                <View style={styles.anchorPlaceholder}/>
                            }
                            style={styles.customMenu}
                            contentStyle={styles.menuContent}
                        >
                            {config.menuContent}
                        </Menu>
                    </Animated.View>
                ))}
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 32,
        right: 32,
        alignItems: 'flex-end',
    },
    fabWrapper: {
        marginBottom: 16,
    },
    fab: {
        marginBottom: 8,
    },
    anchorPlaceholder: {
        width: 1,
        height: 1,
    },
    customMenu: {
        marginTop: -100,
        marginRight: 70,
    },
    menuContent: {
        backgroundColor: 'transparent',
    },
    menuCard: {
        width: 200,
        backgroundColor: 'white',
    },
    menuFab: {
        marginVertical: 4,
        backgroundColor: '#f0f0f0',
    },
});

export default FabGroupAdvanced
