import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import './styles/site.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
import './styles/station.css'
import './styles/entrance.css'
import './styles/crt-screen.css'
// O dossiê é a referência final para a interface inteira.
import './styles/figma.css'
import './styles/dossie.css'
import './styles/dossie-universal.css'
