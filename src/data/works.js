// Reusable "Works" showcase data — one entry per client. The CreativeShowcase
// component renders any of these, so adding a new client is just another object
// here (heading spans + description + the list of creative posters).

const g = (t) => ({ t, red: false })
const r = (t) => ({ t, red: true })

export const worksClients = [
  {
    id: 'i-leaf',
    name: 'i-LEAF Doors',
    heading: [[g('Lead with vision.')], [g('Create '), r('with impact.')]],
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam',
    // ordered so the shield "19 years of trust" poster sits in the middle
    // (the design's featured centre)
    creatives: [
      { src: '/works/iLeaf Poster 2.webp' },
      { src: '/works/i Leaf Door Post_2.webp' },
      { src: '/works/i Leaf Door Post_3.webp' },
      { src: '/works/19 years trust.webp' },
      { src: '/works/i Leaf_POST_Creative 10_11-03.webp' },
      {
        src: '/works/For 19 years, i-Leaf steel doors have stood guard, protecting what matters the most. We offer a.webp',
      },
      {
        src: '/works/Your familys sweet moments deserve a secure home. For 19 years, i-Leaf Steel Doors has stood st.webp',
      },
    ],
  },
]
