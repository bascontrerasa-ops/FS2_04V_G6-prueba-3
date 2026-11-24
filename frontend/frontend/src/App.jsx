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
import AdminUsuariosView from './views/admin/AdminUsuariosView'
import CarritoView from './views/CarritoView'
import MisPedidosView from './views/MisPedidosView'
import AdminPedidosView from './views/admin/AdminPedidosView'

function App() {
  return (
    <>
      <NavbarTienda />
      <Routes>
        <Route path="/" element={<TiendaView />} />
        <Route path="/producto/:id" element={<DetalleProductoView />} />
        <Route path="/carrito" element={<CarritoView />} />
        <Route path="/mis-pedidos" element={<MisPedidosView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/registro" element={<RegistroView />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="productos" element={<AdminProductosView />} />
          <Route path="productos/nuevo" element={<AdminAgregarProductoView />} />
          <Route path="productos/editar/:id" element={<AdminEditarProductoView />} />
          <Route path="usuarios" element={<AdminUsuariosView />} />
          <Route path="pedidos" element={<AdminPedidosView />} />
        </Route>
      </Routes>
    </>
  )
}

export default App