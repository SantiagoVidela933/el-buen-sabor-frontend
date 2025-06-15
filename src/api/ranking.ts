// Obtener el ranking de productos 
export const RankingProductos = async (desde: string, hasta: string) => {
    try {
        const response = await fetch(
        `http://localhost:8080/api/ranking/productos?desde=${desde}&hasta=${hasta}`
        );
        if (!response.ok) {
        throw new Error('Error al obtener el ranking de productos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Descargar el ranking de productos en formato Excel
export const downloadRankingProductosExcel = async (desde: string, hasta: string) => {
    try {
        const response = await fetch(
        `http://localhost:8080/api/ranking/productos/excel?desde=${desde}&hasta=${hasta}`,
        {
            method: 'GET',
        }
        );

        if (!response.ok) {
        throw new Error('Error al descargar el archivo Excel');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ranking_productos_${desde}_a_${hasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();

    } catch (error) {
        console.error('Error al descargar el archivo Excel:', error);
        throw error;
    }
};

// Obtener ranking de clientes
export const fetchRankingClientes = async (desde: string, hasta: string, orden: string = 'cantidad') => {
try {
    const response = await fetch(
    `http://localhost:8080/api/ranking/clientes?desde=${desde}&hasta=${hasta}&orden=${orden}`
    );
    if (!response.ok) {
    throw new Error('Error al obtener el ranking de clientes');
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error(error);
    throw error;
}
};

// Descargar ranking de clientes en Excel
export const downloadRankingClientesExcel = async (desde: string, hasta: string, orden: string = 'cantidad') => {
    try {
        const response = await fetch(
        `http://localhost:8080/api/ranking/clientes/excel?desde=${desde}&hasta=${hasta}&orden=${orden}`,
        {
            method: 'GET',
        }
        );

        if (!response.ok) {
        throw new Error('Error al descargar el archivo Excel');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ranking_clientes_${desde}_a_${hasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error('Error al descargar el archivo Excel:', error);
        throw error;
    }
};

// Obtener movimientos mensuales
export const fetchMovimientosMensuales = async (desde: string, hasta: string) => {
    try {
        const response = await fetch(
        `http://localhost:8080/api/ranking/totales/mensuales?desde=${desde}&hasta=${hasta}`
        );
        if (!response.ok) {
        throw new Error('Error al obtener los movimientos mensuales');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener totales
export const fetchTotales = async (desde: string, hasta: string) => {
    try {
        const response = await fetch(
        `http://localhost:8080/api/ranking/totales?desde=${desde}&hasta=${hasta}`
        );
        if (!response.ok) {
        throw new Error('Error al obtener los totales');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Descargar movimientos en Excel
 export const downloadMovimientosExcel = async (desde: string, hasta: string) => {
    try {
        const response = await fetch(
        `http://localhost:8080/api/ranking/totales/excel?desde=${desde}&hasta=${hasta}`,
        {
            method: 'GET',
        }
        );

        if (!response.ok) {
        throw new Error('Error al descargar el archivo Excel');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `movimientos_monetarios_${desde}_a_${hasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error('Error al descargar el archivo Excel:', error);
        throw error;
    }
};