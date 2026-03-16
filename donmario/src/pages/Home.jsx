import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentProducts, getTopClickedProducts, registerClick } from '../services/products';
import noImage from '/no-image.svg';
import pannelHome from '../assets/maranatha-home-pannel.png';
import { useProductContext } from '../utils/ProductContext';
import './styles/Home.css';

export default function Home() {
    const [newProducts, setNewProducts] = useState([]);
    const [topClicked, setTopClicked] = useState([]);
    const { showPrices, loadingConfig } = useProductContext();

    useEffect(() => {
        const loadRecent = async () => {
            const data = await getRecentProducts(4);
            setNewProducts(data);
        };
        const loadTopClicked = async () => {
            const data = await getTopClickedProducts(4);
            setTopClicked(data);
        };
        loadRecent();
        loadTopClicked();
    }, []);

    if (loadingConfig) return <p>Cargando catálogo...</p>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="home-container container-max"
        >
            <div className="hero">
                <div className="hero-content">
                    <img src={pannelHome} alt="Logo Ferretería Maranatha" className="hero-logo" />
                </div>
                <Link to="/catalogo">
                    <button className="btn-hero">Ver Catálogo Completo</button>
                </Link>
            </div>

             <section className="section-container">
                <h2 className="section-title">Lo más buscado</h2>
                <div className="cards-grid hot-grid">
                    {topClicked.length > 0 ? (
                        topClicked.map((prod) => (
                           <Link to={`/producto/${prod.id}`} key={prod.id} className="product-card-link" onClick={() => registerClick(prod.id)}>
                                <div className="card product-card">
                                    <div className="card-image-container">
                                        {prod.image_url ? (
                                            <img src={prod.image_url} alt={prod.name} className="product-img"/>
                                        ) : (
                                            <img src={noImage} alt="No disponible" className="product-img"/>
                                        )}
                                    </div>
                                    <div className="card-info">
                                        <h3>{prod.name}</h3>
                                        <p className="price">
                                            {(showPrices && prod.price > 0) ? `$${prod.price.toLocaleString('es-CL')}` : "Cotizar"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="loading-msg">Cargando productos más buscados...</div>
                    )}
                </div>
            </section>

            <section className="section-container bg-light">
                <h2 className="section-title">Lo más nuevo</h2>
                <div className="cards-grid products-grid">
                    {newProducts.length > 0 ? (
                        newProducts.map((prod) => (
                            <Link to={`/producto/${prod.id}`} key={prod.id} className="product-card-link" onClick={() => registerClick(prod.id)}>
                                <div className="card product-card">
                                    <div className="card-image-container">
                                        {prod.image_url ? (
                                            <img src={prod.image_url} alt={prod.name} className="product-img"/>
                                        ) : (
                                            <img src={noImage} alt="No disponible" className="product-img"/>
                                        )}
                                    </div>
                                    <div className="card-info">
                                        <h3>{prod.name}</h3>
                                        <p className="price">
                                            {(showPrices && prod.price > 0) ? `$${prod.price.toLocaleString('es-CL')}` : "Cotizar"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="loading-msg">Cargando novedades...</div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}