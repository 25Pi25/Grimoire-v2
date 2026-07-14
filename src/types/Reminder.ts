import { isPosition, Position } from "./Position"


export type ReminderData = {
    // The role that is on this reminder
    id: string,
    text: string,
    ownerUid: number,
    reminderUid: number,
    flipped: boolean
} & Position

export function isReminderData(obj: any): obj is ReminderData {
    if (typeof obj !== "object" || obj === null) return false;
    if (typeof obj.id !== "string") return false;
    if (typeof obj.text !== "string") return false;
    if (typeof obj.ownerUid !== "number") return false;
    if (typeof obj.reminderUid !== "number") return false;
    if (typeof obj.flipped !== "boolean") obj.flipped = false; // TODO: this is for compatibility, if it's unneeded then rewrite as a condition

    return isPosition(obj);
}