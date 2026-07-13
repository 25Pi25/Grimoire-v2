import { useContext } from "react"
import { GameContext, GameContextType } from "../data/gameState";


/**
 * A button to allow the user to toggle the ability to drag tokens around on 
 * the screen. If enabled, it will be green, and tokens can be moved freely. 
 * If disabled, it will be grey, and touching tokens will do nothing. 
 * 
 * @returns the JSX of a button to do the above. 
 */
export default function ToggleDrag() {
    const {appState, setAppState} = useContext(GameContext) as GameContextType;

    function onToggle() {
        setAppState(oldState => {
            return {
                ...oldState,
                tokenDraggingEnabled: !oldState.tokenDraggingEnabled && !oldState.reminderDraggingEnabled,
                reminderDraggingEnabled: oldState.tokenDraggingEnabled === oldState.reminderDraggingEnabled
            }
        });
    }

    if (!appState.tokenDataVisible) return <></>;
    
    return (
        <div onClick={onToggle} 
            role="button"
            className="BottomButtons__button BottomButtons__dragToggle" 
            style={{backgroundImage: 'url("/assets/move.png")', backgroundColor: (appState.reminderDraggingEnabled ? (appState.tokenDraggingEnabled ? "green" : "#1d5223") : "grey")}}>
        </div>
    )
}
