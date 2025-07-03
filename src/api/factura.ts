// Descargar Factura PDF
export const descargarFacturaPDF = async (
    facturaId: number, 
    nombreArchivo?: string
    ): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/factura/${facturaId}/pdf`);
        if (!response.ok) {
            throw new Error(`Error al descargar la factura: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = nombreArchivo || `factura-${facturaId}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar la factura:", error);
        throw error;
    }
};

// Descargar Nota de crédito PDF
export const descargarNotaCreditoPDF = async (
    facturaId: number, 
    nombreArchivo?: string
    ): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/factura/nota-credito/${facturaId}/pdf`);
        if (!response.ok) {
            throw new Error(`Error al descargar la nota de crédito: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = nombreArchivo || `nota-credito-${facturaId}.pdf`;
        document.body.appendChild(link);
        link.click();
        
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