<script setup>
defineProps({
  member: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

defineEmits(['select'])
</script>

<template>
  <article class="member">
    <button
      class="member__btn"
      type="button"
      :aria-label="`Ver perfil de ${member.name}`"
      @click="$emit('select', member)"
    >
      <span class="member__frame">
        <img :src="member.photo" :alt="member.photoAlt" width="600" height="750" loading="lazy" />
        <span class="member__index mono">{{ String(index + 1).padStart(2, '0') }}</span>
      </span>

      <span class="member__meta">
        <span class="member__name">{{ member.name }}</span>
        <span class="member__role mono">{{ member.role }}</span>
      </span>
    </button>
  </article>
</template>

<style scoped>
.member__btn {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  display: grid;
  gap: 0.9rem;
}

.member__frame {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 3px;
  aspect-ratio: 4 / 5;
  background: var(--paper-3);
}

.member__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.02);
  transition: transform 0.9s var(--ease), filter 0.7s var(--ease);
}

.member__btn:hover .member__frame img,
.member__btn:focus-visible .member__frame img {
  transform: scale(1.05);
  filter: grayscale(0);
}

.member__index {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 0.5625rem;
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: rgba(242, 239, 232, 0.88);
  color: var(--ink);
}

.member__meta {
  display: grid;
  gap: 0.2rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}

.member__name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  transition: color 0.4s var(--ease);
}

.member__btn:hover .member__name {
  color: var(--clay);
}

.member__role {
  font-size: 0.625rem;
  color: var(--fg-faint);
}

.member__btn:focus-visible {
  outline: 2px solid var(--clay);
  outline-offset: 6px;
}
</style>
