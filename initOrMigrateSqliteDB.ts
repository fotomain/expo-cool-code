import type { SQLiteDatabase } from "expo-sqlite"

import { initDatabase } from "../db/initDatabase"

async function initOrMigrateSqliteDB(db: SQLiteDatabase, initSqlData: any, doAfter: any) {
  const DATABASE_VERSION = 1
  const ret: any = await db.getFirstAsync<{
    user_version: number
  }>("PRAGMA user_version")

  let { user_version: currentDbVersion } = ret

  if (currentDbVersion >= DATABASE_VERSION) {
    return
  }
  if (currentDbVersion === 0) {
    await initDatabase(db, {})
    currentDbVersion = 1
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
}

export default initOrMigrateSqliteDB
