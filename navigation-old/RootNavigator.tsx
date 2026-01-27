import * as React from "react"
import {useState} from "react"
import {Platform, StyleSheet, View} from "react-native"
import type {DrawerNavigationProp} from "@react-navigation/drawer"
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack"
import {Appbar, Button, Divider, Menu} from "react-native-paper"
import AntDesign from "react-native-vector-icons/AntDesign"
import IoniCons from "react-native-vector-icons/Ionicons"

import Card1 from "../Card1"
import Card2 from "../Card2"
import Card3 from "../Card3"
import PricingTableComponent from "../ui/screens/PricingTableComponent"

const Stack = createStackNavigator()

const RootNavigator = () => {
    const cardStyleInterpolator =
        Platform.OS === "android"
            ? CardStyleInterpolators.forFadeFromBottomAndroid
            : CardStyleInterpolators.forHorizontalIOS

    const [visible, setVisible] = useState(false)
    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)

    return (
        <View style={styles.stackWrapper}>
            <Stack.Navigator
                screenOptions={() => ({
                    cardStyleInterpolator,
                    header: ({navigation, route, options, back}) => (
                        <Appbar.Header elevated>
                            {back ? (
                                <Appbar.BackAction onPress={() => navigation.goBack()}/>
                            ) : (navigation as any).openDrawer ? (
                                <Appbar.Action
                                    icon="menu"
                                    isLeading
                                    onPress={() => (navigation as any as DrawerNavigationProp<{}>).openDrawer()}
                                />
                            ) : null}
                            <Appbar.Content title={options.title || route.name}/>
                            {/*<Provider>*/}
                            <View style={styles.menuStyle}>
                                <Menu
                                    style={styles.menuStyle}
                                    visible={visible}
                                    onDismiss={closeMenu}
                                    anchor={<Button onPress={openMenu}> </Button>}
                                >
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <AntDesign name="file-pdf" {...p} />}
                                        title="Upload PDF"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <AntDesign name="file-word" {...p} />}
                                        title="Upload MS Word"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <AntDesign name="file-text" {...p} />}
                                        title="Upload Txt"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <AntDesign name="file-image" {...p} />}
                                        title="Upload Image"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <AntDesign name="link" {...p} />}
                                        title="Paste URL"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <AntDesign name="youtube" {...p} />}
                                        title="Paste YouTube"
                                    />
                                    <Divider/>
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <IoniCons name="camera-outline" {...p} />}
                                        title="Make Photo"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <IoniCons name="videocam-outline" {...p} />}
                                        title="Record Video"
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <IoniCons name="musical-notes-outline" {...p} />}
                                        title="Record Audio"
                                    />
                                    <Divider/>
                                    <Menu.Item
                                        onPress={() => {
                                        }}
                                        leadingIcon={(p: any) => <IoniCons name="settings-outline" {...p} />}
                                        title="Settings"
                                    />
                                </Menu>
                            </View>
                            {/*</Provider>*/}
                            <Appbar.Action icon="dots-vertical" onPress={openMenu}/>
                        </Appbar.Header>
                    ),
                })}
            >
                <Stack.Screen
                    name="Card2"
                    component={Card2}
                    options={{
                        title: "Card2 Name",
                    }}
                />

                <Stack.Screen
                    name="Card1"
                    component={Card1}
                    options={{
                        title: "Card1 Name",
                    }}
                />

                <Stack.Screen
                    name="Card3"
                    component={Card3}
                    options={{
                        title: "Card3 Name",
                    }}
                />

                <Stack.Screen
                    name="PricePlan0"
                    component={() => (
                        <PricingTableComponent showOnly1Card={true} showCardNumber={1} miniCard={false}/>
                    )}
                    options={{
                        title: "Plan Personal",
                    }}
                />

                <Stack.Screen
                    name="PricePlan1"
                    component={() => (
                        <PricingTableComponent showOnly1Card={true} showCardNumber={2} miniCard={false}/>
                    )}
                    options={{
                        title: "Plan Professional",
                    }}
                />

                <Stack.Screen
                    name="PricePlan2"
                    component={() => (
                        <PricingTableComponent showOnly1Card={true} showCardNumber={3} miniCard={false}/>
                    )}
                    options={{
                        title: "Plan Enterprise",
                    }}
                />

                {/*<Stack.Screen*/}
                {/*    name="ExampleList"*/}
                {/*    component={ExampleList}*/}
                {/*    options={{*/}
                {/*        title: 'Examples',*/}
                {/*    }}*/}
                {/*/>*/}
                {/*{(Object.keys(examples) as Array<keyof typeof examples>).map((id) => {*/}
                {/*    return (*/}
                {/*        <Stack.Screen*/}
                {/*            key={id}*/}
                {/*            name={id}*/}
                {/*            component={examples[id]}*/}
                {/*            options={{*/}
                {/*                title: examples[id].title,*/}
                {/*                headerShown: id !== 'themingWithReactNavigation',*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    );*/}
                {/*})}*/}
            </Stack.Navigator>

            {/*<Text>RootNavigator1</Text>*/}
            {/*<MyComponent/>*/}
        </View>
    )
}

// <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
//   <Text>Centered test</Text>
// </View>

export default RootNavigator

// <View>
//     <Text>PaperProviderApq1</Text>
//     <MyTextInput/>
//     <MyButton/>
// </View>
const styles = StyleSheet.create({
    menuStyle: {
        bottom: 0,
        flexDirection: "row",
        // marginLeft: "auto",
        // paddingLeft: -50,
        // paddingTop: 50,
        justifyContent: "center",
        left: "auto",
        position: "absolute",
        right: 0,
        top: 0,
    },
    stackWrapper: {
        flex: 1,
        ...Platform.select({
            web: {
                overflow: "scroll",
            },
        }),
    },
})
