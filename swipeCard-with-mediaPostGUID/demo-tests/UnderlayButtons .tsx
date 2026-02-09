// components/UnderlayButtons.tsx - Step 5: Underlay Buttons for Swipe Actions
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';

interface UnderlayButtonsProps {
    onClose: () => void;
    side: 'left' | 'right';
}

const UnderlayButtons: React.FC<UnderlayButtonsProps> = ({onClose, side}) => {
    // Step 5.1: Determine styles based on side
    const containerStyle = [
        styles.underlayContainer,
        side === 'left' ? styles.leftUnderlay : styles.rightUnderlay,
    ];

    return (
        <View style={containerStyle}>
            <Button
                mode="contained"
                icon="close"
                onPress={onClose}
                style={styles.closeButton}
                labelStyle={styles.buttonLabel}
            >
                Close
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    underlayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
        borderRadius: 8,
    },
    leftUnderlay: {
        backgroundColor: '#ff6b6b',
        marginRight: 8,
    },
    rightUnderlay: {
        backgroundColor: '#4ecdc4',
        marginLeft: 8,
    },
    closeButton: {
        minWidth: 100,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UnderlayButtons;