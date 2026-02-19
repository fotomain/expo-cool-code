import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const CardForListWEB: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalResolve, setModalResolve] = useState<(() => void) | null>(null);
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

    const x = useMotionValue(0);

    // Transform values for underlays
    const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
    const rightOpacity = useTransform(x, [0, 100], [0, 1]);

    const handleDragEnd = (_: any, info: any) => {
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;

        // Swipe Left
        if (offsetX < -window.innerWidth * 0.5) {
            // More than 50% left → card goes outside
            setCardPosition({ x: -window.innerWidth, y: 0 });
        } else if (offsetX < 0) {
            // Less than 50% left → shift to 30% left
            setCardPosition({ x: -window.innerWidth * 0.3, y: 0 });
        }

        // Swipe Right
        if (offsetX > window.innerWidth * 0.45) {
            // More than 45% right → show modal
            setShowModal(true);
            return new Promise<void>((resolve) => {
                setModalResolve(() => resolve);
            });
        } else if (offsetX > 0) {
            // Less than 45% right → shift to 30% right
            setCardPosition({ x: window.innerWidth * 0.3, y: 0 });
        }
    };

    const resetCard = () => {
        setCardPosition({ x: 0, y: 0 });
    };

    const handleDelete = () => {
        alert("Delete from Right");
        setCardPosition({ x: -window.innerWidth, y: 0 });
    };

    const handleArchiveButton = () => {
        alert("Archived from button!!!");
        setCardPosition({ x: window.innerWidth, y: 0 });
    };

    const handleModalArchive = () => {
        alert("Archive from modal!!!");
        setCardPosition({ x: window.innerWidth, y: 0 });
        setShowModal(false);
        if (modalResolve) modalResolve();
    };

    const handleModalCancel = () => {
        setShowModal(false);
        resetCard();
        if (modalResolve) modalResolve();
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100 relative">
            {/* Left Underlay */}
            <motion.div
                style={{ opacity: leftOpacity }}
                className="absolute left-0 top-0 h-full w-full bg-green-500 flex items-center pl-4"
            >
                <button
                    className="bg-brown-600 text-white px-4 py-2 rounded"
                    onClick={handleArchiveButton}
                >
                    Archive
                </button>
            </motion.div>

            {/* Right Underlay */}
            <motion.div
                style={{ opacity: rightOpacity }}
                className="absolute left-0 top-0 h-full w-full bg-red-500 flex items-center justify-end pr-4"
            >
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </motion.div>

            {/* Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -window.innerWidth, right: window.innerWidth }}
                style={{ x }}
                onClick={resetCard}
                onDragEnd={handleDragEnd}
                animate={{ x: cardPosition.x, y: cardPosition.y }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white w-80 h-48 rounded-xl shadow-xl flex flex-col items-center justify-center cursor-pointer z-10"
            >

                <h2 className="text-2xl font-bold">Card Title</h2>
                <p className="text-xl mt-2">Number: 123</p>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-6 rounded-lg w-96 flex flex-col items-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h3 className="text-lg font-bold mb-4">Do you really want to Archive?</h3>
                            <div className="flex gap-4">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={handleModalArchive}
                                >
                                    Archive
                                </button>
                                <button
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={handleModalCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CardForListWEB
