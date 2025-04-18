
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import AdminPanel from './pages/AdminPanel'
import { PersistGate } from 'redux-persist/integration/react'

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AdminPanel />
      </PersistGate>
    </Provider>
  )
}

export default App
