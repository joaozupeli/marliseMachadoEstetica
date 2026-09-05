<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { clinic } from '../../data/clinic'
import { useWhatsApp } from '../../composables/useWhatsApp'
import Icon from './Icon.vue'

const props = defineProps({
  member: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const panel = ref(null)
const scrim = ref(null)
const closeBtn = ref(null)

const { buildUrl } = useWhatsApp(clinic.whatsapp)

function waHref(member) {
  return buildUrl(`Olá! Gostaria de agendar uma consulta com ${member.name} (${member.role}).`)
}

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.member,
  async (member) => {
    document.body.style.overflow = member ? 'hidden' : ''
    if (!member) return

    await nextTick()
    closeBtn.value?.focus()
    if (!panel.value) return

    gsap
      .timeline()
      .fromTo(scrim.value, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      .fromTo(
        panel.value,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.3',
      )
      .fromTo(
        panel.value.querySelectorAll('[data-modal-anim]'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' },
        '-=0.35',
      )
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="member"
      class="modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`member-${member.id}`"
    >
      <div ref="scrim" class="modal__scrim" @click="emit('close')" />

      <div ref="panel" class="modal__panel theme-dark">
        <button ref="closeBtn" class="modal__close" type="button" @click="emit('close')">
          <span class="mono">Fechar</span>
          <Icon name="close" :size="18" />
        </button>

        <div class="container modal__grid">
          <div data-modal-anim class="modal__photo">
            <img :src="member.photo" :alt="member.photoAlt" width="600" height="750" />
          </div>

          <div class="modal__body">
            <p data-modal-anim class="mono modal__role">{{ member.role }}</p>
            <h3 :id="`member-${member.id}`" data-modal-anim class="modal__name">
              {{ member.name }}
            </h3>
            <p v-if="member.crm" data-modal-anim class="mono modal__crm">{{ member.crm }}</p>
            <p data-modal-anim class="lead modal__bio">{{ member.bio }}</p>

            <dl data-modal-anim class="modal__meta">
              <div>
                <dt class="mono">Formação</dt>
                <dd>{{ member.formation }}</dd>
              </div>
              <div>
                <dt class="mono">Áreas de atuação</dt>
                <dd>{{ member.specialties.join(' · ') }}</dd>
              </div>
              <div v-if="member.languages?.length">
                <dt class="mono">Idiomas</dt>
                <dd>{{ member.languages.join(', ') }}</dd>
              </div>
            </dl>

            <a
              data-modal-anim
              class="btn"
              :href="waHref(member)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" :size="16" />
              Agendar com {{ member.name.split(' ')[0] }} {{ member.name.split(' ')[1] }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: flex-end;
}

.modal__scrim {
  position: absolute;
  inset: 0;
  background: rgba(14, 19, 17, 0.6);
  backdrop-filter: blur(4px);
}

.modal__panel {
  position: relative;
  width: 100%;
  max-height: 92dvh;
  overflow-y: auto;
  background: var(--ink);
  color: var(--paper);
  padding-block: clamp(3.25rem, 6vw, 4.5rem);
  border-radius: 6px 6px 0 0;
}

.modal__close {
  position: absolute;
  top: 1.1rem;
  right: var(--gutter);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--paper);
  cursor: pointer;
  transition: background-color 0.4s var(--ease);
}

.modal__close:hover {
  background: rgba(255, 255, 255, 0.08);
}

.modal__grid {
  display: grid;
  gap: 2rem;
}

.modal__photo {
  overflow: hidden;
  border-radius: 3px;
  aspect-ratio: 4 / 5;
  max-width: 20rem;
  background: var(--ink-2);
}

.modal__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal__role {
  color: var(--clay-soft);
  margin-bottom: 0.75rem;
}

.modal__name {
  font-size: var(--display-sm);
  letter-spacing: -0.03em;
}

.modal__crm {
  margin-top: 0.5rem;
  color: var(--fg-faint);
}

.modal__bio {
  margin-top: 1.5rem;
}

.modal__meta {
  margin-block: 2rem;
  display: grid;
  gap: 1.1rem;
}

.modal__meta dt {
  color: var(--fg-faint);
  margin-bottom: 0.3rem;
}

.modal__meta dd {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--fg);
  padding-bottom: 1.1rem;
  border-bottom: 1px solid var(--line);
}

@media (min-width: 900px) {
  .modal__grid {
    grid-template-columns: 0.55fr 1fr;
    gap: 3.5rem;
    align-items: start;
  }

  .modal__photo {
    max-width: none;
  }
}
</style>
