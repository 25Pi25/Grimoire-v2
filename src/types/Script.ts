import { isCompleteRole, Role, RoleData } from "./Role"


export type Meta = {
    id: "_meta",
    name: string,
    author?: string,
    bootlegger?: string[],
    firstNight?: string[],
    otherNight?: string[],
}

export function isMeta(obj: any) {
    if (typeof obj !== "object" || obj === null) return false;
    if (obj.id !== "_meta") return false;
    if (typeof obj.name !== "string") return false;

    return true;
}

/**
 * Provide a default meta tag for a script that doesn't have one. 
 * @returns 
 */
function defaultMeta(): Meta {
    return {
        id: "_meta",
        name: "Unnamed Custom Script",
        author: "anonymous",
    };
}

/**
 * Update the meta information for a script that either has no meta, has it in
 * a nonstandard place, or 
 * @param script 
 * @param roles 
 * @returns 
 */
export function updateMeta(script: Script, roles: RoleData): Script {
    let meta = script.filter(isMeta)[0] as Meta ?? defaultMeta();
    if (meta.firstNight === undefined) {
        const firstNight = script.map(x => isCompleteRole(x) ? x : roles[x.id])
            .filter(role => role?.firstNight !== undefined)
            .filter(role => role.firstNight! !== 0)
            .sort((a,b) => a.firstNight! - b.firstNight!)
            .map(x => x.id);
        meta.firstNight = firstNight;
    }
    if (meta.otherNight === undefined) {
        const otherNight = script.map(x => isCompleteRole(x) ? x : roles[x.id])
            .filter(role => role?.otherNight !== undefined)
            .filter(role => role.otherNight! !== 0)
            .sort((a,b) => a.otherNight! - b.otherNight!)
            .map(x => x.id)
        meta.otherNight = otherNight;
    }
    return [
        meta,
        ...script.filter(x => !isMeta(x))
    ];
}

export type RoleIdentifier = {
    id: string
}

function hasRoleId(obj: any): obj is RoleIdentifier {
    if (typeof obj !== "object") return false;
    if (typeof obj.id !== "string") return false;

    return true;
}

/**
 * Determine if a script item is a complete role item.
 * @param role A role object from the script
 * @returns true iff the item has all of its role data
 */
export function isRole(role: RoleIdentifier | Role, roles: RoleData): role is Role {
    return roles[role.id] === undefined;
}

export type Script = [Meta, ...Array<RoleIdentifier | Role>]

export type JsonScript = [Meta, ...Array<string|Role>]

export function isGenericScript(obj: any): obj is Script {
    if (!Array.isArray(obj)) return false;

    if (!isMeta(obj[0])) return false;
    if (!obj.every(item => hasRoleId(item))) return false;

    return true;
}

export function isCompleteScript(obj: any, roles: RoleData): obj is Script {
    if (!Array.isArray(obj)) return false;

    let hasMeta = false;
    for (const role of obj) {
        if (isMeta(role)) {
            if (hasMeta) return false;
            hasMeta = true;
            continue;
        }
        if (typeof role !== "object") return false;
        if (typeof role.id !== "string") return false;
        if (isCompleteRole(role)) {
            if (roles[role.id] !== undefined && roles[role.id].ability !== role.ability) { // TODO: find alt solution to not modify
                role.id += '_'
            }
            continue;
        }

        if (roles[role.id] === undefined) {
            return false;
        }
    }

    return true;
}

export function reasonForScriptFailure(obj: any, roles: RoleData): string {
    if (!Array.isArray(obj)) {
        return "Your input should be an array. Did you accidentally import a GameState file?"
    }
    if (obj.filter(isMeta).length > 1) {
        return "Your script has multiple \"_meta\" tags.";
    }
    for (let i = 1; i < obj.length; i++) {
        const role = obj[i];
        if (typeof role === "string") return "Scripts that are just a list of strings are unsupported. That script must be really old."
        if (typeof role !== "object") return `The role at position ${i} is not a proper object.`
        if (typeof role.id !== "string") return `The role at position ${i} has a missing or malformed id.`
        if (roles[role.id] !== undefined) continue
        if (!isCompleteRole(role)) return `The role with id "${role.id}" is not known by this Grimoire, and has a missing or incomplete implementation. Is it homebrew? Did TPI just release it?`;
    }

    return "...I dunno what went wrong. Contact Mirai and send them the JSON you just tried to import."
}
