// Slide content + a flat, editable list of visual elements per brand slide.
//
// Every element (portrait, supporting imagery, framing graphics) is one entry
// so the in-site layout editor can move / resize / reorder / add / delete any
// of them uniformly, and positions can be copied straight back into this file.
//
//   left / top -> anchor position, percentage of the viewport
//   w          -> width in vw (height keeps the image's aspect ratio)
//   center     -> left/top mark the element's CENTRE (translate -50%,-50%)
//   z          -> stacking order
//   depth      -> parallax travel in px on pointer move (bigger = feels closer)
//   glow       -> soft white bloom so transparent artwork blends into the bg
//   spin       -> rotate continuously (rings)
//   float      -> gentle idle drift
//   kind       -> 'image' | 'svg'

export const RED = '#ed3d24'
export const GREY = '#636466'

const g = (t) => ({ t, red: false })
const r = (t) => ({ t, red: true })

// Framing graphics — identical on every brand slide (copied from the Metro Man
// slide). Kept as one shared list so tuning it updates all slides at once.
const DECOR = [
  { id: 'ring-1', kind: 'svg', src: '/assets/ring_1_rotate.svg', left: 53, top: 44, w: 30, z: 25, depth: 16, center: true, spin: true },
  { id: 'ring-arrow', kind: 'svg', src: '/assets/ring_arrow_2.svg', left: 58, top: 65.5, w: 30, z: 33, depth: 20, center: true },
  { id: 'arrow-3', kind: 'svg', src: '/assets/arrow_3.svg', left: 12, top: 13, w: 14, z: 36, depth: 30 },
  { id: 'circle-1', kind: 'svg', src: '/assets/circle_1.svg', left: 71, top: 9, w: 5, z: 36, depth: 46, float: true },
  { id: 'circle-2', kind: 'svg', src: '/assets/circle_2.svg', left: 25, top: 75, w: 2.4, z: 36, depth: 52, float: true },
  { id: 'cross-1', kind: 'svg', src: '/assets/arrow_Element_bg.svg', left: 42, top: 7.5, w: 2.8, z: 36, depth: 40 },
  { id: 'cross-2', kind: 'svg', src: '/assets/arrow_Element_bg.svg', left: 31, top: 80, w: 2.6, z: 36, depth: 44 },
]

// give each slide its own copy of the shared decor (so the editor can still
// tweak one slide without mutating the others)
const decor = () => DECOR.map((d) => ({ ...d }))

