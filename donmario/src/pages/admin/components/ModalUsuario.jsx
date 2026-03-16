import React, { useState, useEffect } from 'react';

const DOMAIN = "@maranatha.local";

const ModalUsuario = ({ isOpen, onClose, mode, user, onSubmit }) => {
  const initialFormState = {
    name: '', 
    username: '', 
    password: '', 
    role: 'customer',
    status: 'active'
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if ((mode === 'edit' || mode === 'view') && user) {
        
        const currentEmail = user.email || '';
        const extractedUsername = currentEmail.includes(DOMAIN) 
          ? currentEmail.replace(DOMAIN, '') 
          : currentEmail; 

        setFormData({
          name: user.name || '', 
          username: extractedUsername,
          password: '', 
          role: user.role || 'customer',
          status: user.status || 'active',
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, mode, user]);

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const getTitle = () => {
    if (mode === 'create') return 'Crear Usuario';
    if (mode === 'edit') return 'Editar Usuario';
    return 'Detalle de Usuario';
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    
    const dataToSubmit = {
      ...formData,
      email: `${formData.username}${DOMAIN}` 
    };
    
    onSubmit(dataToSubmit, mode);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{getTitle()}</h3>
          <button onClick={onClose} className="btn-icon" style={{ textDecoration: 'none', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Nombre Mostrar (Display Name)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isViewMode}
              required={!isViewMode}
              placeholder="Ej. Jorge Bustos"
            />
          </div>

          <div className="form-group">
            <label>Usuario / Correo</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isViewMode || mode === 'edit'} 
                required={!isViewMode}
                placeholder="usuario"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1 }}
              />
              <span style={{ 
                padding: '0.5rem', 
                backgroundColor: '#f3f4f6', 
                border: '1px solid #e5e7eb', 
                borderLeft: 'none',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
                color: '#6b7280',
                fontSize: '0.9rem'
              }}>
                {DOMAIN}
              </span>
            </div>
          </div>

          {!isViewMode && (
            <div className="form-group">
              <label>
                {mode === 'create' ? 'Contraseña' : 'Nueva Contraseña (dejar en blanco para mantener)'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isViewMode}
                required={mode === 'create'} 
                placeholder={mode === 'edit' ? '********' : ''}
              />
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isViewMode}
              >
                <option value="customer">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isViewMode}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </button>
            {!isViewMode && (
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;