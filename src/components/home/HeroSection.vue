<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { clinic } from '../../data/clinic'
import { specialties } from '../../data/specialties'
import { useWhatsApp } from '../../composables/useWhatsApp'
import { useMarquee, useParallax, useSplitReveal } from '../../composables/useMotion'
import Icon from '../ui/Icon.vue'

const title = ref(null)
const frame = ref(null)
const photo = ref(null)
const marquee = ref(null)
const aside = ref(null)

const { buildUrl } = useWhatsApp(clinic.whatsapp, clinic.whatsappDefaultMessage)
const waHref = buildUrl()

const facts = [
  { label: 'Atendimento', value: clinic.hours[0].time },
  { label: 'Convênios', value: `${clinic.insurance.length} planos aceitos` },
  { label: 'Equipe', value: `${clinic.stats[2].value} profissionais` },
]

useSplitReveal(title, { delay: 0.15 })
useParallax(photo, { yPercent: 14, scale: 1.06 })
useMarquee(marquee, { duration: 34 })

onMounted(() => {
  gsap.fromTo(
    frame.value,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut', delay: 0.4 },
  )

  gsap.fromTo(
    aside.value.querySelectorAll('[data-intro]'),
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.65 },
  )
})
</script>

<template>
  <section id="topo" class="hero">
    <div class="container">
      <p class="eyebrow hero__eyebrow">{{ clinic.hero.eyebrow }}</p>

      <h1 ref="title" class="hero__title">
        {{ clinic.hero.titleLead }} <em>{{ clinic.hero.titleAccent }}</em>
      </h1>

      <hr class="rule" />

      <div ref="aside" class="hero__grid">
        <div class="hero__intro">
          <p data-intro class="lead">{{ clinic.hero.lead }}</p>
          <div data-intro class="hero__actions">
            <a class="btn btn--solid" :href="waHref" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" :size="16" />
              Agendar pelo WhatsApp
            </a>
            <a class="link" href="#especialidades">
              Ver especialidades
              <Icon name="arrowUpRight" :size="14" />
            </a>
          </div>
        </div>

        <dl data-intro class="hero__facts">
          <div v-for="fact in facts" :key="fact.label" class="hero__fact">
            <dt class="mono">{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="hero__mediaWrap">
      <div ref="frame" class="hero__frame">
        <img
          ref="photo"
          class="hero__photo"
          src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=2000&h=1125&fit=crop&auto=format"
          :alt="clinic.hero.imageAlt"
          width="2000"
          height="1125"
          fetchpriority="high"
        />
        <span class="hero__cue mono">
          Role para descobrir
          <Icon name="arrowDown" :size="14" />
        </span>
      </div>
    </div>

    <div class="marquee" aria-hidden="true">
      <div ref="marquee" class="marquee__track">
        <span v-for="pass in 2" :key="pass" class="marquee__group">
          <span v-for="item in specialties" :key="`${pass}-${item.id}`" class="marquee__item">
            {{ item.title }}
            <i>✦</i>
          </span>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  background: var(--paper);
  padding-top: calc(var(--header-h) + clamp(2.5rem, 7vw, 5.5rem));
  padding-bottom: 0;
  overflow: hidden;
}

.hero__eyebrow {
  margin-bottom: clamp(1.5rem, 4vw, 2.75rem);
}

.hero__title {
  font-size: var(--display-xl);
  letter-spacing: -0.04em;
  line-height: 0.92;
  margin-bottom: clamp(1.75rem, 4vw, 3rem);
  max-width: 15ch;
}

.hero__title em {
  font-style: italic;
  color: var(--clay);
}

.hero__grid {
  padding-top: 1.75rem;
  display: grid;
  gap: 2rem;
}

.hero__actions {
  margin-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}

.hero__facts {
  display: grid;
  gap: 0.85rem;
  align-content: start;
}

.hero__fact {
  display: grid;
  gap: 0.15rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--line);
}

.hero__fact dt {
  color: var(--fg-faint);
}

.hero__fact dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.35rem;
}

.hero__mediaWrap {
  margin-top: clamp(3rem, 7vw, 5rem);
  padding-inline: var(--gutter);
}

.hero__frame {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  aspect-ratio: 16 / 11;
  background: var(--paper-3);
}

.hero__photo {
  width: 100%;
  height: 118%;
  margin-top: -9%;
  object-fit: cover;
}

.hero__cue {
  position: absolute;
  left: clamp(1rem, 3vw, 2rem);
  bottom: clamp(1rem, 3vw, 2rem);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: rgba(242, 239, 232, 0.9);
  color: var(--ink);
}

.marquee {
  margin-top: clamp(2.5rem, 6vw, 4rem);
  padding-block: 1.1rem;
  border-block: 1px solid var(--line);
  overflow: hidden;
}

.marquee__track {
  display: flex;
  width: max-content;
}

.marquee__group {
  display: flex;
  flex-shrink: 0;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 1.75rem;
  padding-inline: 1.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 2rem);
  white-space: nowrap;
}

.marquee__item i {
  font-style: normal;
  font-size: 0.65em;
  color: var(--clay);
}

@media (min-width: 768px) {
  .hero__frame {
    aspect-ratio: 16 / 9;
  }
}

@media (min-width: 1024px) {
  .hero__grid {
    grid-template-columns: 1.25fr 0.75fr;
    gap: 4rem;
    align-items: start;
  }

  .hero__facts {
    grid-template-columns: 1fr;
    max-width: 22rem;
    margin-left: auto;
    width: 100%;
  }
}
</style>
