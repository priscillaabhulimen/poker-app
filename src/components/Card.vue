<template>
  <div class="card-container shrink-2 w-[80px] lg:w-[200px] lg:min-w-[100px]" :class="{ flipped: isFlipped, empty: !this.img }"
    @click="handleClick">
    <div v-if="img" class="card">
      <img class="card-face card-front" :src="img" alt="Card front" />

      <img class="card-face card-back" :src="backImg" alt="Card back" />
    </div>
    <p v-else>?</p>
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
    },
    isFlipped: {
      type: Boolean,
      default: false
    }
  },

  emits: ["card-flipped", "card-unflipped"],

  data() {
    return {
      backImg: "https://deckofcardsapi.com/static/img/back.png"
    };
  },

  methods: {
    handleClick() {
      if (!this.canFlip || !this.img) return;

      this.$emit("card-flipped");
    }
  }
};
</script>

<style scoped>
.card-container {
  width: 16vw;
  height: 24vw;
  min-width: 70px;
  min-height: 105px;
  perspective: 450px;
  cursor: pointer;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);

  border-radius: 10px;

  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.empty>p {
  font-size: 2em;
  font-weight: 700;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1.3s ease;
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
