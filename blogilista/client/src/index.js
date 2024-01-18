import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { NotificationContextProvider } from './reducers/notificationReducer'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </NotificationContextProvider>
)
