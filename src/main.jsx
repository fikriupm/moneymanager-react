import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
)
