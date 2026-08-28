import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { GameState } from "../types/GameState";
import { AppState } from "./appState";
import { RoleData } from "../types/Role";
import { Script } from "../types/Script";

/* The current version of game state. As new properties are added/changed/removed, the version must also be updated. */
export const GAME_STATE_VERSION = 2;

export const DEFAULT_GAME_STATE: GameState = Object.freeze<GameState>({
    version: GAME_STATE_VERSION,
    background: "url(assets/backgrounds/red_troublebrewing_logo.webp)",
    isNight: false,
    orientation: "landscape",
    playerCount: 12,
    playerTokens: [],
    reminders: [],
    script: [
        {
            id: "_meta",
            name: "Select a Script",
            author: ""
        }
    ],
    scriptColor: "blue",
    scriptId: 0,
    tokenSize: 140
});

/**
 * Load the Game State from storage.
 * @returns The game state saved in storage, or a generic simple one otherwise.
 */
export function load(): GameState {
    const defaults = structuredClone(DEFAULT_GAME_STATE);
    if (localStorage.getItem("state") === null) return defaults;
    return { ...defaults, ...(JSON.parse(localStorage.getItem("state")!) as GameState) };
}

/**
 * Save the game state to storage. 
 * @param state The state of the game at this time. 
 */
export function save(state: GameState) {
    localStorage.setItem("state", JSON.stringify(state));
}

/**
 * A global context object whose purpose is to deal with and hand around the global state.
 */
export const GameContext = createContext<any>(null);

/**
 * The item types in the GameContext object. We can't specify them here, so we do so elsewhere.
 */
export type GameContextType = {
    gameState: GameState, 
    setGameState: Dispatch<SetStateAction<GameState>>
    appState: AppState, 
    setAppState: Dispatch<SetStateAction<AppState>>
    roles: RoleData,
    setRoles:  Dispatch<SetStateAction<RoleData>>,
    scripts: Script[],
    setScripts:  Dispatch<SetStateAction<Script[]>>,
    tokenZoneRef: RefObject<HTMLDivElement | null>,
};