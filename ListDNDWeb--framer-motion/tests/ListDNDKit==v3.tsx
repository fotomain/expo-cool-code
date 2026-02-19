'use dom'

import "./styles.css";
import * as React from "react";
import { useState } from "react";
import { animate, MotionValue, useMotionValue, Reorder } from "framer-motion";

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

// Custom hook for shadow animation
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

// Updated initial items array with objects
const initialItems = [
    { itemId: 1, itemTitle: "🍅 Tomato" },
    { itemId: 2, itemTitle: "🥒 Cucumber" },
    { itemId: 3, itemTitle: "🧀 Cheese" },
    { itemId: 4, itemTitle: "🥬 Lettuce" },
    { itemId: 10, itemTitle: "🍅 Tomato" },
    { itemId: 22, itemTitle: "🥒 Cucumber" },
    { itemId: 33, itemTitle: "🧀 Cheese" },
    { itemId: 40, itemTitle: "🥬 Lettuce" },
    { itemId: 100, itemTitle: "🍅 Tomato" },
    { itemId: 200, itemTitle: "🥒 Cucumber" },
    { itemId: 300, itemTitle: "🧀 Cheese" },
    { itemId: 400, itemTitle: "🥬 Lettuce" },
];

interface ItemProps {
    item: { itemId: number; itemTitle: string };
}

export const Item = ({ item }: ItemProps) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);

    return (
        <Reorder.Item
            value={item}
            id={item.itemId.toString()}
            style={{ boxShadow, y }}
        >
            <span>{item.itemTitle}</span>
        </Reorder.Item>
    );
};

export default function App() {
    const [items, setItems] = useState(initialItems);

    return (
        <div style={{ backgroundColor: "red", height: "100vh", width: "100%" }}>
            <Reorder.Group
                axis="y"
                values={items}
                onReorder={(newItems: typeof items) => {
                    console.log("Reordered:", newItems);
                    setItems(newItems);
                }}
            >
                {items.map((item) => (
                    // !!! key is obligate
                    <Item key={item.itemId} item={item} />
                ))}
            </Reorder.Group>
        </div>
    );
}
