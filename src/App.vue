<script>
export default {
  computed: {
    toggleLabel() {
      return this.$route.name === 'Texas HoldEm'
        ? 'Basic'
        : "Texas Hold’em";
    },

    pageName() {
      return this.$route.name === 'Texas HoldEm'
        ? "Texas Hold’em" : 'Basic';
    }
  },

  methods: {
    toggleRoute() {
      if (this.$route.name === 'Texas HoldEm') {
        this.$router.push({ name: 'Basic' });
      } else {
        this.$router.push({ name: 'Texas HoldEm' });
      }
    }
  }
}
</script>

<template>
  <div id="app">
    <h1 class="mx-auto text-center text-5xl my-8">{{ pageName }}</h1>
    <button class="floating-button" @click="toggleRoute">
      <span class="icon">♠️</span>
      <span class="label">{{ toggleLabel }}</span>
    </button>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
@import url('styles/style.scss');
.floating-button {
  position: fixed;
  top: 1.25rem;
  right: 1.2rem;
  z-index: 50;

  display: flex;
  align-items: center;
  gap: 0.6rem;

  height: 48px;
  padding: 0 12px;
  max-width: 48px;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;

  color: white;
  font-weight: 600;
  cursor: pointer;

  overflow: hidden;
  white-space: nowrap;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  transition:
    max-width 0.35s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;

  &:hover,
  &:focus-visible {
    max-width: 250px;
    background: rgba(255, 255, 255, 0.18);
  }

  &:active {
    transform: scale(0.96);
  }

  .icon {
    font-size: 1.4rem;
    flex-shrink: 0;
  }

  .label {
    opacity: 0;
    transform: translateX(-6px);
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  &:hover .label,
  &:focus-visible .label {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .floating-button {
    top: auto;
    bottom: 1.25rem;
  }
}
</style>
