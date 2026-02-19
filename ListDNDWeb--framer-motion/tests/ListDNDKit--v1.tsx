'use dom'
import React, {
    useState,
    useRef,
    useEffect,
    CSSProperties,
} from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence, useMotionValue } from "motion/react";

// STEP 3: Item Type

type Item = {
    id: string;
    title: string;
    number: number;
};

// STEP 4: Main App

const App: React.FC = () => {
    // STEP 5: Create 100 items
    const initial: Item[] = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        title: "Card",
        number: i + 1,
    }));

    // STEP 6: useState (ONLY updated in onDragEnd)
    const [items, setItems] = useState<Item[]>(initial);

    // STEP 7: useRef for position exchange
    const itemsRef = useRef<Item[]>(initial);

    // STEP 8: Active dragging id
    const [activeId, setActiveId] = useState<string | null>(null);

    // STEP 9: Modal state
    const [modalId, setModalId] = useState<string | null>(null);

    // STEP 10: Scroll container ref
    const scrollRef = useRef<HTMLDivElement>(null);

    // STEP 11: Sensors
    const sensors = useSensors(useSensor(PointerSensor));

    // STEP 12: Auto Scroll Logic
    useEffect(() => {
        const container = scrollRef.current;
        if (!container || !activeId) return;

        const handleMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();

            if (e.clientY > rect.bottom - 60) {
                container.scrollTop += 30;
            }

            if (e.clientY < rect.top + 60) {
                container.scrollTop -= 30;
            }
        };

        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [activeId]);

    // STEP 13: Drag Start
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    // STEP 14: Drag End (ONLY HERE update state)
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = itemsRef.current.findIndex(
            (i) => i.id === active.id
        );
        const newIndex = itemsRef.current.findIndex(
            (i) => i.id === over.id
        );

        const updated = [...itemsRef.current];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);

        itemsRef.current = updated;
        setItems(updated);
    };

    // STEP 15: Delete Item
    const deleteItem = (id: string) => {
        const updated = itemsRef.current.filter((i) => i.id !== id);
        itemsRef.current = updated;
        setItems(updated);
    };

    return (
        <>
            {/* STEP 16: DndContext */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div ref={scrollRef} style={containerStyle}>
                    <SortableContext
                        items={items.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <AnimatePresence>
                            {items.map((item) => (
                                <SortableCard
                                    key={item.id}
                                    item={item}
                                    deleteItem={deleteItem}
                                    openModal={(id) => setModalId(id)}
                                />
                            ))}
                        </AnimatePresence>
                    </SortableContext>
                </div>

                {/* STEP 17: Drag Overlay */}
                <DragOverlay>
                    {activeId && (
                        <div style={dragOverlayStyle}>
                            {items.find((i) => i.id === activeId)?.title}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            {/* STEP 18: Modal */}
            {modalId && (
                <div style={modalBackdrop}>
                    <div style={modalBox}>
                        <p>Do you really want to delete?</p>
                        <button
                            onClick={() => {
                                deleteItem(modalId);
                                setModalId(null);
                            }}
                        >
                            Delete
                        </button>
                        <button onClick={() => setModalId(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// STEP 19: SortableCard Component

const SortableCard: React.FC<{
    item: Item;
    deleteItem: (id: string) => void;
    openModal: (id: string) => void;
}> = ({ item, deleteItem, openModal }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // STEP 20: Motion Value
    const x = useMotionValue(0);

    const handleDragEndSwipe = (
        _: any,
        info: { offset: { x: number } }
    ) => {
        const width = window.innerWidth;

        if (info.offset.x < -width * 0.5) {
            x.set(-width);
            deleteItem(item.id);
        } else if (info.offset.x < -width * 0.3) {
            x.set(-width * 0.3);
        } else if (info.offset.x > width * 0.45) {
            openModal(item.id);
            x.set(0);
        } else if (info.offset.x > width * 0.3) {
            x.set(width * 0.3);
        } else {
            x.set(0);
        }
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={{
                ...style,
                position: "relative",
                marginBottom: 12,
            }}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
        >
            {/* STEP 21: LEFT Overlay */}
            <div style={leftOverlay}>
                <button onClick={() => deleteItem(item.id)}>
                    Archive
                </button>
            </div>

            {/* STEP 22: RIGHT Overlay */}
            <div style={rightOverlay}>
                <button onClick={() => deleteItem(item.id)}>
                    Delete
                </button>
            </div>

            {/* STEP 23: Card */}
            <motion.div
                {...attributes}
                {...listeners}
                drag="x"
                dragConstraints={{ left: -500, right: 500 }}
                style={{ ...cardStyle, x }}
                onTap={() => x.set(0)}
                onDragEnd={handleDragEndSwipe}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {item.title} #{item.number}
            </motion.div>
        </motion.div>
    );
};

export default App;

// STEP 24: Styles

const containerStyle: CSSProperties = {
    height: "100vh",
    overflowY: "auto",
    padding: "12px",
    background: "#f3f3f3",
};

const cardStyle: CSSProperties = {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    touchAction: "none",
    userSelect: "none",
    position: "relative",
    zIndex: 2,
};

const leftOverlay: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "blue",
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    color: "white",
    zIndex: 0,
};

const rightOverlay: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "red",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: "20px",
    color: "white",
    zIndex: 0,
};

const dragOverlayStyle: CSSProperties = {
    padding: "18px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const modalBackdrop: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modalBox: CSSProperties = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
};
