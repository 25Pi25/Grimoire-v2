import './Token.css';
import TokenName from "./components/TokenName";
import { TokenData } from '../types/TokenData';
import Shroud from './components/Shroud';
import { Visibility } from '../types/Visibility';
import Shading from './components/Shading';
import VisibilityIndicator from './components/VisibilityIndicator';
import { useContext } from 'react';
import { GameContext, GameContextType } from '../data/gameState';
import { getImage } from '../types/Role';

type TokenType = {
    token: TokenData
    focused?: boolean
    className?: string,
    onClick?: () => void
}

/**
 * A draggable token representing a player in the game. 
 * @param id the Role id to go on this token.
 * @param top how far this token is from the top of the screen, in pixels.
 * @param left how far this token is from the left of the screen, in pixels.
 * @param onDrag a callback to handle this token being dragged around.
 * @param clickCallback a callback to handle this token being clicked. 
 * @param enabled Whether this token should be allowed to be dragged around.
 * @returns 
 */
export default function Token({ token, focused = false, className, onClick }: TokenType) {

    const { roles } = useContext(GameContext) as GameContextType;

    const role = roles[token.id];
    return (
        <div
            className={className}
            style={{
                backgroundImage: `url(/assets/token-DRfx6YVD.webp)`,
                backgroundSize: "113% auto",
                backgroundPosition: "50% 50%"
            }}
            onClick={() => onClick?.()}
        >
            <img className="Token__image General__backgroundImage" src={getImage(role, token)} alt={role.name} />
            <Shading token={token} focused={focused} className={className}></Shading>
            <TokenName name={role.name} />
            <Shroud token={token} />
            <VisibilityIndicator token={token}></VisibilityIndicator>
            <span className='Token__name'>{token.visibility === Visibility.Assigned ? token.name ?? "" : ""}</span>
        </div>
    );
}
