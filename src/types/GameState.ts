import { isReminderData, ReminderData } from "./Reminder"
import { isGenericScript, Script } from "./Script"
import { isTokenData, TokenData } from "./TokenData"


export type GameState = {
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
