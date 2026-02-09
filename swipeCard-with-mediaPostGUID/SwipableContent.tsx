import {Card, Text} from "react-native-paper";
import * as React from "react";
import {swipeSheet} from "@/mi/ui/posts/list/demo/swipeCard/SwipeCard";

const SwipableContent = (props: any) => {
    const {item} = props;
    return (
        <Card style={swipeSheet.card}>
            <Card.Content>
                {/*<Pressable onPress={resetCard}>*/}
                <Text variant="titleMedium"

                >Title: {item.mediaPostTitle}</Text>
                <Text variant="bodyMedium">Step #{item.mediaPostGUID} SwipableContent</Text>
                {/*</Pressable>*/}
            </Card.Content>
        </Card>
    )
};

export default SwipableContent