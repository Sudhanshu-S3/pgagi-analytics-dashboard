import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion } from "framer-motion";
import Card from "./Card";

interface DraggableWidgetProps {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  index,
  title,
  children,
  moveWidget,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "WIDGET",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveWidget(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Initialize drag and drop
  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;
  const scale = isDragging ? 1.02 : 1;
  const border = isOver ? "border-2 border-primary" : "border-transparent";

  return (
    <motion.div
      ref={ref}
      style={{ opacity, transform: `scale(${scale})` }}
      className={`mb-6 ${border} rounded-lg transition-all duration-200`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card title={title} className="cursor-move" id={id}>
        {children}
      </Card>
    </motion.div>
  );
};

export default DraggableWidget;
