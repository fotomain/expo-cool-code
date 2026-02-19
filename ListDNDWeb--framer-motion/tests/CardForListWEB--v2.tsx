/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const App: React.FC = () => {
    const [cardX, setCardX] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalResolve, setModalResolve] = useState<(() => void) | null>(null);

    const x = useMotionValue(0);

    // Underlay opacities
    const leftOpacity = useTransform(x, [0, window.innerWidth * 0.3], [0, 1]);
    const rightOpacity = useTransform(x, [-window.innerWidth * 0.3, 0], [1, 0]);

    // Reset card position
    const resetCard = () => setCardX(0);

    // Drag end logic
    const handleDragEnd = (_: any, info: any) => {
        const offsetX = info.offset.x;

        // Swipe Left
        if (offsetX < -window.innerWidth * 0.5) {
            setCardX(-window.innerWidth); // go off-screen left
        } else if (offsetX < 0) {
            setCardX(-window.innerWidth * 0.3); // shift 30% left
        }

        // Swipe Right
        if (offsetX > window.innerWidth * 0.45) {
            setCardX(window.innerWidth * 0.5); // shift 50% for modal
            setShowModal(true);
            return new Promise<void>((resolve) => setModalResolve(() => resolve));
        } else if (offsetX > 0) {
            setCardX(window.innerWidth * 0.3); // shift 30% right
        }
    };

    // Delete Button
    const handleDelete = () => {
        alert("Delete from Right");
        setCardX(-window.innerWidth);
    };

    // Archive Button
    const handleArchiveButton = () => {
        alert("Archived from button!!!");
        setCardX(window.innerWidth);
    };

    // Modal Archive
    const handleModalArchive = () => {
        alert("Archive from modal!!!");
        setCardX(window.innerWidth);
        setShowModal(false);
        modalResolve?.();
    };

    // Modal Cancel
    const handleModalCancel = () => {
        setShowModal(false);
        resetCard();
        modalResolve?.();
    };

    // Click on underlay resets card
    const handleUnderlayClick = () => resetCard();

    return (
        <div
            css={css`
        width: 100vw;
        height: 100vh;
        background: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
      `}
        >
            {/* Left Underlay */}
            <motion.div
                style={{ opacity: leftOpacity }}
                css={css`
          position: absolute;
          inset: 0;
          background-color: green;
          display: flex;
          align-items: center;
          padding-left: 16px;
        `}
                onClick={handleUnderlayClick}
            >
                <button
                    css={css`
            background-color: #8b4513;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          `}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveButton();
                    }}
                >
                    Archive
                </button>
            </motion.div>

            {/* Right Underlay */}
            <motion.div
                style={{ opacity: rightOpacity }}
                css={css`
          position: absolute;
          inset: 0;
          background-color: red;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-right: 16px;
        `}
                onClick={handleUnderlayClick}
            >
                <button
                    css={css`
            background-color: blue;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          `}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
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
                animate={{ x: cardX }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                css={css`
          width: 320px;
          height: 192px;
          background-color: lightgreen;
          border-radius: 16px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          position: relative;
          z-index: 10;
        `}
            >
                <h2
                    css={css`
            font-size: 24px;
            font-weight: bold;
          `}
                >
                    Card Title
                </h2>
                <p
                    css={css`
            font-size: 20px;
            margin-top: 8px;
          `}
                >
                    Number: 123
                </p>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        css={css`
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 20;
            `}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            css={css`
                background-color: yellow;
                padding: 24px;
                border-radius: 16px;
                width: 380px;
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h3
                                css={css`
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 16px;
                  text-align: center;
                `}
                            >
                                Do you really want to Archive?
                            </h3>
                            <div
                                css={css`
                  display: flex;
                  gap: 16px;
                `}
                            >
                                <button
                                    css={css`
                    background-color: green;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                  `}
                                    onClick={handleModalArchive}
                                >
                                    Archive
                                </button>
                                <button
                                    css={css`
                    background-color: gray;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                  `}
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

export default App;
