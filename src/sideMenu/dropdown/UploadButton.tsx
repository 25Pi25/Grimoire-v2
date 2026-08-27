import { useContext, useRef } from "react"
import { isValidGamestate, updateGameStateVersion } from "../../types/GameState";
import { GameContext, GameContextType } from "../../data/gameState";
import { appendCustomRoles } from "../../data/roleData";
import { commitNewScript } from "../../data/scriptData";


export default function UploadButton() {
    const { setGameState, roles, setRoles, scripts, setScripts } = useContext(GameContext) as GameContextType;

    const inputRef = useRef<any>(null);

    function clickUpload() {
        if (inputRef.current === null) return;

        inputRef.current.click();
    }

    async function upload() {
        if (inputRef.current === null) return;

        const raw = await inputRef.current.files[0].text();
        const state = JSON.parse(raw);

        
        if (!updateGameStateVersion(state) || !isValidGamestate(state)) {
            window.alert("Error importing state. We do not support script migration from grimoire v1 yet, sorry.");
            return;
        }

        if (state.script[0].name === "Gang's All Here") {
            state.script[0].name = "Gang's All Here (Outdated)";
        }

        appendCustomRoles(state.script, roles, setRoles);
        commitNewScript(state.script, scripts, setScripts);
        setGameState(state);
    }

    return (
        <>
            <div
                onClick={clickUpload}
                role="button"
                className="SideDropdown__button General__backgroundImage"
                style={{ backgroundColor: "#888888", backgroundImage: "url(assets/upload.svg)" }}
            />
            <input
                ref={inputRef}
                type="file"
                id="game_state_upload"
                accept=".json"
                onChange={upload}
                hidden
            />
        </>
    )
}