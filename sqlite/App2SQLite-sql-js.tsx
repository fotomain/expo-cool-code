import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
    initialWindowMetrics,
    SafeAreaProvider,
    SafeAreaView,
} from "react-native-safe-area-context"

import AppRoot from "./AppRoot"
import WithSQLiteAll from "./providers/WithSQLiteAll"
import WithState from "./providers/WithState"
import WithSupabase from "./providers/WithSupabase"
import WithUXUI from "./providers/WithUXUI"
import {TextInput} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {Button} from "react-native";
import {SQLiteProvider} from "expo-sqlite";

import initSqlJs from 'sql.js';



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
        const doAsync = async ()=>{
            // const ret:any = await initSqlJs({
            //     locateFile: (file:any) => `https://sql.js.org/dist/${file}`
            // });

            const ret:any = await initSqlJs({ locateFile: (file) => `/${file}` })

            console.log("ret",ret)
            const _db = new ret.Database()

            setSQL(_db)
        }
        doAsync()
    }, []);

    return (
        // eslint-disable-next-line react-native/no-color-literals,react-native/no-inline-styles
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "seashell" }}>
            {/*<PaperProvider>*/}
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                {/* eslint-disable-next-line react-native/no-inline-styles */}
                <SafeAreaView style={{ flex: 1 }}>
                    <WithSupabase
                        initialConfig={{
                            url: process.env.EXPO_PUBLIC_SUPABASE_URL,
                            key: process.env.EXPO_PUBLIC_SUPABASE_KEY,
                        }}
                    >
                        {/*<WithSQLiteAll dbName={"db333333333"}>*/}
                        {/*    <WithState>*/}
                                {/*<WithUXUI>*/}
                                    {/*<DragSwipe />*/}
                                    {/*<AppIntent />*/}

                        {/*<SQLiteProvider databaseName={'db0001'} >*/}
                                <Button title={'Init'} onPress={()=>{

                                    const db:any = SQL;
                                    if(db) {
                                        db.run(`
                                            CREATE TABLE todos
                                            (
                                                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                                                text      TEXT NOT NULL,
                                                completed BOOLEAN DEFAULT 0
                                            );
                                        `);

                                        db.run(`
                                            INSERT INTO todos (text, completed)
                                            VALUES ('Write blog post', 0),
                                                   ('Ship to production', 1);
                                        `);


                                        const results = db.exec("SELECT * FROM todos");
                                        if (!results.length) return [];

                                        const [cols, ...rows] = results[0].values;
                                        return results[0].values.map((row:any) => {
                                            return Object.fromEntries(
                                                results[0].columns.map((col:any, i:number) => [col, row[i]])
                                            );
                                        });
                                    }

                                }}/>
                                <TextInput
                                    label="Email"
                                    value={text}
                                    onChangeText={text => setText(text)}
                                />
                        {/*</SQLiteProvider>*/}
                                    {/*<AppCameraVisionDemo />*/}
                                {/*</WithUXUI>*/}
                            {/*</WithState>*/}
                        {/*</WithSQLiteAll>*/}
                    </WithSupabase>
                </SafeAreaView>
            </SafeAreaProvider>
            {/*</PaperProvider>*/}
        </GestureHandlerRootView>
    )
    // return <AppRoot />
}

export default App1
