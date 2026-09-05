<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { testimonials } from '../../data/testimonials'
import { useReveal } from '../../composables/useMotion'
import Icon from '../ui/Icon.vue'

const AUTOPLAY_MS = 6500

const section = ref(null)
const quote = ref(null)
const bar = ref(null)

const index = ref(0)
const paused = ref(false)
const touchStartX = ref(0)

const current = computed(() => testimonials[index.value])
const total = computed(() => String(testimonials.length).padStart(2, '0'))

let timer
let barTween

useReveal(section, { selector: '[data-anim]', y: 26 })

function goTo(target) {
  index.value = (target + testimonials.length) % testimonials.length
}

function next() {
  goTo(index.value + 1)
}

function prev() {
  goTo(index.value - 1)
}

function restartBar() {
  barTween?.kill()
  if (!bar.value) return

  barTween = gsap.fromTo(
    bar.value,
    { scaleX: 0 },
    { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: 'none' },
  )
}

function startAutoplay() {
  window.clearInterval(timer)
  restartBar()
  timer = window.setInterval(() => {
    if (!paused.value) next()
  }, AUTOPLAY_MS)
}

function onTouchStart(event) {
  touchStartX.value = event.changedTouches[0].clientX
  paused.value = true
}

function onTouchEnd(event) {
  const delta = event.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(delta) > 40) {
    if (delta < 0) next()
    else prev()
  }
  paused.value = false
}

watch(index, async () => {
  restartBar()
  await nextTick()
  gsap.fromTo(
    quote.value,
    { opacity: 0, y: 26 },
    { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
  )
})

watch(paused, (isPaused) => {
  if (!barTween) return
  if (isPaused) barTween.pause()
  else barTween.resume()
})

onMounted(startAutoplay)

onUnmounted(() => {
  window.clearInterval(timer)
  barTween?.kill()
})
</script>

<template>
  <section
    id="depoimentos"
    ref="section"
    class="section theme-dark voices"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div class="container">
      <div class="voices__head">
        <p class="eyebrow">04 — Depoimentos</p>
        <p data-anim class="mono voices__count">{{ String(index + 1).padStart(2, '0') }} / {{ total }}</p>
      </div>

      <div
        data-anim
        class="voices__stage"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div ref="quote" class="voices__quote">
          <blockquote>
            <p>{{ current.text }}</p>
          </blockquote>

          <figcaption class="voices__author">
            <img
              :src="current.avatar"
              :alt="current.avatarAlt"
              width="64"
              height="64"
              loading="lazy"
            />
            <span>
              <strong>{{ current.name }}</strong>
              <span class="mono">{{ current.role }}</span>
            </span>
            <span class="voices__rating mono" :aria-label="`${current.rating} de 5 estrelas`">
              <Icon name="star" :size="14" />
              {{ current.rating.toFixed(1) }}
            </span>
          </figcaption>
        </div>
      </div>

      <div data-anim class="voices__controls">
        <div class="voices__progress" aria-hidden="true">
          <span ref="bar" class="voices__bar" />
        </div>

        <div class="voices__buttons">
          <button type="button" aria-label="Depoimento anterior" @click="prev">
            <Icon name="arrowRight" :size="18" class="flip" />
          </button>
          <button type="button" aria-label="Próximo depoimento" @click="next">
            <Icon name="arrowRight" :size="18" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.voices__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: clamp(2.5rem, 6vw, 4rem);
}

.voices__count {
  color: var(--fg-faint);
}

.voices__stage {
  min-height: clamp(20rem, 34vw, 24rem);
}

.voices__quote blockquote p {
  font-family: var(--font-display);
  font-size: var(--display-md);
  font-style: italic;
  line-height: 1.08;
  letter-spacing: -0.025em;
  max-width: 22ch;
}

.voices__quote blockquote p::before {
  content: '“';
  color: var(--clay-soft);
}

.voices__quote blockquote p::after {
  content: '”';
  color: var(--clay-soft);
}

.voices__author {
  margin-top: clamp(2rem, 4vw, 3rem);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.voices__author img {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
  filter: grayscale(1);
}

.voices__author strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
}

.voices__author .mono {
  color: var(--fg-faint);
  font-size: 0.625rem;
}

.voices__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--clay-soft);
}

.voices__controls {
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.voices__progress {
  flex: 1;
  height: 1px;
  background: var(--line);
}

.voices__bar {
  display: block;
  height: 100%;
  background: var(--clay-soft);
  transform: scaleX(0);
  transform-origin: left;
}

.voices__buttons {
  display: flex;
  gap: 0.6rem;
}

.voices__buttons button {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--fg);
  cursor: pointer;
  transition: background-color 0.4s var(--ease), border-color 0.4s var(--ease);
}

.voices__buttons button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--clay-soft);
}

.flip {
  transform: rotate(180deg);
}
</style>
