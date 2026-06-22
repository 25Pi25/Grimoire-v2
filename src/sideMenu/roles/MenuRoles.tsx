import { JSX, useCallback, useContext, useMemo, useRef, useState } from "react";
import { GameContext, GameContextType } from "../../data/gameState";
import { TEAM_DATA } from "../../data/roleData";
import { GameState } from "../../types/GameState";
import { Role, RoleData } from "../../types/Role";
import { isRole, RoleIdentifier } from "../../types/Script";
import { Viability } from "../../types/Viability";
import { Visibility } from "../../types/Visibility";
import MenuRole from "./MenuRole";
import { MapLike } from "typescript";
import TeamSection from "./TeamSection";
import { Team } from "../../types/Team";
import { sortAlphabetical, sortSao } from "../../data/roleSorting";
import { playerCounts, roleDistribution } from "../../data/teamData";
import { Alignment, getExpectedAlignment } from "../../types/Alignment";
import MenuRoleOffscript from "./MenuRoleOffscript";

/**
 * Construct the side menu's individual items using the given script.
 * @param script The script in use. 
 * @param createCallback What the individual menu items should do to create a new token
 * @returns 
 */
function populateJSX(
    gameState: GameState, 
    roles: RoleData,
    searchFilter: string,
    sortMethod: (r1: Role, r2: Role) => number,
    createCallback: (id: string, alignment: Alignment) => void
): MapLike<JSX.Element[]> {

    const script = gameState.script.slice(1) as (RoleIdentifier | Role)[];
    const tokens = gameState.playerTokens;

    const items: MapLike<JSX.Element[]> = {}
    Object.keys(TEAM_DATA).forEach(type => items[type] = []);

    const characterDict: MapLike<number> = {}

    tokens.forEach(token => {
        if (!(token.id in characterDict)) {
            characterDict[token.id] = 0;
        }
        characterDict[token.id] += 1
    })

    script.map(r => {
            if (!isRole(r, roles)) return roles[r.id];
            return r as Role;
        })
        .sort(sortMethod)
        .forEach(role => {
            if (!(role.team in items)) return;
            if (!role.name.replace(/\W/g, "").toLowerCase().includes(searchFilter.replace(/\W/g, "").toLowerCase())) return;
            const amount = characterDict[role.id] ?? 0;
            items[role.team].push((
                <MenuRole role={role} amount={amount} key={role.id} callback={createCallback} />
            ));
        })

    return items;
}

function aggregateJSX(
    gameState: GameState,
    roles: RoleData,
    elements: MapLike<JSX.Element[]>,
    callback: (id: string) => void
): JSX.Element[] {
    const actual = playerCounts(gameState.playerTokens, roles);
    const [townsfolk, outsiders, minions] = roleDistribution(gameState.playerCount);

    const expected = {
        [Team.Townsfolk]: townsfolk,
        [Team.Outsider]: outsiders,
        [Team.Minion]: minions,
        [Team.Demon]: 1,
        [Team.Traveller]: undefined,
        [Team.Fabled]: undefined,
        [Team.Loric]: undefined,
    }

    return Object.values(Team)
        .map<JSX.Element>((team: Team) => (
            <TeamSection key={team} teamId={team} expectedCount={expected[team]} actualCount={actual[team]}>
                {elements[team] ?? []}
                <MenuRoleOffscript teamId={team} callback={callback} />
            </TeamSection>
        ));
}

export default function MenuRoles() {

    const {gameState, setGameState, roles} = useContext(GameContext) as GameContextType;

    const [usingSao, setUsingSao] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const searchRef = useRef<any>(null);

    const sortMethod = usingSao ? sortSao : sortAlphabetical;

    function updateSearch() {
        if (searchRef.current === null) return;
        setSearchTerm(searchRef.current.value)
    }

    const createToken = useCallback((id: string, alignment?: Alignment) => {
        setGameState(prevState => {
            const newToken = {
                id: id,
                uid: Date.now(),
                name: "",
                visibility: Visibility.Assigned,
                viability: Viability.Alive,
                alignment: alignment ?? getExpectedAlignment(roles[id]),
                position: {
                    top: window.innerHeight / 2 - 75,
                    left: window.innerWidth / 2 - 75,
                },
            };

            return {
                ...prevState,
                playerTokens: [...prevState.playerTokens, newToken],
            };
        });
    }, [setGameState, roles]);

    const roleJSX = useMemo(
            () => populateJSX(gameState, roles, searchTerm, sortMethod, createToken),
            [gameState, roles, searchTerm, sortMethod, createToken]
    )
    const sectionJSX = aggregateJSX(gameState, roles, roleJSX, createToken);
    
    return (
        <>
            <input 
                ref={searchRef}
                className="MenuRoles__search"
                type="text" 
                autoComplete="off" 
                placeholder="Search For a Role" 
                onChange={updateSearch} 
            />
            <div 
                className="MenuRoles__sort" 
                style={{backgroundImage: 'url("assets/backgrounds/purple_swirls.webp")'}}
                onClick={() => setUsingSao(!usingSao)}
                role="button"
            >{"Sort order: " + (usingSao ? "SAO" : "A-Z")}</div>
            {sectionJSX}
        </>
    );
}
