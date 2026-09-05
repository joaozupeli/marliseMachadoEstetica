<script setup>
import { reactive, ref } from 'vue'
import { clinic } from '../../data/clinic'
import { specialties } from '../../data/specialties'
import { useWhatsApp } from '../../composables/useWhatsApp'
import { useReveal, useSplitReveal } from '../../composables/useMotion'
import Icon from '../ui/Icon.vue'

const section = ref(null)
const title = ref(null)

useSplitReveal(title)
useReveal(section, { selector: '[data-anim]', y: 24, stagger: 0.06 })

const { openWhatsApp } = useWhatsApp(clinic.whatsapp)

const form = reactive({
  name: '',
  phone: '',
  specialty: '',
  message: '',
})

function buildMessage() {
  const specialtyLabel =
    specialties.find((item) => item.id === form.specialty)?.title || 'Não informada'

  return [
    `Olá! Meu nome é ${form.name || '(nome)'}.`,
    `Telefone: ${form.phone || '(não informado)'}.`,
    `Especialidade de interesse: ${specialtyLabel}.`,
    form.message ? `Mensagem: ${form.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

function onSubmit() {
  openWhatsApp(buildMessage())
}
</script>

<template>
  <section id="contato" ref="section" class="section contact">
    <div class="container">
      <div class="contact__head">
        <div>
          <p class="eyebrow">05 — Contato</p>
          <h2 ref="title" class="contact__title display">
            Marque sua consulta <em>hoje mesmo</em>
          </h2>
        </div>
        <p data-anim class="lead contact__lead">
          Respondemos no WhatsApp em poucos minutos durante o horário de atendimento.
        </p>
      </div>

      <div class="contact__grid">
        <div class="contact__info">
          <div data-anim class="info">
            <p class="mono info__label">Endereço</p>
            <p class="info__value">
              {{ clinic.address.street }}<br />
              {{ clinic.address.neighborhood }} — {{ clinic.address.city }}/{{
                clinic.address.state
              }}<br />
              CEP {{ clinic.address.zip }}
            </p>
          </div>

          <div data-anim class="info">
            <p class="mono info__label">Telefone e e-mail</p>
            <p class="info__value">
              <a :href="`tel:${clinic.phone.replace(/\D/g, '')}`">{{ clinic.phone }}</a><br />
              <a :href="`mailto:${clinic.email}`">{{ clinic.email }}</a>
            </p>
          </div>

          <div data-anim class="info">
            <p class="mono info__label">Horários</p>
            <p v-for="item in clinic.hours" :key="item.days" class="info__value info__row">
              <span>{{ item.days }}</span>
              <span>{{ item.time }}</span>
            </p>
          </div>

          <div data-anim class="info">
            <p class="mono info__label">Convênios</p>
            <ul class="info__tags">
              <li v-for="item in clinic.insurance" :key="item" class="mono">{{ item }}</li>
            </ul>
          </div>
        </div>

        <form data-anim class="form" @submit.prevent="onSubmit">
          <label class="field">
            <span class="mono">Nome completo</span>
            <input v-model="form.name" type="text" autocomplete="name" required placeholder="Como podemos te chamar" />
          </label>

          <label class="field">
            <span class="mono">Telefone</span>
            <input v-model="form.phone" type="tel" autocomplete="tel" required placeholder="(11) 99999-9999" />
          </label>

          <label class="field">
            <span class="mono">Especialidade</span>
            <select v-model="form.specialty" required>
              <option value="" disabled>Selecione uma opção</option>
              <option v-for="item in specialties" :key="item.id" :value="item.id">
                {{ item.title }}
              </option>
            </select>
          </label>

          <label class="field">
            <span class="mono">Mensagem</span>
            <textarea v-model="form.message" rows="3" placeholder="Conte brevemente o que você precisa" />
          </label>

          <button class="btn btn--solid form__submit" type="submit">
            <Icon name="whatsapp" :size="16" />
            Enviar pelo WhatsApp
          </button>
        </form>
      </div>
    </div>

    <div data-anim class="contact__map">
      <iframe
        :title="`Mapa da ${clinic.name}`"
        :src="clinic.address.mapEmbedUrl"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      />
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--paper-2);
  padding-bottom: 0;
}

.contact__head {
  display: grid;
  gap: 1.75rem;
  padding-bottom: clamp(2.5rem, 6vw, 4rem);
}

.contact__title {
  margin-top: 1.25rem;
  font-size: var(--display-md);
  max-width: 14ch;
}

.contact__lead {
  align-self: end;
}

.contact__grid {
  display: grid;
  gap: 3rem;
}

.info {
  padding-block: 1.25rem;
  border-top: 1px solid var(--line);
}

.info:last-child {
  border-bottom: 1px solid var(--line);
}

.info__label {
  color: var(--fg-faint);
  margin-bottom: 0.6rem;
}

.info__value {
  font-size: var(--text-base);
  line-height: 1.6;
}

.info__value a:hover {
  color: var(--clay);
}

.info__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--fg-soft);
}

.info__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.info__tags li {
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--fg-soft);
}

.form {
  display: grid;
  gap: 1.75rem;
  align-content: start;
}

.field {
  display: grid;
  gap: 0.5rem;
}

.field > .mono {
  color: var(--fg-faint);
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.65rem 0;
  border: 0;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
  background: transparent;
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--fg);
  transition: border-color 0.4s var(--ease);
}

.field textarea {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  resize: vertical;
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--fg-faint);
  font-family: var(--font-sans);
  font-size: var(--text-base);
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-bottom-color: var(--clay);
}

.form__submit {
  justify-self: start;
}

.contact__map {
  margin-top: clamp(3.5rem, 8vw, 6rem);
  aspect-ratio: 16 / 9;
  max-height: 30rem;
  background: var(--paper-3);
}

.contact__map iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  filter: grayscale(1) contrast(1.05);
  transition: filter 0.6s var(--ease);
}

.contact__map:hover iframe {
  filter: grayscale(0);
}

@media (min-width: 900px) {
  .contact__head {
    grid-template-columns: 1.3fr 0.7fr;
    gap: 3rem;
  }

  .contact__grid {
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
  }
}
</style>
