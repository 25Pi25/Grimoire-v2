import { JSX, useContext, useState } from "react";
import "./CharacterSelect.css"
import { GameContext, GameContextType } from "../data/gameState";
import { TEAM_DATA } from "../data/roleData";
import { GameState } from "../types/GameState";
import { Role, RoleData } from "../types/Role";
import { isRole, RoleIdentifier } from "../types/Script";
import SampleToken from "../token/SampleToken";
import { MapLike } from "typescript";
import { Team } from "../types/Team";
import { Alignment, getExpectedAlignment } from "../types/Alignment";

const isHomebrew = (role: Role) => typeof role.image === "string" && role.image.includes("unofficial");
// TODO: move somewhere else and then add system for this

/**
 * Construct the token select menu's individual items using the given script.
 * @param gameState The Game State
 * @param roles Global role data
 * @param callback What the individual menu items should do to create a new token
 * @param selectType Whether tokens shown are script or offscript.
 * @param alignmentSetting The alignment setting of each token.
 * @param homebrewSetting Whether tokens shown are homebrew or not.
 * @returns 
 */
function populateJSX(
    gameState: GameState,
    roles: RoleData,
    callback: (id: string, alignment: Alignment) => void,
    selectType: "script" | "offscript",
    alignmentSetting: AlignmentSetting,
    homebrewSetting: HomebrewSetting
): MapLike<JSX.Element[]> {
    const script = gameState.script.slice(1) as (RoleIdentifier | Role)[];

    const items: MapLike<JSX.Element[]> = {}
    Object.keys(TEAM_DATA).forEach(type => items[type] = []);

    const roleScript = script.map(r => {
        if (!isRole(r, roles)) {
            r = roles[r.id];
        }
        return r as Role;
    });

    const selectRoles = selectType === "script" ? roleScript : Object.values(roles);
    selectRoles.forEach(role => {
        if (!(role.team in items)) return;
        if (homebrewSetting === "Homebrew" && !isHomebrew(role)) return;
        if (homebrewSetting === "Vanilla" && isHomebrew(role)) return;
        items[role.team].push((
            <SampleToken
                id={role.id}
                key={role.id}
                className={"CharacterSelect__token General__backgroundImage"}
                alignment={alignmentSetting === "Default" ? undefined : alignmentSetting}
                onClick={() => callback(role.id, alignmentSetting === "Default" ? getExpectedAlignment(role) : alignmentSetting)}
            />
        ));
    })

    return items;
}

/**
 * Aggregate the token select menu's elements into the various teams
 * @param gameState The Game State
 * @param roles Global role data
 * @param elements A map mapping teams to the JSX elements made by the populateJSX function.
 * @param filterTeam An optional team to filter other teams out of.
 * @returns 
 */
function aggregateJSX(gameState: GameState, roles: RoleData, elements: MapLike<JSX.Element[]>, filterTeam?: Team): JSX.Element[] {
    const tokens = gameState.playerTokens;

    const teamCounts: MapLike<number> = {};
    tokens.forEach(token => {
        const team = roles[token.id].team;
        if (!(team in teamCounts)) teamCounts[team] = 0
        teamCounts[team] += 1;
    });

    const visibleTeams = filterTeam ? [TEAM_DATA[filterTeam]] : Object.values(TEAM_DATA).filter(team => elements[team.id]?.length > 0);

    return visibleTeams.map<JSX.Element>(team => (
        <div key={team.id}>
            <div className="CharacterSelect__teamHeader" style={{ color: team.color }}>{team.header}</div><br />
            <div id="mutate_menu_townsfolk">
                {elements[team.id] ?? []}
            </div><br />
        </div>
    ));
}

export const alignmentSettings = ["Default", Alignment.Good, Alignment.Evil] as const;
type AlignmentSetting = (typeof alignmentSettings)[number];
export const homebrewSettings = ["All", "Vanilla", "Homebrew"] as const;
type HomebrewSetting = (typeof homebrewSettings)[number];

/**
 * The character selection section of the Side Menu. 
 * Stores all characters, the teams they are under, and handles their creation
 * if the Storyteller clicks on any of them. 
 * @returns Relevant JSX
 */
export default function CharacterSelect() {
    const { gameState, appState, setAppState, roles } = useContext(GameContext) as GameContextType;

    const [alignment, setAlignment] = useState<number>(0);
    const [homebrew, setHomebrew] = useState<number>(0);

    if (appState.characterSelect === undefined) {
        return <></> // TODO: this should be assumed but needs to reset on click
    }
    const onSelect = appState.characterSelect.callback!;
    const selectType = appState.characterSelect.type;
    const team = appState.characterSelect.team;

    function closeMenu(selection?: string, alignment?: Alignment) {
        if (selection !== undefined) onSelect(selection, alignment!); // TODO: make this null assertion type safe
        setAppState(oldState => {
            return {
                ...oldState,
                characterSelect: undefined
            }
        });
    }

    function toggleScriptType() {
        setAppState(oldState => {
            return {
                ...oldState,
                characterSelect: {
                    ...oldState.characterSelect!, // TODO: find better way to use null assertion here
                    type: oldState.characterSelect!.type === "script" ? "offscript" : "script"
                }
            }
        });
    }

    const roleJSX = populateJSX(gameState, roles, closeMenu, selectType, alignmentSettings[alignment], homebrewSettings[homebrew]);
    const sectionJSX = aggregateJSX(gameState, roles, roleJSX, team);


    return (
        <div className="CharacterSelect__container" onClick={() => closeMenu()}>
            <div className="CharacterSelect__background">
                <div className="CharacterSelect__content">
                    <div className="CharacterSelect__buttons">
                        <div className="CharacterSelect__button" onClick={(e) => { e.stopPropagation(); setAlignment(i => (i + 1) % 3); }}>
                            <span>{alignmentSettings[alignment]}</span>
                        </div>
                        <div className="CharacterSelect__button" onClick={(e) => { e.stopPropagation(); toggleScriptType(); }}>
                            <span>{appState.characterSelect!.type === "script" ? "Script" : "Offscript"}</span>
                        </div>
                        <div className="CharacterSelect__button" onClick={(e) => { e.stopPropagation(); setHomebrew(i => (i + 1) % 3); }}>
                            <span>{homebrewSettings[homebrew]}</span>
                        </div>
                    </div>
                    <div className="CharacterSelect__box">
                        {sectionJSX}
                    </div>
                </div>
            </div>
        </div>
    )
}
