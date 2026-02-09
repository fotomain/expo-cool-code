// =====================================================
// STEP 1: Imports
// =====================================================

import SwipableContent from './SwipableContent';
import LeftOverlay from './LeftOverlay';
import RightOverlay from './RightOverlay';
import * as React from 'react';
import {useState} from 'react';
import {Platform, ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import {withTiming,} from 'react-native-reanimated';
import {scheduleOnRN} from "react-native-worklets";
import ModalOnSwipe from "@/mi/ui/posts/list/demo/swipeCard/ModalOnSwipe";
import SwipeCard from "@/mi/ui/posts/list/demo/swipeCard/SwipeCard";
import {Snackbar} from "react-native-paper";
// =====================================================
// STEP 2: Constants
// =====================================================


// =====================================================
// STEP 3: Types
// =====================================================
// type CardItem = {
//     id: number;
//     title: string;
// };

// =====================================================
// STEP 5: Main Application
// =====================================================
export default function SwipeApp5() {
    const {width} = useWindowDimensions();
    // ---------------------------------------------------
    // STEP 5.1: State
    // ---------------------------------------------------
    // id: i + 1,
    // title: `Card ${i + 1}`,
    //████SWIPE-01 Set Data
    const [items, setItems] = React.useState<any[]>(
        Array.from({length: 10}, (_, i) => ({
            mediaPostGUID: i + 1,
            mediaPostTitle: `Card ${i + 1}`,
        }))
    );

    //████SWIPE-02 Crud Data
    // ---------------------------------------------------
    // STEP 5.2: Logic
    // ---------------------------------------------------
    const [modalVisible, setModalVisible] = React.useState(false);
    const [pendingId, setPendingId] = React.useState<number | null>(null);
    const pendingX: any = React.useRef<any>(null);
    const [justRemoved, setJustRemoved] = useState(false);
    const [removedItem, setRemovedItem] = useState<any>(null);
    const removeCard = (id: number) => {

        let removedPosition = -1;
        const itemFound = items.find((x, ii: number) => {
            removedPosition = ii;
            return x.mediaPostGUID === id
        });
        setRemovedItem({itemFound, removedPosition});

        setItems((prev) => prev.filter((c) => c.mediaPostGUID !== id));

        setJustRemoved(true)

    };

    const handleUndo = () => {
        // window.alert("Undo!" + JSON.stringify(removedItem));
        setItems((prev) => prev.toSpliced(removedItem.removedPosition, 0, removedItem.itemFound));
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
                {items.map((item) => (
                    // !!! swipe must work without any inner calls
                    <SwipeCard
                        key={item.mediaPostGUID}
                        item={item}
                        onRemove={removeCard}
                        onArchive={removeCard}
                        onFullSwipe={removeCard}
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


            {/* =================================================
            STEP 6: Modal (NO PORTAL)
            ================================================= */}
            <Snackbar
                visible={justRemoved}
                onDismiss={() => setJustRemoved(false)}
                action={{label: 'Undo', onPress: handleUndo}}
                duration={3000}
            >
                Item deleted.
            </Snackbar>

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