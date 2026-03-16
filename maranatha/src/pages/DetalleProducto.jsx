import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, registerClick } from '../services/products';
import { uploadImageToCloudinary } from '../services/cloudinary';
import noImage from '/no-image.svg';
import { useProductContext } from '../utils/ProductContext';
import './styles/DetalleProducto.css';

export default function DetalleProducto() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { showPrices, loadingConfig } = useProductContext();

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            setProduct(data);
            setLoading(false);
            
            if (data) {
                registerClick(data.id);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading || loadingConfig) return <div className="detail-loading">Cargando producto...</div>;
    if (!product) return <div className="detail-loading">Producto no encontrado.</div>;

    return (
        <div className="detail-container container-max">
            <div className="breadcrumb">
                <Link to="/catalogo">Volver al catálogo</Link> / <span>{product.name}</span>
            </div>
            
            <div className="detail-grid">
                <div className="detail-image-column">
                    <div className="image-wrapper">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="product-img"/>
                        ) : (
                            <img src={noImage} alt="No disponible" className="product-img"/>
                        )}
                    </div>
                </div>

                <div className="detail-info-column">
                    <span className="detail-category">{product.category}</span>
                    <h1 className="detail-title">{product.name}</h1>

                    <div className="detail-price-section">
                        {showPrices && product.price > 0 ? (
                            <span className="detail-price">${product.price.toLocaleString('es-CL')}</span>
                        ) : (
                            <span className="detail-price-quote">Precio a cotizar</span>
                        )}
                    </div>

                    <div className="detail-actions">
                        <a 
                            href={`https://wa.me/56958985683?text=Hola,%20me%20interesa%20cotizar:%20${product.name}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="whatsapp-btn-full"
                        >
                            Comunicarse por WhatsApp
                        </a>
                    </div>

                    <div className="detail-description">
                        <h3>Descripción</h3>
                        <p>
                            {product.description.trim() !== "" ? product.description : product.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
