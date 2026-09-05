<script setup>
import { ref } from 'vue'
import { clinic } from '../../data/clinic'
import { useReveal } from '../../composables/useMotion'
import Icon from '../ui/Icon.vue'

const footer = ref(null)
const year = new Date().getFullYear()

const quickLinks = [
  { href: '#sobre', label: 'Manifesto' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#contato', label: 'Contato' },
]

const socials = [
  { icon: 'instagram', label: 'Instagram', href: clinic.social.instagram },
  { icon: 'facebook', label: 'Facebook', href: clinic.social.facebook },
  { icon: 'youtube', label: 'YouTube', href: clinic.social.youtube },
]

useReveal(footer, { selector: '[data-anim]', y: 22, stagger: 0.05 })
</script>

<template>
  <footer ref="footer" class="footer theme-dark">
    <div class="container">
      <div class="footer__grid">
        <div data-anim class="footer__brand">
          <p class="footer__tagline">{{ clinic.tagline }}</p>
          <p class="footer__desc">{{ clinic.shortDescription }}</p>
          <a class="link" href="#contato">
            Agendar consulta
            <Icon name="arrowUpRight" :size="14" />
          </a>
        </div>

        <nav data-anim class="footer__col" aria-label="Rodapé">
          <p class="mono footer__label">Navegação</p>
          <ul>
            <li v-for="link in quickLinks" :key="link.href">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </nav>

        <div data-anim class="footer__col">
          <p class="mono footer__label">Contato</p>
          <ul>
            <li>
              <a :href="`tel:${clinic.phone.replace(/\D/g, '')}`">{{ clinic.phone }}</a>
            </li>
            <li>
              <a :href="`mailto:${clinic.email}`">{{ clinic.email }}</a>
            </li>
            <li class="footer__address">
              {{ clinic.address.street }}<br />
              {{ clinic.address.neighborhood }} — {{ clinic.address.city }}/{{
                clinic.address.state
              }}
            </li>
          </ul>
        </div>

        <div data-anim class="footer__col">
          <p class="mono footer__label">Redes</p>
          <ul class="footer__social">
            <li v-for="item in socials" :key="item.label">
              <a :href="item.href" target="_blank" rel="noopener noreferrer">
                <Icon :name="item.icon" :size="16" />
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <p class="footer__logotype" aria-hidden="true">{{ clinic.name }}</p>

    <div class="container footer__bottom">
      <p class="mono">
        {{ clinic.legal.razaoSocial }} · CNPJ {{ clinic.legal.cnpj }} · CNES
        {{ clinic.legal.cnes }}
      </p>
      <p class="mono">© {{ year }} — Todos os direitos reservados</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--ink);
  color: var(--paper);
  padding-top: clamp(4rem, 9vw, 7rem);
  overflow: hidden;
}

.footer__grid {
  display: grid;
  gap: 2.75rem;
  padding-bottom: clamp(3rem, 7vw, 5rem);
}

.footer__tagline {
  font-family: var(--font-display);
  font-size: var(--display-sm);
  line-height: 1.05;
  letter-spacing: -0.025em;
  max-width: 16ch;
}

.footer__desc {
  margin-block: 1.25rem 1.75rem;
  color: var(--fg-soft);
  max-width: 38ch;
  font-size: var(--text-sm);
}

.footer__label {
  color: var(--fg-faint);
  margin-bottom: 1.1rem;
}

.footer__col ul {
  display: grid;
  gap: 0.65rem;
  font-size: var(--text-sm);
}

.footer__col a {
  color: var(--fg-soft);
  transition: color 0.35s var(--ease);
}

.footer__col a:hover {
  color: var(--clay-soft);
}

.footer__address {
  color: var(--fg-faint);
  line-height: 1.55;
}

.footer__social a {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.footer__logotype {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 15.5vw, 15rem);
  line-height: 0.85;
  letter-spacing: -0.045em;
  white-space: nowrap;
  text-align: center;
  color: transparent;
  -webkit-text-stroke: 1px rgba(242, 239, 232, 0.28);
  padding-inline: var(--gutter);
}

.footer__bottom {
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-block: 1.5rem;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 0.5rem;
  color: var(--fg-faint);
}

@media (min-width: 768px) {
  .footer__grid {
    grid-template-columns: 1.5fr 1fr 1.2fr 0.9fr;
    gap: 2rem;
  }

  .footer__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
