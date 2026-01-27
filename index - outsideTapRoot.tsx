import TextMi from "@/mi/ui/screens/sendemail/TextMi";
// import {Drawer as Drawer1} from 'expo-router/drawer';
// import {Drawer as Drawer2} from "react-native-drawer-layout";
import {Drawer as Drawer2} from "react-native-drawer-layout";

import {StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import {routerGlobals} from "@/router1/routerGlobals";
import ButtonMi from "@/mi/ui/screens/sendemail/ButtonMi";
import {useDispatch, useSelector} from "react-redux";
import {uxuiActions} from "@/mi/state/enities/uxui/uxuiSlice";
import Drawer2ContentScreen from "@/router1/Drawer2ContentScreen";
import {useDrawerStatus} from "@react-navigation/drawer";
import {useNavigation} from "expo-router";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

export default function HomeScreen(props: any) {

    const dispatch: any = useDispatch();

    const [open, setOpen] = useState<boolean>(false);

    const uxui = useSelector((state: any) => state.uxuiState);

    const isDrawerOpen = useDrawerStatus() === 'open';
    const isDrawerClosed = useDrawerStatus() === 'closed';
    console.log("isDrawerOpen0", isDrawerOpen);
    const navigation = useNavigation();

    useEffect(() => {
        // Open drawer on initial render
        if (uxui.openDrawer2) {
            navigation.dispatch({type: 'OPEN_DRAWER'});
            // const timer = setTimeout(() => {
            //     // Try both methods
            //     navigation.dispatch({type: 'OPEN_DRAWER'});
            // }, 100);
            // return () => clearTimeout(timer);
        } else {
            navigation.dispatch({type: 'CLOSE_DRAWER'});
        }

    }, [uxui.openDrawer2]);

    useEffect(() => {
        if (isDrawerClosed) {
            dispatch(uxuiActions.setAttribute({openDrawer2: false}))
        }
    }, [isDrawerClosed]);

    const outsideTapRoot = Gesture.Tap()
        .numberOfTaps(1)
        .onStart((e: any) => {
            // console.log('=== tap e',e);
            console.log('█████ outsideTapRoot ');
            console.log('█████ outsideTapRoot - ', e);
            console.log('█████ outsideTapRoot e.target.id - ', e.target.dataset);
        });

    return (
        <GestureDetector gesture={outsideTapRoot}>
            <Drawer2
                drawerStyle={{
                    // marginTop: -50,
                    borderTopLeftRadius: routerGlobals.drawerRight.borderTopLeftRadius,
                    borderBottomLeftRadius: routerGlobals.drawerRight.borderBottomLeftRadius,
                    overflow: 'hidden', // Important for borderRadius to work with gradient
                }}
                open={false}
                // open={uxui.openDrawer2}
                onOpen={() => {
                    dispatch(uxuiActions.setAttribute({openDrawer2: true}))
                }}
                onClose={() => {
                    dispatch(uxuiActions.setAttribute({openDrawer2: false}))
                }}
                renderDrawerContent={() => {
                    // return <View><Text>0000</Text></View>

                    // window.alert("to to Drawer1Content2");

                    return (
                        <Drawer2ContentScreen
                            setOpen={(p: boolean) => dispatch(uxuiActions.setAttribute({openDrawer2: p}))}/>

                    )
                }}
                drawerPosition={routerGlobals.drawerRight.position}
            >

                {/*<FabGroupWithSpeedDial/>*/}
                {/*<FabGroupWithMenus/>*/}

                <View style={{backgroundColor: "lightgreen", flex: 1, height: '100%', width: '100%'}}>
                    <TextMi>HomeScreen as index.tsx</TextMi>
                    <TextMi h3>uxui.openDrawer2 {uxui.openDrawer2.toString()}</TextMi>
                </View>

                <ButtonMi
                    onPress={() => {
                        dispatch(uxuiActions.setAttribute({openDrawer2: !uxui.openDrawer2}))
                    }}>
                    Set
                </ButtonMi>
                <ButtonMi
                    onPress={() => {
                        setOpen(!open);
                    }}>
                    Open
                </ButtonMi>
            </Drawer2>
        </GestureDetector>
    )

}

const styles = StyleSheet.create({

    // backdrop: {
    //     flex: 1,
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    //     justifyContent: 'center',              // Centers content vertically
    //     alignItems: 'center',                  // Centers content horizontally
    // },
    // modalContent: {
    //     width: '90%',        // Responsive width for web
    //     maxWidth: 500,       // Prevents it from being too wide on desktop
    //     minHeight: 300,
    //     backgroundColor: 'white',
    //     borderRadius: 8,
    //     padding: 20,
    //     // Add shadow for better depth on web
    //     shadowColor: '#000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5,
    // },

    // modal: {
    //     backgroundColor: "pink",
    //     // top: '50%',
    //     // height: '50%',
    //     // width: '50%',
    //     width: 50,
    // }
});
