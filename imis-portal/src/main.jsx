import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import './styles/app.css'
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <AuthProvider>
        <DataProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </DataProvider>
      </AuthProvider>
    </LangProvider>
  </React.StrictMode>,
)
