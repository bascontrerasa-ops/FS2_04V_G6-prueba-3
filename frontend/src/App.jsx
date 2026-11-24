import { Route, Routes } from 'react-router-dom'
import NavbarTienda from './components/NavbarTienda'
import TiendaView from './views/TiendaView'
import DetalleProductoView from './views/DetalleProductoView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'
import AdminLayout from './views/admin/AdminLayout'
import AdminProductosView from './views/admin/AdminProductosView'
import AdminAgregarProductoView from './views/admin/AdminAgregarProductoView'
import AdminEditarProductoView from './views/admin/AdminEditarProductoView'

function App() {
  return (
    <>
      <NavbarTienda />
      <Routes>
        <Route path="/" element={<TiendaView />} />
        <Route path="/producto/:id" element={<DetalleProductoView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/registro" element={<RegistroView />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="productos" element={<AdminProductosView />} />
          <Route path="productos/nuevo" element={<AdminAgregarProductoView />} />
          <Route path="productos/editar/:id" element={<AdminEditarProductoView />} />
        </Route>
      </Routes>
    </>
  )
}

export default App