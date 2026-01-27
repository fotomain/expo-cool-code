import {GestureHandlerRootView} from "react-native-gesture-handler"
import {TextInput} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {Button, View} from "react-native";
import initSqlJs from "sql.js";
import {backupLargeUint8Array, restoreLargeUint8Array} from "@/mi/indexedDBapi";


// import { SQLocal } from 'sqlocal';
//
// // Create a client with a name for the SQLite file to save in
// // the origin private file system
// const { sql } = new SQLocal('database.sqlite3');


// █████ DOC https://dev.to/hexshift/using-sqlite-in-the-browser-with-webassembly-and-react-local-first-apps-with-no-backend-5183

const App1 = () => {


    const [text, setText] = React.useState("");

    const [SQL, setSQL] = useState(null)

    useEffect(() => {
        const doAsync = async () => {
            // const ret:any = await initSqlJs({
            //     locateFile: (file:any) => `https://sql.js.org/dist/${file}`
            // });
            const ret: any = await initSqlJs({
                locateFile: file => `https://unpkg.com/sql.js@1.13.0/dist/${file}`
            });

            const dbImport = await restoreLargeUint8Array("dataId111")
            console.log("SQL loaded dbImport", dbImport);
            if (dbImport) {
                setSQL(new ret.Database(dbImport.data))
            } else {
                setSQL(new ret.Database())
            }

        }
        doAsync()
    }, []);

    return (
        // eslint-disable-next-line react-native/no-color-literals,react-native/no-inline-styles
        <GestureHandlerRootView style={{flex: 1, backgroundColor: "seashell"}}>
            {/*<PaperProvider>*/}
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            {/*        <SQLiteProvider databaseName={'db0001'} >*/}
            <View style={{flex: 1}}>
                <Button title={'Init'} onPress={() => {

                    const db: any = SQL;
                    if (db) {
                        try {
                            db.exec(`
                                CREATE TABLE todos
                                (
                                    id        INTEGER PRIMARY KEY AUTOINCREMENT,
                                    text      TEXT NOT NULL,
                                    completed BOOLEAN DEFAULT 0
                                );
                            `);
                        } catch (e) {
                            console.log("error sql.js", e)
                        }

                        db.exec(`
                            INSERT INTO todos (text, completed)
                            VALUES ('Write blog post', 0),
                                   ('Ship to production', 1);
                        `);


                        const results = db.exec("SELECT * FROM todos");
                        console.log("results1", results)

                        const [cols, ...rows] = results[0].values;
                        const resJSON: any = results[0].values.map((row: any) => {
                            return Object.fromEntries(
                                results[0].columns.map((col: any, i: number) => [col, row[i]])
                            );
                        });

                        console.log("results2", resJSON)

                        const dbExport: any = db.export()

                        const doAsync = async () => {
                            await backupLargeUint8Array("dataId111", dbExport)
                        }
                        doAsync()

                        // console.log("results2 dbExport type ",typeof dbExport)
                        //
                        // const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
                        //     const bytes = new Uint8Array(buffer);
                        //     let binary = '';
                        //
                        //     for (let i = 0; i < bytes.byteLength; i++) {
                        //         binary += String.fromCharCode(bytes[i]);
                        //     }
                        //
                        //     return btoa(binary);
                        // }
                        //
                        // // const base64 = arrayBufferToBase64(dbExport);
                        // const base64Str = arrayBufferToBase64(dbExport);
                        //
                        // console.log("results2 dbExport ",dbExport)
                        //
                        // localStorage.setItem(dbFileName, base64Str);

                    }

                }}/>
                <TextInput
                    label="Email"
                    value={text}
                    onChangeText={text => setText(text)}
                />

            </View>
            {/*</SQLiteProvider>*/}

        </GestureHandlerRootView>
    )
    // return <AppRoot />
}

export default App1
