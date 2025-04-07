import { DragStoppedEvent, DragStartedEvent } from "ag-grid-community";
import { useRef } from "react";

function useDragColumnChange(cb: (e: DragStoppedEvent) => void) {
  const columnOrderRef = useRef<string[]>([]);
  const onDragStarted = (e: DragStartedEvent) => {
    columnOrderRef.current = e.api
      .getColumnState()
      .map((c) => c.colId as string);
  };

  const onDragStopped = (e: DragStoppedEvent) => {
    const newColumnOrder = e.api
      .getColumnState()
      .map((c) => c.colId as string)
      .filter((colId) => colId !== "detail");

    const sameOrder = columnOrderRef.current.every(
      (c, i) => c === newColumnOrder[i],
    );

    if (!sameOrder) {
      cb(e);
    }
  };

  return { onDragStarted, onDragStopped };
}

export default useDragColumnChange;
