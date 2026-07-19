/**
 * Regenerates src/data/worksClients.json from the optimized asset tree.
 * Run after adding a client folder under public/works and re-running
 * optimize-images.mjs.
 *
 *   node scripts/generate-works.mjs
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = 'public/opt/works'

// Client metadata — `dir` is the folder under public/works ('' = the root
// files, which are i-LEAF). `logo: null` renders a text wordmark instead.
const CLIENTS = [
  { id: 'i-leaf', name: 'i-LEAF Doors', logo: '/logo/clients/ileaf.svg', dir: '', tagline: 'Steel doors built on 19 years of trust.' },
  { id: 'clinic7', name: 'Clinic 7', logo: '/logo/clients/clinic7.svg', dir: '(2)  C7', tagline: 'Skin, hair and dental care, made aspirational.' },
  { id: 'sepack', name: 'Sepack', logo: null, dir: '(3).  Sepack', tagline: 'Industrial packaging brought to life.' },
  { id: 'margin-free', name: 'Margin Free', logo: null, dir: '(4)  Margin Free', tagline: 'Comfort and craft for the modern home.' },
  { id: 'de-pedia', name: 'De Pedia', logo: '/logo/clients/De_pedia.svg', dir: '(5). D Pedia', tagline: 'Interiors that inspire every space.' },
  { id: 'vuespace', name: 'VueSpace', logo: '/logo/clients/vuespace.svg', dir: '(6). Viewspace', tagline: 'Interior studio storytelling.' },
]

const out = []
for (const c of CLIENTS) {
  const dir = path.join(ROOT, c.dir)
  const entries = await readdir(dir, { withFileTypes: true })
  const creatives = entries
    .filter((e) => e.isFile() && /\.webp$/i.test(e.name))
    .map((e) => `/opt/works/${c.dir ? `${c.dir}/` : ''}${e.name}`)
  out.push({ ...c, creatives })
  console.log(`${c.id.padEnd(12)} ${creatives.length} creatives`)
}

await mkdir('src/data', { recursive: true })
await writeFile('src/data/worksClients.json', JSON.stringify(out, null, 2))
console.log('\nwrote src/data/worksClients.json')
