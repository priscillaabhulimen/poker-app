<script>
import Card from "../components/Card.vue"
import { createEmptyCard } from "../utils/card-factory.js";
import { evaluatePokerHand } from "../utils/evaluate-hand.js";

export default {
  name: "Basic",
  components: {
    Card,
  },
  data() {
    return {
      loading: false,
      error: '',
      cards: [],
      deckId: '',
      replaceCounter: 0,
      cardsToReplace: [],
    }
  },
  methods: {
    addToCardsForReplacement(card, index) {
      this.cardsToReplace.push({
        card: card,
        cardIndex: index,
      })
    },
    removeFromCardsForReplacement(card, index) {
      let toBeRemoved = {
        card: card,
        cardIndex: index,
      };

      if (this.cardsToReplace.includes(toBeRemoved)) {
        let c = this.cardsToReplace.find((e) => e.index == toBeRemoved.index);
        console.log(c);
      }
    },
    async getNewDeck() {
      try {
        this.loading = true;
        const deckRes = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        const deck = await deckRes.json()

        this.deckId = deck.deck_id;

        await this.getNewCard(5)
        this.loading = false;
      } catch (err) {
        console.error("Failed to fetch cards:", err)
        this.error = err;
      }
    },
    async getNewCard(count) {
      try {
        const cardRes = await fetch(
          `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${count}`,
        )
        const cards = await cardRes.json()

        if (this.cards.length === 0) {
          this.cards = cards.cards;
        } 

      } catch (err) {
        console.error("Failed to fetch cards:", err)
        this.error = err;
      }
    },
  },

  computed: {
    displayedCards() {
      if (this.cards.length == 0) {
        return Array.from({ length: 5 }, (_, i) => createEmptyCard(i))
      }

      return this.cards.map(card => ({
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
      if (this.cards.length > 0 && this.replaceCounter < 2) {
        return "Replace cards"
      }

      return "Get cards";
    }
  }
}
</script>

<template>
  <section>
    <h1 class="m-auto text-center text-6xl py-12">Let's Play</h1>
    <div class="table-wrapper flex justify-center px-[1rem] py-8">
      <div class="glass-table lg:flex-nowrap ">
        <Card v-for="(card, index) in displayedCards" :img="card.image"
          @card-flipped="addToCardsForReplacement(card, index)"
          @card-unflipped="removeFromCardsForReplacement(card, index)" class="shrink min-w-[100px]" />

        <p class="py-4">
          {{ currentHand }}
        </p>
      </div>
    </div>
    <p class="
    mx-auto block
    w-[200px] py-[12px]
    text-white text-md text-md text-center
    rounded-md
    bg-white/8
    backdrop-blur-lg backdrop-saturate-150
    border border-white/25
    shadow-lg shadow-black/40
    hover:bg-white/20
    hover:border-white/40
    hover:shadow-black/60
    transition-all duration-200
    active:scale-95
  " @click="getNewDeck()">
      {{ buttonText }}
    </p>
  </section>

</template>