<script setup>
/**
 * Ícones SVG leves (stroke) — sem dependência de biblioteca.
 */
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 24,
  },
})

const paths = {
  shield:
    'M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z',
  clock:
    'M12 7v5l3 2 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  heart:
    'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  users:
    'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20 M15.5 7.5a3 3 0 1 0-6 0 3 3 0 0 0 6 0z M19 20v-1.2a3 3 0 0 0-2-2.8 M17.5 4.6a2.5 2.5 0 0 1 0 4.8',
  stethoscope:
    'M6 4v6a4 4 0 0 0 8 0V4 M6 4H4 M14 4h2 M10 14v2a4 4 0 0 0 8 0v-1 M18 11a2 2 0 1 0 0.01 0',
  baby:
    'M12 8a3 3 0 1 0 0.01 0 M9 13c.8 1.2 2 2 3 2s2.2-.8 3-2 M8 18c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5 M5 11c.5-2 2-3.5 4-4 M19 11c-.5-2-2-3.5-4-4',
  heartPulse:
    'M3 12h3l2-5 3 10 2-5h8 M19.5 7.5a4 4 0 0 0-7.5-2 4 4 0 0 0-7.5 2',
  flower:
    'M12 12m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0 M12 5c1.5 1.5 1.5 3.5 0 5-1.5-1.5-1.5-3.5 0-5z M12 19c-1.5-1.5-1.5-3.5 0-5 1.5 1.5 1.5 3.5 0 5z M5 12c1.5-1.5 3.5-1.5 5 0-1.5 1.5-3.5 1.5-5 0z M19 12c-1.5 1.5-3.5 1.5-5 0 1.5-1.5 3.5-1.5 5 0z',
  sparkle:
    'M12 3l1.2 5.3L18 10l-4.8 1.7L12 17l-1.2-5.3L6 10l4.8-1.7L12 3z M18.5 15l.6 2.4L21.5 18l-2.4.6L18.5 21l-.6-2.4L15.5 18l2.4-.6.6-2.4z',
  leaf:
    'M5 19c8-1 13-7 14-14-7 1-13 6-14 14z M5 19c3-3 6-5 9-7',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6L6 18',
  whatsapp:
    'M12 3a9 9 0 0 0-7.8 13.4L3 21l4.8-1.2A9 9 0 1 0 12 3z M8.5 9.5c.3-.6.6-.6.8-.6h.6c.2 0 .4 0 .6.5l.7 1.7c.1.3 0 .5-.2.7l-.4.5c-.2.2-.1.4.1.7.4.5 1 1.1 1.6 1.5.5.4.9.4 1.2.2l.6-.3c.2-.1.5-.1.7.2l1.1 1.3c.2.2.1.5 0 .7-.3.5-1.1.9-1.7.9-.5 0-1.1-.1-2.2-.7-1.4-.7-2.5-1.9-3.3-3.3-.5-.9-.8-1.7-.8-2.3 0-.5.3-1.2.7-1.5z',
  chevron: 'M9 6l6 6-6 6',
  star: 'M12 3l2.4 5.4 5.9.6-4.5 3.9 1.3 5.7L12 15.8 6.9 18.6l1.3-5.7L3.7 9l5.9-.6L12 3z',
  mapPin: 'M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z M12 10.5a1.5 1.5 0 1 0 0.01 0',
  phone: 'M7 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5L16 13l4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 5 6a2 2 0 0 1 2-2z',
  mail: 'M4 7h16v10H4V7z M4 7l8 6 8-6',
  instagram:
    'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z M12 9a3 3 0 1 0 0.01 0 M17.5 7.5h.01',
  facebook: 'M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.5L16 12h-3v-2c0-.6.4-1 1-1z',
  youtube:
    'M3.5 9.5c0-1.7 1.3-3 3-3h11c1.7 0 3 1.3 3 3v5c0 1.7-1.3 3-3 3h-11c-1.7 0-3-1.3-3-3v-5z M10 9.5l5 2.5-5 2.5v-5z',
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
  arrowUpRight: 'M7 17L17 7 M8 7h9v9',
  arrowDown: 'M12 5v14 M6 13l6 6 6-6',
  plus: 'M12 5v14 M5 12h14',
  minus: 'M5 12h14',
}
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.heart" />
  </svg>
</template>

<style scoped>
.icon {
  flex-shrink: 0;
}
</style>
