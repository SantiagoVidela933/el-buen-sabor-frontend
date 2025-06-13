import { useEffect} from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

interface CheckoutMPProps {
  idPreferencia: string;
  mostrar?: boolean;
}

function CheckoutMP({ idPreferencia, mostrar = false }: CheckoutMPProps) {
    useEffect(() => {
        initMercadoPago("APP_USR-38c63032-9571-440f-8096-1241102a5245", {
        locale: "es-AR",
        });
    }, []);

    if (!mostrar|| !idPreferencia) return null;

    return (
        <div>
            <Wallet
                initialization={{ preferenceId: idPreferencia, redirectMode: "blank" }}
                customization={{ texts: { valueProp: "smart_option" } }}
            />
        </div>
    );
}

export default CheckoutMP;