export const slides = [
  {
    id: 'intro',
    type: 'intro',
    heading: [
      [g('We associate')],
      [g('with clients,')],
      [g('who '), r('value their')],
      [r('customers.')],
    ],
    quote: ['Commitment is everything.', '— Brand Esense'],
    sub: ['Branding & Marketing', 'For Startup and Giants'],
    duration: 2700,
  },

  {
    id: 'sreedharan',
    type: 'brand',
    duration: 6400,
    heading: [
      [g('We are')],
      [g('honoured')],
      [g('to have')],
      [g('worked')],
      [g('with '), r('Kochi')],
      [r('Metro Rail')],
      [r('Limited.')],
    ],
    desc: {
      name: 'Elattuvalapil Sreedharan',
      role: 'Metro Man',
      roleRed: true,
      text: 'A true visionary who builds trust by embracing responsibility.',
      top: '31%',
      width: '22vw',
    },
    elements: [
      { id: 'metro', kind: 'image', src: '/hero/Sreedharan/metro_left_top.webp', left: 15.5, top: 25.5, w: 37, z: 19, depth: 42, glow: true },
      { id: 'bridge', kind: 'image', src: '/hero/Sreedharan/bridge_right.webp', left: 43, top: 39, w: 40, z: 20, depth: 38, glow: true },
      { id: 'ship', kind: 'image', src: '/hero/Sreedharan/ship_right.webp', left: 59.5, top: 59, w: 20, z: 20, depth: 54, glow: true },
      { id: 'person', kind: 'image', src: '/hero/Sreedharan/sreedharan.webp', left: 51, top: 50, w: 38, z: 20, depth: 26, center: true, glow: true },
      { id: 'ring-1', kind: 'svg', src: '/assets/ring_1_rotate.svg', left: 53, top: 44, w: 30, z: 19, depth: 16, center: true, spin: true },
      { id: 'ring-arrow', kind: 'svg', src: '/assets/ring_arrow_2.svg', left: 58, top: 65.5, w: 30, z: 33, depth: 20, center: true },
      { id: 'arrow-3', kind: 'svg', src: '/assets/arrow_3.svg', left: 12, top: 13, w: 14, z: 36, depth: 30 },
      { id: 'circle-1', kind: 'svg', src: '/assets/circle_1.svg', left: 71, top: 9, w: 5, z: 36, depth: 46, float: true },
      { id: 'circle-2', kind: 'svg', src: '/assets/circle_2.svg', left: 25, top: 75, w: 2.4, z: 36, depth: 52, float: true },
      { id: 'cross-1', kind: 'svg', src: '/assets/arrow_Element_bg.svg', left: 42, top: 7.5, w: 2.8, z: 36, depth: 40 },
      { id: 'cross-2', kind: 'svg', src: '/assets/arrow_Element_bg.svg', left: 31, top: 80, w: 2.6, z: 36, depth: 44 },
    ],
  },

  {
    id: 'v-gaurd',
    type: 'brand',
    duration: 6400,
    heading: [
      [g('We are')],
      [g('privileged')],
      [g('to have')],
      [g('worked with')],
      [r('V Gaurd')],
      [r('Industries.')],
    ],
    desc: {
      name: 'Kochouseph Chittilappilly,',
      role: 'Founder, V-Guard Industries',
      text: 'An innovator who seamlessly blends business with benevolence.',
      top: '31%',
      width: '22vw',
    },
    elements: [
      { id: 'building', kind: 'image', src: '/hero/v-gaurd/building_left.webp', left: 21.5, top: 24.5, w: 40, z: 20, depth: 42, glow: true },
      { id: 'heater', kind: 'image', src: '/hero/v-gaurd/heater_right.webp', left: 56.5, top: 36, w: 30, z: 26, depth: 38, glow: true },
      { id: 'water-heater', kind: 'image', src: '/hero/v-gaurd/water_heater_right.webp', left: 77, top: 40.5, w: 12, z: 34, depth: 52, glow: true },
      { id: 'person', kind: 'image', src: '/hero/v-gaurd/kochu_ousep.webp', left: 53, top: 52, w: 35, z: 30, depth: 26, center: true, glow: true },
      ...decor(),
    ],
  },

  {
    id: 'synthite',
    type: 'brand',
    duration: 6400,
    heading: [
      [g('We are')],
      [g('delighted')],
      [g('to have')],
      [g('worked with')],
      [r('Synthite')],
      [r('Industries')],
    ],
    desc: {
      name: 'Dr. Viju Jacob',
      role: 'Founder, Synthite Industries',
      text: 'A trailblazer who transforms the ordinary through innovation',
      top: '31%',
      width: '22vw',
    },
    elements: [
      { id: 'building', kind: 'image', src: '/hero/synthite/synthite_building_left.webp', left: 18, top: 24, w: 38, z: 20, depth: 42, glow: true },
      { id: 'medicines', kind: 'image', src: '/hero/synthite/medicines_and_herbs_right.webp', left: 65.5, top: 50.5, w: 22, z: 34, depth: 52, glow: true },
      { id: 'person', kind: 'image', src: '/hero/synthite/viju_jacob.webp', left: 55, top: 51, w: 37, z: 30, depth: 26, center: true, glow: true },
      ...decor(),
    ],
  },

  {
    id: 'prasad-yogi',
    type: 'brand',
    duration: 6400,
    heading: [
      [g('Lead with')],
      [g('vision.')],
      [r('Create')],
      [r('with')],
      [r('impact.')],
    ],
    desc: {
      name: 'Prasad Yogi',
      role: 'CEO, Brand Essence Global',
      text: 'Creative leadership driving vision, growth & excellence.',
      top: 'auto',
      bottom: '19%',
      width: '21vw',
    },
    elements: [
      { id: 'studio-left', kind: 'image', src: '/hero/prasad-yogi/bg_Studio_Left.webp', left: 19, top: 7, w: 26, z: 20, depth: 42, glow: true },
      { id: 'studio-right', kind: 'image', src: '/hero/prasad-yogi/bg_right_studio.webp', left: 66, top: 23, w: 32, z: 22, depth: 38, glow: true },
      { id: 'person', kind: 'image', src: '/hero/prasad-yogi/prasad_yogi.webp', left: 54, top: 52, w: 42, z: 30, depth: 26, center: true, glow: true },
      ...decor(),
    ],
  },
]

// Assets available to drop into a slide from the editor palette.
export const PALETTE = [
  { label: 'Ring (rotating)', src: '/assets/ring_1_rotate.svg' },
  { label: 'Ring + arrow', src: '/assets/ring_arrow_2.svg' },
  { label: 'Curved arrow', src: '/assets/arrow_3.svg' },
  { label: 'Red circle L', src: '/assets/circle_1.svg' },
  { label: 'Red circle S', src: '/assets/circle_2.svg' },
  { label: 'Crosshair', src: '/assets/arrow_Element_bg.svg' },
  { label: 'Arrow (btn)', src: '/assets/arrow-button.svg' },
  { label: 'Pill', src: '/assets/button.svg' },
  { label: 'Logo (box)', src: '/logo/logo_1.svg' },
  { label: 'Logo (full)', src: '/logo/logo_2.svg' },
]
