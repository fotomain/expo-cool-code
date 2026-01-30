const checkTableExists = async (tableName: string) => {
    const db = await SQLite.openDatabaseAsync('db33333333.db');

    // Query the master schema table for the specific table name
    const result = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?;",
        tableName
    );

    return result !== null;
};
