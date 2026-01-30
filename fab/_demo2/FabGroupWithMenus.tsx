import React, {useCallback, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Divider, FAB, Menu, Portal, Text} from 'react-native-paper';

const FabGroupWithMenus = () => {
    // Refs for FAB buttons
    const fabRefs: any = useRef([]);

    // State for each menu's visibility
    const [menuVisible, setMenuVisible] = useState<any>({});

    // State for active menu index
    const [activeMenu, setActiveMenu] = useState<any>(null);

    // Set FAB ref with cleanup
    const setFabRef = useCallback((index: any) => (ref: any) => {
        fabRefs.current[index] = ref;
    }, []);

    // Handle FAB press - opens its menu and closes others
    const handleFabPress = useCallback((index: number) => {
        // Close all other menus
        const newMenuVisible: any = {};
        Object.keys(menuVisible).forEach((key: string) => {
            newMenuVisible[key] = false;
        });

        // Toggle the clicked menu
        newMenuVisible[index] = !menuVisible[index];

        // Update state
        setMenuVisible(newMenuVisible);
        setActiveMenu(newMenuVisible[index] ? index : null);

        // Optional: Animate the active FAB
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
    }, [menuVisible]);

    // Close all menus
    const closeAllMenus = useCallback(() => {
        const newMenuVisible: any = {};
        Object.keys(menuVisible).forEach(key => {
            newMenuVisible[key] = false;
        });
        setMenuVisible(newMenuVisible);
        setActiveMenu(null);
    }, [menuVisible]);

    // FAB configurations
    const fabConfigs = [
        {
            icon: 'camera',
            label: 'Camera',
            color: '#FF5722',
            menuItems: [
                {label: 'Take Photo', icon: 'camera', action: () => console.log('Take Photo')},
                {label: 'Record Video', icon: 'video', action: () => console.log('Record Video')},
                {label: 'Scan Document', icon: 'document-scanner', action: () => console.log('Scan')},
            ]
        },
        {
            icon: 'file',
            label: 'Documents',
            color: '#2196F3',
            menuItems: [
                {label: 'New Document', icon: 'file-plus', action: () => console.log('New Doc')},
                {label: 'Upload File', icon: 'upload', action: () => console.log('Upload')},
                {label: 'Scan QR', icon: 'qrcode-scan', action: () => console.log('Scan QR')},
            ]
        },
        {
            icon: 'message',
            label: 'Messages',
            color: '#4CAF50',
            menuItems: [
                {label: 'New Message', icon: 'message-plus', action: () => console.log('New Message')},
                {label: 'Inbox', icon: 'inbox', action: () => console.log('Inbox')},
                {label: 'Drafts', icon: 'file-document-edit', action: () => console.log('Drafts')},
            ]
        },
        {
            icon: 'account',
            label: 'Account',
            color: '#9C27B0',
            menuItems: [
                {label: 'Profile', icon: 'account-circle', action: () => console.log('Profile')},
                {label: 'Settings', icon: 'cog', action: () => console.log('Settings')},
                {label: 'Logout', icon: 'logout', action: () => console.log('Logout')},
            ]
        },
    ];

    return (
        <Portal>
            <View style={styles.container}>
                {/* Render FABs with menus */}
                {fabConfigs.map((config, index) => (
                    <View key={index} style={styles.fabContainer}>
                        {/* Menu for this FAB */}
                        <Menu
                            anchorPosition={'bottom'}
                            visible={menuVisible[index] || false}
                            onDismiss={() => {
                                const newVisible = {...menuVisible};
                                newVisible[index] = false;
                                setMenuVisible(newVisible);
                                setActiveMenu(null);
                            }}
                            anchor={
                                <FAB
                                    ref={setFabRef(index)}
                                    icon={config.icon}
                                    style={[
                                        styles.fab,
                                        {
                                            backgroundColor: config.color,
                                            // Highlight active FAB
                                            transform: [
                                                {
                                                    scale: activeMenu === index ? 1.1 : 1
                                                }
                                            ],
                                        }
                                    ]}
                                    onPress={() => handleFabPress(index)}
                                    color="white"
                                    small
                                />
                            }
                            contentStyle={styles.menuContent}
                        >
                            {/* Menu Header */}
                            <View style={styles.menuHeader}>
                                <Text style={styles.menuTitle}>{config.label} Options</Text>
                            </View>
                            <Divider/>

                            {/* Menu Items */}
                            {config.menuItems.map((item, itemIndex) => (
                                <Menu.Item
                                    key={itemIndex}
                                    leadingIcon={item.icon}
                                    onPress={() => {
                                        item.action();
                                        closeAllMenus();
                                    }}
                                    title={item.label}
                                    titleStyle={styles.menuItemText}
                                />
                            ))}
                        </Menu>
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
        right: 32,
        alignItems: 'flex-end',
    },
    fabContainer: {
        marginBottom: 16,
    },
    fab: {
        marginBottom: 8,
    },
    menuContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 4,
    },
    menuHeader: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    menuTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    menuItemText: {
        fontSize: 14,
        color: '#333',
    },
});

export default FabGroupWithMenus
