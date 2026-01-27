// import EvilIcons from "react-native-vector-icons/EvilIcons"
// import EvilIcons from "react-native-vector-icons/EvilIcons"

import { useEffect, useState } from "react"
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import * as WebBrowser from "expo-web-browser"
import { Card, FAB, PaperProvider, Text, TextInput } from "react-native-paper"

import mediaContainers from "./views/mediaContainers"
import { stylesMediaContainer } from "./views/stylesMediaContainer"
import IconMi from "../../../components/iconvariable/IconMi"
import TextMi from "@/mi/ui/screens/sendemail/TextMi";
import {showCard} from "@/mi/ui/posts/list/card/showCard";
import InputTexts from "@/mi/ui/posts/list/card/InputTexts";
import RowLast from "@/mi/ui/posts/list/card/RowLast";
import FABCardLocal from "@/mi/ui/posts/list/card/FABCardLocal";

export const isWeb = Platform.OS === "web"

const _debug = false

const MediaPostCardDefault = (props: any) => {
  // Share - see deepseek
  // MediaPostContentURL
  // MediaPostContentYouTube
  // MediaPostContentURI
  // console.log("=== theme",theme)

    let itemData = props.item
    let _json= itemData.mediaPostJSON
    const _type = typeof itemData.mediaPostJSON

    console.log('type0', _type,itemData.mediaPostJSON)

    if("string"=== _type){
        _json = JSON.parse(itemData.mediaPostJSON)
    }
    itemData = {...itemData, mediaPostJSON : _json}

    console.log("itemData0",itemData)

  const [state, setState] = useState<any>({
    ...itemData,
  })

    const  WorkContainer = mediaContainers[state.mediaPostJSON?.mediaPostMIME];
  // console.log("WorkContainer", WorkContainer)

  const [isOpen, setIsOpen] = useState(false)
  const [openInBrowser, setOpenInBrowser] = useState(false)

  const globals_MiGap = 6

  const styles = StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles,react-native/no-color-literals
    iconsContainer: {
      alignItems: "center",
      backgroundColor: "lightyellow",
      display: "flex",
      flex: 1,
      flexDirection: "row",
      gap: globals_MiGap,
      justifyContent: "flex-end",
    },
    // eslint-disable-next-line react-native/no-color-literals
    titleSmall: { backgroundColor: "red", maxWidth: Platform.OS !== "web" ? 250 : 800 },
  })

  useEffect(() => {
    const _handlePressButtonAsync = async () => {
      const result = await WebBrowser.openBrowserAsync(state.mediaPostJSON?.mediaPostOrigin)
      if (_debug) console.log("result", result)
      setOpenInBrowser(false)
    }

    if (openInBrowser) {
      _handlePressButtonAsync()
    }
  })

    // return ( <View><TextMi l1 >AAA</TextMi></View> )

  return (
      <Card style={showCard().cardContainer}>
        <Card.Content>
          <View
            style={{
              backgroundColor: "cyan",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
            }}
          >
            <View
              style={{
                flex: 2,
                justifyContent: "flex-start",
                flexDirection: "row",
                display: "flex",
              }}
              // style={{gap:globals_MiGap,justifyContent:"flex-start",flexDirection:'row',alignItems:'center',display:"flex"}}
            >
              <View style={showCard().iconsContainerLeftUp}>
                <IconMi name={"more_vert"} />
                <IconMi name={"content_copy"} />
              </View>
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              <View style={{ flex: 3, flexDirection: "row", display: "flex" }}>
                <Text variant="titleSmall" numberOfLines={1} style={styles.titleSmall}>
                  {state.mediaPostJSON?.mediaPostOrigin}
                </Text>
              </View>
            </View>

            <View style={styles.iconsContainer}>
              <IconMi name={"home"} />
              <IconMi name={"hide_image"} />
              <IconMi name={"share"} />
              <IconMi
                name={"arrow_menu_open"}
                onPress={() => {
                  //DOC https://docs.expo.dev/versions/latest/sdk/webbrowser/
                  const _handleAsync = async () => {
                    const result = await WebBrowser.openBrowserAsync(state?.mediaPostOrigin)
                    console.log("=== onPress", result)
                  }
                  _handleAsync()
                }}
              />

              {/*<IconMi name={'home'} color={'red'} mode={'sharp'} FILL={0}*/}
              {/*        size={32}*/}
              {/*/>*/}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              // Alert.alert("Touch!")
              setOpenInBrowser(true)
            }}
          >
            <View style={stylesMediaContainer.container}>
              <WorkContainer url={state.mediaPostJSON?.mediaPostOrigin} />
            </View>
          </TouchableOpacity>

            <InputTexts state={state} setState={setState}/>

          {/*111*/}
          {/*<View style={{gap:globals_MiGap,justifyContent:"space-between",flexDirection:'row',alignItems:'center'}}>*/}
          {/*<View style={{gap:globals_MiGap,justifyContent:"space-between",flexDirection:'row',alignItems:'center'}}>*/}

            <RowLast state={state}/>

            <FABCardLocal isOpen={isOpen} setIsOpen={setIsOpen}/>

          {/*<FABforCardMi.Group*/}
          {/*    visible={true}*/}
          {/*    open={open}*/}
          {/*    icon={open ? 'close' : 'plus'}*/}
          {/*    actions={[*/}
          {/*        {*/}
          {/*            icon: 'email',*/}
          {/*            label: 'Email',*/}
          {/*            onPress: () => console.log('Pressed email'),*/}
          {/*        },*/}
          {/*        {*/}
          {/*            icon: 'bell',*/}
          {/*            label: 'Reminder',*/}
          {/*            onPress: () => console.log('Pressed reminders'),*/}
          {/*        },*/}
          {/*    ]}*/}
          {/*    onStateChange={onStateChange}*/}
          {/*    onPress={() => {*/}
          {/*        if (open) {*/}
          {/*            // do something if the speed dial is open*/}
          {/*        }*/}
          {/*    }}*/}
          {/*/>*/}

          {/*<Portal>*/}
          {/*    <FABforCardMi.Group*/}
          {/*        // size={"small"}*/}
          {/*        style={{zIndex:999,backgroundColor:'transparent', zIndex:998}}*/}
          {/*        // theme={{ colors: { background: 'lightgreen' } }}*/}
          {/*        backdropColor={'rgba(0, 0, 0, 0.6)'}*/}
          {/*        open={open}*/}
          {/*        // icon={()=><IconMi name={'close'} size={24} />}*/}
          {/*        icon={open ? 'calendar-today' : 'plus'}*/}
          {/*        // fabStyle={{backgroundColor:'red'}} //*/}
          {/*        // fabStyle={{borderRadius: 28, height:32, width:32}}*/}
          {/*        accessibilityLabel="Calendar FABforCardMi"*/}
          {/*        toggleStackOnLongPress={toggleStackOnLongPress}*/}
          {/*        actions={[*/}
          {/*            {*/}
          {/*                icon:"share",*/}
          {/*                // icon: ()=><IconMi name={'forward'} color={showCard({theme}).iconStyle.color} />, // 'forward',*/}
          {/*                label: 'Share Origin', onPress: () => {},*/}
          {/*                labelStyle:showCard({theme}).fabGroupLabelStyle*/}
          {/*            },*/}
          {/*            {*/}
          {/*                icon:"share",*/}
          {/*                // icon: ()=><IconMi name={'share'} color={showCard({theme}).iconStyle.color} />,*/}
          {/*                label: 'Share Origin + Comment',*/}
          {/*                onPress: () => {},*/}
          {/*                size: isV3 ? 'small' : 'medium',*/}
          {/*                labelStyle:showCard({theme}).fabGroupLabelStyle*/}
          {/*            },*/}
          {/*            {*/}
          {/*                icon:"share",*/}
          {/*                // icon: ()=><FontAwesome color={showCard({theme}).iconStyle.color} size={24} name="telegram" />,*/}
          {/*                label: 'Share Telegram', onPress: () => {},*/}
          {/*                labelStyle:showCard({theme}).fabGroupLabelStyle*/}
          {/*            },*/}
          {/*            {*/}
          {/*                icon:"share",*/}
          {/*                // icon: ()=><AntDesign color={showCard({theme}).iconStyle.color} size={24} name="whats-app" />,*/}
          {/*                label: 'Share WhatsApp', onPress: () => {},*/}
          {/*                labelStyle:showCard({theme}).fabGroupLabelStyle*/}
          {/*            },*/}
          {/*        ]}*/}
          {/*        enableLongPressWhenStackOpened*/}
          {/*        onStateChange={({ open }: { open: boolean }) => setOpen(open)}*/}
          {/*        onPress={() => {*/}
          {/*            //DOC ███!!!███ DO NOT DELETE*/}
          {/*            // if (toggleStackOnLongPress) {*/}
          {/*            //     isWeb ? alert('Fab is Pressed') : Alert.alert('Fab is Pressed');*/}
          {/*            //     // do something on press when the speed dial is closed*/}
          {/*            // } else if (open) {*/}
          {/*            //     isWeb ? alert('Fab is Pressed') : Alert.alert('Fab is Pressed');*/}
          {/*            //     // do something if the speed dial is open*/}
          {/*            // }*/}
          {/*        }}*/}
          {/*        onLongPress={() => {*/}
          {/*            //DOC ███!!!███ DO NOT DELETE*/}
          {/*            // if (!toggleStackOnLongPress || open) {*/}
          {/*            //     isWeb*/}
          {/*            //         ? alert('Fab is Long Pressed')*/}
          {/*            //         : Alert.alert('Fab is Long Pressed');*/}
          {/*            //     // do something if the speed dial is open*/}
          {/*            // }*/}
          {/*        }}*/}
          {/*        visible={open}*/}
          {/*    />*/}

          {/*</View>*/}
          {/*111*/}

          {/*</Portal>*/}
        </Card.Content>
      </Card>


  )
}

export default MediaPostCardDefault


// <View style={{flex: 1}}>
//     <View style={{flex: 1, backgroundColor: 'powderblue'}} />
//     <View style={{flex: 2, backgroundColor: 'skyblue'}} />
//     <View style={{flex: 3, backgroundColor: 'steelblue'}} />
// </View>)

//DOC ███!!!███ DO NOT DELETE
// {
//
//     icon: toggleStackOnLongPress
//         ? 'gesture-tap'
//         : 'gesture-tap-hold',
//     label: toggleStackOnLongPress
//         ? 'Toggle on Press'
//         : 'Toggle on Long Press',
//     onPress: () => {
//         setToggleStackOnLongPress(!toggleStackOnLongPress);
//     },
//     labelStyle:{
//         backgroundColor: theme.colors.primary, //'#2196f3', // Blue background
//         color: 'white',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 16,}
// },
