import { useContext, useEffect, useRef, useState } from "react";
import { GameContext, GameContextType } from "../../data/gameState";
import { InfoTabType } from "../InfoBox";
import { getToken } from "../../util";
import SampleReminder from "../../reminder/SampleReminder";
import ReminderSpawner from "../../reminder/ReminderSpawner";

type GhostProp = {
    left: number,
    top: number,
    text: string,
}

/**
 * The Reminders tab -- where reminders for this token can be instantiated.
 * @param focused If this tab is focused
 * @param focusCallback the callback to focus this tab. 
 * @param onBottom if the info box is on the bottom.
 * @returns 
 */
export default function InfoReminders({focused, focusCallback, onBottom}: InfoTabType & {onBottom: boolean}) {
    const {gameState, appState, roles} = useContext(GameContext) as GameContextType;

    const landingRef = useRef<HTMLDivElement>(null)
    const [ghosts, setGhosts] = useState<GhostProp[]>([])

    const roleId = getToken(appState.activeTokenUid, gameState)!.id;

    const role = roles[roleId];


    useEffect(() => {
        if (!landingRef.current) return;
        if (role.reminders === undefined) return;

        const landingRect = landingRef.current.getBoundingClientRect();

        const newGhosts = role.reminders!.map((reminderText, index) => {
        
            const child = landingRef.current!.children[index] as HTMLElement;
            const rect = child.getBoundingClientRect();
            const left = rect.x - landingRect.x;
            const top = rect.y - landingRect.y;

            return {left: left, top: top, text: reminderText};
        })

        setGhosts(newGhosts);
    }, [role.reminders]);


    let staticJsx = [];
    let draggableJsx = ghosts.map(({left, top, text}, index) => {
        return <ReminderSpawner 
            key={index} 
            text={text} 
            ownerUid={appState.activeTokenUid}
            className="InfoReminders__dynamicReminder"
            left={left} 
            top={top} 
            roleId={role.id}
            onBottom={onBottom}
        />
    });

    if (role.reminders !== undefined) {
        for (const reminderText of role.reminders!) {
            staticJsx.push(<SampleReminder 
                key={reminderText}
                id={roleId}
                text={reminderText}
                className="InfoReminders__staticReminder"
            />);
        }
    }


    return (
        <div className={"InfoReminders__container InfoBox__tab" + (focused ? " InfoBox__focus" : "")}>
            <div 
                className="InfoBox__tabHeader InfoBox__tabHeaderGeneric" 
                style={{backgroundImage: "url('assets/blue_swirls.webp')"}}
                onClick={focusCallback}
                role="button"
            >
                <img className="InfoBox__tabImage" src="assets/reminders.png" alt="" draggable="false" />
            </div>
            <div ref={landingRef} className="InfoReminders__content">
                {staticJsx}
            </div>
            <div className="InfoReminders__content">
                {draggableJsx}
            </div>
        </div>
    )
}
