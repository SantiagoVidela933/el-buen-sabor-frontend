
export const descargarFacturaPDF = async (
    facturaId: number, 
    nombreArchivo?: string
    ): Promise<void> => {
    try {
        
        // Hacer la solicitud al endpoint
        const response = await fetch(`http://localhost:8080/api/v1/factura/${facturaId}/pdf`);
        if (!response.ok) {
        throw new Error(`Error al descargar la factura: ${response.statusText}`);
        }
        
        // Obtener el blob del PDF
        const blob = await response.blob();
        
        // Crear un objeto URL para el blob
        const url = window.URL.createObjectURL(blob);
        
        // Crear un elemento <a> temporal para descargar el archivo
        const link = document.createElement('a');
        link.href = url;
        // Usar el nombre personalizado o un nombre por defecto
        link.download = nombreArchivo || `factura-${facturaId}.pdf`;
        
        // Añadir el enlace al documento y hacer clic en él
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar la factura:", error);
        throw error;
    }
};