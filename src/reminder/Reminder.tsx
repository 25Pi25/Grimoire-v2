import "./Reminder.css"
import { ReminderData } from "../types/Reminder"
import { RefObject, useContext, useRef } from "react"
import { GameContext, GameContextType } from "../data/gameState"
import { getImage } from "../types/Role"


type ReminderType = {
    reminder: ReminderData,
    promptDeletion: boolean,
    className?: string,
}

export default function Reminder({ reminder, className, promptDeletion }: ReminderType) {

    const { roles } = useContext(GameContext) as GameContextType;

    // Kludge to fix a reference error in Draggable 4.5.
    // https://github.com/react-grid-layout/react-draggable/issues/771#issuecomment-2545737391
    const ref: RefObject<any> = useRef(null);
    const role = roles[reminder.id];

    const classes = className === undefined ? "General__backgroundImage" : className + " General__backgroundImage"

    let prompt = <></>;
    if (promptDeletion) {
        prompt = <img className="Reminder__prompt" src="/assets/delete.png" alt="Deletion prompt" />;
    }

    return (
        <div ref={ref} className={classes} style={{ backgroundImage: "url(assets/reminder.png)" }}>
            <img className="Reminder__image" src={getImage(role)} alt={role.name} />
            {/* <p className="Reminder__text">{reminder.text}</p> */}
            <svg viewBox="0 0 140 140">
                <path data-v-8b24badb="" d="M 70 70 m -42.4264 -42.4264 a 60 60 315 1 0 84.8528 84.8528 a 60 60 315 1 0 -84.8528 -84.8528" id="reminder-curve" fill="transparent"></path>
                <text width="150" x="100%" y="130" textAnchor="middle" className="Reminder__text">
                    <textPath href="#reminder-curve" className="Reminder__textPath">
                        {reminder.text}
                    </textPath>
                </text>
            </svg>
            {prompt}
        </div>
    )
}