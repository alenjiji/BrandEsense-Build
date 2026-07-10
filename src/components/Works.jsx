import CreativeShowcase from './CreativeShowcase.jsx'
import { worksClients } from '../data/works.js'

// The Works section. One CreativeShowcase per client — currently i-LEAF.
// Add more clients in data/works.js and they render as additional showcases.
export default function Works() {
  return (
    <>
      {worksClients.map((client) => (
        <CreativeShowcase
          key={client.id}
          heading={client.heading}
          description={client.description}
          creatives={client.creatives}
        />
      ))}
    </>
  )
}
