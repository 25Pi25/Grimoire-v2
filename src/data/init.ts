import { GameState } from "../types/GameState";
import { customCharacterRole, isCompleteRole, RoleData } from "../types/Role";
import { JsonScript, Script, updateMeta } from "../types/Script";
import { getJSON } from "../util";
import { DEFAULT_SCRIPT_PATHS, formatImportedScript, getLocalScripts, scriptIndexOf } from "./scriptData";

/**
 * Initialize the application by fetching data from the backend. 
 * @param gameState The game state. Stored locally, so we retrieved it already. 
 * @param setRoles A callback to set the global role data.
 * @param setScripts A callback to set the global script data. 
 * @param setGameState A callback to set the global game state.
 */
export default async function init(gameState: GameState, setRoles: any, setScripts: any, setGameState: any) {
    const roles: RoleData = {
        custom: customCharacterRole,
        ...await getJSON("tokens.json"),
    };
    const scripts: Script[] = [];
    for (const path of DEFAULT_SCRIPT_PATHS) {
        const script = await getJSON(path) as JsonScript;
        scripts.push(updateMeta(formatImportedScript(script), roles));
    }

    const localScripts = getLocalScripts().concat([gameState.script as JsonScript]);
    localScripts.forEach(script => {
        const newScript = updateMeta(formatImportedScript(script), roles)
        if (scriptIndexOf(newScript, scripts) >= 0) return;
        if (newScript[0].name === "Select a Script") return;
        if (newScript[0].name === "Gang's All Here") {
            newScript[0].name = "Gang's All Here (Outdated)"
        }
        scripts.push(newScript);
        newScript.slice(1).forEach(role => {
            if (roles[role.id] !== undefined) return;
            if (!isCompleteRole(role)) {
                throw new Error(`Script contains a role "${role.id}" for which there is no data!`);
            }
            roles[role.id] = role;
        });
    });

    setRoles(roles);
    setScripts(scripts);
    setGameState((state: GameState) => {
        if (state.script.length > 1) return state;
        return {
            ...state,
            script: gameState.script.length > 1 ? gameState.script : scripts[0],
        }
    });
    setGameState((state: GameState) => { // In case of a homebrew character deleted from the role list, defaults to custom
        return {
            ...state,
            playerTokens: state.playerTokens.map(token => {
                if (roles[token.id] !== undefined) return token;
                return { ...token, id: 'custom' };
            })
        }
    });
}