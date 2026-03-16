import React, { useState, useEffect } from 'react';
import NoImage from '/no-image.svg';
import Watch from '/watchIcon.png';
import Edit from '/editIcon.png';
import Delete from '/deleteIcon.png';

const ImageWithPlaceholder = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="img-placeholder-wrapper">
      {!loaded && <div className="skeleton-loader" />}
      <img src={src || NoImage} alt={alt} className="img-content" style={{ opacity: loaded ? 1 : 0 }} onLoad={() => setLoaded(true)} />
    </div>
  );
};

const Tabla = ({ data, type, onView, onEdit, onDelete }) => {
  const isProduct = type === 'products';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { setCurrentPage(1); }, [type, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const StatusBadge = ({ isActive }) => {
    const activeClass = isActive ? 'status-active' : 'status-inactive';
    return <span className={`status-badge ${activeClass}`}>{isActive ? 'Activo' : 'Inactivo'}</span>;
  };

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {isProduct ? (
              <>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Estado</th>
              </>
            ) : (
              <>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
              </>
            )}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron resultados.</td></tr>
          ) : (
            currentItems.map((item) => {
              const isActive = isProduct ? item.stock_status : item.status === 'active';
              return (
                <tr key={item.id} className={isProduct && isActive ? 'row-active' : ''}>
                  {isProduct ? (
                    <>
                      <td data-label="Producto">
                        <div className="product-cell">
                          <ImageWithPlaceholder src={item.image_url} alt={item.name} />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td data-label="Categoría">{item.category || '-'}</td>
                      <td data-label="Marca">{item.brand || 'Genérico'}</td>
                      <td data-label="Precio">${item.price}</td>
                      <td data-label="Estado"><StatusBadge isActive={item.stock_status} /></td>
                    </>
                  ) : (
                    <>
                      <td data-label="Usuario">{item.name}</td>
                      <td data-label="Email">{item.email}</td>
                      <td data-label="Rol">{item.role}</td>
                    </>
                  )}
                  <td data-label="Acciones">
                    <button onClick={() => onView(item)} className="btn-icon" style={{ color: '#2563eb' }} title="Ver detalles"><img src={Watch} alt="Ver" /></button>
                    <button onClick={() => onEdit(item)} className="btn-icon" style={{ color: '#d97706' }} title="Editar"><img src={Edit} alt="Editar" /></button>
                    <button onClick={() => onDelete(item.id)} className="btn-icon" style={{ color: '#dc2626' }} title="Eliminar"><img src={Delete} alt="Borrar" /></button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {data.length > 0 && (
        <div className="pagination-container">
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}>Anterior</button>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tabla;