type TokenNameType = {name: string}

/**
 * A SVG graphic showing the name of a role on the token.
 * @param name The name to display.
 * @returns 
 */
export default function TokenName({name}: TokenNameType) {
    return (
        <svg viewBox="0 0 150 150" className="TokenName__graphic">
            <path d="M 13 75 C 13 150, 138 150, 138 75" id="curve" fill="transparent" />
            <text width="150" x="62.5%" y="130" textAnchor="middle" className="TokenName__text">
                <textPath href="#curve" className="TokenName__textPath" style={{fontSize: '22px'}}>
                    {name.toUpperCase()}
                </textPath>
            </text>
        </svg>
    )
}
