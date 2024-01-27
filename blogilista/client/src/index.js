import './index.css'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { NotificationContextProvider } from './reducers/notificationReducer'
import { UserContextProvider } from './reducers/userReducer'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <div className='app-container'>
    <UserContextProvider>
      <NotificationContextProvider>
        <QueryClientProvider client={queryClient}>
          <App/>
        </QueryClientProvider>
      </NotificationContextProvider>
    </UserContextProvider>
  </div>
)
