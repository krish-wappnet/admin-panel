
import { Provider } from 'react-redux'
import { store } from './redux/store'
import AdminPanel from './pages/AdminPanel'

function App() {

  return (
    <Provider store={store}>
      <AdminPanel />
    </Provider>
  )
}

export default App
