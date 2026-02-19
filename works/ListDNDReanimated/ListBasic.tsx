import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Sortable, SortableItem, SortableRenderItemProps} from "@/mi/ListDNDReanimated/src";


interface ListItem {
    id: string;
    title: string;
    subtitle: string;
    color: string;
}

export default function ListBasic() {
    const [items] = useState<ListItem[]>([
        { id: '1', title: 'First Item', subtitle: 'Drag to reorder', color: '#ff6b6b' },
        { id: '2', title: 'Second Item', subtitle: 'Move me around', color: '#4ecdc4' },
        { id: '3', title: 'Third Item', subtitle: 'I can be sorted', color: '#45b7d1' },
        { id: '4', title: 'Fourth Item', subtitle: 'Reorder the list', color: '#96ceb4' },
        { id: '5', title: 'Fifth Item', subtitle: 'Drag and drop', color: '#feca57' },
    ]);

    const renderItem = useCallback((props: SortableRenderItemProps<ListItem>) => {
        const { item, id, positions, lowerBound, autoScrollDirection, itemsCount, itemHeight } = props;

        return (
            <SortableItem
                key={id}
                id={id}
                data={item}
                positions={positions}
                lowerBound={lowerBound}
                autoScrollDirection={autoScrollDirection}
                itemsCount={itemsCount}
                itemHeight={itemHeight}
                containerHeight={600} // Adjust based on your container
                style={styles.sortableItem}
                onMove={(currentId:string, from:any, to:any) => {
                    console.log(`Item ${currentId} moved from ${from} to ${to}`);
                }}
                onDragStart={(currentId:string, position:any) => {
                    console.log(`Item ${currentId} started dragging from position ${position}`);
                }}
                onDrop={(currentId:string, position:any) => {
                    console.log(`Item ${currentId} dropped at position ${position}`);
                }}
            >
                <View style={[styles.itemContent, { borderLeftColor: item.color }]}>
                    <View style={styles.dragHandle}>
                        <Text style={styles.dragIcon}>⋮⋮</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.itemIndex}>
                        <Text style={styles.indexText}>{parseInt(id)}</Text>
                    </View>
                </View>
            </SortableItem>
        );
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Sortable Lists</Text>
                    <Text style={styles.subtitle}>Drag items to reorder</Text>

                    <View style={styles.listContainer}>
                        <Sortable
                            data={items}
                            renderItem={renderItem}
                            itemHeight={80} // Height of each item
                            style={styles.sortableContainer}
                        />
                    </View>

                    {/* Info */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            Items: {items.length} • Drag the handle (⋮⋮) to reorder
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 30,
    },
    listContainer: {
        flex: 1,
        marginBottom: 20,
    },
    sortableContainer: {
        flex: 1,
    },
    sortableItem: {
        marginBottom: 12,
    },
    itemContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dragHandle: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    dragIcon: {
        color: '#58a6ff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemText: {
        flex: 1,
    },
    itemTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemSubtitle: {
        color: '#8E8E93',
        fontSize: 14,
    },
    itemIndex: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indexText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoContainer: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#58a6ff',
    },
    infoText: {
        color: '#8E8E93',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
});