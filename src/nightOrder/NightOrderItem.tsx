import { JSX, useEffect, useRef, useState } from "react";
import { TEAM_DATA } from "../data/roleData"
import { getImage, Role } from "../types/Role";


const REMINDER_FLAG = ":reminder:"

function infoJsx(info: string) {
    // Terrible compiler, gooooooo
    const tokens: string[] = [];
    let token = "";
    while (info.length > 0){
        if (info.startsWith(REMINDER_FLAG)) {
            tokens.push(token);
            tokens.push(REMINDER_FLAG)
            token = "";
            info = info.slice(REMINDER_FLAG.length);
        } else if (info.startsWith("*")) {
            tokens.push(token);
            tokens.push("*");
            token = "";
            info = info.slice(1);
        } else {
            token += info[0];
            info = info.slice(1);
        }
    }
    tokens.push(token);

    const pieces: (string | JSX.Element)[] = [];
    let withinBold: (string | JSX.Element)[] = [];
    let bold = false;
    for (let i = 0; i < tokens.length; i++) {
        token = tokens[i];
        let element: (string | JSX.Element) = token;
        if (element === "*") {
            if (bold) {
                pieces.push(
                    <strong key={i} className="NightOrderItem__emphasis">{withinBold}</strong>
                );
                withinBold = [];
            }
            bold = !bold;
            continue;
        }
        if (element === REMINDER_FLAG) {
            element = <img key={i} className="NightOrderItem__reminder" src="assets/reminder.png" alt="" />;
        }

        if (bold) withinBold.push(element);
        else pieces.push(element);
    }
    
    return <span className="NightOrderItem__text"> {pieces} </span>
}

type NightOrderRoleType = {
    role: Role;
    alive: boolean;
    assigned: boolean;
    firstNight: boolean;
}

/**
 * A night order item based on a role.
 * @param role Role data about this night order item. 
 * @param alive Whether any player given this role is alive. 
 * @param assigned Whether this role is assigned to any player.
 * @param firstNight True iff this is the first night.
 * @returns 
 */
export function NightOrderRole({ role, alive, assigned, firstNight }: NightOrderRoleType) {
    let color = TEAM_DATA[role.team].color;
    if (!alive) color = "#000000";

    const info = firstNight ? role.firstNightReminder ?? "" : role.otherNightReminder ?? "";

    return <NightOrderItem image={getImage(role)} name={role.name} color={color} info={info} assigned={assigned}/>
}

type NightOrderItemType = {
    image: string;
    name: string;
    color: string;
    info: string;
    assigned: boolean;
}

/**
 * A generic night order item.
 * @param image The image URL.
 * @param name The name of the night order item.
 * @param color The color of the item.
 * @param info Displayable info for the night order item.
 * @param assigned Whether this role is assigned to any player.
 * @returns 
 */
export function NightOrderItem({ image, name, color, info, assigned }: NightOrderItemType) {
    const [open, setOpen] = useState(false);
    const ref = useRef<any>(null);

    useEffect(() => {
        if (ref.current === undefined) return;
        if (open) {
            ref.current.style.height = ref.current.scrollHeight + "px";
        } else {
            ref.current.style.height = "";
        }
    })

    let visibility = <></>
    if (!assigned) {
        visibility = <img className="NightOrderItem__visibility" src="/assets/visibility_off_red.png" alt="Unassigned" />
    }

    return (
        <div 
            ref={ref}
            className={"NightOrderItem__container" + (open ? " NightOrderItem__open" : "")}
            style={{backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) , ${color})`}}
            onClick={() => setOpen(!open)}
            role="button"
        >
            {infoJsx(info)}
            <img className="NightOrderItem__image" src={image} alt={name}/>
            {visibility}
        </div>
    )
}