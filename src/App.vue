<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import WhatsAppFloat from './components/layout/WhatsAppFloat.vue'
import CustomCursor from './components/ui/CustomCursor.vue'
import { setLenis } from './composables/useMotion'

gsap.registerPlugin(ScrollTrigger)

let lenis
let onTick

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  setLenis(lenis)
  lenis.on('scroll', ScrollTrigger.update)

  onTick = (time) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(0)
})

onUnmounted(() => {
  if (onTick) gsap.ticker.remove(onTick)
  lenis?.destroy()
  setLenis(null)
})
</script>

<template>
  <a class="skip-link" href="#topo">Ir para o conteúdo</a>
  <AppHeader />
  <RouterView />
  <AppFooter />
  <WhatsAppFloat />
  <CustomCursor />
  <div class="grain" aria-hidden="true" />
</template>
