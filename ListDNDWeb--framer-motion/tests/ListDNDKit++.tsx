'use dom'

import "./styles.css";
import * as React from "react";
import {useState} from "react";

import {animate, MotionValue} from "framer-motion";

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

import {useMotionValue, Reorder} from "framer-motion";

export function useRaisedShadow(value: MotionValue<number>) {
    const boxShadow = useMotionValue(inactiveShadow);

    React.useEffect(() => {
        let isActive = false;
        value.onChange((latest) => {
            const wasActive = isActive;
            if (latest !== 0) {
                isActive = true;
                if (isActive !== wasActive) {
                    animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
                }
            } else {
                isActive = false;
                if (isActive !== wasActive) {
                    animate(boxShadow, inactiveShadow);
                }
            }
        });
    }, [value, boxShadow]);

    return boxShadow;
}


const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];


interface Props {
    item: string;
}

export const Item = ({item}: Props) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);

    return (
        <Reorder.Item value={item} id={item} style={{boxShadow, y}}>
            <span>{item}</span>
        </Reorder.Item>
    );
};


export default function App() {
    const [items, setItems] = useState(initialItems);

    return (
        <div style={{backgroundColor: 'red', height: "100vh", width: "100%"}}>
            <Reorder.Group axis="y"
                           onReorder={(newData: any) => {
                               console.log("newData0", newData)
                               setItems(newData)
                           }}
                           values={items}>
                {items.map((item) => (
                    <Item key={item} item={item}/>
                ))}
            </Reorder.Group>
        </div>
    );
}
