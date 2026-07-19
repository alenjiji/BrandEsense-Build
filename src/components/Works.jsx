import CreativeShowcase from './CreativeShowcase.jsx'
import { worksClients, worksHeading } from '../data/works.js'

// The Works section — one showcase, switchable across every client.
export default function Works() {
  return <CreativeShowcase heading={worksHeading} clients={worksClients} />
}
