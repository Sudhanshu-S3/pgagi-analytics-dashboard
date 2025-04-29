import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion } from "framer-motion";
import styles from "./Card.module.scss";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  id: string; // This prop is required but not provided
  draggable?: boolean;
  index?: number;
  moveCard?: (dragIndex: number, hoverIndex: number) => void;
}

type DragItem = {
  id: string;
  index: number;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      children,
      className = "",
      id,
      draggable = false,
      index = 0,
      moveCard,
    },
    forwardedRef
  ) => {
    // Internal ref for the DOM node
    const internalRef = useRef<HTMLDivElement>(null);

    // Expose internalRef.current to parent via forwardedRef
    useImperativeHandle(forwardedRef, () => internalRef.current!);

    // Drag source
    const [{ isDragging }, drag] = useDrag({
      type: "CARD",
      item: { id, index } as DragItem,
      canDrag: draggable,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // Drop target
    const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
      accept: "CARD",
      hover: (item) => {
        if (!internalRef.current || !moveCard) return;

        const dragIndex = item.index;
        const hoverIndex = index;

        // don't replace item with itself
        if (dragIndex === hoverIndex) return;

        moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <motion.div
        className={`
          ${styles.card}
          bg-white dark:bg-gray-800
          rounded-lg shadow-lg p-6
          ${className}
          ${isDragging ? "opacity-50" : ""}
          ${isOver ? "border-2 border-primary" : ""}
        `}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        style={{ cursor: draggable ? "move" : "default" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`${styles.cardTitle} text-xl font-semibold text-gray-800 dark:text-white`}
          >
            {title}
          </h2>
          <div className="flex space-x-2">{/* action buttons */}</div>
        </div>
        <div className={styles.cardContent}>{children}</div>
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
