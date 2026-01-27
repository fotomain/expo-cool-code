import {initSQLiteSQLText} from "@/mi/providers/initSQLiteSQLText";

const initSQLite = async (dbRun: any, initData: any = {}) => {

    const sqlText = initSQLiteSQLText()

    try {
        console.log("█████ initSQLite dbRun ", dbRun)
        const result1 = await dbRun.exec(sqlText)
        console.log("█████ initSQLite result1 ", result1)
        const result3 = await dbRun.exec("SELECT * FROM items1  ORDER BY orderInList ASC ")
        console.log("█████ initSQLite result3 ", result3)
        // Alert.alert("█████ result3  ============= ", JSON.stringify(result3))

    } catch (e) {
        console.log("█████ initSQLite ERROR 808 ============= ", e)
        // Alert.alert("█████ ERROR 808 ============= ", JSON.stringify(e))
    }

}

export {initSQLite}