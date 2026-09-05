import { onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/*
 * Revelações usam IntersectionObserver, não ScrollTrigger.
 * O ScrollTrigger mede as posições dos elementos no momento em que é criado; em
 * produção as imagens e fontes chegam depois dessa medida, a página cresce e as
 * posições ficam erradas. O IntersectionObserver é calculado pelo navegador em
 * tempo real, então nenhum atraso de carregamento consegue desalinhá-lo.
 * O ScrollTrigger continua sendo usado só onde ele é insubstituível: efeitos
 * contínuos ligados ao scroll (parallax e barra de progresso), que se corrigem
 * sozinhos a cada refresh e nunca escondem conteúdo.
 *
 * O Lenis (smooth scroll) fica no App.vue — aqui só guardamos a instância para
 * as âncoras do menu poderem chamar scrollTo.
 */

let lenis = null

export function setLenis(instance) {
  lenis = instance
}

function whenFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve()
  return document.fonts.ready
}

let refreshTimer
function refreshSoon() {
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180)
}

function watchLayoutChanges() {
  whenFontsReady().then(refreshSoon)

  if (document.readyState === 'complete') refreshSoon()
  else window.addEventListener('load', refreshSoon, { once: true })

  // Eventos de load de imagem não sobem na árvore, por isso a escuta é na captura.
  document.addEventListener(
    'load',
    (event) => {
      if (event.target instanceof HTMLImageElement) refreshSoon()
    },
    true,
  )
}

export function scrollToHash(hash) {
  const target = document.querySelector(hash)
  if (!target) return

  const offset =
    -Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      10,
    ) || -76

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset })
  }
}

function handleAnchorClicks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#"]')
    if (!link) return

    const hash = link.getAttribute('href')
    if (!hash || hash === '#' || !document.querySelector(hash)) return

    event.preventDefault()
    scrollToHash(hash)
  })
}

export function startMotion() {
  ScrollTrigger.config({ ignoreMobileResize: true })
  watchLayoutChanges()
  handleAnchorClicks()
}

/*
 * O disparo é por borda (threshold 0 + margem inferior negativa), não por área
 * visível: um bloco mais alto que a tela nunca alcançaria uma fração de área
 * grande e ficaria sem revelar.
 */
function observeOnce(elements, onVisible, options = {}) {
  const { threshold = 0, rootMargin = '0px 0px -10% 0px' } = options

  if (typeof IntersectionObserver === 'undefined') {
    onVisible(elements)
    return null
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target)
    if (!visible.length) return

    visible.forEach((el) => observer.unobserve(el))
    onVisible(visible)
  }, { threshold, rootMargin })

  elements.forEach((el) => observer.observe(el))
  return observer
}

/**
 * Revela elementos ao entrarem na tela. Sem `selector`, anima o próprio elemento.
 */
export function useReveal(rootRef, options = {}) {
  let observer

  onMounted(() => {
    const root = rootRef.value
    if (!root) return

    const {
      selector = '[data-anim]',
      y = 40,
      duration = 1.25,
      stagger = 0.1,
      ease = 'expo.out',
      threshold,
    } = options

    const items = selector ? Array.from(root.querySelectorAll(selector)) : [root]
    if (!items.length) return

    gsap.set(items, { opacity: 0, y })

    observer = observeOnce(
      items,
      (visible) => {
        gsap.to(visible, { opacity: 1, y: 0, duration, stagger, ease, overwrite: 'auto' })
      },
      { threshold },
    )
  })

  onUnmounted(() => observer?.disconnect())
}

/**
 * Revela um título quebrando-o em linhas que sobem por trás de uma máscara.
 * A quebra é desfeita ao final para o texto voltar ao fluxo normal e reagir a resize.
 */
export function useSplitReveal(elRef, options = {}) {
  let observer
  let split
  let cancelled = false

  onMounted(() => {
    const el = elRef.value
    if (!el) return

    const { duration = 1.4, stagger = 0.1, delay = 0, ease = 'expo.out' } = options

    gsap.set(el, { opacity: 0 })

    whenFontsReady().then(() => {
      if (cancelled || !elRef.value) return

      split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
      gsap.set(el, { opacity: 1 })
      gsap.set(split.lines, { yPercent: 110 })

      observer = observeOnce([el], () => {
        gsap.to(split.lines, {
          yPercent: 0,
          duration,
          delay,
          stagger,
          ease,
          onComplete: () => split?.revert(),
        })
      })
    })
  })

  onUnmounted(() => {
    cancelled = true
    observer?.disconnect()
    split?.revert()
  })
}

/**
 * Conta de zero até o valor final quando o número entra na tela.
 */
export function useCountUp(elRef, endValue, options = {}) {
  let observer
  let tween

  onMounted(() => {
    const el = elRef.value
    if (!el) return

    const { duration = 2, suffix = '', ease = 'power2.out' } = options
    const counter = { value: 0 }
    const render = () => {
      el.textContent = `${Math.round(counter.value).toLocaleString('pt-BR')}${suffix}`
    }

    render()

    observer = observeOnce([el], () => {
      tween = gsap.to(counter, { value: endValue, duration, ease, onUpdate: render })
    }, { threshold: 0.4 })
  })

  onUnmounted(() => {
    observer?.disconnect()
    tween?.kill()
  })
}

/**
 * Deslocamento suave ligado ao scroll. Nunca esconde o elemento.
 */
export function useParallax(elRef, options = {}) {
  let tween

  onMounted(() => {
    const el = elRef.value
    if (!el) return

    const { yPercent = 12, scale = 1 } = options

    tween = gsap.fromTo(
      el,
      { yPercent: -yPercent / 2, scale },
      {
        yPercent: yPercent / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  })

  onUnmounted(() => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
  })
}

/**
 * Faixa de texto em rolagem infinita. O conteúdo do trilho deve estar duplicado.
 */
export function useMarquee(trackRef, options = {}) {
  let tween

  onMounted(() => {
    const track = trackRef.value
    if (!track) return

    const { duration = 26, reverse = false } = options

    tween = gsap.to(track, {
      xPercent: reverse ? 0 : -50,
      startAt: { xPercent: reverse ? -50 : 0 },
      duration,
      ease: 'none',
      repeat: -1,
    })
  })

  onUnmounted(() => tween?.kill())
}

/**
 * Preenche uma barra de 0 a 100% conforme o documento é percorrido.
 */
export function useScrollProgress(elRef) {
  let tween

  onMounted(() => {
    const el = elRef.value
    if (!el) return

    tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      },
    )
  })

  onUnmounted(() => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
  })
}

/**
 * Reanima uma lista sempre que os itens filtrados mudam.
 */
export function useStaggerOnChange(containerRef, source, options = {}) {
  const { selector = '[data-stagger]', y = 26 } = options

  function animate() {
    const container = containerRef.value
    if (!container) return

    const items = container.querySelectorAll(selector)
    if (!items.length) return

    gsap.fromTo(
      items,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.055, ease: 'power3.out', overwrite: true },
    )
  }

  watch(source, () => requestAnimationFrame(animate))
}
