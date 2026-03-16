import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../services/products';

import {
  getAllUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
} from '../../services/auth';

import { logout } from '../../services/auth';
import Tabla from './components/Tabla';
import ModalProducto from './components/ModalProducto';
import ModalUsuario from './components/ModalUsuario';
import { useProductContext } from '../../utils/ProductContext';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('products');
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'create', data: null });

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const { showPrices, togglePriceVisibility } = useProductContext();

  useEffect(() => {
    fetchData();
  }, [currentView]);

  const fetchData = async () => {
    setLoading(true);
    if (currentView === 'products') {
      const data = await getAllProducts();
      setProducts(data || []);
    } else {
      const data = await getAllUsers();
      setUsers(data || []);
    }
    setLoading(false);
  };

  const getFilteredData = () => {
    if (currentView === 'products') {
      return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
    } else {
      return users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
  };

  const handleLogout = async () => {
    try { await logout(); } catch (error) { console.error("Error al salir", error); }
  };

  const openModal = (mode, data = null) => {
    setModalState({ isOpen: true, mode, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create', data: null });
  };

  const handleSave = async (formData, mode) => {
    try {
      if (currentView === 'products') {
        if (mode === 'create') await createProduct(formData);
        else if (mode === 'edit') await updateProduct(modalState.data.id, formData);
      } else {
        if (mode === 'create') await adminCreateUser(formData);
        else if (mode === 'edit') await adminUpdateUser(modalState.data.id, formData);
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro de forma permanente?")) return;
    try {
      if (currentView === 'products') {
        await deleteProduct(id);
      } else {
        await adminDeleteUser(id);
      }
      fetchData();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Panel de Administración</h1>
          <span>Gestión de inventario y usuarios</span>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      <div className="view-tabs">
        <button className={`tab-btn ${currentView === 'products' ? 'active' : ''}`} onClick={() => { setCurrentView('products'); setSearchTerm(''); setSelectedCategory(''); }}>Productos</button>
        <button className={`tab-btn ${currentView === 'users' ? 'active' : ''}`} onClick={() => { setCurrentView('users'); setSearchTerm(''); }}>Usuarios</button>
      </div>

      <div className="admin-actionbar">
        <div className='action-buttons'>
          <input
            type="text"
            placeholder={currentView === 'products' ? "Buscar producto..." : "Buscar usuario..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {currentView === 'products' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          )}
        </div>
        {currentView === 'products' && (
          <button onClick={togglePriceVisibility} className="btn btn-primary">
            {showPrices ? 'Ocultar Precios en Catálogo' : 'Mostrar Precios en Catálogo'}
          </button>
        )}
        <button onClick={() => openModal('create')} className="btn btn-primary">
          + {currentView === 'products' ? 'Añadir Producto' : 'Añadir Usuario'}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos...</div>
      ) : (
        <Tabla
          data={getFilteredData()}
          type={currentView}
          onView={(item) => openModal('view', item)}
          onEdit={(item) => openModal('edit', item)}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {currentView === 'products' && (
        <ModalProducto
          isOpen={modalState.isOpen}
          onClose={closeModal}
          mode={modalState.mode}
          product={modalState.data}
          onSubmit={handleSave}
        />
      )}

      {currentView === 'users' && (
        <ModalUsuario
          isOpen={modalState.isOpen}
          onClose={closeModal}
          mode={modalState.mode}
          user={modalState.data}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
};

export default AdminDashboard;