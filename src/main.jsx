import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// Every reload starts at the hero. Browsers otherwise restore the last scroll
// position, which would drop you mid-page (and fire section reveals with no
// scroll). Force manual restoration and pin to the top before React mounts.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
