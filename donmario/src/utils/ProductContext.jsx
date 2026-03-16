import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [showPrices, setShowPrices] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    let channel;

    const initConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('app_config')
          .select('show_prices')
          .eq('id', 1)
          .single();

        if (error) throw error;
        if (data) setShowPrices(data.show_prices);
      } catch (error) {
        console.error("Error cargando configuración:", error.message);
      } finally {
        setLoadingConfig(false);
      }

      channel = supabase
        .channel('public:app_config')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'app_config', filter: 'id=eq.1' },
          (payload) => {
            console.log("Cambio de configuración recibido:", payload.new);
            setShowPrices(payload.new.show_prices);
          }
        )
        .subscribe();
    };

    initConfig();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const togglePriceVisibility = async () => {
    try {
      const newValue = !showPrices;
      setShowPrices(newValue); 

      const { error } = await supabase
        .from('app_config')
        .update({ show_prices: newValue })
        .eq('id', 1);

      if (error) {
        setShowPrices(!newValue);
        throw error;
      }
    } catch (error) {
      console.error("Error actualizando configuración:", error.message);
      alert("No se pudo actualizar la configuración.");
    }
  };

  return (
    <ProductContext.Provider value={{ showPrices, togglePriceVisibility, loadingConfig }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProductContext debe usarse dentro de ProductProvider");
  return context;
};