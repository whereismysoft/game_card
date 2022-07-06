import shuffle from "knuth-shuffle-seeded"

import Cards from "@src/cards.json";

const {suits, cards} = Cards as {suits: string[], cards: string[]};

export function getCards(): Card[] {
    const cardsStack = cards.reduce((arr: Card[], currentCard) => {
        const AllSuitsCard: Card[] = suits.map( suit => ({ suit, number: currentCard }))
        return [...arr, ...AllSuitsCard]
    }, [])

    return shuffle(cardsStack)
}