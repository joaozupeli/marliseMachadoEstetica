<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { clinic } from '../../data/clinic'
import { useWhatsApp } from '../../composables/useWhatsApp'
import Icon from '../ui/Icon.vue'

const { buildUrl } = useWhatsApp(clinic.whatsapp, clinic.whatsappDefaultMessage)
const href = buildUrl()

const shown = ref(false)

function onScroll() {
  shown.value = window.scrollY > window.innerHeight * 0.6
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <a
    class="wa"
    :class="{ 'wa--shown': shown }"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon name="whatsapp" :size="18" />
    <span class="mono">Falar agora</span>
  </a>
</template>

<style scoped>
.wa {
  position: fixed;
  right: clamp(1rem, 3vw, 2rem);
  bottom: clamp(1rem, 3vw, 2rem);
  z-index: 150;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  background: var(--ink);
  color: var(--paper);
  box-shadow: 0 14px 40px rgba(14, 19, 17, 0.28);
  opacity: 0;
  transform: translateY(1.5rem);
  pointer-events: none;
  transition:
    opacity 0.5s var(--ease),
    transform 0.5s var(--ease),
    background-color 0.4s var(--ease);
}

.wa--shown {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.wa:hover {
  background: var(--clay);
}
</style>
