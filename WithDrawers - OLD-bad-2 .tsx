import {Pressable, StyleSheet, View} from 'react-native';
import {useNavigation, useRouter, useSegments} from "expo-router";
import {Drawer as Drawer2} from "react-native-drawer-layout";
import {routerGlobals} from "@/router1/routerGlobals";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import Drawer1ContentScreen from "@/router1/Drawer1ContentScreen";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {useState} from "react";
import Drawer2ContentScreen from "@/router1/Drawer2ContentScreen";
import {useSupabase} from "@/mi/providers/WithSupabase";
import {userActions} from "@/mi/state/enities/user/userSlice";
import {useDispatch} from "react-redux";

import userCreateApi from "@/mi/state/enities/user/userCreateApi";
import {useSQLiteGlobal} from "@/app/_layout";
import {userReadApi} from "@/mi/state/enities/user/userReadApi";


const router = useRouter();

export default function WithDrawers(props: any) {

    // ██████████████████ AUTH userLC

    const dispatch: any = useDispatch();

    const _adapter: any = useSQLiteGlobal();
    const sqLiteAdapter: any = _adapter.useSQLiteMi;

    const supabaseAdapter: any = useSupabase();
    supabaseAdapter.supabase.auth.onAuthStateChange((event: any, session: any) => {
        // console.log("===== event all  ", event, session)

        console.log("===== userLC event", event);
        console.log("===== userLC session?.user?.email ", session?.user?.email);

        dispatch(
            userActions.setAttribute({supabaseSession: session}),
        );

        if (event === "INITIAL_SESSION") {

            console.log("userLC INITIAL_SESSION ", event);

            if (session?.user?.email) {

                const doAsync = async () => {
                    // Check if user exists

                    const _email = session?.user?.email.toLowerCase().trim();
                    const existingUser = await userReadApi({sqLiteAdapter, supabaseAdapter, userEmail: _email});

                    if (existingUser?.mediaPostGUID) {
                        console.log("===== userLC existingUser dispatch", existingUser);
                        dispatch(
                            userActions.setActualData(existingUser),
                        )
                    }
                };

                doAsync()
            }
        } else if (event === "SIGNED_IN") {

            const doAsync = async () => {
                const _email = session?.user?.email.toLowerCase().trim();
                const existingUser = await userReadApi({sqLiteAdapter, supabaseAdapter, userEmail: _email});
                console.log("===== userLC existingUser found !!!", existingUser);
                if (existingUser?.mediaPostGUID) {
                    console.log("===== userLC existingUser dispatch", existingUser);
                    dispatch(
                        userActions.setActualData(existingUser),
                    )

                } else {
                    const resRead = await userCreateApi({router, session, sqLiteAdapter, supabaseAdapter});
                    console.log("userLC resRead", resRead);
                    dispatch(
                        userActions.setActualData(existingUser),
                    )
                }
            };

            doAsync()

            // handle sign in event
        } else if (event === "SIGNED_OUT") {

            dispatch(
                userActions.clearActualData(""),
            );

            if (router.canGoBack()) {
                router.back()
            }

        } else if (event === "PASSWORD_RECOVERY") {
            // handle password recovery event
        } else if (event === "TOKEN_REFRESHED") {
            // handle token refreshed event
        } else if (event === "USER_UPDATED") {
            // handle user updated event
        }
    });

    // ██████████████████ DRAWERS

    const router = useRouter();
    const segments: any = useSegments();
    const navigation = useNavigation();
    const [open, setOpen] = useState<boolean>(false);
    return (

        <Drawer2
            drawerStyle={{
                borderTopLeftRadius: routerGlobals.drawerRight.borderTopLeftRadius,
                borderBottomLeftRadius: routerGlobals.drawerRight.borderBottomLeftRadius,
                overflow: 'hidden', // Important for borderRadius to work with gradient
            }}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderDrawerContent={() => {
                // return <View><Text>0000</Text></View>
                return (<Drawer2ContentScreen setOpen={setOpen}/>)
            }}
            drawerPosition={routerGlobals.drawerRight.position}
        >
            <props.Drawer1
                drawerContent={(props: any) => <Drawer1ContentScreen/>}
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: routerGlobals.drawerLeft.backgroundColor,
                        borderTopRightRadius: routerGlobals.drawerLeft.borderTopRightRadius,
                        borderBottomRightRadius: routerGlobals.drawerLeft.borderBottomRightRadius,
                        // OR use a single property for all corners:
                        // borderRadius: 30,
                    },
                    drawerPosition: routerGlobals.drawerLeft.position,
                    headerShown: true,
                    // 1. Custom App Bar Styling
                    headerStyle: {backgroundColor: '#6200ee'},
                    headerTintColor: '#fff',
                    headerLeft: (p: any) => {
                        // console.log("p1 router1.canGoBack", router1.canGoBack())
                        // console.log("p1 segments ", segments)
                        // console.log("p1 segments.length ", segments.length)
                        // console.log("p1 router1", router1)
                        if (router.canGoBack()) {
                            return (<Pressable
                                onPress={() => router.back()}
                                style={{paddingLeft: 16, paddingRight: 16,}}
                            >
                                <Ionicons name="arrow-back" size={24} color={routerGlobals.navigateMainIconColor}/>

                            </Pressable>)
                        }

                        // return <MaterialCommunityIcons name="menu" size={24} style={{marginLeft: 16}}/>

                        return (
                            <View style={(!router.canGoBack()) ? {} : styles.rotatedButton}>
                                <DrawerToggleButton
                                    tintColor={routerGlobals.hamburgerColor}
                                    // Or use a completely custom icon:
                                    // children={<Ionicons name="menu-outline" size={28} color="white" />}
                                />
                            </View>
                        )
                    },
                    headerRight: (p: any) => {

                        return (
                            <View style={{flexDirection: 'row'}}>
                                <Pressable style={{paddingLeft: 20}}>
                                    <Ionicons name="search-outline" size={24}
                                              color={routerGlobals.navigateIconsColor}/>
                                </Pressable>
                                <Pressable style={{paddingLeft: 20}}>
                                    <Ionicons name="notifications-outline" size={24}
                                              color={routerGlobals.navigateIconsColor}/>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setOpen((prevOpen) => !prevOpen)
                                        // Alert.alert("headerRight", "!!!")
                                        // window.alert("headerRight")
                                        // router1.back()
                                    }}
                                    style={{paddingLeft: 16, paddingRight: 16,}}
                                >
                                    <MaterialCommunityIcons name="dots-vertical" size={24} color="white"/>
                                </Pressable>
                            </View>
                        )

                    },
                }}
            >
                {props.children}
            </props.Drawer1>
        </Drawer2>

    );
}

const styles = StyleSheet.create({
    rotatedButton: {
        transform: [{rotate: '90deg'}],
        marginRight: 16,
    },

});
