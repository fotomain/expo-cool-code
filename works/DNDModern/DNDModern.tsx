import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Draggable, Droppable, DropProvider} from 'react-native-reanimated-dnd';

export default function InstallationTest() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <DropProvider>
                <View style={styles.content}>
                    <Text style={styles.title}>Installation Test</Text>

                    <Draggable data={{id: '1', name: 'Test Item'}}>
                        <View style={styles.draggable}>
                            <Text>Drag me!</Text>
                        </View>
                    </Draggable>

                    <Droppable onDrop={(data) => console.log('Dropped:', data)}>
                        <View style={styles.droppable}>
                            <Text>Drop here!</Text>
                        </View>
                    </Droppable>
                </View>
            </DropProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    draggable: {
        zIndex: 99,
        width: 100,
        height: 100,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    droppable: {
        width: 200,
        height: 100,
        backgroundColor: '#2196F3',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#1976D2',
    },
});