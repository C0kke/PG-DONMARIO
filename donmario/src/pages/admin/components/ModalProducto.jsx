import React, { useState, useEffect } from 'react';
import { uploadImageToCloudinary } from '../../../services/cloudinary';

const ModalProducto = ({ isOpen, onClose, mode, product, onSubmit }) => {
  const initialFormState = {
    name: '',
    brand: '',
    price: '',
    stock_status: true,
    description: '',
    image_url: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if ((mode === 'edit' || mode === 'view') && product) {
        setFormData({
          name: product.name || '',
          brand: product.brand || '',
          price: product.price || '',
          stock_status: product.stock_status === true,
          description: product.description || '',
          image_url: product.image_url || ''
        });
      } else {
        setFormData(initialFormState);
      }
      setSelectedFile(null);
      setIsUploading(false);
    }
  }, [isOpen, mode, product]);

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const getTitle = () => {
    if (mode === 'create') return 'Crear Producto';
    if (mode === 'edit') return 'Editar Producto';
    return 'Detalle de Producto';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'stock_status') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalImageUrl = formData.image_url;
    if (selectedFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadImageToCloudinary(selectedFile);
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        alert("Error al subir la imagen. Inténtalo de nuevo.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSubmit({ ...formData, image_url: finalImageUrl }, mode);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{getTitle()}</h3>
          <button onClick={onClose} className="btn-icon" style={{ textDecoration: 'none', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isViewMode}
                required={!isViewMode}
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Ej. Herramientas"
              />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={isViewMode}
                required={!isViewMode}
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                name="stock_status"
                value={formData.stock_status.toString()}
                onChange={handleChange}
                disabled={isViewMode}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Imagen del Producto</label>
            {!isViewMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: '10px' }}
              />
            )}
            
            {isUploading ? (
              <div style={{ padding: '10px', backgroundColor: '#f3f4f6', textAlign: 'center', borderRadius: '4px' }}>
                Subiendo imagen...
              </div>
            ) : (
              (formData.image_url || selectedFile) && (
                <div style={{ width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                   <img 
                     src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image_url} 
                     alt="Preview" 
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   />
                </div>
              )
            )}
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isUploading}>
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </button>
            {!isViewMode && (
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isUploading}
                style={{ opacity: isUploading ? 0.7 : 1 }}
              >
                {isUploading ? 'Procesando...' : 'Guardar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProducto;