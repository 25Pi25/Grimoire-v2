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

export default function BagDraw() {
    const { gameState, setGameState, appState, setAppState, roles } = useContext(GameContext) as GameContextType;
    const [tokenMap, setTokenMap] = useState<[TokenData, TokenData | null][]>(
        shuffle(gameState.playerTokens.filter(token => canShuffle(token, roles))).map(x => [x, null]));
    const [names, setNames] = useState<TokenData[]>(gameState.playerTokens.filter(token => canShuffle(token, roles)));
    const [tokenIndex, setTokenIndex] = useState<number | null>(null);
    const [name, setName] = useState<TokenData | null>(null);
    const [storyteller, setStoryteller] = useState(true);
    const [cancelPrompt, setCancelPrompt] = useState(false);

    const amountComplete = useMemo(() => tokenMap.reduce((a, [_, out]) => a + (out !== null ? 1 : 0), 0), [tokenMap]);
    const tokensComplete = useMemo(() => tokenMap.length === amountComplete, [tokenMap, amountComplete]);
    const currentRole = useMemo(() => tokenIndex === null ? null : tokenMap[tokenIndex][0], [tokenMap, tokenIndex]);

    useEffect(() => {
        if (!tokensComplete) return;
        if (storyteller) return;
        console.log(tokenMap)
        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: [
                    ...oldState.playerTokens.filter(t => !canShuffle(t, roles)),
                    ...tokenMap.map(([old, newToken]) => ({ ...newToken!, alignment: old.alignment, id: old.id, viability: old.viability }))
                ]
            }
        });
        setAppState(oldState => ({ ...oldState, drawingBag: false }));
        // TODO: method of sorting may be unstable, may have to find another way to sort this properly
    }, [tokenMap, tokensComplete, gameState.playerTokens, roles, setAppState, setGameState, gameState.tokenSize, storyteller]);

    if (!appState.drawingBag) return <></>;

    function closeMenu() {
        setAppState(oldState => ({ ...oldState, drawingBag: false }));
    }

    if (cancelPrompt) return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div className="Card__content">
            <span className="Card__title">Do you want to quit bag drawing?</span>
            <div className="CharacterSelect__button BagDraw__button" onClick={closeMenu}>
                <span>Yes</span>
            </div>
            <div className="CharacterSelect__button BagDraw__button" onClick={() => setCancelPrompt(false)}>
                <span>No</span>
            </div>
        </div>
    </div>

    if (tokensComplete && !storyteller) return <></>;

    function handleClick() {
        // if (!name) return; // name required
        setTokenMap(oldMap => oldMap.map((token, index) => index === tokenIndex ? [token[0], name] : token));
        setTokenIndex(null);
        setName(null);
    }

    function handleTokenClick(index: number) {
        setTokenIndex(index);
    }

    if (tokensComplete) return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div
            className="Card__closeButton General__backgroundImage"
            onClick={() => setCancelPrompt(true)}
            role="button"
            style={{ backgroundImage: 'url("assets/close.png")' }}
        ></div>
        <div className="Card__content">
            <span className="Card__title">Hand the device to the Storyteller.</span>
            <div className="CharacterSelect__button BagDraw__button" onClick={() => setStoryteller(false)}>
                <span>All done!</span>
            </div>
        </div>
    </div>

    if (name === null) return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div
            className="Card__closeButton BagDraw__closeButton General__backgroundImage"
            onClick={() => setCancelPrompt(true)}
            role="button"
            style={{ backgroundImage: 'url("assets/close.png")' }}
        ></div>
        <div className="Card__content BagDraw__content">
            <div className="Card__iconsContainer BagDraw__namesContainer">
                {names.map((name, index) =>
                    <div className="Card__iconContainer BagDraw__nameContainer" key={index}
                        onClick={() => { setName(name); setNames(oldState => oldState.filter((_, index2) => index !== index2)) }}>
                        <p className="Card__title BagDraw__subtitle BagDraw__name" style={{ color: 'white' }}>{name.name}</p>
                    </div>)}
            </div>
        </div>
    </div>

    if (!currentRole) return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div
            className="Card__closeButton BagDraw__closeButton General__backgroundImage"
            onClick={() => setCancelPrompt(true)}
            role="button"
            style={{ backgroundImage: 'url("assets/close.png")' }}
        ></div>
        <div className="Card__content BagDraw__content">
            <div className="Card__iconsContainer BagDraw__tokensContainer">
                {tokenMap.map(([_, name], index) =>
                    name !== null ? <div className="Card__iconContainer BagDraw__tokenContainer" key={index}></div> :
                        <div className="Card__iconContainer BagDraw__tokenContainer" key={index}
                            style={{ backgroundImage: "url(assets/alive_token.png)" }} onClick={name ? () => { } : () => handleTokenClick(index)}>
                            <p className="Card__title BagDraw__subtitle">{index + 1}</p>
                        </div>)}
            </div>
        </div>
    </div>

    return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div
            className="Card__closeButton General__backgroundImage"
            onClick={() => setCancelPrompt(true)}
            role="button"
            style={{ backgroundImage: 'url("assets/close.png")' }}
        ></div>
        <div className="Card__content">
            <form onSubmit={e => { e.preventDefault(); handleClick(); }}>
                <div className="Card__iconsContainer">
                    <div className="Card__iconContainer BagDraw__iconContainer">
                        <SampleToken id={currentRole.id} className="Card__icon General__backgroundImage" />
                    </div>
                </div>
                <div className="CharacterSelect__button BagDraw__button" onClick={handleClick}>
                    <span>Next Player</span>
                </div>
            </form>
        </div>
    </div>
}