import { useContext, useEffect, useMemo, useState } from "react";
import "./BagDraw.css";
import { GameContext, GameContextType } from "../data/gameState";
import { TokenData } from "../types/TokenData";
import { Team } from "../types/Team";
import { Visibility } from "../types/Visibility";
import { RoleData } from "../types/Role";
import SampleToken from "../token/SampleToken";
import { spreadTokens } from "../sideMenu/SideButtons";

function canShuffle(token: TokenData, roles: RoleData): boolean {
    return token.visibility === Visibility.Assigned && ![Team.Traveller, Team.Fabled, Team.Loric].includes(roles[token.id].team);
}

function shuffle<T>(arr: T[]): T[] {
    return arr
        .map(val => ({ val, rank: Math.random() }))
        .sort((a, b) => a.rank - b.rank)
        .map(({ val }) => val);
}

export default function Card() {
    const {gameState, setGameState, appState, setAppState, roles} = useContext(GameContext) as GameContextType;
    const [tokenList, setTokenList] = useState<[TokenData, string | null][]>(
        shuffle(gameState.playerTokens.filter(token => canShuffle(token, roles))).map(x => [x, null])
    );
    const [tokenOrder, setTokenOrder] = useState<number[]>([]);
    const [tokenIndex, setTokenIndex] = useState<number | null>(null);
    const [name, setName] = useState<string>("");
    const [storyteller, setStoryteller] = useState(true);

    const amountComplete = useMemo(() => tokenList.reduce((a, [_, name]) => a + (name !== null ? 1 : 0), 0), [tokenList]);
    const tokensComplete = useMemo(() => tokenList.length === amountComplete, [tokenList, amountComplete]);
    const currentRole = useMemo(() => tokenIndex === null ? null : tokenList[tokenIndex][0], [tokenList, tokenIndex]);

    useEffect(() => {
        if (!tokensComplete) return;
        if (storyteller) return;
        // finish distribution of tokens
        const tokenBreakPoint = Math.floor((tokenList.length - 1) * 1 / 4);
        const reorderedList = tokenOrder.map(order => tokenList[order]);
        const finalList = [...reorderedList.slice(tokenBreakPoint), ...reorderedList.slice(0, tokenBreakPoint)];
        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: spreadTokens(gameState.tokenSize, [
                    ...oldState.playerTokens.filter(t => !canShuffle(t, roles)),
                    ...finalList.map(t => ({ ...t[0], name: t[1] as string, position: { left: 0, top: 0 } }))
                ], roles)
            }
        });
        setAppState(oldState => ({ ...oldState, drawingBag: false }));
        // TODO: method of sorting may be unstable, may have to find another way to sort this properly
    }, [tokenList, tokenOrder, tokensComplete, gameState.playerTokens, roles, setAppState, setGameState, gameState.tokenSize, storyteller]);

    if (!appState.drawingBag) return <></>;
    if (tokensComplete && !storyteller) return <></>;

    function handleClick() {
        // if (!name) return; // name required
        setTokenList(oldList => oldList.map((token, index) => index === tokenIndex ? [token[0], name] : token));
        setTokenOrder(oldOrder => [tokenIndex!, ...oldOrder]);
        setTokenIndex(null);
        setName("");
    }

    function handleTokenClick(index: number) {
        setTokenIndex(index);
    }

    function closeMenu() {
        setAppState(oldState => ({ ...oldState, drawingBag: false }));
    }

    if (tokensComplete) return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div 
            className="Card__closeButton General__backgroundImage" 
            onClick={closeMenu}
            role="button"
            style={{backgroundImage: 'url("assets/close.png")'}}
        ></div>
        <div className="Card__content">
            <span className="Card__title">Hand the device to the Storyteller.</span>
            <div className="CharacterSelect__button BagDraw__button" onClick={() => setStoryteller(false)}>
                <span>All done!</span>
            </div>
        </div>
    </div>

    if (!currentRole) return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div 
            className="Card__closeButton General__backgroundImage" 
            onClick={closeMenu}
            role="button"
            style={{backgroundImage: 'url("assets/close.png")'}}
        ></div>
        <div className="Card__content">
            <div className="Card__iconsContainer BagDraw__tokensContainer">
                {tokenList.map(([_, name], index) =>
                    name ? <div className="Card__iconContainer BagDraw__tokenContainer" key={index}></div> :
                    <div className="Card__iconContainer BagDraw__tokenContainer" key={index}
                        style={{ backgroundImage: "url(assets/alive_token.png)" }} onClick={name ? () => {} : () => handleTokenClick(index)}>
                        <p className="Card__title BagDraw__subtitle">{index + 1}</p>
                    </div>)
                }
            </div>
        </div>
    </div>

    return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div 
            className="Card__closeButton General__backgroundImage" 
            onClick={closeMenu}
            role="button"
            style={{backgroundImage: 'url("assets/close.png")'}}
        ></div>
        <div className="Card__content">
            <form onSubmit={e => { e.preventDefault(); handleClick(); }}>
                <div className="Card__iconsContainer">
                    <div className="Card__iconContainer BagDraw__iconContainer">
                        <SampleToken id={currentRole.id} className="Card__icon General__backgroundImage" />
                    </div>
                </div>
                <div className="BagDraw__title">
                    <p className="Card__title">Name {amountComplete + 1}:</p>
                    <input
                        autoComplete="off"
                        type="text"
                        className="InfoPowers__nameInput BagDraw__nameInput"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="CharacterSelect__button BagDraw__button" onClick={handleClick}>
                    <span>{!name ? "Enter your name!" : "Next Player"}</span>
                </div>
            </form>
        </div>
    </div>
}