import { FormEvent, useContext, useRef } from "react";
import "./RenamePrompt.css";
import { GameContext, GameContextType } from "../data/gameState";

export default function RenamePrompt() {
    const { gameState, setGameState, appState, setAppState } = useContext(GameContext) as GameContextType;
    const textRef = useRef<HTMLInputElement>(null);

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        closeMenu(textRef.current!.value);
    }

    function closeMenu(text?: string) {
        setAppState(oldState => {
            return {
                ...oldState,
                customReminderUid: undefined
            }
        });

        if (!text) return;

        const reminderIndex = gameState.reminders.findIndex(reminder => reminder.reminderUid === appState.customReminderUid!);
        if (reminderIndex === null) return;
        setGameState(oldState => {
            return {
                ...oldState,
                reminders: [
                    ...oldState.reminders.slice(0, reminderIndex),
                    {
                        ...oldState.reminders[reminderIndex],
                        text
                    },
                    ...oldState.reminders.slice(reminderIndex + 1)
                ]
            }
        })
    }
    
    return <div className="CharacterSelect__container" onClick={() => closeMenu()}>
        <div className="RenamePrompt__background">
            <form onSubmit={onSubmit} className="RenamePrompt__content" onClick={e => e.stopPropagation()}>
                <input type="text" ref={textRef} className="RenamePrompt__input" />
            </form>
        </div>
    </div>
}