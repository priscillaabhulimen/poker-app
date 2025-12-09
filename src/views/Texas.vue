<script>
import Card from "../components/Card.vue"
import { createEmptyCard } from "../utils/card-factory.js";
import { evaluatePokerHand } from "../utils/evaluate-hand.js";

export default {
    name: "Texas HoldEm",
    components: {
        Card,
    },
    data: () => {
        return {
            loading: false,
            error: '',
            cards: [],
            communityCards: [],
            deckId: '',
        }
    },
    computed: {
        displayedPrivateCards() {
            if (this.cards.length == 0) {
                return Array.from({ length: 2 }, (_, i) => {
                    let emptyCard = createEmptyCard(i);

                    return {
                        ...emptyCard,
                        size: 'md'
                    }
                })
            }

            return this.cards.map(card => ({
                ...card,
                isPlaceholder: false,
                size: 'md'
            }))

        },

        displayedCommunityCards() {
            let empty = Array.from({ length: 5 - this.communityCards.length }, (_, i) => {
                let emptyCard = createEmptyCard(i);

                return {
                    ...emptyCard,
                    size: 'sm'
                }
            })

            const nonEmpty = this.communityCards.map(card => ({
                ...card,
                isPlaceholder: false,
                size: 'sm'
            }));

            return [
                ...nonEmpty,
                ...empty
            ]

        },

        currentHand() {
            let hand = evaluatePokerHand([
                ...this.displayedPrivateCards,
                ...this.displayedCommunityCards,
            ]).hand;

            if (hand) {
                return hand;
            }

            return '';
        },

        buttonText() {
            if (this.cards.length === 0 && !this.loading) {
                return "Deal cards";
            } else if(this.communityCards.length === 5){
                return "Deal new cards";
            } else if (this.communityCards.length === 0) {
                return "Deal flop";
            } else if (this.communityCards.length === 3) {
                return "Deal turn";
            } else {
                return "Deal river";
            }
        }
    },
    methods: {
        async getNewDeck() {
            try {
                this.loading = true;
                this.deckId = '';
                this.cards = [];
                this.communityCards = [];
                const deckRes = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/");
                const deck = await deckRes.json();

                this.deckId = deck.deck_id;

                let c = await this.getNewCard(2);
                if (c) {
                    c = c.map((e) => {
                        return { ...e, isFlipped: true }
                    })
                    this.cards = c;
                    await this.revealCardsSequentially(c);
                }

                this.loading = false;
            } catch (err) {
                console.error("Failed to fetch cards:", err);
                this.error = err;
                this.loading = false;
            }
        },

        async revealCardsSequentially(cards, startingIndex = 0, isCommunity = false) {
            await new Promise(resolve => setTimeout(resolve, 70));

            console.log(startingIndex);
            console.log(isCommunity);

            for (let i = startingIndex; i < cards.length; i++) {
                if (!isCommunity) {
                    this.cards[i].isFlipped = false;
                } else {
                    this.communityCards[i].isFlipped = false;
                    console.log(this.communityCards[i]);
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        },

        async getNewCard(count) {
            try {
                const cardRes = await fetch(
                    `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${count}`
                );
                const cardsJson = await cardRes.json();

                return cardsJson.cards;

            } catch (err) {
                console.error("Failed to fetch cards:", err);
                this.error = err;
                this.loading = false;
            }
        },

        async getCommunityCards(count) {
            let c = await this.getNewCard(count);

            let startingIndex = this.communityCards.filter((e) => e.image !== null).length;

            if (c) {
                c = c.map(e => ({
                    ...e,
                    isFlipped: true,
                    size: 'sm'
                }));

                this.communityCards.push(...c); // append instead of replacing
                await this.revealCardsSequentially(this.communityCards, startingIndex, true);
            }
        },

        handleButtonClick() {
            if (this.communityCards.length < 5 && this.cards.length > 0) {
                this.getCommunityCards(this.communityCards.length >= 3 ? 1 : 3)
            } else {
                this.getNewDeck();
            }
        }
    },
}
</script>

<template>
    <div class="flex flex-col justify-center items-center px-[1rem] pb-4">
        <p class="pb-3 align-middle" :class="{ invisible: currentHand === '' }">
            Highest hand:
            <span class="text-2xl italic">{{ currentHand }}</span>
        </p>
        <div class="glass lg:flex-nowrap ">
            <div class="table">
                <Card v-for="card in displayedCommunityCards" :img="card.image"
                    :isFlipped="card.isFlipped || !card.image" :size="card.size" :canFlip="false" />
            </div>
            <p class="text-center">Community</p>
        </div>
        <div class="glass mt-10">
            <div class="table">
                <Card v-for="card in displayedPrivateCards" :img="card.image" :isFlipped="card.isFlipped || !card.image"
                    :size="card.size" :canFlip="false" />
            </div>
            <p class="text-center">Your Hand</p>
        </div>
    </div>
    <p class="btn-glass" @click="handleButtonClick">
        {{ buttonText }}
    </p>
</template>