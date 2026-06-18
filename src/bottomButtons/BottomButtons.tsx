import "./BottomButtons.css"
import ToggleDrag from "./ToggleDrag";
import ToggleVisibility from "./ToggleVisibility";
import TokenAdjust from "./TokenAdjust";

/**
 * Display the bottom buttons. These buttons are situated in a fixed spot
 * at the bottom right corner of the screen.
 * @returns 
 */
export default function BottomButtons() {
    return (
        <>
            <ToggleVisibility />
            <ToggleDrag />
            <TokenAdjust />
        </>
    )
}