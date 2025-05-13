import { createContext, useState, ReactNode } from "react";
import { Order } from "../models/Order";

type OrderStatus = "Entregado" | "En preparación" | "En camino" | "Cancelado";

interface OrderContextType {
  orders: Order[];
  addOrder: (data: {
    total: number;
    paid: boolean;
    orderStatus?: OrderStatus;
  }) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = ({
    total,
    paid,
    orderStatus = "En preparación",
  }: {
    total: number;
    paid: boolean;
    orderStatus?: OrderStatus;
  }) => {
    const newOrder = new Order(
      Date.now(), // id temporal
      new Date().toISOString(),
      total,
      orderStatus,
      paid
    );
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext };