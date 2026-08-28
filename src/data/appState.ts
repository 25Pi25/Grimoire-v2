import { createContext } from "react";
import { Card } from "../types/Role";
import { NightOrderTab } from "../nightOrder/TopButtons";
import { Team } from "../types/Team";
import { Alignment } from "../types/Alignment";

/**
 * The current Card. Is a Card, but includes data on which tokens are in the menu as well.
 */
export type ActiveCard = Card & {
    shownIcons: ([string, Alignment | undefined] | undefined)[]
}

/**
 * The state of the app. This is NOT persistent. 
 */
export type AppState = {
    /** The UID of the token that is being shown via the Info Box, */
    activeTokenUid: number,

    /** Whether token dragging is enabled. */
    tokenDraggingEnabled: boolean,

    /** Whether reminder token dragging is enabled. */
    reminderDraggingEnabled: boolean,

    /** Whether the background selector UI is shown. */
    isBackgroundSelectorOpen: boolean

    /** The Reminder UIDs of any reminders that are presently showing the "prompt deletion" flag. */
    promptedReminders: number[],

    nightOrderData: {
        // TODO: Denest this by one; I initially figured other properties would be relevant.
        currentTab: NightOrderTab
    }

    /** Whether token data is visible (eg: not town square mode) */
    tokenDataVisible: boolean,

    /** The currently active card, if any. Null if no card is currently being shown. */
    activeCard?: ActiveCard,

    /** Data about the dialog */
    dialog?: {
        message: string,
        allowCancel: boolean,
        callback: () => void,
    }

    /** 
     * The callback to run in the mutate menu when any token is selected. 
     * Notably, The Mutate menu is only shown iff there is an action to do. 
     */
    characterSelect?: {
        type: "script" | "offscript",
        team?: Team
        callback: (id: string, alignment: Alignment) => void
    }

    drawingBag: boolean
}

/**
 * The default state of the Application on page load. 
 */
export const DEFAULT_APP_STATE: AppState = Object.freeze({
    activeTokenUid: -1,
    tokenDraggingEnabled: true,
    reminderDraggingEnabled: true,
    isBackgroundSelectorOpen: false,
    promptedReminders: [],
    tokenDataVisible: true,
    nightOrderData: {
        currentTab: NightOrderTab.None,
        openItems: []
    },
    drawingBag: false,
})

export const AppContext = createContext(null);