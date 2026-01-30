import React, {useCallback, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {FAB, Portal, Text, useTheme} from 'react-native-paper';

type FabAction = {
    icon: string;
    label: string;
    color: string;
    onPress: () => void;
};

type FabGroupConfig = {
    icon: string;
    label: string;
    color: string;
    actions: FabAction[];
};

type FabRef = React.ComponentRef<typeof FAB>;

const FabGroupWithSpeedDial: React.FC = () => {
    const theme = useTheme();
    const {width} = Dimensions.get('window');

    // Refs for FAB buttons
    const fabRefs = useRef<FabRef[]>([]);

    // State for each FAB group's visibility
    const [groupStates, setGroupStates] = useState<Record<number, boolean>>({});

    // State for active group index
    const [activeGroup, setActiveGroup] = useState<number | null>(null);

    // Set FAB ref with cleanup
    const setFabRef = useCallback((index: number) => (ref: FabRef | null) => {
        if (ref) {
            fabRefs.current[index] = ref;
        }
    }, []);

    // Handle main FAB press - opens its group and closes others
    const handleMainFabPress = useCallback((index: number) => {
        // Close all other groups if they're open
        const newGroupStates: Record<number, boolean> = {};

        // Toggle the clicked group
        const shouldOpen = !groupStates[index];
        newGroupStates[index] = shouldOpen;

        // Update state
        setGroupStates(newGroupStates);
        setActiveGroup(shouldOpen ? index : null);

        // Animate the active FAB
        if (fabRefs.current[index]) {
            Animated.sequence([
                Animated.timing(new Animated.Value(1), {
                    toValue: 1.2,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(new Animated.Value(1.2), {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [groupStates]);

    // Close all groups
    const closeAllGroups = useCallback(() => {
        setGroupStates({});
        setActiveGroup(null);
    }, []);

    // Handle backdrop press (to close all groups)
    const handleBackdropPress = useCallback(() => {
        closeAllGroups();
    }, [closeAllGroups]);

    // FAB group configurations
    const fabGroupConfigs: FabGroupConfig[] = [
        {
            icon: 'camera',
            label: 'Media',
            color: '#FF5722',
            actions: [
                {
                    icon: 'camera',
                    label: 'Take Photo',
                    color: '#FF9800',
                    onPress: () => console.log('Take Photo')
                },
                {
                    icon: 'video',
                    label: 'Record Video',
                    color: '#F44336',
                    onPress: () => console.log('Record Video')
                },
                {
                    icon: 'image',
                    label: 'Gallery',
                    color: '#4CAF50',
                    onPress: () => console.log('Open Gallery')
                },
                {
                    icon: 'microphone',
                    label: 'Voice Memo',
                    color: '#2196F3',
                    onPress: () => console.log('Record Audio')
                }
            ]
        },
        {
            icon: 'file-document',
            label: 'Documents',
            color: '#2196F3',
            actions: [
                {
                    icon: 'file-plus',
                    label: 'New Document',
                    color: '#4CAF50',
                    onPress: () => console.log('New Document')
                },
                {
                    icon: 'upload',
                    label: 'Upload File',
                    color: '#FF9800',
                    onPress: () => console.log('Upload File')
                },
                {
                    icon: 'folder',
                    label: 'Browse Files',
                    color: '#795548',
                    onPress: () => console.log('Browse Files')
                },
                {
                    icon: 'printer',
                    label: 'Print',
                    color: '#607D8B',
                    onPress: () => console.log('Print Document')
                }
            ]
        },
        {
            icon: 'message',
            label: 'Communicate',
            color: '#4CAF50',
            actions: [
                {
                    icon: 'email',
                    label: 'Compose Email',
                    color: '#D32F2F',
                    onPress: () => console.log('Compose Email')
                },
                {
                    icon: 'chat',
                    label: 'New Chat',
                    color: '#1976D2',
                    onPress: () => console.log('New Chat')
                },
                {
                    icon: 'phone',
                    label: 'Voice Call',
                    color: '#388E3C',
                    onPress: () => console.log('Voice Call')
                },
                {
                    icon: 'video-box',
                    label: 'Video Call',
                    color: '#7B1FA2',
                    onPress: () => console.log('Video Call')
                }
            ]
        },
        {
            icon: 'account',
            label: 'Account',
            color: '#9C27B0',
            actions: [
                {
                    icon: 'account-circle',
                    label: 'View Profile',
                    color: '#2196F3',
                    onPress: () => console.log('View Profile')
                },
                {
                    icon: 'cog',
                    label: 'Settings',
                    color: '#607D8B',
                    onPress: () => console.log('Settings')
                },
                {
                    icon: 'shield',
                    label: 'Security',
                    color: '#FF9800',
                    onPress: () => console.log('Security')
                },
                {
                    icon: 'logout',
                    label: 'Sign Out',
                    color: '#F44336',
                    onPress: () => console.log('Sign Out')
                }
            ]
        },
    ];

    return (
        <Portal>
            {/* Backdrop overlay when any group is open */}
            {activeGroup !== null && (
                <View
                    style={styles.backdrop}
                    onTouchStart={handleBackdropPress}
                />
            )}

            <View style={styles.container}>
                {/* Render FAB groups */}
                {fabGroupConfigs.map((config, index) => (
                    <View key={index} style={styles.fabGroupContainer}>
                        {/* Main FAB button */}
                        <FAB
                            ref={setFabRef(index)}
                            icon={config.icon}
                            style={[
                                styles.mainFab,
                                {
                                    backgroundColor: config.color,
                                    // Highlight active FAB
                                    transform: [
                                        {
                                            scale: activeGroup === index ? 1.1 : 1
                                        }
                                    ],
                                }
                            ]}
                            onPress={() => handleMainFabPress(index)}
                            color="white"
                            size="medium"
                        />

                        {/* FAB Group (Speed Dial) */}
                        {groupStates[index] && (
                            <FAB.Group
                                open={true}
                                visible={true}
                                icon={config.icon}
                                actions={config.actions.map((action, actionIndex) => ({
                                    ...action,
                                    style: {backgroundColor: action.color},
                                    labelStyle: styles.actionLabel,
                                    labelTextColor: '#FFFFFF',
                                    onPress: () => {
                                        action.onPress();
                                        closeAllGroups();
                                    },
                                }))}
                                onStateChange={({open}) => {
                                    if (!open) {
                                        closeAllGroups();
                                    }
                                }}
                                fabStyle={[
                                    styles.groupFab,
                                    {backgroundColor: config.color}
                                ]}
                                style={[
                                    styles.fabGroup,
                                    {
                                        // Position groups horizontally
                                        left: -(index * 100),
                                    }
                                ]}
                                backdropColor="transparent"
                            />
                        )}

                        {/* Label for main FAB */}
                        {!activeGroup && (
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>{config.label}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 32,
        right: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    fabGroupContainer: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    mainFab: {
        marginBottom: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabGroup: {
        position: 'absolute',
        bottom: 60,
        right: 0,
        zIndex: 10,
    },
    groupFab: {
        marginBottom: 8,
    },
    labelContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 4,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    actionLabel: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        fontSize: 14,
    },
});

export default FabGroupWithSpeedDial;
