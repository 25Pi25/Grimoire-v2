import { useContext } from "react";
import { DraggableEvent, DraggableData } from "react-draggable";
import { GameContext, GameContextType } from "../data/gameState";
import { GameState } from "../types/GameState";
import DraggableReminder from "../reminder/DraggableReminder";

/**
 * Provides a div containing the "reminder Zone", a region where all reminder tokens exist. 
 * @returns 
 */
export default function ReminderZone() {

    const { gameState, setGameState, appState, setAppState } = useContext(GameContext) as GameContextType;

    if (!appState.tokenDataVisible) return <></>

    function handleDrag(_: DraggableEvent, ui: DraggableData, index: number) {
        setGameState(oldState => {
            return {
                ...oldState,
                reminders: [
                    ...oldState.reminders.slice(0, index),
                    {
                        ...oldState.reminders[index],
                        top: oldState.reminders[index].top + ui.deltaY,
                        left: oldState.reminders[index].left + ui.deltaX,
                    },
                    ...oldState.reminders.slice(index + 1)
                ]
            }
        });
    }

    function handleClick(e: any, index: number) {
        if (!appState.tokenDataVisible) return;

        const reminder = gameState.reminders[index];
        e.stopPropagation();

        if (!appState.promptedReminders.includes(reminder.reminderUid)) {
            setAppState(oldState => {
                return {
                    ...oldState,
                    promptedReminders: [
                        ...oldState.promptedReminders,
                        reminder.reminderUid
                    ]
                }
            })
            return;
        }

        setGameState(oldState => {
            return {
                ...oldState,
                reminders: [
                    ...oldState.reminders.slice(0, index),
                    ...oldState.reminders.slice(index + 1)
                ]
            }
        });
        setAppState(oldState => {
            return {
                ...oldState,
                promptedReminders: oldState.promptedReminders.filter(x => x !== reminder.reminderUid),
            }
        });
    }

    function handleRightClick(e: any, index: number) {
        if (!appState.tokenDataVisible) return;

        e.preventDefault();
        e.stopPropagation();

        setGameState(oldState => {
            return {
                ...oldState,
                reminders: [
                    ...oldState.reminders.slice(0, index),
                    {
                        ...oldState.reminders[index],
                        flipped: !oldState.reminders[index].flipped
                    },
                    ...oldState.reminders.slice(index + 1)
                ]
            }
        });
    }

    function handleDrop(index: number) {
        setGameState(oldState => {
            const newState: GameState = { ...oldState };
            const oldReminder = oldState.reminders[index];
            newState.reminders = [
                ...oldState.reminders.slice(0, index),
                ...oldState.reminders.slice(index + 1),
                oldReminder
            ];
            return newState;
        });
    }

    const reminders = gameState.reminders.map((reminder, index) => (
        <DraggableReminder
            key={reminder.reminderUid}
            className="Reminder__container"
            dragEnabled={appState.draggingEnabled}
            reminder={reminder}
            promptDeletion={appState.promptedReminders.includes(reminder.reminderUid)}
            onDrag={(e, ui) => handleDrag(e, ui, index)}
            onDrop={() => handleDrop(index)}
            onClick={(e) => handleClick(e, index)}
            onRightClick={(e) => handleRightClick(e, index)}
        />
    ));

    return (
        <div className="DragZone__container">
            {reminders}
        </div>
    )
}