import { useContext } from "react";
import { GameContext, GameContextType } from "../../data/gameState";
import { getToken } from "../../util";
import { Alignment, getExpectedAlignment, getNextAlignment } from "../../types/Alignment";
import { TEAM_DATA } from "../../data/roleData";
import { Team } from "../../types/Team";

/**
 * Edit the token's visibility -- cycle between being assigned, a demon bluff, or hidden for administrative reasons. 
 * @returns 
 */
export default function AlignmentButton() {
    const {gameState, setGameState, appState, roles} = useContext(GameContext) as GameContextType;
    const token = getToken(appState.activeTokenUid, gameState)!;
    const index = gameState.playerTokens.indexOf(token);
    const role = roles[token.id];

    if (getExpectedAlignment(role) === Alignment.Storyteller) return <></>;

    let backgroundColor: string;
    let transform: string;
    switch (token.alignment) {
        case Alignment.Evil:
            backgroundColor = TEAM_DATA[Team.Demon].color;
            transform = "rotate(180deg)";
            break;
        case Alignment.Good:
            backgroundColor = TEAM_DATA[Team.Townsfolk].color;
            transform = "rotate(0deg)";
            break;
        case Alignment.Traveller:
        default:
            backgroundColor = TEAM_DATA[Team.Traveller].color;
            transform = "rotate(90deg)";
    }    

    function cycleAlignment() {
        console.log(token.alignment, getNextAlignment(role, token))
        console.log(gameState.playerTokens)
        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: [
                    ...oldState.playerTokens.slice(0, index),
                    {
                        ...oldState.playerTokens[index],
                        alignment: getNextAlignment(role, token)
                    },
                    ...oldState.playerTokens.slice(index+1)
                ]
            };
        })
    }
    
    return (
        <div 
            onClick={cycleAlignment}
            role="button"
            className="InfoPowers__option" 
            style={{backgroundColor}}
        >
            <img className="AlignmentButton__image" style={{transform}} src="assets/thumbs-up.svg" alt="" draggable="false" />
        </div>
    )
}