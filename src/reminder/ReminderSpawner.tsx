import { DraggableData, DraggableEvent } from "react-draggable"
import { ReminderData } from "../types/Reminder"
import DraggableReminder from "./DraggableReminder"
import { Position } from "../types/Position"
import { useContext } from "react"
import { GameContext, GameContextType } from "../data/gameState"


type ReminderSpawnerType = {
    roleId: string,
    text: string,
    top: number,
    left: number,
    ownerUid: number,
    className?: string,
    onBottom: boolean,
}

export default function ReminderSpawner({roleId, text, top, left, ownerUid, className, onBottom}: ReminderSpawnerType) {
    const {setGameState} = useContext(GameContext) as GameContextType;

    const dummyReminder: ReminderData = {
        id: roleId,
        text: text,
        top: top,
        left: left,
        ownerUid: 0,
        reminderUid: 0,
        flipped: false
    }

    function onDrop(e: DraggableEvent, data: DraggableData) {
        // Don't drop if we aren't outside the box
        if (onBottom ? data.y > -100 : data.y < 100) return;
        const droppedPos = data.node.getBoundingClientRect() as Position
        const spawnPos = {top: droppedPos.top + 12.5, left: droppedPos.left + 12.5}
        const reminder: ReminderData = {
            id: roleId,
            text: text,
            ownerUid,
            reminderUid: Date.now(),
            flipped: false,
            ...spawnPos
        };

        setGameState(oldState => {
            return {
                ...oldState,
                reminders: [
                    ...oldState.reminders,
                    reminder
                ]
            };
        });
    }

    return (
        <DraggableReminder
            reminder={dummyReminder}
            className={className}
            dragEnabled={true}
            promptDeletion={false}
            // TODO
            onClick={() => {}}
            onDrag={() => {}}
            onDrop={onDrop}
        />
    )
}