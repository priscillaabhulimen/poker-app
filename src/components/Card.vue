<template>
  <div
    class="card-container"
    :class="{ flipped: isFlipped }"
    @click="handleClick"
  >
    <div class="card">
      <img
        class="card-face card-front"
        :src="img"
        alt="Card front"
      />

      <img
        class="card-face card-back"
        :src="backImg"
        alt="Card back"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",

  props: {
    img: {
      type: String,
      required: true
    },
    canFlip: {
      type: Boolean,
      default: true
    }
  },

  emits: ["card-flipped", "card-unflipped"],

  data() {
    return {
      isFlipped: false,
      backImg: "https://deckofcardsapi.com/static/img/back.png"
    };
  },

  methods: {
    handleClick() {
      if (!this.canFlip) return;

      this.isFlipped = !this.isFlipped;

      this.$emit(this.isFlipped ? "card-flipped" : "card-unflipped");
    }
  }
};
</script>

<style scoped>
.card-container {
  width: 120px;
  height: 180px;
  perspective: 1000px;
  cursor: pointer;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.card-container.flipped .card {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
}

.card-front {
  transform: rotateY(0deg);
}

.card-back {
  transform: rotateY(180deg);
}
</style>
