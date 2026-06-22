import { useContext, useEffect, useState } from "react";
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
    const { gameState, setGameState, appState, setAppState, roles } = useContext(GameContext) as GameContextType;
    const [tokenQueue, setTokenQueue] = useState<TokenData[]>(shuffle(gameState.playerTokens.filter(token => canShuffle(token, roles))));
    const [tokenDoneQueue, setTokenDoneQueue] = useState<[TokenData, string][]>([]);
    const [reveal, setReveal] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [storyteller, setStoryteller] = useState(true);

    useEffect(() => {
        if (tokenQueue.length) return;
        if (storyteller) return;
        // finish distribution of tokens
        const tokenBreakPoint = Math.floor((tokenDoneQueue.length - 1) * 1 / 4);
        const newQueue = [...tokenDoneQueue.slice(tokenBreakPoint), ...tokenDoneQueue.slice(0, tokenBreakPoint)];
        console.log(newQueue.map(x => x[1]))
        setGameState(oldState => {
            return {
                ...oldState,
                playerTokens: spreadTokens(appState.tokenSize, [
                    ...oldState.playerTokens.filter(t => !canShuffle(t, roles)),
                    ...newQueue.map(t => ({ ...t[0], name: t[1], position: { left: 0, top: 0 } }))
                ], roles)
            }
        });
        setAppState(oldState => ({ ...oldState, drawingBag: false }));
        // TODO: method of sorting may be unstable, may have to find another way to sort this properly
    }, [tokenQueue, tokenDoneQueue, gameState.playerTokens, roles, setAppState, setGameState, appState.tokenSize, storyteller]);

    if (!appState.drawingBag) return <></>;
    if (!tokenQueue[0] && !storyteller) return <></>;

    const currentRole = roles[tokenQueue[0]?.id];

    function handleClick() {
        if (!name) return;
        setReveal(r => !r);
        if (!reveal) return;
        setTokenQueue([...tokenQueue.slice(1)]);
        setTokenDoneQueue([[tokenQueue[0], name], ...tokenDoneQueue]);
        setName("");
    }



    if (tokenQueue.length) return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <div className="Card__content">
            <form onSubmit={e => { e.preventDefault(); handleClick(); }}>
                <div className="BagDraw__title">
                    <p className="Card__title">P{tokenDoneQueue.length + 1}'s Name:</p>
                    <input
                        autoComplete="off"
                        type="text"
                        className="InfoPowers__nameInput BagDraw__nameInput"
                        value={name}
                        onChange={e => setName(e.target.value)} // TODO: surely there's a better way to capture an input change
                    />
                </div>
                <div className="Card__iconsContainer">
                    <div className="Card__iconContainer" style={{ backgroundImage: " url(assets/question-mark.svg)" }}>
                        {reveal && <SampleToken id={currentRole.id} className="Card__icon General__backgroundImage" />}
                    </div>
                </div>
                <p className="Card__title BagDraw__subtitle">{reveal ? currentRole.ability : ""}</p>
                <div className="CharacterSelect__button BagDraw__button" onClick={handleClick}>
                    <span>{!name ? "Enter your name!" : reveal ? "Next Player" : "Reveal"}</span>
                </div>
            </form>
        </div>
    </div>

    return <div className="Card__container" style={{ backgroundImage: "url(assets/background-img2.webp)" }}>
        <form onSubmit={e => {e.preventDefault(); setStoryteller(false)}}>
            <div className="Card__content">
                <span className="Card__title">Hand the device to the Storyteller.</span>
                <div className="CharacterSelect__button BagDraw__button" onClick={() => setStoryteller(false)}>
                    <span>All done!</span>
                </div>
            </div>
        </form>
    </div>
}