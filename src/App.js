import { createMuiTheme, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import MiniDrawer from './components/Drawer/Drawer'
import GeneralModal from './components/Modal/GeneralModal'
import URLFiltersLoader from './components/URLFiltersLoader'
import { ModalProvider } from './Context/ModalContext'
import Products from './pages/Products'
import store from './redux/Store/store'

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0, // ekstra küçük
      sm: 600, // küçük
      md: 960, // orta
      lg: 1280, // büyük
      xl: 1920, // ekstra büyük
      xxl: 2560, // ekstra ekstra büyük
    },
  },
})

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <GeneralModal />
          <URLFiltersLoader /> {/* Yeni bileşeni buraya ekleyin */}
          <Routes>
            <Route path="/" element={<MiniDrawer />}>
              <Route index element={<Products />} />
              <Route path="products" element={<Products />} />
              {/* Diğer rota tanımlamalarınız */}
            </Route>
          </Routes>
        </ModalProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
