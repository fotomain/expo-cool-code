// import EvilIcons from "react-native-vector-icons/EvilIcons"
// import EvilIcons from "react-native-vector-icons/EvilIcons"

import {useEffect, useState} from "react"
import {Platform, TouchableOpacity, View} from "react-native"
import * as WebBrowser from "expo-web-browser"
import {Card} from "react-native-paper"


import {stylesMediaContainer} from "../views/stylesMediaContainer"
import RowFirst from "@/mi/ui/posts/list/card/lib/RowFirst";
import InputTexts from "@/mi/ui/posts/list/card/lib/InputTexts";
import RowLast from "@/mi/ui/posts/list/card/lib/RowLast";
import {showCard} from "@/mi/ui/posts/list/card/showCard";
import {fabOfListMenuItems} from "@/mi/ui/providers/lib/constants";
import {useEntityForm} from "@/mi/ui/providers/EntityFormProvider"
import FABforCardMi from "@/mi/ui/posts/list/fab/FABforCardMi";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import showMediaDeterminant from "../views/showMediaDeterminant"

export const isWeb = Platform.OS === "web";

const _debug = false;


const MediaPostCardDefault = (props: any) => {
    // Share - see deepseek
    // MediaPostContentURL
    // MediaPostContentYouTube
    // MediaPostContentURI
    // console.log("=== theme",theme)

    console.log('MediaPostCardDefault props', props);

    const [showMedia, setShowMedia] = useState(false);

    let itemData = props.item;
    let _json = itemData.mediaPostJSON;
    const _type = typeof itemData.mediaPostJSON;

    console.log('type0', _type, itemData.mediaPostJSON);

    if ("string" === _type) {
        _json = JSON.parse(itemData.mediaPostJSON)
    }
    itemData = {...itemData, mediaPostJSON: _json};

    console.log("itemData0", itemData);

    const [state, setState] = useState<any>({
        ...itemData,
    });

    const WorkContainer = showMediaDeterminant[state.mediaPostJSON?.mediaPostMIME];
    // console.log("WorkContainer", WorkContainer)

    const [isOpen, setIsOpen] = useState(false);
    const [openInBrowser, setOpenInBrowser] = useState(false);

    const globals_MiGap = 6;

    useEffect(() => {
        const _handlePressButtonAsync = async () => {
            const result = await WebBrowser.openBrowserAsync(state.mediaPostJSON?.mediaPostOrigin);
            if (_debug) console.log("result", result);
            setOpenInBrowser(false)
        };

        if (openInBrowser) {
            _handlePressButtonAsync()
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMedia(true)
        }, 1500);

        return () => clearTimeout(timer);

    }, []);


    // return ( <View><TextMi l1 >AAA</TextMi></View> )
    const fabNumber = props.itemIndex;
    const entityForm: any = useEntityForm();

    const outsideTap = Gesture.Tap()
        .numberOfTaps(1)
        .onStart((e: any) => {
            // console.log('=== tap e',e);
            console.log('█████ outsideTap activeFABfromList - ', entityForm.activeFABfromList);
            console.log('█████ Click Outside - ', e);
            console.log('█████ Click Outside e.target.id - ', e.target.dataset);
            if (entityForm.activeFABfromList !== null) {
                console.log('█████ handleOutsidePress - ', entityForm.activeFABfromList);
                entityForm.handleOutsidePress()
            }

        });

    return (
        <Card style={showCard().cardContainer}>
            <GestureDetector gesture={outsideTap}>
                <Card.Content>
                    <RowFirst state={state}/>

                    {state.mediaPostJSON?.mediaPostOrigin &&
                        <TouchableOpacity
                            onPress={() => {
                                // Alert.alert("Touch!")
                                setOpenInBrowser(true)
                            }}
                        >
                            <View style={stylesMediaContainer.container}>
                                <WorkContainer url={state.mediaPostJSON?.mediaPostOrigin}/>
                            </View>
                        </TouchableOpacity>
                    }

                    <InputTexts state={state} setState={setState}/>

                    <RowLast state={state}/>

                    {/*<FABCardLocal isOpen={isOpen} setIsOpen={setIsOpen}/>*/}

                </Card.Content>
            </GestureDetector>
            <FABforCardMi
                workDataItem={props?.item}
                menuItems={fabOfListMenuItems}
                fabId={"fab-" + fabNumber.toString()} //mediaPostGUID
                isActive={entityForm.activeFABfromList === ('fab-' + fabNumber.toString())} //mediaPostGUID
                onPress={entityForm.handleFABofListPress}
                onOutsidePress={entityForm.handleOutsidePress}
                handleFABofListMenuItemPress={entityForm.handleFABofListMenuItemPress}
            />
        </Card>


    )
};

export default MediaPostCardDefault

