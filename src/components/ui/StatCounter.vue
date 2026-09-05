<script setup>
import { ref } from 'vue'
import { useCountUp } from '../../composables/useMotion'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
  index: { type: Number, default: 0 },
})

const numberEl = ref(null)
useCountUp(numberEl, props.value, { suffix: props.suffix })
</script>

<template>
  <div class="stat">
    <span class="stat__index mono">{{ String(index + 1).padStart(2, '0') }}</span>
    <strong ref="numberEl" class="stat__value">0{{ suffix }}</strong>
    <span class="stat__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.stat {
  display: grid;
  gap: 0.35rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

.stat__index {
  font-size: 0.5625rem;
  color: var(--fg-faint);
}

.stat__value {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.4rem, 1.4rem + 3.4vw, 4rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--fg);
}

.stat__label {
  font-size: var(--text-sm);
  color: var(--fg-soft);
  max-width: 16ch;
}
</style>
