import { useContext } from "react";
import SampleToken from "../token/SampleToken";
import { Role } from "../types/Role";
import { TokenData } from "../types/TokenData";
import { Visibility } from "../types/Visibility";
import { InfoTabType } from "./InfoBox";
import { GameContext, GameContextType } from "../data/gameState";

type InfoDetailsType = InfoTabType & {
    token: TokenData
}

/**
 * Generate the JSX, if any, for the flavor text of this token. 
 * @param role 
 * @returns 
 */
function generateFlavor(role: Role) {
    if (role.flavor === undefined) return (<></>);
    const flavor = `"${(role.flavor ?? "").replaceAll(/\n[\t ]*/g, " / ")}"`;

    let color: string;

    switch (role.team) {
        case "townsfolk":
        case "outsider":
        default:
            color = "rgb(176, 176, 230)";
            break;
        case "minion":
        case "demon":
            color = "rgb(230, 176, 176)";
            break;
        case "fabled":
            color = "rgb(230, 230, 176)"
            break;
        case "loric":
            color = "rgb(176, 230, 176)"
            break;
        case "traveller":
            color = "rgb(230, 176, 230)"
    }

    return (<div className="InfoDetails__flavor" style={{color: color}}>{flavor}</div>);

}

/**
 * The Details tab -- Provides basic details about this token's character.
 * @param focused If this tab is focused
 * @param focusCallback the callback to focus this tab. 
 * @returns 
 */
export default function InfoDetails({token, focused, focusCallback}: InfoDetailsType) {

    const {roles} = useContext(GameContext) as GameContextType;

    const role = roles[token.id];

    let name = token.name ?? "";
    let mask = <></>

    if (token.visibility === Visibility.Bluff) {
        name = "(Demon Bluff)"
        mask = <>
            <div className="InfoDetails__tokenMask"></div>
            <div className="InfoDetails__visibilityIndicator" style={{backgroundImage: "url(assets/visibility_off_yellow.png)"}}></div>
        </>;
    } else if (token.visibility === Visibility.Hidden) {
        name = " (Hidden Token)"
        mask = <>
            <div className="InfoDetails__tokenMask"></div>
            <div className="InfoDetails__visibilityIndicator" style={{backgroundImage: "url(assets/visibility_off_red.png)"}}></div>
        </>;
    }

    return (
        <div className={"InfoDetails__container InfoBox__tab" + (focused ? " InfoBox__focus" : "")}>
            <SampleToken id={token.id} alignment={token.alignment} className="InfoDetails__token" onClick={focusCallback}></SampleToken>
            {mask}
            <span className="InfoDetails__tokenName">{name}</span>
                <div className="InfoDetails__content">
                    <div className="InfoDetails__roleName">{role.name}</div>
                    <div className="InfoDetails__playerName">{name}</div>
                    <div className="InfoDetails__ability">{role.ability}</div>
                    {generateFlavor(role)}
                </div>
        </div>
    )
}
