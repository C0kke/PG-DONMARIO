import { supabase } from './supabase';

const DOMAIN = "@maranatha.local";

export const login = async (username, password) => {
    const email = `${username}${DOMAIN}`;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) throw error;
    return data;
};

export const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; 
};

export const getAllUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error obteniendo usuarios:", error.message);
        return [];
    }
};

export const adminCreateUser = async (userData) => {
    const email = `${userData.username}${DOMAIN}`;
    
    const { data, error } = await supabase.rpc('create_user_admin', {
        email: email,
        password: userData.password,
        name: userData.name,
        role: userData.role || 'customer',
        status: userData.status || 'active'
    });

    if (error) throw error;
    return data;
};

export const adminUpdateUser = async (id, updates) => {
    const { password, name, role, status } = updates;

    const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, role, status })
        .eq('id', id);

    if (profileError) throw profileError;

    if (password && password.trim() !== '') {
        const { error: passError } = await supabase.auth.updateUser({ 
            password: password 
        });

        const { error: rpcError } = await supabase.rpc('update_user_admin', {
            target_user_id: id,
            new_name: name, 
            new_role: role,
            new_status: status,
            new_password: password
        });

        if (rpcError) throw rpcError;
    }
    
    return true;
};

export const adminDeleteUser = async (id) => {
    const { error } = await supabase.rpc('delete_user_admin', {
        target_user_id: id
    });

    if (error) {
        console.error("Error eliminando usuario:", error);
        throw error;
    }
    return true;
};