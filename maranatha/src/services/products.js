import { supabase } from './supabase';

export const getAllProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error getAllProducts:", error.message);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error obteniendo producto:", error.message);
        return null;
    }
};

export const getActiveProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('stock_status', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error en getActiveProducts:", error.message);
        throw error;
    }
};

export const registerClick = async (productId) => {
    try {
        await supabase.rpc('increment_clicks', { product_id: productId });
    } catch (error) {
        console.error("Error en registerClick:", error);
    }
};

export const getTopClickedProducts = async (limit = 4) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
.eq('stock_status', true)
            .order('clicks', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error en getTopClickedProducts:", error.message);
        return [];
    }
};

export const getRecentProducts = async (limit = 4) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('stock_status', true)
            .order('updated_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error en getRecentProducts:", error.message);
        return [];
    }
};

export const createProduct = async (productData) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: productData.name,
                brand: productData.brand,
                price: parseFloat(productData.price),
                stock_status: productData.stock_status,
                description: productData.description,
                image_url: productData.image_url
            }])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating product:", error.message);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({
                name: productData.name,
                brand: productData.brand,
                price: parseFloat(productData.price),
                stock_status: productData.stock_status,
                description: productData.description,
                image_url: productData.image_url
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error deleting product:", error.message);
        throw error;
    }
};