<template>
  <div
    class="card-container"
    :class="{ flipped: isFlipped, empty: !this.img}"
    @click="handleClick"
  >
    <div v-if="this.img" class="card">
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

    
      <p>?</p>
    
  </div>
</template>

<script>
export default {
  name: "Card",

  props: {
    img: {
      type: String,
      default: ""
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
      if (!this.canFlip || !this.img) return;

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
  perspective: 300px;
  cursor: pointer;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);

  border-radius: 20px;

  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.empty > p{
  font-size: 2em;
  font-weight: 700;
  color: white;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1.8s ease;
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
