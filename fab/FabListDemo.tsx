import * as React from 'react';
import {useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Card, FAB, Text} from 'react-native-paper';

export type FabController = {
    close: () => void;
};

export const closeAllFabs = (fabControllers: any, exclude: number) => {

    Object.values(fabControllers.current).forEach((c: any, ii) => {
        if (ii !== exclude) {
            console.log(ii, exclude);
            c.close()
        }
    });
};

export default function FabListDemo() {

    //█████ fab2-1 - fabControllers on the top - index.tsx = MediaPostYouTubeScreen
    const fabControllers = React.useRef<Record<number, FabController>>({});

    return (
        <Pressable style={styles.container} onPress={() => {
            console.log("FabListDemo0");
            //█████ fab2-2 + OFF <GestureDetector gesture={panGestureEntityRoot}>
            closeAllFabs(fabControllers, -1)
        }}>
            <View style={{padding: 30, backgroundColor: 'blue'}}>
                {Array.from({length: 5}).map((_, index) => (
                    <FabCard
                        key={index}
                        index={index}
                        //█████ fab2-3 for Animation    <ItemView key={item.mediaPostGUID} item={item} index={index} draggedIndex={draggedIndex}
                        //█████ fab2-4 for Card Visual  <ItemCard item={item} itemIndex={index}/>
                        fabControllers={fabControllers}
                        closeAllFabs={closeAllFabs}
                    />
                ))}
            </View>
        </Pressable>

    );
}

type FabCardProps = {
    index: number;
    fabControllers: React.RefObject<Record<number, FabController>>;
    closeAllFabs: (a: any, p: any) => void;
};

function FabCard({index, fabControllers, closeAllFabs}: FabCardProps) {
    const [open, setOpen] = React.useState(false);

    //█████ fab2-5 in the MediaPostCardDefault
    React.useEffect(() => {
        fabControllers.current[index] = {
            close: () => setOpen(false),
        };

        return () => {
            delete fabControllers.current[index];
        };
    }, [index]);

    //█████ fab2-6 in the MediaPostCardDefault
    const onFabPress = () => {
        setOpen(prev => !prev);
    };

    //█████ fab2-7 in the MediaPostCardDefault
    useEffect(() => {
        if (open) closeAllFabs(fabControllers, index)
    }, [open]);

    return (
        //█████ fab2-8 Press Outside - over Card
        <Pressable onPress={e => e.stopPropagation()}>
            <View style={{paddingRight: 50, flex: 1, width: 500}}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View>
                            <Text variant="titleMedium">Card {index + 1}</Text>
                        </View>
                        <View style={{paddingTop: 50}}>
                            {/*█████ fab2-8 in the MediaPostCardDefault*/}
                            <FAB.Group
                                // fabStyle={{backgroundColor:'pink',width:40,height:40}}
                                open={open}
                                visible
                                // visible={open}

                                icon={open ? 'close' : 'plus'}
                                // icon={open ? <IconMi name={"close"}/>:<IconMi name={"open"}/>}
                                onStateChange={() => {
                                }}
                                onPress={onFabPress}
                                actions={[
                                    {
                                        size: 'medium',
                                        icon: 'share',
                                        label: 'Share',
                                        onPress: () => {
                                            console.log('Share', index);
                                            onFabPress()
                                        },
                                    },
                                    {
                                        icon: 'plus',
                                        label: 'New',
                                        onPress: () => {
                                            console.log('New', index);
                                            onFabPress()
                                        },
                                    },
                                    {
                                        icon: 'delete',
                                        label: 'Delete',
                                        onPress: () => {
                                            console.log('Delete', index);
                                            onFabPress()
                                        },
                                    },
                                ]}
                            />
                        </View>
                    </Card.Content>


                </Card>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,

    },
    card: {
        marginBottom: 16,
        height: 50,
        width: 400,
    },
});
