
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

// Descargar nota de crédito
export const descargarNotaCreditoPDF = async (
    facturaId: number, 
    nombreArchivo?: string
    ): Promise<void> => {
    try {
        // Hacer la solicitud al endpoint específico para notas de crédito
        const response = await fetch(`http://localhost:8080/api/v1/factura/nota-credito/${facturaId}/pdf`);
        if (!response.ok) {
            throw new Error(`Error al descargar la nota de crédito: ${response.statusText}`);
        }
        
        // Obtener el blob del PDF
        const blob = await response.blob();
        
        // Crear un objeto URL para el blob
        const url = window.URL.createObjectURL(blob);
        
        // Crear un elemento <a> temporal para descargar el archivo
        const link = document.createElement('a');
        link.href = url;
        // Usar el nombre personalizado o un nombre por defecto
        link.download = nombreArchivo || `nota-credito-${facturaId}.pdf`;
        
        // Añadir el enlace al documento y hacer clic en él
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar la nota de crédito:", error);
        throw error;
    }
};

// Anular factura
export const anularFactura = async (facturaId: number): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/factura/anular/${facturaId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al anular la factura: ${errorText}`);
        }
        
    } catch (error) {
        console.error("Error al anular la factura:", error);
        throw error;
    }
};