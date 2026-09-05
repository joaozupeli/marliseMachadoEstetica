<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { specialties } from '../../data/specialties'
import { useReveal, useSplitReveal } from '../../composables/useMotion'
import Icon from '../ui/Icon.vue'

const section = ref(null)
const title = ref(null)
const preview = ref(null)

const openId = ref(null)
const hoverIndex = ref(-1)
const canPreview = ref(false)

let moveX
let moveY

useSplitReveal(title)
useReveal(section, { selector: '[data-anim]', y: 26, stagger: 0.06 })

function toggle(id) {
  openId.value = openId.value === id ? null : id
}

function onMove(event) {
  if (!moveX) return
  moveX(event.clientX)
  moveY(event.clientY)
}

onMounted(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return

  canPreview.value = true
  gsap.set(preview.value, { xPercent: -50, yPercent: -50 })
  moveX = gsap.quickTo(preview.value, 'x', { duration: 0.65, ease: 'power3' })
  moveY = gsap.quickTo(preview.value, 'y', { duration: 0.65, ease: 'power3' })
})
</script>

<template>
  <section id="especialidades" ref="section" class="section specialties">
    <div class="container">
      <div class="specialties__head">
        <div>
          <p class="eyebrow">02 — Especialidades</p>
          <h2 ref="title" class="specialties__title display">
            Seis frentes de cuidado, <em>um único prontuário</em>
          </h2>
        </div>
        <p data-anim class="lead specialties__lead">
          As especialidades conversam entre si. O que a cardiologia descobre, a nutrição já sabe na
          consulta seguinte.
        </p>
      </div>

      <ul class="list" @mousemove="onMove" @mouseleave="hoverIndex = -1">
        <li
          v-for="(item, i) in specialties"
          :key="item.id"
          data-anim
          class="row"
          :class="{ 'row--open': openId === item.id }"
          @mouseenter="hoverIndex = i"
        >
          <button
            class="row__head"
            type="button"
            :aria-expanded="openId === item.id"
            :aria-controls="`spec-${item.id}`"
            @click="toggle(item.id)"
          >
            <span class="row__num mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="row__title">{{ item.title }}</span>
            <span class="row__short">{{ item.short }}</span>
            <span class="row__toggle">
              <Icon :name="openId === item.id ? 'minus' : 'plus'" :size="18" />
            </span>
          </button>

          <div :id="`spec-${item.id}`" class="row__panel">
            <div class="row__panelInner">
              <p>{{ item.description }}</p>
              <a class="link" href="#contato">
                Agendar {{ item.title }}
                <Icon name="arrowUpRight" :size="14" />
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-show="canPreview"
      ref="preview"
      class="preview"
      :class="{ 'preview--on': hoverIndex >= 0 }"
      aria-hidden="true"
    >
      <img
        v-for="(item, i) in specialties"
        :key="item.id"
        :src="item.image"
        :alt="item.imageAlt"
        class="preview__img"
        :class="{ 'preview__img--on': hoverIndex === i }"
        loading="lazy"
      />
    </div>
  </section>
</template>

<style scoped>
.specialties {
  background: var(--paper-2);
}

.specialties__head {
  display: grid;
  gap: 1.75rem;
  padding-bottom: clamp(2.5rem, 6vw, 4rem);
}

.specialties__title {
  margin-top: 1.25rem;
  font-size: var(--display-md);
  max-width: 16ch;
}

.specialties__lead {
  align-self: end;
}

.row {
  border-top: 1px solid var(--line);
}

.row:last-child {
  border-bottom: 1px solid var(--line);
}

.row__head {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding-block: clamp(1.15rem, 2.5vw, 1.75rem);
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: padding-left 0.5s var(--ease), color 0.4s var(--ease);
}

.row:hover .row__head {
  padding-left: 0.9rem;
  color: var(--clay);
}

.row__num {
  font-size: 0.625rem;
  color: var(--fg-faint);
}

.row__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 1rem + 3.4vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.row__short {
  display: none;
  font-size: var(--text-sm);
  color: var(--fg-soft);
  max-width: 30ch;
}

.row__toggle {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  transition: transform 0.5s var(--ease), border-color 0.4s var(--ease);
}

.row:hover .row__toggle {
  transform: rotate(90deg);
  border-color: var(--clay);
}

/* Acordeão sem medir altura em JS: a linha do grid vai de 0fr para 1fr. */
.row__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.55s var(--ease);
}

.row--open .row__panel {
  grid-template-rows: 1fr;
}

.row__panelInner {
  overflow: hidden;
}

.row__panelInner > * {
  opacity: 0;
  transition: opacity 0.4s var(--ease) 0.1s;
}

.row--open .row__panelInner > * {
  opacity: 1;
}

.row__panelInner p {
  max-width: 62ch;
  color: var(--fg-soft);
  padding-bottom: 1rem;
}

.row__panelInner .link {
  margin-bottom: 1.5rem;
}

.preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 60;
  width: 17rem;
  height: 21rem;
  overflow: hidden;
  border-radius: 4px;
  pointer-events: none;
  opacity: 0;
  transform-origin: center;
  transition: opacity 0.45s var(--ease);
}

.preview--on {
  opacity: 1;
}

.preview__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s var(--ease);
}

.preview__img--on {
  opacity: 1;
}

@media (min-width: 900px) {
  .specialties__head {
    grid-template-columns: 1.3fr 0.7fr;
    gap: 3rem;
  }

  .row__head {
    grid-template-columns: auto minmax(0, 1fr) minmax(0, 0.85fr) auto;
    gap: 2rem;
  }

  .row__short {
    display: block;
  }
}
</style>
