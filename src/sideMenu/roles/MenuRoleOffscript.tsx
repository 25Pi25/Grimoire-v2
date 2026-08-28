import { useContext } from "react";
import { Team } from "../../types/Team";
import { GameContext, GameContextType } from "../../data/gameState";
import { Alignment } from "../../types/Alignment";

type MenuRoleOffscriptType = {
    teamId: Team,
    callback: (id: string, alignment: Alignment) => void
}

export default function MenuRoleOffscript({teamId, callback}: MenuRoleOffscriptType) {
    const { setAppState } = useContext(GameContext) as GameContextType;

    function onClick() {
        setAppState(oldState => {
            return {
                ...oldState,
                characterSelect: {
                    type: "offscript",
                    team: teamId,
                    callback
                }
            }
        });
    }

    const title = `(Add Offscript ${teamId[0].toUpperCase() + teamId.slice(1)})`;
    return (
        <div title={title} className="MenuRole__container" onClick={onClick} role="button">
            <label className="MenuRole__label">{title}</label>
            &nbsp;
            <hr style={{marginBlockEnd: "0em"}} />
        </div>
    )
}
