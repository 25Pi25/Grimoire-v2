import { JSX, useContext } from "react";
import "./CharacterSelect.css"
import { GameContext, GameContextType } from "../data/gameState";
import { TEAM_DATA } from "../data/roleData";
import { GameState } from "../types/GameState";
import { Role, RoleData } from "../types/Role";
import { isRole, RoleIdentifier } from "../types/Script";
import SampleToken from "../token/SampleToken";
import { MapLike } from "typescript";
import { Team } from "../types/Team";

/**
 * Construct the token select menu's individual items using the given script.
 * @param gameState The Game State
 * @param roles Global role data
 * @param callback What the individual menu items should do to create a new token
 * @returns 
 */
function populateJSX(gameState: GameState, roles: RoleData, callback: (id: string) => void, selectType: "script" | "offscript"): MapLike<JSX.Element[]> {
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
        items[role.team].push((
            <SampleToken
                id={role.id}
                key={role.id}
                className={"CharacterSelect__token General__backgroundImage"}
                onClick={() => callback(role.id)}
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

    const visibleTeams = filterTeam ? [TEAM_DATA[filterTeam]]: Object.values(TEAM_DATA).filter(team => elements[team.id]?.length > 0);

    return visibleTeams.map<JSX.Element>(team => (
        <div key={team.id}>
            <div className="CharacterSelect__teamHeader" style={{ color: team.color }}>{team.header}</div><br />
            <div id="mutate_menu_townsfolk">
                {elements[team.id] ?? []}
            </div><br />
        </div>
    ));
}

/**
 * The character selection section of the Side Menu. 
 * Stores all characters, the teams they are under, and handles their creation
 * if the Storyteller clicks on any of them. 
 * @returns Relevant JSX
 */
export default function CharacterSelect() {
    const { gameState, appState, setAppState, roles } = useContext(GameContext) as GameContextType;
    
    if (appState.characterSelect === undefined) {
        return <></>
    }
    const onSelect = appState.characterSelect.callback!;
    const selectType = appState.characterSelect.type;
    const team = appState.characterSelect.team;

    function closeMenu(selection?: string) {
        if (selection !== undefined) onSelect(selection);
        setAppState(oldState => {
            return {
                ...oldState,
                characterSelect: undefined
            }
        });
    }

    const roleJSX = populateJSX(gameState, roles, closeMenu, selectType);
    const sectionJSX = aggregateJSX(gameState, roles, roleJSX, team);


    return (
        <div className="CharacterSelect__container" onClick={() => closeMenu()} >
            <div className="CharacterSelect__background">
                <div className="CharacterSelect__content">
                    {sectionJSX}
                </div>
            </div>
        </div>
    )
}
