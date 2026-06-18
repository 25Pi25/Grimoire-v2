import { useContext } from "react";
import { RoleData, Card } from "../../types/Role";
import { InfoTabType } from "../InfoBox";
import { GameContext, GameContextType } from "../../data/gameState";
import CardItem from "./CardItem";
import { Script } from "../../types/Script";

export type CardMap = {
    [key: string]: Card
}

/**
 * The default cards. These cards appear in the info box no matter what 
 * characters are on the script. 
 */
const DEFAULT_CARDS: CardMap = Object.freeze({
    "GENERAL_INFO": { 
        "listTitle": "General Info", 
        "color": "green",
        "title": "You Learn...",
        "icons": 0
    },
    "USE_ABILITY": { 
        "listTitle": "Use Your Ability?",
        "color": "brown",
        "title": "Use Your Ability?", 
        "icons": 0
    },
    "CHOOSE_SOMEONE": {
        "listTitle": "Choose Player(s)",
        "color": "brown",
        "title": "Choose a Player", 
        "icons": 0
    },
    "CHOOSE_CHARACTER": {
        "listTitle": "Choose Character(s)",
        "color": "brown",
        "title": "Choose a Character", 
        "icons": 1
    },
    "MINIONS": { 
        "listTitle": "This is Your Demon",
        "color": "red",
        "title": "This Is Your Demon", 
        "icons": 0,
    },
    "DEMONS": {
        "listTitle": "These Are Your Minions",
        "color": "red",
        "title": "These Are Your Minions",
        "icons": 0,
    },
    "BLUFFS": {
        "listTitle": "Demon Bluffs",
        "color": "blue",
        "title": "These Characters are Not In Play", 
        "icons": 3,
        "autofill": "_bluff"
    },
    "CHOSEN_BY": {
        "listTitle": "You Were Chosen By", 
        "color": "blue",
        "title": "You Have Been Chosen By", 
        "icons": 1,
        "autofill": "_self"
    },
    "YOU_ARE": { 
        "listTitle": "You Are", 
        "color": "purple",
        "title": "You Are", 
        "icons": 1,
        "autofill": "_self"
    },
    "YOUR_ABILITY": { 
        "listTitle": "Your Ability Text", 
        "color": "purple",
        "title": "Your ability is: ", 
        "icons": 1,
        "autofill": "_self"
    },
    "THIS_PLAYER_IS": {
        "listTitle": "This Player Is", 
        "color": "purple",
        "title": "This Player Is",
        "icons": 1,
        "autofill": "_self"
    }
});

/**
 * Construct the entire card list, including cards relevant to 
 * some of the characters.
 * @param gameState The game state. 
 * @param roles 
 * @returns 
 */
function completeCardList(script: Script, roles: RoleData) {
    const output = {...DEFAULT_CARDS};
    script.slice(1)
        .filter(role => roles[role.id]?.cards !== undefined)
        .forEach(role => {
            const cards = roles[role.id].cards!;
            for (const i in cards) {
                const cardId = `${role.id}_${i}`;
                output[cardId] = cards[i];
            }
        });
    return output;
}

/**
 * The Cards tab -- where Cards can be selected to be shown to players
 * @param focused If this tab is focused
 * @param focusCallback the callback to focus this tab. 
 * @returns 
 */
export default function InfoCards({focused, focusCallback}: InfoTabType) {
    const {gameState, roles} = useContext(GameContext) as GameContextType;
    const cards = completeCardList(gameState.script, roles);
    
    const cardJsx = [];
    for (const id of Object.keys(cards)) {
        cardJsx.push(<CardItem key={id} card={cards[id]}></CardItem>);
    }

    return (
        <div className={"InfoCards__container InfoBox__tab" + (focused ? " InfoBox__focus" : "")}>
            <div 
                className="InfoBox__tabHeader InfoBox__tabHeaderGeneric" 
                style={{backgroundImage: "url('assets/light_green_swirls.webp')", backgroundPosition:"calc(50% - 140px)"}}
                onClick={focusCallback}
                role="button"
            >
                <img className="InfoBox__tabImage" src="assets/list.png" alt="" draggable="false" />
            </div>
            <div className="InfoCards__content">
                {cardJsx}
            </div>
        </div>
    )
}