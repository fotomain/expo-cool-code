import {useState} from "react"
import {StyleSheet, View} from "react-native"
import {Button as ButtonPaper, Card, IconButton, Text as TextPaper} from "react-native-paper"

import {themeMaterial3} from "../EntityListMain"

const PostsCardForListTest = (props: any) => {
    const itemData = props.item

    const [state, setState] = useState({
        panelNumber: 2,
    })

    //console.log("=== itemData", itemData)

    return (
        <Card style={styles.card} mode={"elevated"}>
            {/*<Image style={{borderRadius:10,height:120,width:'auto'}} source={require('./bridge.jpg')} />*/}
            {/*<Card.Cover source={require('./bridge.jpg')} />*/}
            <Card.Title
                title={itemData.mediaPostJSON.mediaPostTitle}
                subtitle={itemData.mediaPostGUID}
                titleVariant="headlineMedium"
                subtitleVariant="bodyLarge"
            />
            <Card.Content>
                <TextPaper variant="bodyMedium">
                    {itemData.mediaPostGUID}
                    This is a card s specified variants.
                </TextPaper>

                {/*<View style={{ margin:2, flex:1, justifyContent:'center', alignItems:'center', flexDirection:'column',*/}
                {/*  backgroundColor:props.item?.backgroundColor, height:*/}
                {/*  props.item?.height*/}
                {/*}}>*/}

                {/*  <Text style={styles.test}>{`${props.item.mediaPostOwnerGUID}`}</Text>*/}

                {/*</View>*/}
            </Card.Content>
            <Card.Actions>
                {state.panelNumber !== 1 ? null : (
                    <View
                        style={{
                            backgroundColor: themeMaterial3.colors.surfaceScale,
                            justifyContent: "center",
                            flex: 1,
                            flexDirection: "row",
                        }}
                    >
                        <IconButton
                            size={20}
                            style={{marginLeft: 0}}
                            iconColor={themeMaterial3.colors.primary}
                            icon="dots-horizontal"
                            onPress={() => {
                                setState((prevState: any) => {
                                    return {...prevState, panelNumber: 2}
                                })
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="upload"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="microphone"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="camera"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="video"
                            onPress={() => {
                            }}
                        />
                    </View>
                )}

                {state.panelNumber !== 2 ? null : (
                    <View
                        style={{
                            backgroundColor: themeMaterial3.colors.surfaceScale,
                            justifyContent: "flex-start",
                            flex: 1,
                            flexDirection: "row",
                        }}
                    >
                        <IconButton
                            size={20}
                            style={{marginLeft: 0}}
                            iconColor={themeMaterial3.colors.primary}
                            icon="dots-horizontal"
                            onPress={() => {
                                setState((prevState: any) => {
                                    return {...prevState, panelNumber: 3}
                                })
                            }}
                        />

                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="arrow-up"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="arrow-down"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="arrow-collapse-up"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="arrow-collapse-down"
                            onPress={() => {
                            }}
                        />
                    </View>
                )}

                {state.panelNumber !== 3 ? null : (
                    <View
                        style={{
                            backgroundColor: themeMaterial3.colors.surfaceScale,
                            justifyContent: "flex-start",
                            flex: 1,
                            flexDirection: "row",
                        }}
                    >
                        <IconButton
                            size={20}
                            style={{marginLeft: 0}}
                            iconColor={themeMaterial3.colors.primary}
                            icon="dots-horizontal"
                            onPress={() => {
                                setState((prevState: any) => {
                                    return {...prevState, panelNumber: 1}
                                })
                            }}
                        />

                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="delete-outline"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="archive-outline"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="content-duplicate"
                            onPress={() => {
                            }}
                        />
                        <IconButton
                            disabled={true}
                            size={20}
                            iconColor={themeMaterial3.colors.primary}
                            icon="drag"
                            onPress={() => {
                            }}
                        />
                    </View>
                )}

                <ButtonPaper mode="contained" icon="share" onPress={() => {
                }} style={{}}>
                    Share
                </ButtonPaper>
            </Card.Actions>
        </Card>
    )
}

export default PostsCardForListTest

const styles = StyleSheet.create({
    card: {
        margin: 4,
        width: "90%",
    },
    sectionContainer: {
        padding: 16,
    },
    text: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
    },
})
