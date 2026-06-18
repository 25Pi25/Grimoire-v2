import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext, GameContextType } from "../data/gameState";

/**
 * A button to toggle visibility. 
 * In the visible state, all token and reminder information will be freely
 * displayed to the user. 
 * In the invisible, or "town saure" state, only the aliveness of assigned
 * tokens will be shown to the user. All other functionality will be disabled.
 * This way, the Storyteller can display the aliveness of players without showing all of the information.
 * 
 * @returns 
 */
export default function ToggleVisibility() {
    const { appState, setAppState } = useContext(GameContext) as GameContextType;
    const [hidden, setHidden] = useState<boolean>(false);

    const onToggle = useCallback(() => {
        setAppState(oldState => {
            return {
                ...oldState,
                // Should be impossible since the button is covered by infobox, but eh.
                activeTokenUid: -1,
                tokenDataVisible: !oldState.tokenDataVisible
            }
        });
    }, [setAppState]);

    useEffect(() => {
        const event = (e: any) => {
            if (e.key !== "h") return;
            setHidden(h => !h);
        };
        window.addEventListener("keydown", event);
        return () => window.removeEventListener("keydown", event);
    }, [hidden]);

    if (hidden) return <></>;
    return (
        <div onClick={onToggle}
            role="button"
            className="BottomButtons__button BottomButtons__visibilityToggle"
            style={{ backgroundImage: 'url("/assets/visibility_off.png")', backgroundColor: (appState.tokenDataVisible ? "grey" : "lightblue") }}>
        </div>
    )
}