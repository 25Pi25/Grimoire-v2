import { useContext, useMemo } from "react";
import { GameContext, GameContextType } from "../data/gameState";
import { Visibility } from "../types/Visibility";
import { MapLike } from "typescript";
import { Viability } from "../types/Viability";
import { NightOrderTab } from "./TopButtons";
import NightOrderItem from "./NightOrderItem";
import { Script } from "../types/Script";
import { RoleData } from "../types/Role";

type NightOrderData = {
    id: string,
    alive: boolean,
    assigned: boolean
}

function getSortingMethod(script: Script, roles: RoleData, timeKey: "firstNight" | "otherNight") {
    const metaNightOrder = script[0][timeKey];
    if (metaNightOrder === undefined) {
        return (a: NightOrderData,b:NightOrderData) => (roles[a.id][timeKey] ?? -1) - (roles[b.id][timeKey] ?? -1)
    }
    return (a: NightOrderData,b:NightOrderData) => {
        const aIndex = metaNightOrder.indexOf(a.id) ?? -1
        const bIndex = metaNightOrder.indexOf(b.id) ?? -1
        if (aIndex === -1 || bIndex === -1) {
            return (roles[a.id][timeKey] ?? -1) - (roles[b.id][timeKey] ?? -1)
        }
        return aIndex - bIndex
    }
    // return (a:NightOrderData,b:NightOrderData) => (roles[a.id][timeKey] ?? -1) - (roles[b.id][timeKey] ?? -1);
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
        .sort(sortingMethod)
        .map((data) => (
            <NightOrderItem 
                key={data.id + "_" + timeKey} 
                role={roles[data.id]} 
                alive={data.alive} 
                assigned={data.assigned}
                firstNight={firstNight}
            />
        ))

    return (
        <div className="NightOrder__content">
            {order}
        </div>
    )
}