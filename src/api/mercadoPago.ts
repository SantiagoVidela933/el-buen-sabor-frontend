import type { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import { DatoMercadoPago } from '../models/DatoMercadoPago';

interface MercadoPagoPreferenceResponse {
    preferenceId: string;
    initPoint: string;
    sandboxInitPoint: string | null;
    }


    export const crearPagoMercadoPago = async (
    pedidoId: number,
    getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>
    ): Promise<MercadoPagoPreferenceResponse> => {
    try {
        const token = await getAccessTokenSilently({
        audience: 'https://apiSabor',
        scope: 'openid profile email',
        } as any);

        const response = await fetch(`http://localhost:8080/api/v1/datoMercadoPago/${pedidoId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
        });

        if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear pago con Mercado Pago: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al crear pago con Mercado Pago:", error);
        throw error;
    }
    };


    export const getDatosMercadoPago = async (
    pagoId: number,
    getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>
    ): Promise<DatoMercadoPago> => {
    try {
        const token = await getAccessTokenSilently({
        audience: 'https://apiSabor',
        scope: 'openid profile email',
        } as any);

        const response = await fetch(`http://localhost:8080/api/v1/datoMercadoPago/${pagoId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
        });

        if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener datos del pago: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener datos del pago:", error);
        throw error;
    }
};


export const actualizarEstadoPago = async (
    facturaId: number,
    status: string,
    getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>
    ): Promise<DatoMercadoPago> => {
    try {
        const token = await getAccessTokenSilently({
        audience: 'https://apiSabor',
        scope: 'openid profile email',
        } as any);

        const response = await fetch(`http://localhost:8080/api/v1/datoMercadoPago/actualizar/${facturaId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status })
        });

        if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el estado del pago: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al actualizar estado del pago:", error);
        throw error;
    }
};