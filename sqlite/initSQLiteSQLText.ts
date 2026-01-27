const initSQLiteSQLText = () => {

    const initSqlData: any = {
        tables: [{tableName: "items1"}],
    }

    let sqlText: string = ""
    for (let i = 0; i < initSqlData.tables.length; i++) {
        const tableName = initSqlData.tables[i].tableName
        console.log("=== init tableName ", tableName)

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
        // console.log("█████ result3 sqlText", sqlText)
    }

    return sqlText
}

export {initSQLiteSQLText}