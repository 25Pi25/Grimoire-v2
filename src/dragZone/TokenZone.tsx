import { CSSProperties, useContext } from "react";
import { DraggableEvent, DraggableData } from "react-draggable";
import { GameContext, GameContextType } from "../data/gameState";
import DraggableToken from "../token/DraggableToken";
import { GameState } from "../types/GameState";
import { nextViability } from "../types/Viability";
import { isStorytellerToken } from "../data/teamData";

/**
 * Provides a div containing the "token Zone", a region where all role tokens exist. 
 * @returns 
 */
export default function TokenZone() {
    const { gameState, setGameState, appState, setAppState, roles, tokenZoneRef } = useContext(GameContext) as GameContextType;

    function handleDrag(_: DraggableEvent, ui: DraggableData, index: number) {
        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: [
                    ...oldState.playerTokens.slice(0, index),
                    {
                        ...oldState.playerTokens[index],
                        position: {
                            top: oldState.playerTokens[index].position.top + ui.deltaY,
                            left: oldState.playerTokens[index].position.left + ui.deltaX,
                        }
                    },
                    ...oldState.playerTokens.slice(index + 1)
                ]
            }
        });
    }

    function handleClick(e: any, index: number) {
        const token = gameState.playerTokens[index];
        e.preventDefault();
        e.stopPropagation();
        if (appState.tokenDataVisible) {
            setAppState(oldState => {
                return {
                    ...oldState,
                    activeTokenUid: token.uid,
                }
            });
            return;
        }

        if (isStorytellerToken(token, roles)) return;

        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: [
                    ...oldState.playerTokens.slice(0, index),
                    {
                        ...token!,
                        viability: nextViability(token.viability)
                    },
                    ...oldState.playerTokens.slice(index + 1)
                ]
            }
        })
    }

    function handleDrop(index: number) {
        setGameState(oldState => {
            const newState: GameState = { ...oldState };
            const oldToken = oldState.playerTokens[index];
            newState.playerTokens = [
                ...oldState.playerTokens.slice(0, index),
                ...oldState.playerTokens.slice(index + 1),
                oldToken
            ];
            return newState;
        });
    }

    const tokens = gameState.playerTokens.map((token, index) => (
        <DraggableToken
            key={token.uid}
            focused={appState.activeTokenUid === token.uid}
            dragEnabled={appState.draggingEnabled}
            isDataVisible={appState.tokenDataVisible}
            token={token}
            onDrag={(e, ui) => handleDrag(e, ui, index)}
            onDrop={() => handleDrop(index)}
            onClick={(e) => handleClick(e, index)}
        />
    ));

    const style = { "--token-size": `${appState.tokenSize}px`} as CSSProperties;

    return (
        <div ref={tokenZoneRef} className="DragZone__container" style={style}>
            {tokens}
        </div>
    )
}