import { useContext } from "react"
import { TokenData } from "../types/TokenData"
import { Viability } from "../types/Viability"
import { Visibility } from "../types/Visibility"
import Token from "./Token"
import { GameContext, GameContextType } from "../data/gameState"
import { Alignment, getExpectedAlignment } from "../types/Alignment"

type SampleTokenType = {
    id: string,
    alignment?: Alignment,
    name?: string,
    className?: string,
    onClick?: () => void,
}

export default function SampleToken({id, alignment, name, className, onClick}: SampleTokenType) {
    const { roles } = useContext(GameContext) as GameContextType;

    const dummyTokenInfo: TokenData = {
        id: id,
        uid: 0,
        name: name ?? "",
        visibility: Visibility.Assigned,
        viability: Viability.Alive,
        alignment: alignment ?? getExpectedAlignment(roles[id]),
        position: {left: 0, top: 0},
    };

    return (<Token token={dummyTokenInfo} className={className} onClick={onClick} title={true}></Token>)
}