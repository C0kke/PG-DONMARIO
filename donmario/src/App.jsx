import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Contacto from './pages/Contacto';
import DetalleProducto from './pages/DetalleProducto';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import './index.css';

function App() {
  const location = useLocation();
  const isPublicRoute = !location.pathname.startsWith('/admin') && location.pathname !== '/login';

  return (
    <div className="app">
      {isPublicRoute && <Navbar />}
      <main style={{ width: '100VW' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
             <Route path="/admin" element={<Dashboard />} />
             <Route path="/admin/productos" element={<div>Vista de Productos (Pronto)</div>} />
             <Route path="/admin/usuarios" element={<div>Vista de Usuarios (Pronto)</div>} />
          </Route>

        </Routes>
      </main>
    </div>
  );
}

export default App;