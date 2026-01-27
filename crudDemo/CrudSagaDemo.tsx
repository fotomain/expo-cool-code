import {useEffect} from "react"

// eslint-disable-next-line no-restricted-imports
import {Alert, Button, Platform, ScrollView, Text, View} from "react-native"
import {useDispatch, useSelector} from "react-redux"
import {initDatabase} from "../../../state/enities/lib/crudPosts/db/initDatabase"
import {
    CREATE_AFTER,
    CREATE_BEFORE,
    CREATE_FIRST,
    READ_ALL,
    UPDATE_ONE_JSON_FIELD,
    UPDATE_SHIFT_BOTTOM,
    UPDATE_SHIFT_TOP,
    UPDATE_SWAP_TWO_LINES,
} from "../../../state/enities/lib/crudPosts/lib/constants"
import {mediaPostActions} from "../../../state/enities/posts/mediaPostsSlice"
import {useSQLWeb} from "@/mi/providers/SQLiteWebProvider";
import {useSQLNative} from "@/mi/providers/SQLiteNativeProvider";
import {useSQLiteGlobal} from "@/app/_layout";

const CrudSagaDemo = () => {
    const dispatch: any = useDispatch()

    const mediaPostState: any = useSelector((state: any) => state.mediaPostState)
    const mediaPostsArray = mediaPostState.entityDataFromServer?.result

    useEffect(() => {
        ///saga-6
        // @ts-ignore
        dispatch(
            mediaPostActions.readData({
                tableName: "items1",
                readData: {
                    readMode: READ_ALL,
                },
            }),
        )

        console.log("===== mediaPostsArray3", mediaPostState.crudMoment)
    }, [mediaPostState.crudMoment])

    const _adapter: any = useSQLiteGlobal()
    const db = _adapter.useSQLiteMi()


    const _debug = false

    // call unsubscribe to remove the callback
    //data1.subscription.unsubscribe()

    return (
        <ScrollView>
            <ScrollView horizontal={true}>
                {/*<Text>CrudSagaScreen firsMoment{firsMoment}</Text>*/}
                {/*<Text>postsArray █████ {JSON.stringify(postsArray)}</Text>*/}

                <View>
                    <Text>Items1 - sliceCreated ${mediaPostState.sliceCreated}</Text>


                    <Button
                        title="CREATE" //█████████████████ CREATE ███████████████████
                        color="blue"
                        accessibilityLabel="Init Database tables"
                        onPress={() => {
                            const doAsync = async () => {
                                const GUID = "Post-" + Date.now()
                                const createData: any = {
                                    tableName: "items1",
                                    createMode: CREATE_FIRST,
                                    mediaPostOwnerGUID: "111",
                                    mediaPostGUID: "222-" + GUID,
                                    mediaPostJSON: JSON.stringify({
                                        mediaPostTitle: "Title " + GUID,
                                        mediaPostDescription: "description" + GUID,
                                    }),
                                }

                                console.log("███ create START")
                                dispatch(
                                    mediaPostActions.createOne({
                                        createData,
                                    }),
                                )
                            }
                            doAsync()
                        }}
                    />

                    <Button
                        onPress={() => {
                            const doAsync = async () => {
                                try {
                                    await initDatabase(db, {})
                                } catch (error) {
                                    console.log("█████ 222 initDatabase Error ", error)
                                }
                            }
                            doAsync()
                        }}
                        title="Init Database"
                        color="#841584"
                        accessibilityLabel="Init Database tables"
                    />

                    {Array.isArray(mediaPostState.entityDataFromServer?.result) &&
                        mediaPostState.entityDataFromServer?.result.map((el: any, indexInList: any) => {
                            return (
                                // eslint-disable-next-line react-native/no-inline-styles
                                <View key={el.mediaPostGUID} style={{padding: 10, flexDirection: "row"}}>
                                    {/* eslint-disable-next-line react-native/no-inline-styles */}
                                    <View style={{flexDirection: "column"}}>
                                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                                        <View style={{flexDirection: "row"}}>
                                            {/* eslint-disable-next-line react-native/no-inline-styles */}
                                            <Text style={{width: 150}}>{el.mediaPostJSON.mediaPostTitle}</Text>
                                            {/* eslint-disable-next-line react-native/no-inline-styles */}
                                            <Text style={{width: 50}}>{el.orderInList}</Text>
                                        </View>
                                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                                        <Text style={{width: 150}}>{el.mediaPostJSON?.updateField}</Text>
                                    </View>
                                    <Button
                                        title="UPDATE" //████████████████████████████████████
                                        color="orange"
                                        accessibilityLabel="Init Database tables"
                                        onPress={() => {
                                            const doAsync = async () => {
                                                const updateData = {
                                                    updateMode: UPDATE_ONE_JSON_FIELD,
                                                    mediaPostGUID: el.mediaPostGUID,
                                                    updateFieldName: "updateField",
                                                    updateFieldValue: el.mediaPostJSON?.updateField + "█",
                                                    // mediaPostTitle:el.mediaPostJSON.mediaPostTitle + "█",
                                                }
                                                // const resultUpdate = await mediaPostUpdateAPI({
                                                //     dbHandle:db,
                                                //     tableName:"items1",
                                                //     updateData:updateData,
                                                // })
                                                // console.log("=== ████████ resultUpdate ",resultUpdate)

                                                console.log("███ update START")
                                                dispatch(
                                                    mediaPostActions.updateOne({
                                                        tableName: "items1",
                                                        updateData: updateData,
                                                    }),
                                                )
                                            }
                                            doAsync()
                                        }}
                                    />

                                    <Button
                                        title="DEL" //█████████████████ DELETE ████████████████
                                        color="red"
                                        accessibilityLabel="Init Database tables"
                                        onPress={() => {
                                            const doAsync = async () => {
                                                const deleteData: any = {
                                                    tableName: "items1",
                                                    mediaPostGUID: el.mediaPostGUID,
                                                    reSelect: true,
                                                }

                                                console.log("███ deleteOne START")
                                                dispatch(
                                                    mediaPostActions.deleteOne({
                                                        tableName: "items1",
                                                        deleteData,
                                                    }),
                                                )
                                            }
                                            doAsync()
                                        }}
                                    />

                                    <Button
                                        title="CREATE AFTER" //█████████████████ CREATE ███████████████████
                                        color="blue"
                                        accessibilityLabel="AFTER"
                                        onPress={() => {
                                            const doAsync1 = async () => {
                                                const GUID = "Post-" + Date.now()
                                                const createData: any = {
                                                    tableName: "items1",
                                                    createMode: CREATE_AFTER,
                                                    mediaPostOwnerGUID: "111",
                                                    mediaPostGUID: el.mediaPostGUID,
                                                    mediaPostGUIDNew: "new-post-" + GUID,
                                                    mediaPostJSON: JSON.stringify({
                                                        mediaPostTitle: "title " + GUID,
                                                        mediaPostDescription: "description" + GUID,
                                                    }),
                                                }

                                                console.log("███ create START")
                                                dispatch(
                                                    mediaPostActions.createOne({
                                                        createData,
                                                    }),
                                                )
                                            }

                                            console.log("doAsync1")
                                            doAsync1()
                                        }}
                                    />
                                    <Button
                                        title="CREATE BEFORE" //█████████████████ CREATE ███████████████████
                                        color="green"
                                        accessibilityLabel="CREATE_BEFORE"
                                        onPress={() => {
                                            const doAsync1 = async () => {
                                                const GUID = "Post-" + Date.now()
                                                const createData: any = {
                                                    tableName: "items1",
                                                    createMode: CREATE_BEFORE,
                                                    mediaPostOwnerGUID: "111",
                                                    mediaPostGUID: el.mediaPostGUID,
                                                    mediaPostGUIDNew: "new-post-" + GUID,
                                                    mediaPostJSON: JSON.stringify({
                                                        mediaPostTitle: "title " + GUID,
                                                        mediaPostDescription: "description" + GUID,
                                                    }),
                                                }

                                                console.log("███ create before START")
                                                dispatch(
                                                    mediaPostActions.createOne({
                                                        createData,
                                                    }),
                                                )
                                            }

                                            // console.log("doAsync1")
                                            doAsync1()
                                        }}
                                    />

                                    <Button
                                        title="SHIFT BOTTOM" //█████████████████ BOTTOM ███████████████████
                                        color="brown"
                                        onPress={() => {
                                            const doAsync = async () => {
                                                const updateData = {
                                                    tableName: "items1",
                                                    updateMode: UPDATE_SHIFT_BOTTOM,
                                                    mediaPostGUID: el.mediaPostGUID,
                                                    mediaPostOwnerGUID: el.mediaPostOwnerGUID,
                                                }

                                                console.log("███ update START")
                                                dispatch(
                                                    mediaPostActions.updateOne({
                                                        updateData: updateData,
                                                    }),
                                                )
                                            }
                                            doAsync()
                                        }}
                                    />

                                    <Button
                                        title="SHIFT TOP" //█████████████████ BOTTOM ███████████████████
                                        color="darkred"
                                        onPress={() => {
                                            const doAsync = async () => {
                                                const updateData = {
                                                    tableName: "items1",
                                                    updateMode: UPDATE_SHIFT_TOP,
                                                    mediaPostGUID: el.mediaPostGUID,
                                                    mediaPostOwnerGUID: el.mediaPostOwnerGUID,
                                                }

                                                console.log("███ update START")
                                                dispatch(
                                                    mediaPostActions.updateOne({
                                                        updateData: updateData,
                                                    }),
                                                )
                                            }
                                            doAsync()
                                        }}
                                    />

                                    <Button
                                        title={"UP " + indexInList.toString()} //█████████████████ UP ███████████████████
                                        color="darkcyan"
                                        onPress={() => {
                                            const doAsync = async () => {
                                                const i1 = indexInList
                                                const i2 = indexInList - 1

                                                const updateData = {
                                                    updateMode: UPDATE_SWAP_TWO_LINES,
                                                    tableName: "items1",
                                                    mediaPostGUID1: mediaPostsArray[i2].mediaPostGUID,
                                                    mediaPostGUID2: mediaPostsArray[i1].mediaPostGUID,
                                                    orderInList1: mediaPostsArray[i2].orderInList,
                                                    orderInList2: mediaPostsArray[i1].orderInList,
                                                    mediaPostOwnerGUID: mediaPostsArray[i1].mediaPostOwnerGUID,
                                                }

                                                console.log("███ update START")
                                                dispatch(
                                                    mediaPostActions.updateOne({
                                                        tableName: "items1",
                                                        updateData: updateData,
                                                    }),
                                                )
                                            }

                                            const i1 = indexInList

                                            if (i1 <= 0) {
                                                console.log("This position is just 1st!")
                                                if (Platform.OS === "web") {
                                                    window.alert("Attetion please - This position is just 1st!")
                                                } else {
                                                    Alert.alert("Attetion please", "This position is just 1st!")
                                                }
                                                return
                                            }
                                            doAsync()
                                        }}
                                    />

                                    <Button
                                        title={"Down " + indexInList.toString()} //█████████████████ UP ███████████████████
                                        color="darkgreen"
                                        onPress={() => {
                                            const doAsync = async () => {
                                                const i1 = indexInList
                                                const i2 = indexInList + 1

                                                const updateData = {
                                                    updateMode: UPDATE_SWAP_TWO_LINES,
                                                    tableName: "items1",
                                                    mediaPostGUID1: mediaPostsArray[i2].mediaPostGUID,
                                                    mediaPostGUID2: mediaPostsArray[i1].mediaPostGUID,
                                                    orderInList1: mediaPostsArray[i2].orderInList,
                                                    orderInList2: mediaPostsArray[i1].orderInList,
                                                    mediaPostOwnerGUID: mediaPostsArray[i1].mediaPostOwnerGUID,
                                                }

                                                console.log("███ update START")
                                                dispatch(
                                                    mediaPostActions.updateOne({
                                                        tableName: "items1",
                                                        updateData: updateData,
                                                    }),
                                                )
                                            }

                                            const i1 = indexInList

                                            if (i1 === mediaPostsArray.length - 1) {
                                                console.log("This position is just Last!")
                                                if (Platform.OS === "web") {
                                                    window.alert("Attetion please - This position is just Last!")
                                                } else {
                                                    Alert.alert("Attetion please", "This position is just Last!")
                                                }
                                                return
                                            }
                                            doAsync()
                                        }}
                                    />
                                </View>
                            )
                        })}

                    {/*{!Array.isArray(mediaPostsArray) || mediaPostsArray.length===0?<Text>No Posts...</Text>:<></>}*/}

                    <Text>{JSON.stringify(mediaPostState.lastUpdatedData)}</Text>
                    <Text>{JSON.stringify(mediaPostState.lastDeletedData)}</Text>
                </View>
            </ScrollView>
        </ScrollView>
    )
}

export default CrudSagaDemo
