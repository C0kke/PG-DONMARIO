export const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

    if (!cloudName || !uploadPreset) {
        console.error("Faltan las variables de entorno VITE_CLOUDINARY...");
        throw new Error("Configuración de Cloudinary incompleta");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "maranatha/catalog");

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Error respuesta Cloudinary:", errorDetails);
            throw new Error('Error al subir la imagen a la nube');
        }

        const data = await response.json();
        return data.secure_url;

    } catch (error) {
        console.error("Error en el servicio de subida:", error);
        throw error;
    }
};