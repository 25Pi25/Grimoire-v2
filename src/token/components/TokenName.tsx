type TokenNameType = {name: string}

/**
 * A SVG graphic showing the name of a role on the token.
 * @param name The name to display.
 * @returns 
 */
export default function TokenName({name}: TokenNameType) {
    return (
        <svg viewBox="0 0 140 140" className="TokenName__graphic">
            {/* TODO: path is duplicated in Reminder.tsx, make a circle path definition for both */}
            <path data-v-8b24badb="" d="M 70 70 m -42.4264 -42.4264 a 60 60 315 1 0 84.8528 84.8528 a 60 60 315 1 0 -84.8528 -84.8528" id="token-curve" fill="transparent"></path>
            <text width="140" x="100%" y="130" textAnchor="middle" className="TokenName__text">
                <textPath href="#token-curve" className="TokenName__textPath">
                    {name.toUpperCase()}
                </textPath>
            </text>
        </svg>
    )
}
