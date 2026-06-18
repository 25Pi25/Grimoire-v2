import { useContext } from "react";
import { GameContext, GameContextType } from "../data/gameState";
import SampleToken from "../token/SampleToken";


export default function CardIcons() {
    const {appState, setAppState} = useContext(GameContext) as GameContextType;

    function addIcon() {
        setAppState(oldState => {
            return {
                ...oldState,
                activeCard: {
                    ...oldState.activeCard!,
                    shownIcons: [
                        ...oldState.activeCard!.shownIcons,
                        undefined
                    ]
                }
            }
        });
    }

    function selectCallback(id: string, index: number) {
        setAppState(oldState => {
            const oldIcons = oldState.activeCard!.shownIcons;
            return {
                ...oldState,
                activeCard: {
                    ...oldState.activeCard!,
                    shownIcons: [
                        ...oldIcons.slice(0,index),
                        id,
                        ...oldIcons.slice(index+1)
                    ]
                }
            }
        });
    }

    function changeIcon(index: number) {
        setAppState(oldState => {
            return {
                ...oldState,
                characterSelect: {
                    type: "script",
                    callback: (id) => selectCallback(id, index)
                }
            }
        });
    }

    const icons = appState.activeCard!.shownIcons;

    const iconJsx = icons.map((id, index) => {
        let token = <></>
        if (id !== undefined) token = <SampleToken id={id} className="Card__icon General__backgroundImage" />;
        return (
            <div key={index} className="Card__iconContainer" style={{backgroundImage:" url(assets/person_add.png)"}} onClick={() => changeIcon(index)}>
                {token}
            </div>
        )
    })

    let extraIcons = <></>;
    if (!appState.activeCard!.autofill === true) {
        extraIcons = 
            <div 
                className="Card__extraIconsButton" 
                style={{backgroundImage: "url(assets/person_add.png)"}}
                onClick={addIcon}
                role="button"
            />
    }

    return (
        <>
            <div className="Card__iconsContainer">
                {iconJsx}
            </div>
            <br />
            {extraIcons}
        </>
    )
}