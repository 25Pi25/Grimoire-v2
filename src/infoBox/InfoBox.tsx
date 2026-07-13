import { useContext, useMemo, useState } from "react";
import { GameContext, GameContextType } from "../data/gameState";
import "./InfoBox.css"
import InfoDetails from "./InfoDetails";
import InfoReminders from "./Reminders/InfoReminders";
import InfoCards from "./Cards/InfoCards";
import InfoPowers from "./Powers/InfoPowers";
import { getToken } from "../util";

/**
 * An enum storing which Info Box tab is currently open.
 */
enum Focus {
    DETAILS,
    CARDS,
    REMINDERS,
    POWERS
}

export type InfoTabType = {
    focused: boolean,
    focusCallback: () => void
}

/**
 * The info Box. A bar of infomration and actions along the botom of the screen
 * that shows info on the state of a currently selected token. Only appears if
 * there is a selected token to provide information about.
 * @returns 
 */
export default function InfoBox() {

    const {gameState, appState, tokenZoneRef} = useContext(GameContext) as GameContextType;
    const [focus, setFocus] = useState(Focus.DETAILS);

    const token = getToken(appState.activeTokenUid, gameState);
    const onBottom = useMemo(() => {
        if (!token || !tokenZoneRef.current) return false;
        const height = tokenZoneRef.current.clientHeight;
        return height * 0.6 > token.position.top + gameState.tokenSize / 2;
    }, [token, tokenZoneRef, gameState.tokenSize]);

    if (token === undefined) {
        return ( <></> );
    }

    const alignment = onBottom ? "InfoBox__bottom" : "InfoBox__top";
    return (
        <div className={"InfoBox__container " + alignment} style={{backgroundImage: "url('assets/vines.png')"}}>
            <InfoDetails 
                token={token} 
                focused={focus === Focus.DETAILS}
                focusCallback={() => setFocus(Focus.DETAILS)}
            ></InfoDetails>
            <InfoCards
                focused={focus === Focus.CARDS}
                focusCallback={() => setFocus(Focus.CARDS)}
            ></InfoCards>
            <InfoReminders
                focused={focus === Focus.REMINDERS}
                focusCallback={() => setFocus(Focus.REMINDERS)}
                onBottom={onBottom}
            ></InfoReminders>
            <InfoPowers
                focused={focus === Focus.POWERS}
                focusCallback={() => setFocus(Focus.POWERS)}
            ></InfoPowers>
        </div>
    )
}
