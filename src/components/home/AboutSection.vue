<script setup>
import { ref } from 'vue'
import { clinic } from '../../data/clinic'
import { useParallax, useReveal, useSplitReveal } from '../../composables/useMotion'
import Icon from '../ui/Icon.vue'
import StatCounter from '../ui/StatCounter.vue'

const section = ref(null)
const statement = ref(null)
const photo = ref(null)

useSplitReveal(statement)
useReveal(section, { selector: '[data-anim]', y: 30 })
useParallax(photo, { yPercent: 12, scale: 1.08 })
</script>

<template>
  <section id="sobre" ref="section" class="section theme-dark manifesto">
    <div class="container">
      <div class="manifesto__head">
        <p class="eyebrow">01 — Manifesto</p>
        <p class="mono manifesto__tag">Sobre a clínica</p>
      </div>

      <h2 ref="statement" class="manifesto__statement">
        {{ clinic.manifesto.lead }} <em>{{ clinic.manifesto.statement }}</em>
      </h2>

      <div class="manifesto__grid">
        <div data-anim class="manifesto__media">
          <img
            ref="photo"
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1040&h=1300&fit=crop&crop=right&auto=format"
            alt="Paciente ouvindo com atenção durante a consulta"
            width="1040"
            height="1300"
            loading="lazy"
          />
        </div>

        <div class="manifesto__body">
          <p data-anim class="lead">{{ clinic.manifesto.body }}</p>

          <ul class="manifesto__list">
            <li v-for="item in clinic.highlights" :key="item.id" data-anim class="pillar">
              <span class="pillar__icon">
                <Icon :name="item.icon" :size="20" />
              </span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="manifesto__stats">
        <StatCounter
          v-for="(stat, i) in clinic.stats"
          :key="stat.label"
          data-anim
          :index="i"
          :value="stat.value"
          :suffix="stat.suffix"
          :label="stat.label"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.manifesto__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--line);
}

.manifesto__tag {
  color: var(--fg-faint);
}

.manifesto__statement {
  margin-block: clamp(2.5rem, 6vw, 4.5rem);
  font-size: var(--display-lg);
  line-height: 1.02;
  letter-spacing: -0.03em;
  max-width: 20ch;
}

.manifesto__statement em {
  font-style: italic;
  color: var(--clay-soft);
}

.manifesto__grid {
  display: grid;
  gap: 2.5rem;
}

.manifesto__media {
  overflow: hidden;
  border-radius: 4px;
  aspect-ratio: 4 / 5;
  background: var(--ink-2);
}

.manifesto__media img {
  width: 100%;
  height: 116%;
  margin-top: -8%;
  object-fit: cover;
}

.manifesto__list {
  margin-top: 2.5rem;
  display: grid;
  gap: 0;
}

.pillar {
  display: flex;
  gap: 1.1rem;
  align-items: flex-start;
  padding-block: 1.35rem;
  border-top: 1px solid var(--line);
}

.pillar:last-child {
  border-bottom: 1px solid var(--line);
}

.pillar__icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--clay-soft);
}

.pillar h3 {
  font-size: 1.25rem;
  margin-bottom: 0.2rem;
}

.pillar p {
  font-size: var(--text-sm);
  color: var(--fg-soft);
}

.manifesto__stats {
  margin-top: clamp(3rem, 7vw, 5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem 1.5rem;
}

@media (min-width: 1024px) {
  .manifesto__grid {
    grid-template-columns: 0.85fr 1.15fr;
    gap: 4rem;
    align-items: start;
  }

  .manifesto__list {
    margin-top: 3rem;
  }

  .manifesto__stats {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
</style>
