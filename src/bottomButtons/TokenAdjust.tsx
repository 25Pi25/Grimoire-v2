import { useContext } from "react"
import { GameContext, GameContextType } from "../data/gameState";


/**
 * A button interface to change the size of the tokens. By default
 * all tokens start at 140px, but can be increased or decreased.
 * 
 * @returns the JSX of a button to do the above. 
 */
export default function TokenAdjust() {
    const { appState, setAppState, setGameState } = useContext(GameContext) as GameContextType;

    function setTokenSize(size: number) {
        size = Math.max(50, Math.min(size, 200));
        const delta = size - appState.tokenSize;
        setAppState(oldState => {
            return {
                ...oldState,
                tokenSize: size
            }
        });
        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: oldState.playerTokens.map(token => {
                    return {
                        ...token,
                        position: {
                            left: token.position.left - delta / 2,
                            top: token.position.top - delta / 2
                        }
                    }
                })
            }
        })
    }

    if (!appState.tokenDataVisible) return <></>;

    return (
        <>
            <div onClick={() => setTokenSize(appState.tokenSize + 5)}
                role="button"
                className="BottomButtons__button BottomButtons__tokenAdjust"
                style={{ backgroundImage: 'url("/assets/plus.svg")', backgroundSize: '50%', backgroundColor: 'grey', bottom: '80px' }}>
            </div>
            <div onClick={() => setTokenSize(140)}
                role="button"
                className="BottomButtons__button BottomButtons__tokenAdjust"
                style={{ backgroundImage: 'url("/assets/restart.svg")', backgroundColor: 'grey', bottom: '45px' }}>
            </div>
            <div onClick={() => setTokenSize(appState.tokenSize - 5)}
                role="button"
                className="BottomButtons__button BottomButtons__tokenAdjust"
                style={{ backgroundImage: 'url("/assets/minus.svg")', backgroundSize: '50%', backgroundColor: 'grey' }}>
            </div>
        </>
    )
}
