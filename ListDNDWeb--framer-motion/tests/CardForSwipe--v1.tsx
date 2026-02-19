import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from "framer-motion";

export default function CardForSwipe() {
    const [cardVisible, setCardVisible] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [overlay, setOverlay] = React.useState<"left" | "right" | null>(null);
    const [dragging, setDragging] = React.useState(false);

    const handleDragEnd = (_: any, info: PanInfo) => {
        const offsetX = info.offset.x;

        // Swipe Left > 50% → delete card immediately
        if (offsetX < -window.innerWidth * 0.5) {
            animate(x, -window.innerWidth, { duration: 0.3 }).then(() => setCardVisible(false));
        }
        // Swipe Left < 50% → show red overlay
        else if (offsetX < 0) {
            setOverlay("right");
            animate(x, -window.innerWidth * 0.3, { duration: 0.2 });
        }
        // Swipe Right > 45% → show modal
        else if (offsetX > window.innerWidth * 0.45) {
            setOverlay("left");
            animate(x, window.innerWidth * 0.3, { duration: 0.2 });
            setModalOpen(true);
        }
        // Swipe Right < 45% → show blue overlay
        else if (offsetX > 0) {
            setOverlay("left");
            animate(x, window.innerWidth * 0.3, { duration: 0.2 });
        }
        // Reset
        else {
            animate(x, 0, { duration: 0.2 });
            setOverlay(null);
        }
    };

    const resetCard = () => {
        animate(x, 0, { duration: 0.2 });
        setOverlay(null);
    };

    const deleteCard = () => {
        animate(x, -window.innerWidth, { duration: 0.3 }).then(() => setCardVisible(false));
    };

    const archiveCard = () => {
        animate(x, window.innerWidth, { duration: 0.3 }).then(() => setCardVisible(false));
    };

    return (
        <div
            style={{
                backgroundColor: "red",
                height: "50px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
            }}
        >
            <AnimatePresence>
                {cardVisible && (
                    <motion.div
                        style={{
                            x,
                            y,
                            position: "relative",
                            cursor: "grab",
                            width: 300,
                            borderRadius: 10,
                            userSelect: "none",
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragStart={() => setDragging(true)}
                        onDragEnd={handleDragEnd}
                        onClick={() => !dragging && resetCard()}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        {/* Right Overlay (Delete) */}
                        {overlay === "right" && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundColor: "red",
                                    borderRadius: 10,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    paddingRight: 20,
                                    color: "white",
                                    zIndex: -1,
                                }}
                            >
                                <button
                                    onClick={deleteCard}
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

                        {/* Left Overlay (Archive) */}
                        {overlay === "left" && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundColor: "blue",
                                    borderRadius: 10,
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    paddingLeft: 20,
                                    color: "white",
                                    zIndex: -1,
                                }}
                            >
                                <button
                                    onClick={archiveCard}
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
                                padding: 30,
                                borderRadius: 10,
                                backgroundColor: "white",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                textAlign: "center",
                                fontSize: 24,
                            }}
                        >
                            Swipe Me
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal */}
            {modalOpen && (
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
                            <button onClick={() => setModalOpen(false)}>Cancel</button>
                            <button
                                style={{ background: "red", color: "white" }}
                                onClick={() => {
                                    setModalOpen(false);
                                    animate(x, -window.innerWidth, { duration: 0.3 }).then(() => setCardVisible(false));
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
