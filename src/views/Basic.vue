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
      replacementsLeft: 2,
      cardsToReplace: [],
    }
  },
  methods: {
    toggleCardForReplacement(card, index) {
      const exists = this.cardsToReplace.find(c => c.cardIndex === index);
      if (exists) {
        this.cardsToReplace = this.cardsToReplace.filter(c => c.cardIndex !== index);
        this.cards[index].isFlipped = false;
      } else {
        this.cardsToReplace.push({ card, cardIndex: index });
        this.cards[index].isFlipped = true;
      }
    },

    async revealCardsSequentially(cards) {
      await new Promise(resolve => setTimeout(resolve, 70));
      for (let i = 0; i < cards.length; i++) {
        this.cards[i].isFlipped = false;
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
      }
    },

    async replaceSelectedCards() {
      if (this.cardsToReplace.length === 0) return;

      try {
        this.loading = true;
        const count = this.cardsToReplace.length;

        const newCards = await this.getNewCard(count);

        this.cardsToReplace.forEach((item, i) => {
          this.cards[item.cardIndex] = newCards[i];
          this.cards[item.cardIndex].isFlipped = false;
        });

        this.cardsToReplace = [];
        this.loading = false;
      } catch (err) {
        console.error("Failed to replace cards:", err);
        this.error = err;
        this.loading = false;
      }
    },

    async handleButtonClick() {
      if (this.buttonDisabled) return;
      if (this.cards.length === 0 || this.replacementsLeft <= 0) {
        this.replacementsLeft = 2;
        await this.getNewDeck();
      } else {
        await this.replaceSelectedCards();
        this.replacementsLeft--;
      }
    },

    async getNewDeck() {
      try {
        this.loading = true;
        this.deckId = '';
        this.cards = [];
        const deckRes = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/");
        const deck = await deckRes.json();

        this.deckId = deck.deck_id;

        let c = await this.getNewCard(5);
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
  },

  computed: {
    displayedCards() {
      if (this.cards.length == 0) {
        return Array.from({ length: 5 }, (_, i) => createEmptyCard(i))
      }

      return this.cards.map(card => ({
        ...card,
        isPlaceholder: false,
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
      if (this.cards.length > 0) {
        if(this.replacementsLeft > 0) return "Redraw cards";

        return "Draw new cards";
      }

      return "Draw cards";
    },

    buttonDisabled() {
      return this.cards.length > 0 && this.cardsToReplace.length === 0 && this.replacementsLeft > 0;
    },

    canFlip(card) {
      return this.replacementsLeft > 0;
    }
  }
}
</script>

<template>
  <section>
    <div class="table-wrapper flex flex-col justify-center items-center px-[1rem] pt-8 pb-2">
      <p :class="{ invisible: currentHand === '' }" class="pb-6">
        Highest hand:
        <span class="text-2xl italic">{{ currentHand }}</span>
      </p>
      <div class="glass table lg:flex-nowrap ">
        <Card v-for="(card, index) in displayedCards" :img="card.image" :isFlipped="card.isFlipped || !card.image"
          :canFlip="canFlip" @card-flipped="toggleCardForReplacement(card, index)" />

      </div>

      <p :class="{ invisible: cards.length <= 0 }" class="m-auto pt-8"> You have <span class="text-2xl">{{ replacementsLeft
          }}</span> redraws left</p>

      <p :class="{ invisible: cards.length <= 0 || replacementsLeft <= 0 }" class="m-auto pt-2 pb-4 text-sm">Click on the
        cards to select and replace them</p>


    </div>

    <p class="btn-glass" :class="{ disabled: buttonDisabled }" @click="handleButtonClick">
      {{ buttonText }}
    </p>
  </section>

</template>