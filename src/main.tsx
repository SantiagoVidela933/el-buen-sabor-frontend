import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react';
createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <Auth0Provider
    domain="dev-oeojpg2fmcrgcf2n.us.auth0.com"
    clientId="vhdjvuMntjaGKUWbKDRDQzJOrRTve1O5"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: 'https://apiSabor',
      scope: 'openid profile email'
    }}
    cacheLocation="localstorage" 
  >
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Auth0Provider>
</StrictMode>,
)
