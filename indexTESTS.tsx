import TextMi from "@/mi/ui/screens/sendemail/TextMi";
// import {Drawer as Drawer1} from 'expo-router/drawer';
// import {Drawer as Drawer2} from "react-native-drawer-layout";
import {StyleSheet, View} from "react-native";
import {useSelector} from "react-redux";

export default function HomeScreen(props: any) {

    const uxui = useSelector((state: any) => state.uxuiState);


    return (
        <View
            style={{backgroundColor: "lightgreen", width: "100%", flex: 1, justifyContent: 'space-between'}}>
            <View>
                <TextMi>HomeScreen as index.tsx</TextMi>
                <TextMi>uxui {uxui.screenWidth}</TextMi>
            </View>
        </View>
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
