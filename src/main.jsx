import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { store } from './states/index.js'
import { hydrateToken } from './states/auth/slice.js'
import './index.css'

store.dispatch(hydrateToken())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              fontFamily: 'monospace',
              fontSize: '13px'
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#1e293b' }
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#1e293b' }
            }
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)

