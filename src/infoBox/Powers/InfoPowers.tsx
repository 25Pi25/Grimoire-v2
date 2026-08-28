import { InfoTabType } from "../InfoBox";
import SetName from "./SetName";
import DeleteButton from "./DeleteButton";
import ViabilityButton from "./ViabilityButton";
import VisibilityButton from "./VisibilityButton";
import EditButton from "./EditButton";
import AlignmentButton from "./AlignmentButton";

/**
 * The Powers tab -- where all mutations and changes to this token occur.
 * @param focused If this tab is focused
 * @param focusCallback the callback to focus this tab. 
 * @returns 
 */
export default function InfoPowers({focused, focusCallback}: InfoTabType) {

    return (
        <div 
            className={"InfoPowers__container InfoBox__tab" + (focused ? " InfoBox__focus" : "")} 
            // This is necessary to hide the content of the reminders tab.
            style={{backgroundImage: "url('assets/vines.png')"}}
        >
            <div 
                className="InfoBox__tabHeader InfoBox__tabHeaderGeneric" 
                style={{backgroundImage: "url('assets/yellow_swirls.webp')", backgroundPosition:"calc(50% + 140px)"}}
                onClick={focusCallback}
                role="button"
            >
                <img className="InfoBox__tabImage" src="assets/power.png" alt="" draggable="false" />
            </div>
            <div className="InfoPowers__content">
                <SetName></SetName>
                <div className="InfoPowers__optionsContainer">
                    <DeleteButton />
                    <ViabilityButton />
                    <VisibilityButton />
                    <AlignmentButton />
                    <EditButton />
                </div>
            </div>
        </div>
    )
}
