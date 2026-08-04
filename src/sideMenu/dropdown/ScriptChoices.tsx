import { useContext, useRef } from "react";
import { GameContext, GameContextType } from "../../data/gameState";
import { commitNewScript, deleteScriptByIndex, formatImportedScript, sanitizeName, SCRIPT_BACKGROUNDS, SCRIPT_COLORS, scriptIndexOf } from "../../data/scriptData";
import { isCompleteScript, reasonForScriptFailure, updateMeta } from "../../types/Script";
import { appendCustomRoles } from "../../data/roleData";

export default function ScriptChoices() {
    const { gameState, setGameState, setAppState, roles, setRoles, scripts, setScripts } = useContext(GameContext) as GameContextType;
    const selectRef = useRef<any>(null);
    const uploadRef = useRef<any>(null);

    const index = scriptIndexOf(gameState.script, scripts);
    
    const color = SCRIPT_COLORS[index] ?? SCRIPT_COLORS[5];
    const boxShadow = "0 0 10px " + color;
    const backgroundImage = SCRIPT_BACKGROUNDS[index] ?? SCRIPT_BACKGROUNDS[5];
    
    const defaultNames = scripts.map(script => sanitizeName(script));
    const optionJsx = defaultNames.map((name, index) => 
            <option className="SideDropdown__scriptOption" key={name + index.toString()} >{`${index+1}. ${name}`}</option>
    );
    
    function changeScript() {
        if (selectRef.current === null) return;
        
        setGameState(state => {
            return {
                ...state,
                script: scripts[selectRef.current.selectedIndex]
            };
        })
    }

    function deleteScript() {
        if (index < 6) return;
        function callback() {
            deleteScriptByIndex(index, setScripts);
            setGameState(state => {
                return {
                    ...state,
                    script: scripts[0]
                }
            });
        }

        setAppState(state => {
            return {
                ...state,
                dialog: {
                    message: "This will delete the selected script. You will need to upload it again. This will also clear the board. Are you sure you want to do this?",
                    allowCancel: true,
                    callback
                }
            }
        })
    }
    
    function openUploadDialog() {
        if (uploadRef.current === null) return;
        
        uploadRef.current.click();
    }

    async function uploadFile() {
        if (uploadRef.current === null) return;
        uploadScript(await uploadRef.current.files[0].text());
    }

    async function pasteScript() {
        let clipboardText = "";
        try {
            clipboardText = await navigator.clipboard.readText();
        } catch { }
        uploadScript(clipboardText);
    }
    
    function uploadScript(raw: string) {
        if (!raw) return;

        let script: any;
        try {
            script = JSON.parse(raw);
        } catch (e) {
            window.alert("Ya dun goofed!\nError parsing JSON. Is that actually a JSON file?");
            return;
        }

        script = formatImportedScript(script);
        
        if (!isCompleteScript(script, roles)) {
            console.error("Invalid Script:", script);
            window.alert("Ya dun goofed!\n" + reasonForScriptFailure(script, roles));
            return;
        }

        script = updateMeta(script, roles);
        
        appendCustomRoles(script, roles, setRoles);
        commitNewScript(script, scripts, setScripts);
        
        setGameState(state => {
            return {
                ...state,
                script
            };
        });
        
    }

    return (
        <>
            <span className="SideDropdown__scriptHeader">Current Script</span>
            <br />
            <div className="SideDropdown__scriptSelectContainer">
                <select
                    ref={selectRef}
                    className="SideDropdown__scriptSelect"
                    style={{ backgroundImage, boxShadow }}
                    value={`${index+1}. ${sanitizeName(gameState.script)}`}
                    onChange={changeScript}
                    >
                    {optionJsx}
                </select>
                <div 
                    className="SideDropdown__scriptDelete General__backgroundImage" 
                    style={{backgroundImage: "url(assets/delete.png)", backgroundColor: index < 6 ? "gray" : "red"}}
                    onClick={deleteScript}
                    role="button"
                />
            </div>
            <div style={{height: "15px"}}/>
            <div className='SideDropdown__labelList'>
                <label 
                    className="SideDropdown__uploadLabel" 
                    style={{backgroundImage: "url(assets/backgrounds/green_swirls.webp)"}}
                    onClick={openUploadDialog}
                    role="button"
                >  
                    Upload Script
                </label>
                <label 
                    className="SideDropdown__uploadLabel" 
                    style={{backgroundImage: "url(assets/backgrounds/green_swirls.webp)"}}
                    onClick={pasteScript}
                    role="button"
                >  
                    Paste Script
                </label>
            </div>
            <input ref={uploadRef} type="file" accept=".json" onChange={uploadFile} hidden />
            <hr />
        </>
    )
}