import { useContext, useMemo } from "react";
import { GameContext, GameContextType } from "../data/gameState";
import { Visibility } from "../types/Visibility";
import { MapLike } from "typescript";
import { Viability } from "../types/Viability";
import { NightOrderTab } from "./TopButtons";
import { NightOrderItem, NightOrderRole } from "./NightOrderItem";
import { Script } from "../types/Script";
import { RoleData } from "../types/Role";

const generalNightInfo: Record<string, string> = {
    dusk: "Start the Night Phase.",
    minioninfo: "If there are 7 or more players, wake all Minions: Show the *THIS IS THE DEMON* token. Point to the Demon. Show the *THESE ARE YOUR MINIONS* token. Point to the other minions.",
    demoninfo: "If there are 7 or more players, wake the Demon: Show the *THESE ARE YOUR MINIONS* token. Point to all Minions. Show the *THESE CHARACTERS ARE NOT IN PLAY* token. Show 3 not-in-play good character tokens.",
    dawn: "Wait for a few seconds. End the Night Phase."
}

type NightOrderData = {
    id: string,
    alive: boolean,
    assigned: boolean
}

function getSortingMethod(script: Script, roles: RoleData, timeKey: "firstNight" | "otherNight") {
    const metaNightOrder = script[0][timeKey];
    if (metaNightOrder === undefined) {
        return (a: NightOrderData, b: NightOrderData) => getGlobalNightOrder(a.id, roles, timeKey) - getGlobalNightOrder(b.id, roles, timeKey);
    }
    let dawnIndex = metaNightOrder.indexOf("dawn")
    if (dawnIndex === -1) dawnIndex = metaNightOrder.length;
    return (a: NightOrderData, b: NightOrderData) => {
        const aIndex = metaNightOrder.indexOf(a.id);
        const bIndex = metaNightOrder.indexOf(b.id);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        console.log(a.id, getGlobalNightOrder(a.id, roles, timeKey), b.id, getGlobalNightOrder(b.id, roles, timeKey))
        return getGlobalNightOrder(a.id, roles, timeKey) - getGlobalNightOrder(b.id, roles, timeKey);
    }
}

function getGlobalNightOrder(id: string, roles: RoleData, timeKey: "firstNight" | "otherNight") {
    // TODO: Global night order is hardcoded into tokens.json, if that changes then this needs to as well
    // 96 is for before dawn
    switch (id) {
        case "dusk":
            return 0;
        case "minioninfo":
            return 19;
        case "demoninfo":
            return 23;
        case "dawn":
            return 97;
    }
    return roles[id][timeKey] ?? 96;
}

export default function NightOrderList() {
    const { gameState, appState, roles } = useContext(GameContext) as GameContextType;

    const firstNight = appState.nightOrderData.currentTab === NightOrderTab.FirstNight
    const timeKey = firstNight ? "firstNight" : "otherNight";
    const sortingMethod = useMemo(
        () => getSortingMethod(gameState.script, roles, timeKey),
        [gameState.script, roles, timeKey]
    );

    const nightOrderData: MapLike<NightOrderData> = {}
    gameState.playerTokens
        .filter(token => token.visibility !== Visibility.Bluff)
        .forEach(token => {
            if (!(token.id in nightOrderData)) {
                nightOrderData[token.id] = {
                    id: token.id,
                    alive: false,
                    assigned: false
                }
            }
            nightOrderData[token.id].alive ||= (token.viability === Viability.Alive);
            nightOrderData[token.id].assigned ||= (token.visibility === Visibility.Assigned);
        });

    const order = Object.values(nightOrderData)
        .filter(data => roles[data.id][timeKey] !== undefined && roles[data.id][timeKey]! !== 0)
        .concat({ id: 'dusk', alive: true, assigned: true }, { id: 'dawn', alive: true, assigned: true })
        .concat(firstNight ? [{ id: 'minioninfo', alive: true, assigned: true }, { id: 'demoninfo', alive: true, assigned: true }] : [])
        .sort(sortingMethod)
        .map((data) =>
            generalNightInfo[data.id] ?
                <NightOrderItem
                    key={data.id + "_" + timeKey}
                    image={`assets/${data.id}.png`} // TODO: if this is too flimsy this can be changed
                    name={data.id}
                    color="#999999"
                    info={generalNightInfo[data.id]}
                    assigned={true}
                /> :
                <NightOrderRole
                    key={data.id + "_" + timeKey}
                    role={roles[data.id]}
                    alive={data.alive}
                    assigned={data.assigned}
                    firstNight={firstNight}
                />
        );

    return (
        <div className="NightOrder__content">
            {order}
        </div>
    )
}