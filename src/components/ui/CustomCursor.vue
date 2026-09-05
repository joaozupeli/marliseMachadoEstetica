<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
const ring = ref(null)
const enabled = ref(false)
const active = ref(false)
const visible = ref(false)

let moveX
let moveY

function isInteractive(target) {
  return Boolean(target?.closest?.('a, button, input, select, textarea, [data-cursor]'))
}

function onPointerMove(event) {
  visible.value = true
  active.value = isInteractive(event.target)
  moveX(event.clientX)
  moveY(event.clientY)
}

function onPointerLeave() {
  visible.value = false
}

onMounted(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  if (!fine) return

  enabled.value = true
  gsap.set(ring.value, { xPercent: -50, yPercent: -50 })
  moveX = gsap.quickTo(ring.value, 'x', { duration: 0.5, ease: 'power3' })
  moveY = gsap.quickTo(ring.value, 'y', { duration: 0.5, ease: 'power3' })

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerleave', onPointerLeave)
})
</script>

<template>
  <div
    v-show="enabled"
    ref="ring"
    class="cursor"
    :class="{ 'cursor--active': active, 'cursor--visible': visible }"
    aria-hidden="true"
  />
</template>

<style scoped>
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9998;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--ink);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.3s var(--ease),
    width 0.35s var(--ease),
    height 0.35s var(--ease),
    background-color 0.35s var(--ease),
    border-color 0.35s var(--ease);
}

.cursor--visible {
  opacity: 1;
}

.cursor--active {
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(184, 79, 43, 0.14);
  border-color: var(--clay);
}
</style>
