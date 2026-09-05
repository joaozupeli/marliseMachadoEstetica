# Marlise Machado Estetica

Site de clínica geral com direção de arte editorial, feito com **Vue 3** (Composition API),
**Vue Router**, **GSAP + ScrollTrigger**, **Lenis** e CSS puro.

## Como rodar

O projeto usa **pnpm**. Não misture com npm ou yarn: cada um monta o `node_modules` de um jeito,
e rodar dois gerenciadores no mesmo projeto quebra a instalação (o pnpm move os pacotes do npm
para uma pasta `.ignored/` e o Vite some).

```bash
pnpm install
pnpm dev
```

Build de produção:

```bash
pnpm build
pnpm preview
```

Se a instalação travar ou o Vite sumir, limpe e reinstale:

```bash
rm -rf node_modules
pnpm install
```

## Como as animações funcionam

Esta é a parte mais importante de entender antes de mexer.

As **revelações ao rolar** (todo elemento com `data-anim`) usam **IntersectionObserver**, não
ScrollTrigger. O motivo é um bug real que derrubou as animações em produção: o ScrollTrigger mede
a posição dos elementos no instante em que é criado, e em produção as imagens e fontes chegam
depois dessa medida. A página crescia, as posições ficavam erradas e os gatilhos disparavam todos
de uma vez durante o carregamento, se autodestruindo antes de o usuário rolar. O resultado era um
site visível, porém completamente estático. O IntersectionObserver é calculado pelo navegador em
tempo real, então atraso de rede não consegue desalinhá-lo.

O ScrollTrigger continua no projeto, mas só onde ele é insubstituível: efeitos contínuos ligados
ao scroll (parallax das imagens e barra de progresso do header). Esses são seguros porque se
atualizam a cada quadro e nunca escondem conteúdo.

Regra prática ao criar seções novas: **se a animação esconde conteúdo, use `useReveal`. Se ela só
desloca algo que já está visível, pode usar ScrollTrigger.**

Tudo isso vive em `src/composables/useMotion.js`:

| Função | Para quê |
|--------|----------|
| `startMotion()` | Liga o Lenis, o refresh após fontes/imagens e os cliques em âncora. Chamada uma vez no `main.js` |
| `useReveal(ref)` | Revela os `[data-anim]` dentro do elemento quando entram na tela |
| `useSplitReveal(ref)` | Título que sobe linha a linha por trás de uma máscara |
| `useCountUp(ref, valor)` | Números que contam de zero |
| `useParallax(ref)` | Deslocamento suave ligado ao scroll |
| `useMarquee(ref)` | Faixa de texto em rolagem infinita |
| `useScrollProgress(ref)` | Barra de progresso da página |
| `useStaggerOnChange(ref, fonte)` | Reanima uma lista quando o filtro muda |

## Onde editar o conteúdo

| Arquivo | Conteúdo |
|---------|----------|
| `src/data/clinic.js` | Nome, textos do hero e do manifesto, WhatsApp, endereço, horários, convênios, números, CNES/CNPJ |
| `src/data/specialties.js` | Especialidades, descrições e imagem de preview |
| `src/data/team.js` | Equipe (médicos + apoio), CRM, bios, fotos |
| `src/data/testimonials.js` | Depoimentos |

O composable `src/composables/useWhatsApp.js` monta todos os links de WhatsApp.

> As fotos são do Unsplash e servem só de rascunho. Troque pelas fotos reais antes de publicar.

## Design system

Os tokens ficam no topo de `src/assets/styles/base.css`. Trocar a paleta e as fontes ali muda o
site inteiro, o que facilita adaptar o modelo para outro cliente.

- Paleta: papel cru, verde profundo e terracota
- Tipografia: `Instrument Serif` (display), `Inter Tight` (texto), `JetBrains Mono` (rótulos)
- Seções escuras recebem a classe `theme-dark`, que inverte as variáveis de cor

## Estrutura

```
src/
  assets/styles/base.css   tokens + estilos base
  components/
    layout/    AppHeader, AppFooter, WhatsAppFloat
    home/      Hero, About, Specialties, Team, Testimonials, Contact
    ui/        Icon, TeamCard, TeamModal, StatCounter, CustomCursor
  composables/ useMotion, useWhatsApp
  data/        clinic, specialties, team, testimonials
  router/
  views/HomeView.vue
  main.js
```

## Deploy na Vercel

O `vercel.json` define o redirecionamento de SPA e o cache dos assets; o comando de build vem do
preset do Vite. O projeto usa **pnpm**: mantenha apenas o `pnpm-lock.yaml` versionado. Ter dois
lockfiles faz a Vercel escolher o gerenciador de forma imprevisível e foi um dos problemas
corrigidos aqui.

## Acessibilidade e performance

- Imagens abaixo da dobra com `loading="lazy"` e dimensões declaradas para evitar salto de layout
- Animações apenas em `transform` e `opacity`
- Cursor customizado só em ponteiro fino (mouse); no toque ele fica desligado
- Modal com `Escape`, foco inicial e trava de rolagem do fundo
