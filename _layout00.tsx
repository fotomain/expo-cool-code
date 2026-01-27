// import { Stack } from "expo-router";

import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";
// import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import {useEffect} from "react";
import {WithAuthNative} from "@/mi/providers/WithAuthNative";
import {Stack} from "expo-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import WithState from "@/mi/providers/WithState";
import WithSupabase from "@/mi/providers/WithSupabase";
import WithSQLiteAll from "@/mi/providers/WithSQLiteAll";
import WithUXUI from "@/mi/providers/WithUXUI";
import WithIntent from "@/mi/providers/WithIntent";
import SQLiteNativeProvider, {useSQLNative} from "@/mi/providers/SQLiteNativeProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    // return <App1/>

    return (
        <GestureHandlerRootView>
            <WithSupabase
                initialConfig={{
                    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
                    key: process.env.EXPO_PUBLIC_SUPABASE_KEY,
                }}
            >
                <SQLiteNativeProvider dbName={"db1111"}>
                    <WithState>
                        <WithIntent>
                            <WithAuthNative>
                                <WithUXUI>
                                    {/*<LoginForm />*/}
                                    <Stack>
                                        <Stack.Screen name="index" options={{headerShown: false}}/>
                                        <Stack.Screen name="+not-found"/>
                                    </Stack>
                                    <StatusBar style="auto"/>
                                </WithUXUI>
                            </WithAuthNative>
                        </WithIntent>
                    </WithState>
                </SQLiteNativeProvider>
            </WithSupabase>

        </GestureHandlerRootView>
    );
}


export const useSQLiteGlobal = useSQLNative


// screenOptions={{
//         headerShown: false,
//         navigationBarHidden: false,
//         statusBarHidden: true,
//         statusBarTranslucent: true,
// }}
