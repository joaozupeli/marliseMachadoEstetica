/**
 * ============================================================
 * DADOS DA CLÍNICA — Marlise Machado Estética
 * Demo personalizado a partir de clinproto (molde intacto)
 * ============================================================
 */

export const clinic = {
  name: 'Marlise Machado Estética',
  tagline: 'Saúde e cuidados com a pele em Boa Vista',
  shortDescription:
    'Estética íntima e acolhedora no Centro de Beleza Requinte — soft pink, floral e foco em cuidados com a pele no Boa Vista, Curitiba.',

  hero: {
    eyebrow: 'Curitiba · Boa Vista',
    titleLead: 'Pele cuidada',
    titleAccent: 'com delicadeza',
    titleTail: '',
    lead: 'Protocolos de skin-care e estética com atendimento próximo. Ambiente floral e suave no Centro de Beleza Requinte — agende pelo WhatsApp.',
    imageAlt: 'Cuidados com a pele em ambiente acolhedor e floral',
  },

  manifesto: {
    lead: 'Nós acreditamos que',
    statement: 'cuidar da pele é um gesto de presença.',
    body: 'Cada protocolo começa com escuta: o que a sua pele pede, o que o seu ritmo permite e como manter o resultado no dia a dia — com carinho e clareza.',
  },

  whatsapp: '554197243624',
  whatsappDefaultMessage:
    'Olá! Gostaria de agendar um horário com a Marlise Machado Estética.',

  phone: '(41) 97243-624',
  email: 'contato@marlisemachadoestetica.com.br',

  address: {
    street: 'R. Antônio Lago, 200 — Centro de Beleza Requinte',
    neighborhood: 'Boa Vista',
    city: 'Curitiba',
    state: 'PR',
    zip: '82540-000',
    mapEmbedUrl:
      'https://www.google.com/maps?q=Rua+Antônio+Lago+200+Boa+Vista+Curitiba+PR&output=embed',
  },

  hours: [
    { days: 'Segunda a Sexta', time: '09:00 – 19:00' },
    { days: 'Sábado', time: 'Sob agendamento' },
    { days: 'Domingo', time: 'Fechado' },
  ],

  insurance: ['Particular', 'Pacotes de tratamento'],

  stats: [
    { value: 1100, suffix: '+', label: 'Seguidores no Instagram' },
    { value: 200, suffix: '', label: 'Endereço no Requinte' },
    { value: 5, suffix: '', label: 'Focos de cuidado com a pele' },
    { value: 1, suffix: '', label: 'Canal WhatsApp' },
  ],

  highlights: [
    {
      id: 'pele',
      title: 'Skin-care íntimo',
      description: 'Protocolos pensados para a saúde e o viço da pele.',
      icon: 'flower',
    },
    {
      id: 'floral',
      title: 'Ambiente acolhedor',
      description: 'Espaço suave no Centro de Beleza Requinte, Boa Vista.',
      icon: 'sparkle',
    },
    {
      id: 'whats',
      title: 'Agende no WhatsApp',
      description: 'Resposta humana e rápida para dúvidas e horários.',
      icon: 'heart',
    },
    {
      id: 'local',
      title: 'Boa Vista · Curitiba',
      description: 'R. Antônio Lago, 200 — fácil acesso no bairro.',
      icon: 'clock',
    },
  ],

  social: {
    instagram: 'https://www.instagram.com/marlisemachadoestetica/',
    facebook: null,
    youtube: null,
  },

  legal: {
    cnes: '—',
    cnpj: '—',
    razaoSocial: 'Marlise Machado Estética',
  },
}
