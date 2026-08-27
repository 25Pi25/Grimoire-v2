import { DEFAULT_GAME_STATE, GAME_STATE_VERSION } from "../data/gameState"
import { isReminderData, ReminderData } from "./Reminder"
import { isGenericScript, Script } from "./Script"
import { isTokenData, TokenData } from "./TokenData"

export type GameState = {
    version: number,
    background: string,
    isNight: boolean,
    orientation: "portrait" | "landscape",
    playerCount: number,
    playerTokens: TokenData[],
    reminders: ReminderData[],
    script: Script
    scriptColor: string,
    scriptId: number,
    tokenSize: number
}

/**
 * Forwards compatibility for future versions in case new properties are added/changed. Can be used for unknown game state.
 * May cause unexpected mutations if updating the version fails.
 * @param obj Unknown object assumed to be game state data
 * @returns If the object is at the current version, or successfully updated
 * */
export function updateGameStateVersion(obj: any): boolean {
    if (typeof obj !== "object" || obj === null) return false;
    if (obj.version === GAME_STATE_VERSION) return true;
    if (typeof obj.version !== "number") { // Version 1, added tokenSize to game and flipped to reminders
        if (typeof obj.tokenSize !== "number") obj.tokenSize = DEFAULT_GAME_STATE.tokenSize;
        if (!Array.isArray(obj.reminders)) return false;
        if (!obj.reminders.every((reminder: any) => typeof reminder === "object" && reminder !== null)) return false;
        for (const reminder of obj.reminders) {
            reminder.flipped = false;
        }
    }
    if (obj.version !== 2) { // Version 2, added custom to reminders
        if (!Array.isArray(obj.reminders)) return false;
        if (!obj.reminders.every((reminder: any) => typeof reminder === "object" && reminder !== null)) return false;
        for (const reminder of obj.reminders) {
            reminder.custom = false;
        }
    }
    obj.version = GAME_STATE_VERSION;
    return true;
}

export function isValidGamestate(obj: any): obj is GameState {
    if (typeof obj !== "object" || obj === null) return false;
    
    if (typeof obj.background !== "string") return false;
    if (typeof obj.isNight !== "boolean") return false;
    if (!["portrait", "landscape"].includes(obj.orientation)) return false;
    if (typeof obj.playerCount !== "number") return false;
    
    if (!Array.isArray(obj.playerTokens)) return false;
    if (!obj.playerTokens.every((token: any) => isTokenData(token))) return false;
    
    if (!Array.isArray(obj.reminders)) return false;
    if (!obj.reminders.every((reminder: any) => isReminderData(reminder))) return false;

    if (!isGenericScript(obj.script)) return false;
    
    if (typeof obj.scriptColor !== "string") return false;
    if (typeof obj.scriptId !== "number") return false;
    
    if (typeof obj.tokenSize !== "number") return false;
    
    return true;
}