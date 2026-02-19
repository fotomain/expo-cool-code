'use dom'

import "./styles.css";
import * as React from "react";
import { useState } from "react";
import { animate, MotionValue } from "framer-motion";
import { useMotionValue, Reorder, motion, AnimatePresence, PanInfo } from "framer-motion";

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

export function useRaisedShadow(value: MotionValue<number>) {
    const boxShadow = useMotionValue(inactiveShadow);

    React.useEffect(() => {
        let isActive = false;
        value.onChange((latest) => {
            const wasActive = isActive;
            if (latest !== 0) {
                isActive = true;
                if (isActive !== wasActive) animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
            } else {
                isActive = false;
                if (isActive !== wasActive) animate(boxShadow, inactiveShadow);
            }
        });
    }, [value, boxShadow]);

    return boxShadow;
}

const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];

interface ListItemProps {
    item: string;
    onDelete: () => void;
    onArchive: () => void;
    onModal: () => void;
}

export const ListItem = ({ item, onDelete, onArchive, onModal }: ListItemProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const [overlay, setOverlay] = React.useState<"left" | "right" | null>(null);
    const [dragging, setDragging] = React.useState(false);
    const [removed, setRemoved] = React.useState(false);

    const handleDragEnd = (_: any, info: PanInfo) => {
        const offsetX = info.offset.x;
        setDragging(false);

        // Swipe left >50% → delete
        if (offsetX < -window.innerWidth * 0.5) {
            animate(x, -window.innerWidth, { duration: 0.3 }).then(() => setRemoved(true));
        }
        // Swipe left <50% → show delete overlay at 30%
        else if (offsetX < 0) {
            setOverlay("right");
            animate(x, -window.innerWidth * 0.3, { duration: 0.2 });
        }
        // Swipe right >45% → show modal
        else if (offsetX > window.innerWidth * 0.45) {
            setOverlay("left");
            animate(x, window.innerWidth * 0.3, { duration: 0.2 });
            onModal();
        }
        // Swipe right <45% → show archive overlay at 30%
        else if (offsetX > 0) {
            setOverlay("left");
            animate(x, window.innerWidth * 0.3, { duration: 0.2 });
        }
        // Else reset
        else {
            animate(x, 0, { duration: 0.2 });
            setOverlay(null);
        }
    };

    const resetCard = () => {
        animate(x, 0, { duration: 0.2 });
        setOverlay(null);
    };

    return (
            !removed && (
                <Reorder.Item
                    value={item}
                    id={item}
                    style={{
                        x,
                        y,
                        boxShadow,
                        position: "relative",
                        cursor: "grab",
                        userSelect: "none",
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={handleDragEnd}
                    onClick={() => !dragging && resetCard()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <AnimatePresence
                        mode="popLayout"
                        onExitComplete={() => removed && onDelete()}
                    >

                    {/* Right overlay */}
                    {overlay === "right" && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "red",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                paddingRight: 20,
                                borderRadius: 10,
                                color: "white",
                                zIndex: -1,
                            }}
                        >
                            <button
                                onClick={() => setRemoved(true)}
                                style={{
                                    background: "white",
                                    color: "red",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: 5,
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    {/* Left overlay */}
                    {overlay === "left" && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "blue",
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                paddingLeft: 20,
                                borderRadius: 10,
                                color: "white",
                                zIndex: -1,
                            }}
                        >
                            <button
                                onClick={() => setRemoved(true)}
                                style={{
                                    background: "white",
                                    color: "blue",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: 5,
                                }}
                            >
                                Archive
                            </button>
                        </div>
                    )}

                    <div
                        style={{
                            padding: 20,
                            borderRadius: 10,
                            backgroundColor: "white",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                    >
                        {item}
                    </div>
                    </AnimatePresence>
                </Reorder.Item>
            )

    );
};

export default function App() {
    const [items, setItems] = useState(initialItems);
    const [modalItem, setModalItem] = useState<string | null>(null);

    const removeItem = (item: string) => {
        setItems((prev) => prev.filter((i) => i !== item));
    };

    return (
        <div style={{ backgroundColor: "red", height: "100vh", width: "100%", padding: 20 }}>
            <Reorder.Group axis="y" values={items} onReorder={setItems} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                    <ListItem
                        key={item}
                        item={item}
                        onDelete={() => removeItem(item)}
                        onArchive={() => removeItem(item)}
                        onModal={() => setModalItem(item)}
                    />
                ))}
            </Reorder.Group>

            {/* Modal */}
            {modalItem && (
                <motion.div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        style={{
                            background: "white",
                            padding: 20,
                            borderRadius: 10,
                            minWidth: 300,
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                        }}
                    >
                        <p>Do you really want to delete?</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button onClick={() => setModalItem(null)}>Cancel</button>
                            <button
                                style={{ background: "red", color: "white" }}
                                onClick={() => {
                                    if (modalItem) {
                                        removeItem(modalItem);
                                        setModalItem(null);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
