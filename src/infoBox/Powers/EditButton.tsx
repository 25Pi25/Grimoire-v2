import { useContext } from "react";
import { GameContext, GameContextType } from "../../data/gameState";
import { getToken } from "../../util";

/**
 * The edit button. When clicked, opens the Mutate menu and lets the
 * Storyteller change the current token's role.
 * @returns 
 */
export default function EditButton() {
    const {gameState, setGameState, appState, setAppState} = useContext(GameContext) as GameContextType;

    const token = getToken(appState.activeTokenUid, gameState)!;
    const index = gameState.playerTokens.indexOf(token);

    function editCallback(id: string) {
        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: [
                    ...oldState.playerTokens.slice(0, index),
                    {
                        ...token,
                        id: id,
                    },
                    ...oldState.playerTokens.slice(index+1)
                ]
            }
        });
    }

    function edit() {
        setAppState(oldState => {
            return {
                ...oldState,
                characterSelect: {
                    type: "script",
                    callback: editCallback
                }
            }
        })
    }

    return (
        <div 
            className="InfoPowers__option" 
            style={{backgroundColor: "#00920C", backgroundImage: "url('assets/edit.png')"}}
            onClick={edit}
            role="button"
        ></div>
    )
}