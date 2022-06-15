import Cards from "@src/cards.json";

type Card = {
    suit: string,
    card: string
}

const {suits, cards} = Cards as {suits: string[], cards: string[]};

export function getCards(): Card[] {
    return cards.reduce((arr: Card[], currentCard) => {
        const AllSuitsCard: Card[] = suits.map( suit => ({ suit, card: currentCard }))
        return [...arr, ...AllSuitsCard]
    }, [])
}