import {mediaPostCreateSQLite} from "../sql/mediaPostCreateSQLite"
import mediaPostDeleteSQLite from "../sql/mediaPostDeleteSQLite"
import {Platform} from "react-native";

const isWeb = Platform.OS === "web";

const initDatabase = async (db: any, workData: any): Promise<void> => {
    console.log("█████ 000 initDatabase db ", db)

    // const resultSelect1: any = await db.getAllAsync("SELECT * FROM items ;")
    //
    // console.log("█████ resultSelect1 ", resultSelect1)
    // console.log("█████ workData ", workData)

    // const result2 = await db.execAsync(`PRAGMA user_version = 0;`)
    // console.log("█████ result2 ", result2)
    //
    // const result1 = await db.runAsync(`
    //                           DROP TABLE IF EXISTS items1;
    //                   `)

    // console.log("█████ result1 ", result1)

    const initSqlData: any = {
        tables: [
            {tableName: "items1"},
            {tableName: "users1"}
        ],
    }

    // orderInList NUMERIC(20,10),
    let sqlText: string = ""
    for (let i = 0; i < initSqlData.tables.length; i++) {
        const tableName = initSqlData.tables[i].tableName
        console.log("=== tableName ", tableName)

        sqlText =
            sqlText +
            `
                CREATE TABLE IF NOT EXISTS ${tableName}
                (
                    mediaPostOwnerGUID
                    TEXT
                    NOT
                    NULL,
                    orderInList
                    NUMERIC
                (
                    20,
                    10
                ),
                    mediaPostGUID TEXT NOT NULL,
                    mediaPostJSON TEXT
                    );
            `
        console.log("█████ result3 sqlText", sqlText)
    }

    try {

        let result3: any
        if (isWeb) {
            result3 = await db.exec(sqlText)
        } else {
            result3 = await db.execAsync(sqlText)
        }
        console.log("█████ result3 ", result3)
        // Alert.alert("█████ result3  ============= ", JSON.stringify(result3))
    } catch (e) {
        console.log("█████ ERROR 808 ============= ", e)
        // Alert.alert("█████ ERROR 808 ============= ", JSON.stringify(e))
    }

    return

    const GUID = "Post-" + Date.now()
    const createData: any = {
        tableName: "items1",
        mediaPostOwnerGUID: "111",
        mediaPostGUID: "222-old" + GUID,
        mediaPostGUIDNew: "222-new" + GUID,
        mediaPostJSON: JSON.stringify({
            title: "Init Post Title " + GUID,
            description: "Init Description" + GUID,
        }),
    }

    const insert1 = await mediaPostCreateSQLite(db, createData)

    console.log("█████ insert1 ", insert1)

    const resultSelect2: any = await db.getAllAsync("SELECT * FROM items1 ;")

    console.log("█████ resultSelect2 ", resultSelect2)
    console.log("█████ title ", JSON.parse(resultSelect2[0].mediaPostJSON).title)

    const delete1 = await mediaPostDeleteSQLite(db, createData)

    // const delete1:any = await db.getAllAsync('' +
    //     'DELETE FROM items1 WHERE mediaPostGUID = ?;'
    //     , createData.mediaPostGUID
    // );

    console.log("█████ delete1 ", delete1)

    const resultSelect3: any = await db.getAllAsync("SELECT * FROM items1 ;")

    console.log("█████ resultSelect3 ", resultSelect3)
}

export {initDatabase}
