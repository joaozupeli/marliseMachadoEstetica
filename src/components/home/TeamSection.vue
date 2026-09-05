<script setup>
import { computed, ref } from 'vue'
import { team } from '../../data/team'
import { useReveal, useSplitReveal, useStaggerOnChange } from '../../composables/useMotion'
import TeamCard from '../ui/TeamCard.vue'
import TeamModal from '../ui/TeamModal.vue'

const filters = [
  { id: 'todos', label: 'Todos' },
  { id: 'medico', label: 'Corpo clínico' },
  { id: 'apoio', label: 'Equipe de apoio' },
]

const section = ref(null)
const title = ref(null)
const grid = ref(null)
const activeFilter = ref('todos')
const selected = ref(null)

const filtered = computed(() => {
  if (activeFilter.value === 'todos') return team
  return team.filter((member) => member.type === activeFilter.value)
})

function countOf(id) {
  if (id === 'todos') return team.length
  return team.filter((member) => member.type === id).length
}

useSplitReveal(title)
useReveal(section, { selector: '[data-anim]', y: 28, stagger: 0.05 })
useStaggerOnChange(grid, filtered)
</script>

<template>
  <section id="equipe" ref="section" class="section team">
    <div class="container">
      <div class="team__head">
        <div>
          <p class="eyebrow">03 — Equipe</p>
          <h2 ref="title" class="team__title display">
            Quem vai <em>te atender</em>
          </h2>
        </div>

        <div data-anim class="team__filters" role="group" aria-label="Filtrar equipe">
          <button
            v-for="filter in filters"
            :key="filter.id"
            type="button"
            class="filter mono"
            :class="{ 'filter--active': activeFilter === filter.id }"
            :aria-pressed="activeFilter === filter.id"
            @click="activeFilter = filter.id"
          >
            {{ filter.label }}
            <sup>{{ countOf(filter.id) }}</sup>
          </button>
        </div>
      </div>

      <div ref="grid" class="team__grid">
        <TeamCard
          v-for="(member, i) in filtered"
          :key="member.id"
          data-anim
          data-stagger
          :member="member"
          :index="i"
          @select="selected = member"
        />
      </div>
    </div>

    <TeamModal :member="selected" @close="selected = null" />
  </section>
</template>

<style scoped>
.team {
  background: var(--paper);
}

.team__head {
  display: grid;
  gap: 1.75rem;
  padding-bottom: clamp(2.5rem, 6vw, 4rem);
}

.team__title {
  margin-top: 1.25rem;
  font-size: var(--display-lg);
}

.team__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-self: end;
}

.filter {
  position: relative;
  border: 0;
  background: transparent;
  padding: 0 0 0.35rem;
  cursor: pointer;
  color: var(--fg-faint);
  transition: color 0.4s var(--ease);
}

.filter sup {
  font-size: 0.5rem;
  margin-left: 0.2rem;
}

.filter::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s var(--ease);
}

.filter:hover {
  color: var(--fg);
}

.filter--active {
  color: var(--clay);
}

.filter--active::after {
  transform: scaleX(1);
}

.team__grid {
  display: grid;
  gap: 2.5rem 1.5rem;
  grid-template-columns: 1fr 1fr;
}

@media (min-width: 900px) {
  .team__head {
    grid-template-columns: 1fr auto;
    align-items: end;
  }

  .team__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 3.5rem 2rem;
  }

  /*
   * Deslocamento alternado para quebrar o alinhamento de catálogo.
   * Usa margem, não transform: o GSAP anima transform nesses mesmos elementos
   * e sobrescreveria o deslocamento ao terminar a revelação.
   */
  .team__grid > *:nth-child(4n + 2) {
    margin-top: 2.75rem;
  }

  .team__grid > *:nth-child(4n + 4) {
    margin-top: 1.5rem;
  }
}
</style>
