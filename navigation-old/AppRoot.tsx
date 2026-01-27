import React from "react"
import {createDrawerNavigator} from "@react-navigation/drawer"
import {SafeAreaInsetsContext} from "react-native-safe-area-context"

import DrawerItems from "./components/drawer/DrawerItems"


import {View} from "react-native";
import RootNavigator from "@/mi/navigation/RootNavigator";

const Drawer = createDrawerNavigator<any>()

const AppRoot = () => {
    const [collapsed, setCollapsed] = React.useState(false)

    return (
        <View style={{backgroundColor: 'red', width: '100%', height: '100%'}}>
            <SafeAreaInsetsContext.Consumer>
                {(insets) => {
                    const {left, right} = insets || {left: 0, right: 0}
                    const collapsedDrawerWidth = 100 + Math.max(left, right)
                    return (
                        // <View>
                        //     <Text>PaperProviderApq1</Text>
                        //     <Text>{collapsed?"collapsed yes":"collapsed no"}</Text>
                        //     <Text>{collapsedDrawerWidth}</Text>
                        //     {/*<Text>{JSON.stringify(insets)}</Text>*/}
                        //     <MyTextInput/>
                        //     <MyButton/>
                        //
                        // </View>
                        <View style={{backgroundColor: 'red', width: '100%', height: '100%'}}>
                            <Drawer.Navigator
                                screenOptions={{
                                    drawerStyle: collapsed && {
                                        width: collapsedDrawerWidth,
                                    },
                                }}
                                drawerContent={() => <DrawerItems/>}
                            >
                                <Drawer.Screen
                                    name="/mi/test"
                                    component={RootNavigator}
                                    options={{headerShown: false}}
                                />
                            </Drawer.Navigator>
                        </View>
                    )
                }}
            </SafeAreaInsetsContext.Consumer>
        </View>
        // NavigationContainer
    )
}
export default AppRoot
