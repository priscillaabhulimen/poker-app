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
                return Array.from({ length: 2 }, (_, i) => createEmptyCard(i))
            }

            return this.cards.map(card => ({
                ...card,
                isPlaceholder: false
            }))

        },

        displayedCommunityCards() {
            if (this.communityCards.length == 0) {
                return Array.from({ length: 2 }, (_, i) => createEmptyCard(i))
            }

            return this.communityCards.map(card => ({
                ...card,
                isPlaceholder: false
            }))

        },

        currentHand() {
            let hand = evaluatePokerHand(this.displayedCards).hand;

            if (hand) {
                return hand;
            }

            return '';
        },

        buttonText() {
            return "Get cards"
        }
    },
    methods: {
        async getNewDeck() {
            try {
                this.loading = true;
                this.deckId = '';
                this.cards = [];
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

        async revealCardsSequentially(cards) {
            await new Promise(resolve => setTimeout(resolve, 70));
            for (let i = 0; i < cards.length; i++) {
                this.cards[i].isFlipped = false;
                await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
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

        handleButtonClick() {
            this.getNewDeck();
        }
    },
}
</script>

<template>
    <div class="table-wrapper flex flex-col justify-center items-center px-[1rem] py-8">
        <p v-if="currentHand !== ''" class="pb-6 align-middle">
            Highest hand:
            <span class="text-2xl italic">{{ currentHand }}</span>
        </p>
        <div class="glass-table lg:flex-nowrap ">
            <Card v-for="card in displayedPrivateCards" :img="card.image" :isFlipped="card.isFlipped || !card.image"
                :size="md" :canFlip="false" />

        </div>
    </div>
    <p class="btn-glass" @click="handleButtonClick()">
        {{ buttonText }}
    </p>
</template>