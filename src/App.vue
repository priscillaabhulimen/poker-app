<template>
  <div id="app">
    <button @click="toggleRoute" class="route-toggle">
      Go to {{ nextRouteName }}
    </button>

    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue' 
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const nextRouteName = computed(() => {
  if (route.name === 'Basic') return 'Texas HoldEm'
  return "Basic"
})

function toggleRoute() {
  router.push({ name: nextRouteName.value })
}
</script>

<style>
.route-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>


