import { MouseEventHandler, RefObject, useRef } from "react";
import { ReminderData } from "../types/Reminder";
import Draggable, { DraggableEvent, DraggableData, DraggableEventHandler } from "react-draggable";
import Reminder from "./Reminder";

type ReminderType = {
    reminder: ReminderData,
    dragEnabled: boolean,
    promptDeletion: boolean
    onDrag: (e: DraggableEvent, ui: DraggableData) => void;
    onClick: MouseEventHandler<HTMLElement>;
    onRightClick?: MouseEventHandler<HTMLElement>;
    onDrop: DraggableEventHandler;
    className?: string,
} 

export default function DraggableReminder({ reminder, className, dragEnabled, promptDeletion, onDrag, onClick, onRightClick, onDrop}: ReminderType) {

    // Kludge to fix a reference error in Draggable 4.5.
    // https://github.com/react-grid-layout/react-draggable/issues/771#issuecomment-2545737391
    const ref: RefObject<any> = useRef(null);
    const touchMoved = useRef({left: 0, top: 0, total: false});

    function hasSufficientlyMoved() {
        touchMoved.current = {
            left: touchMoved.current.left,
            top: touchMoved.current.top,
            total: touchMoved.current.total || touchMoved.current.left ** 2 + touchMoved.current.top ** 2 > 100
        };
        return touchMoved.current.total;
    }

    function handleMouseDown(e: any) {
        if (e.button === 2) return true; // Right click
        if (dragEnabled) return true;
        onClick(e);
    }

    function handleTouchStart() {
        touchMoved.current = {left: 0, top: 0, total: false};
    }

    function handleTouchMove(e:DraggableEvent, ui:DraggableData) {
        touchMoved.current = {
            left: touchMoved.current.left + ui.deltaX,
            top: touchMoved.current.top + ui.deltaY,
            total: touchMoved.current.total
        }
        hasSufficientlyMoved();
        onDrag(e,ui);
    }

    function handleTouchEnd(e: DraggableEvent, data: DraggableData) {
        if (touchMoved.current.total) {
            onDrop(e, data);
        } else {
            e.preventDefault();
            onClick(e as any);
        }
        touchMoved.current = {left: 0, top: 0, total: false};
    }

    const innerReminder = <Reminder reminder={reminder} className={className} promptDeletion={promptDeletion} />;

    return (
        <Draggable
            nodeRef={ref}
            disabled={!dragEnabled}
            position={{x: reminder.left, y: reminder.top}}
            onMouseDown={handleMouseDown}
            onStart={handleTouchStart}
            onDrag={handleTouchMove}
            onStop={handleTouchEnd}
        >
            <div ref={ref} style={{zIndex: hasSufficientlyMoved() ? 1 : 0}} onContextMenu={(e) => onRightClick?.(e)}>
                {innerReminder}
            </div>
        </Draggable>
    )
}