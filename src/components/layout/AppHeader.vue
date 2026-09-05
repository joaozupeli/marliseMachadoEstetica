<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { clinic } from '../../data/clinic'
import { useScrollProgress } from '../../composables/useMotion'
import Icon from '../ui/Icon.vue'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#contato', label: 'Contato' },
]

const menuOpen = ref(false)
const scrolled = ref(false)
const progress = ref(null)
const overlay = ref(null)

useScrollProgress(progress)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

async function openMenu() {
  menuOpen.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  if (!overlay.value) return

  const items = overlay.value.querySelectorAll('[data-menu-item]')
  gsap
    .timeline()
    .fromTo(overlay.value, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' })
    .fromTo(
      items,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
      '-=0.25',
    )
}

function closeMenu() {
  if (!menuOpen.value) return
  document.body.style.overflow = ''

  if (!overlay.value) {
    menuOpen.value = false
    return
  }

  gsap.to(overlay.value, {
    yPercent: -100,
    duration: 0.5,
    ease: 'power3.inOut',
    onComplete: () => {
      menuOpen.value = false
    },
  })
}

function toggleMenu() {
  if (menuOpen.value) closeMenu()
  else openMenu()
}

function onKeydown(event) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header" :class="{ 'header--solid': scrolled }">
    <div class="container header__inner">
      <a href="#topo" class="brand" @click="closeMenu">
        <span class="brand__name">{{ clinic.name }}</span>
        <span class="brand__meta mono">Clínica geral · {{ clinic.address.city }}</span>
      </a>

      <nav class="nav" aria-label="Principal">
        <a v-for="(link, i) in links" :key="link.href" class="nav__link" :href="link.href">
          <span class="nav__index mono">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="nav__label">{{ link.label }}</span>
        </a>
      </nav>

      <div class="header__end">
        <a class="btn btn--solid header__cta" href="#contato">Agendar consulta</a>
        <button
          class="burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="menu-overlay"
          :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'"
          @click="toggleMenu"
        >
          <Icon :name="menuOpen ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <span ref="progress" class="header__progress" aria-hidden="true" />
  </header>

  <div v-show="menuOpen" id="menu-overlay" ref="overlay" class="overlay theme-dark">
    <nav class="container overlay__nav" aria-label="Menu">
      <a
        v-for="(link, i) in links"
        :key="link.href"
        data-menu-item
        class="overlay__link"
        :href="link.href"
        @click="closeMenu"
      >
        <span class="mono">{{ String(i + 1).padStart(2, '0') }}</span>
        {{ link.label }}
      </a>

      <div data-menu-item class="overlay__foot">
        <a class="btn" href="#contato" @click="closeMenu">Agendar consulta</a>
        <p class="mono">{{ clinic.phone }}</p>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: var(--header-h);
  transition: background-color 0.5s var(--ease), border-color 0.5s var(--ease);
  border-bottom: 1px solid transparent;
}

.header--solid {
  background: rgba(242, 239, 232, 0.82);
  backdrop-filter: blur(12px);
  border-bottom-color: rgba(14, 19, 17, 0.12);
}

.header__inner {
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand {
  margin-right: auto;
  display: grid;
  line-height: 1.1;
}

.brand__name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: -0.02em;
}

.brand__meta {
  font-size: 0.625rem;
  color: var(--fg-faint);
}

.nav {
  display: none;
  align-items: baseline;
  gap: 1.75rem;
}

.nav__link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: var(--text-sm);
  color: var(--ink);
  transition: color 0.35s var(--ease);
}

.nav__index {
  font-size: 0.5625rem;
  color: var(--fg-faint);
  transition: color 0.35s var(--ease);
}

.nav__label {
  position: relative;
}

.nav__label::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.45s var(--ease);
}

.nav__link:hover .nav__label::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav__link:hover,
.nav__link:hover .nav__index {
  color: var(--clay);
}

.header__end {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header__cta {
  display: none;
  min-height: 2.75rem;
  padding-inline: 1.25rem;
}

.burger {
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
}

.header__progress {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: var(--clay);
  transform: scaleX(0);
  transform-origin: left;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 190;
  background: var(--ink);
  color: var(--paper);
  display: flex;
  align-items: center;
  padding-top: var(--header-h);
}

.overlay__nav {
  display: grid;
  gap: 0.25rem;
  width: 100%;
}

.overlay__link {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-block: 0.65rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-display);
  font-size: clamp(2rem, 9vw, 3.5rem);
  line-height: 1.1;
}

.overlay__link .mono {
  font-size: 0.625rem;
  color: var(--clay-soft);
}

.overlay__foot {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
}

.overlay__foot .mono {
  color: var(--fg-faint);
}

@media (min-width: 1024px) {
  .nav {
    display: flex;
  }

  .header__cta {
    display: inline-flex;
  }

  .burger,
  .overlay {
    display: none !important;
  }
}
</style>
