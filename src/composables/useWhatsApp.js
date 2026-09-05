/**
 * Composable reutilizável para CTAs de WhatsApp.
 * EDITAR: o número padrão fica em src/data/clinic.js
 *
 * @param {string} phoneNumber - DDI+DDD+número (só dígitos)
 * @param {string} [message] - mensagem pré-preenchida
 */
export function useWhatsApp(phoneNumber, message = '') {
  const digits = String(phoneNumber || '').replace(/\D/g, '')

  function buildUrl(customMessage) {
    const text = customMessage ?? message
    const base = `https://wa.me/${digits}`
    if (!text) return base
    return `${base}?text=${encodeURIComponent(text)}`
  }

  function openWhatsApp(customMessage) {
    const url = buildUrl(customMessage)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return {
    buildUrl,
    openWhatsApp,
    phoneDigits: digits,
  }
}
