import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getActiveProducts, registerClick } from '../services/products';
import noImage from '/no-image.svg';
import ArrowLeft from "../assets/arrow-left.svg?react";
import ArrowRight from "../assets/arrow-right.svg?react";
import { useProductContext } from '../utils/ProductContext';
import './styles/Catalogo.css';

export default function Catalogo() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [globalMax, setGlobalMax] = useState(100000);
    
    const [sortOrder, setSortOrder] = useState("");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    const [minInput, setMinInput] = useState("0");
    const [maxInput, setMaxInput] = useState("100000");

    const { showPrices, loadingConfig } = useProductContext();
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = sessionStorage.getItem('catalogPage');
        return savedPage ? Number(savedPage) : 1;
    });
    const itemsPerPage = 10;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMounted = useRef(false);
    const rangeRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getActiveProducts();
                setProducts(data);

                if (data.length > 0) {
                    const prices = data.map(p => p.price || 0);
                    const highest = Math.max(...prices);
                    setGlobalMax(highest);
                    setMaxPrice(highest);
                    setMaxInput(String(highest));
                    setMinPrice(0);
                    setMinInput("0");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        sessionStorage.setItem('catalogPage', currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (loading) return;

        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        setCurrentPage(1);
    }, [searchTerm, selectedCategory, minPrice, maxPrice, sortOrder, loading]);

    useEffect(() => {
        if (rangeRef.current) {
            const maxVal = globalMax > 0 ? globalMax : 1;
            const minPercent = (minPrice / maxVal) * 100;
            const maxPercent = (maxPrice / maxVal) * 100;

            rangeRef.current.style.left = `${minPercent}%`;
            rangeRef.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minPrice, maxPrice, globalMax]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
            const price = product.price || 0;
            const matchesPrice = price >= minPrice && price <= maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [products, searchTerm, selectedCategory, minPrice, maxPrice]);

    const sortedProducts = useMemo(() => {
        let sorted = [...filteredProducts];
        switch (sortOrder) {
            case 'price-asc': return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price-desc': return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'name-az': return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-za': return sorted.sort((a, b) => b.name.localeCompare(a.name));
            default: return sorted;
        }
    }, [filteredProducts, sortOrder]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedProducts, currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            const productContainer = document.querySelector('.products-scroll-container');
            if (productContainer) productContainer.scrollTop = 0;
        }
    };
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const uniqueCategories = useMemo(() => {
        const categories = products.map(p => p.category).filter(Boolean);
        return [...new Set(categories)];
    }, [products]);

    const handleRangeChange = (e, type) => {
        const value = parseInt(e.target.value);
        const gap = globalMax * 0.05;

        if (type === 'min') {
            const newVal = Math.min(value, maxPrice - gap);
            setMinPrice(newVal);
            setMinInput(String(newVal));
        } else {
            const newVal = Math.max(value, minPrice + gap);
            setMaxPrice(newVal);
            setMaxInput(String(newVal));
        }
    };

    const handleNumberInput = (e, type) => {
        const val = e.target.value;
        if (type === 'min') setMinInput(val);
        else setMaxInput(val);
    };

    const fixNumberInput = (type) => {
        if (type === 'min') {
            let val = parseInt(minInput);
            if (isNaN(val)) val = minPrice;
            if (val < 0) val = 0;
            if (val >= maxPrice) val = maxPrice - 1;
            setMinPrice(val);
            setMinInput(String(val));
        } else {
            let val = parseInt(maxInput);
            if (isNaN(val)) val = maxPrice;
            if (val > globalMax) val = globalMax;
            if (val <= minPrice) val = minPrice + 1;
            setMaxPrice(val);
            setMaxInput(String(val));
        }
    };

    if (loading || loadingConfig) {
        return (
            <div className="loading-container">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className='loading-spinner'
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="catalog-container container-max"
        >
            <div className="search-bar-section">
                <input
                    type="text"
                    placeholder="¿Qué estás buscando?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="main-search-input"
                />
            </div>

            <button className="mobile-filter-toggle" onClick={() => setShowMobileFilters(!showMobileFilters)}>
                {showMobileFilters ? 'Ocultar Filtros' : 'Filtrar y Ordenar'}
            </button>

            <div className="catalog-layout">
                <aside className={`sidebar-filters ${showMobileFilters ? 'show-mobile' : ''}`}>
                    <div className="filter-group">
                        <h3>Ordenar por</h3>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
                            <option value="">Destacados</option>
                            <option value="name-az">Nombre (A-Z)</option>
                            <option value="name-za">Nombre (Z-A)</option>
                            <option value="price-asc">Precio (Menor a Mayor)</option>
                            <option value="price-desc">Precio (Mayor a Menor)</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <h3>Precio</h3>
                        <div className="price-slider-wrapper">
                            <div className="price-inputs-header">
                                <div className="price-field">
                                    <label>Mínimo</label>
                                    <div className="input-prefix">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            value={minInput}
                                            onChange={(e) => handleNumberInput(e, 'min')}
                                            onBlur={() => fixNumberInput('min')}
                                            onKeyDown={e => e.key === 'Enter' && fixNumberInput('min')}
                                        />
                                    </div>
                                </div>
                                <div className="price-field">
                                    <label>Máximo</label>
                                    <div className="input-prefix">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            value={maxInput}
                                            onChange={(e) => handleNumberInput(e, 'max')}
                                            onBlur={() => fixNumberInput('max')}
                                            onKeyDown={e => e.key === 'Enter' && fixNumberInput('max')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="dual-slider-container">
                                <div className="slider-track"></div>
                                <div ref={rangeRef} className="slider-range"></div>
                                <input
                                    type="range"
                                    min="0" max={globalMax}
                                    value={minPrice}
                                    onChange={(e) => handleRangeChange(e, 'min')}
                                    className="range-input min-thumb"
                                />
                                <input
                                    type="range"
                                    min="0" max={globalMax}
                                    value={maxPrice}
                                    onChange={(e) => handleRangeChange(e, 'max')}
                                    className="range-input max-thumb"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Categoría</h3>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Todas</option>
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </aside>

                <div className="products-area">
                    {totalPages > 1 && (
                        <div className="pagination-wrapper">
                            <div className="pagination-numbers">
                                <button
                                    className="pagination-arrow"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <img className='arrow-icon' src={ArrowLeft} />
                                </button>
                                {pageNumbers.map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={`pagination-btn ${number === currentPage ? 'active' : ''}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    className="pagination-arrow"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <img className='arrow-icon' src={ArrowRight} />
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="products-scroll-container">
                        {!loading && sortedProducts.length === 0 ? (
                            <div className="no-results"><p>No encontramos productos.</p></div>
                        ) : (
                            <div className="products-grid">
                                {paginatedProducts.map((product) => (
                                    <Link
                                        to={`/producto/${product.id}`}
                                        key={product.id}
                                        className="product-card-link"
                                        onClick={() => registerClick(product.id)}
                                    >
                                        <div className="product-card">
                                            <div className="card-image">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="product-img" />
                                                ) : (
                                                    <img src={noImage} alt="No disponible" className="product-img" />
                                                )}
                                            </div>
                                            <div className="card-content">
                                                <span className="category-tag">{product.category}</span>
                                                <h3 title={product.name}>{product.name}</h3>

                                                <div className="price-row">
                                                    <span className="price">
                                                        {(showPrices && product.price > 0) ? `$${product.price.toLocaleString('es-CL')}` :
                                                            <span className="cotizar-badge">Precio a Cotizar</span>
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}