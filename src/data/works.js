// Works showcase data. The per-client creative lists are generated from the
// optimized asset tree into worksClients.json (filenames are long/emoji-laden,
// so they're read from disk rather than transcribed):
//
//   node scripts/generate-works.mjs
//
// Sepack and Margin Free have no logo asset yet — they fall back to a wordmark.
import clients from './worksClients.json'

const g = (t) => ({ t, red: false })
const r = (t) => ({ t, red: true })

export const worksHeading = [[g('Lead with vision.')], [g('Create '), r('with impact.')]]

export const worksClients = clients

export default worksClients
