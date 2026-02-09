// =====================================================
// STEP 1: Imports
// =====================================================

import SwipableContent from './SwipableContent';
import LeftOverlay from './LeftOverlay';
import RightOverlay from './RightOverlay';
import * as React from 'react';
import {useState} from 'react';
import {Dimensions, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {withTiming,} from 'react-native-reanimated';
import {scheduleOnRN} from "react-native-worklets";
import ModalOnSwipe from "@/mi/ui/posts/list/demo/swipeCard/ModalOnSwipe";
import SwipeCard from "@/mi/ui/posts/list/demo/swipeCard/SwipeCard";
import {Snackbar} from "react-native-paper";
// =====================================================
// STEP 2: Constants
// =====================================================
const {width} = Dimensions.get('window');

// =====================================================
// STEP 3: Types
// =====================================================
type CardItem = {
    id: number;
    title: string;
};

// =====================================================
// STEP 5: Main Application
// =====================================================
export default function SwipeApp5() {
    // ---------------------------------------------------
    // STEP 5.1: State
    // ---------------------------------------------------
    const [cards, setCards] = React.useState<CardItem[]>(
        Array.from({length: 10}, (_, i) => ({
            id: i + 1,
            title: `Card ${i + 1}`,
        }))
    );

    const [modalVisible, setModalVisible] = React.useState(false);
    const [pendingId, setPendingId] = React.useState<number | null>(null);
    const pendingX: any = React.useRef<any>(null);

    // ---------------------------------------------------
    // STEP 5.2: Logic
    // ---------------------------------------------------
    const [justRemoved, setJustRemoved] = useState(false);
    const [removedItem, setRemovedItem] = useState<any>(null);
    const removeCard = (id: number) => {

        let removedPosition = -1;
        const itemFound = cards.find((x, ii: number) => {
            removedPosition = ii;
            return x.id === id
        });
        setRemovedItem({itemFound, removedPosition});

        setCards((prev) => prev.filter((c) => c.id !== id));

        setJustRemoved(true)

    };

    const handleUndo = () => {
        // window.alert("Undo!" + JSON.stringify(removedItem));
        setCards((prev) => prev.toSpliced(removedItem.removedPosition, 0, removedItem.itemFound));
    };

    const [onCancelModal, setOnCancelModal] = useState<any>(null);

    const openModalToAsk = (id: number, x: any, doAfterCancel: any) => {
        setPendingId(id);
        pendingX.current = x;
        setModalVisible(true);
        if (doAfterCancel) {
            setOnCancelModal({doAfterCancel})
        }
    };

    const onPressDelete = () => {
        console.log("width0", width);
        if (pendingId && pendingX.current) {
            pendingX.current.value = withTiming(width, {}, () =>
                //delete2 from modal
                scheduleOnRN(removeCard, pendingId)
            );
        }
        setModalVisible(false);
    };

    // ---------------------------------------------------
    // STEP 5.3: Render
    // ---------------------------------------------------
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", width: 550}}>
            <ScrollView style={[swipeSheet.container, {width: 550}]}>
                {cards.map((item) => (

                    <SwipeCard
                        key={item.id}
                        item={item}
                        onRemove={removeCard}
                        onArchive={removeCard}
                        doOpenModalToAsk={openModalToAsk}
                        SHIFT_SIMPLE_MILESTONE={120}
                        SHIFT_FULL_MILESTONE={Platform.select({ios: 150, android: 150, web: 300, default: 150})}
                        SHIFT_FOR_ASK_MILESTONE={Platform.select({ios: 150, android: 150, web: 300, default: 150})}
                        LeftOverlay={LeftOverlay}
                        RightOverlay={RightOverlay}
                    >
                        <SwipableContent item={item}/>
                    </SwipeCard>

                ))}
            </ScrollView>

            <Snackbar
                visible={justRemoved}
                onDismiss={() => setJustRemoved(false)}
                action={{label: 'Undo', onPress: handleUndo}}
                duration={3000}
            >
                Item deleted.
            </Snackbar>

            {/* =================================================
            STEP 6: Modal (NO PORTAL)
            ================================================= */}
            <ModalOnSwipe
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                questionText={"Do you really want to delete?"}
                buttonYesText="Delete"
                buttonCancelText="Cancel"
                onPressYes={() => {
                    onPressDelete()
                }}

                onPressCancel={() => {
                    setModalVisible(false);
                    if (onCancelModal?.doAfterCancel) {
                        onCancelModal?.doAfterCancel()
                    }
                }}
            />

        </View>
    );
}

// =====================================================
// STEP 7: Styles
// =====================================================
export const swipeSheet = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12,
    },
    cardWrapper: {
        flex: 1,
        backgroundColor: 'pink',
        position: 'relative',
        marginBottom: 12,
    },
    card: {
        elevation: 3,
    },
    leftOverlay: {
        // ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        left: 0,
        backgroundColor: '#1976d2',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 16,
        borderRadius: 8,
    },
    rightOverlay: {
        // ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        right: 0,
        backgroundColor: '#d32f2f',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 16,
        borderRadius: 8,
    },
    modal: {
        backgroundColor: 'white',
        padding: 24,
        margin: 24,
        borderRadius: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
});