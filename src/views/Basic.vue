<script>
import Card from "../components/Card.vue"
import { createEmptyCard } from "../utils/card-factory.js";

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
    }
  },
  methods: {
    addToCardsForReplacement(card, index) {
      console.log(`Card flipped: ${card} at ${index}`)
    },
    removeFromCardsForReplacement(card, index) {
      console.log(`Card unflipped: ${card} at ${index}`)
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

    }
  }
}
</script>

<template>
  <section class="table-wrapper">
    <h1 class="text-center text-xxl text-white">Let's Play</h1>
    <div class="glass-table">
       <Card v-for="(card, index) in displayedCards" :img="card.image" @card-flipped="addToCardsForReplacement(card, index)"
        @card-unflipped="removeFromCardsForReplacement(card, index)" />
    </div>
  </section>
</template>