import { useContext } from "react";
import { GameContext, GameContextType } from "../../data/gameState";
import { RoleData, Card } from "../../types/Role"
import { distanceSquared, getToken } from "../../util";
import { GameState } from "../../types/GameState";
import { ActiveCard, AppState } from "../../data/appState";
import { Visibility } from "../../types/Visibility";
import { Alignment } from "../../types/Alignment";


type CardItemType = {
    card: Card;
}

/**
 * Fill out additional properties required for this card 
 * (default tokens, some text), based on what card was selected.
 * @param card The card being selected
 * @param appState The state of the app.
 * @param gameState The game state
 * @param roles A list of all known roles.
 * @returns A new card object with more details on what should be displayed.
 */
function completeCard(card: Card, appState: AppState, gameState: GameState, roles: RoleData): ActiveCard {
    const newCard = {...card};
    const token = getToken(appState.activeTokenUid, gameState)!;

    if (card.listTitle === "Your Ability Text") {
        newCard.title += roles[token.id].ability
    }

    const shownIcons: ([string, Alignment | undefined] | undefined)[] = [];
    if (card.autofill === "_bluff") {
        const bluffs = gameState.playerTokens.filter(token => token.visibility === Visibility.Bluff);
        const nearestBluff = token// bluffs.sort((a,b) => distanceSquared(a.position, token.position) - distanceSquared(b.position, token.position))[0];
        bluffs
            .sort((a,b) => distanceSquared(a.position, nearestBluff.position) - distanceSquared(b.position, nearestBluff.position))
            .map(token => token.id)
            .slice(0,3)
            .forEach(id => shownIcons.push([id, undefined]));
    }

    for (let i = shownIcons.length; i < (card.icons ?? 0); i++) {
        let iconId: string | undefined;
        let iconAlignment: Alignment | undefined;
        if (i === 0 && card.autofill !== undefined && !card.autofill!.startsWith("_")) {
            iconId = card.autofill;
        }
        if (card.autofill === "_self") {
            iconId = token.id;
        }
        if (card.autofill === "_selfAlignment") {
            iconId = token.id;
            iconAlignment = token.alignment;
        }
        shownIcons.push(iconId === undefined ? iconId : [iconId, iconAlignment]);
        // TODO: add alignment to shown icons and cards
    }

    return {
        ...newCard,
        shownIcons
    }
}

/**
 * A single card in the list of cards. 
 * @param card The card being represented. 
 * @returns 
 */
export default function CardItem({ card }: CardItemType) {
    const { gameState, appState, setAppState, roles } = useContext(GameContext) as GameContextType;

    function showThisCard() {
        setAppState(oldState => {
            return {
                ...oldState,
                activeCard: completeCard(card, appState, gameState, roles),
            }
        });
    }

    return (
        <div
            className="InfoCards__item"
            onClick={showThisCard}
            role="button"
            style={{ backgroundImage: `url(assets/cards/card-${card.color}.png)` }}
        >
            <span className="InfoCards__itemTitle">{card.listTitle}</span>
        </div>
    )
}