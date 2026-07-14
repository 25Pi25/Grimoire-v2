import { Alignment, getExpectedAlignment } from "./Alignment"
import { Team } from "./Team"
import { TokenData } from "./TokenData"

export type RoleData = {
    [key: string]: Role
}

export type Jinx = {
    id: string,
    reason: string
}

function isJinx(obj: any): obj is Jinx {
    if (typeof obj !== "object") return false;
    if (typeof obj.id !== "string") return false;
    if (typeof obj.reason !== "string") return false;

    return true;
}

export type Card = {
    listTitle: string,
    color: string,
    title: string,
    icons?: number
    iconsFixed?: boolean
    autofill?: string
    epilog?: string
}

function isCard(obj: any): obj is Card {
    if (typeof obj !== "object") return false;
    if (typeof obj.listTitle !== "string") return false;

    if (typeof obj.color !== "string") return false;
    if (!["blue", "brown", "green", "orange", "purple", "red"].includes(obj.color)) return false;

    if (typeof obj.title !== "string") return false;

    if (obj.icons !== undefined && typeof obj.icons !== "number") return false;
    if (obj.icons < 0) return false;

    if (obj.iconsFixed !== undefined && typeof obj.iconsFixed !== "boolean") return false;
    if (obj.autofill !== undefined && typeof obj.autofill !== "string") return false;

    if (obj.epilog !== undefined && typeof obj.epilog !== "string") return false;

    return true;
}

export type Role = {
    id: string,
    name: string,
    ability: string,
    flavor?: string,
    team: Team,
    image: string | string[],
    reminders?: string[],
    firstNight?: number,
    firstNightReminder?: string,
    otherNight?: number,
    otherNightReminder?: string,
    // change_makeup?: any[],
    cards?: Card[]
    jinxes?: Jinx[]
}

export function isCompleteRole(obj: any): obj is Role {
    if (typeof obj !== "object") return false;

    if (typeof obj.id !== "string") return false;
    if (typeof obj.name !== "string") return false;
    if (typeof obj.flavor !== "string" && obj.flavor !== undefined) return false;
    if (!Object.values(Team).includes(obj.team)) return false;
    if (typeof obj.image !== "string") return false; // TODO: should allow for arrays. 

    if (obj.reminders !== undefined) {
        if (!Array.isArray(obj.reminders)) return false;
        if (!obj.reminders.every((r: any) => typeof r === "string")) return false;
    }
    
    if (obj.firstNight !== undefined) {
        if (typeof obj.firstNight !== "number") return false;
        // Night order specified requires reminder text. 
        if (obj.firstNightReminder === undefined && obj.firstNight <= 0) return false;
        if (typeof obj.firstNightReminder !== "string") return false;
    }

    if (obj.otherNight !== undefined) {
        if (typeof obj.otherNight !== "number") return false;
        // Night order specified requires reminder text. 
        if (obj.otherNightReminder === undefined && obj.otherNight <= 0) return false;
        if (typeof obj.otherNightReminder !== "string") return false;
    }

    if (obj.cards !== undefined) {
        if (!Array.isArray(obj.cards)) return false;
        if (!obj.cards.every(isCard)) return false;
    }

    if (obj.jinxes !== undefined) {
        if (!Array.isArray(obj.jinxes)) return false;
        if (!obj.jinxes.every(isJinx)) return false;
    }

    return true;
}

export function getImage(role?: Role, token?: TokenData): string {
    if (!role) return "assets/custom.webp";
    if (typeof role.image === "string") return role.image;
    if (role.image.length === 1) return role.image[0];
    if (token === undefined) return role.image[0];
    if (token.alignment === undefined) return role.image[0];

    const expected = getExpectedAlignment(role);
    switch (expected) {
        case Alignment.Storyteller:
        default:
            return role.image[0];
        case Alignment.Good:
        case Alignment.Evil:
            return role.image[expected === token.alignment ? 0 : 1];
        case Alignment.Traveller:
            if (token.alignment === Alignment.Evil) return role.image[2];
            if (token.alignment === Alignment.Good) return role.image[1];
            return role.image[0];
    }
}