import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import AnimatedList from "./screens/AnimatedList";
import {SONGS} from "@/srccool/constants";
import {isDebug} from "@/srccool/types";



// import {Colors} from 'react-native/Libraries/NewAppScreen';


function AppListFinal(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

    const [data, setData] = useState(SONGS)

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: '#0E0C0A'}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'pink'}
        />
        <AnimatedList
            autoScrollStep={10}
            height={500}
            cardHeight={100}
            data={data}
            onDragEnd={(p:any)=>{
                if(isDebug) if(isDebug) console.log("onDragEnd0",p);
                setData((prev:any)=>{
                        const newItems = [...prev];

                        newItems.splice(p.to, 0, newItems.splice(p.form, 1)[0]);

                        return newItems;
                });
            }}
            // draggerType={'draggerFullCard'} //draggerDots
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default AppListFinal;
