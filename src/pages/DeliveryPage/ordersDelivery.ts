export interface Order {
  id: number;
  date: string;
  deliveryMethod: 'Delivery' | 'Local';
  paymentMethod: 'Efectivo' | 'Mercado Pago';
  paid: boolean;
  status: 'A confirmar' | 'En cocina' | 'Entregado';
}

export const mockOrders: Order[] = [
  {
    id: 1001,
    date: '2025-05-15 12:30',
    deliveryMethod: 'Delivery',
    paymentMethod: 'Mercado Pago',
    paid: true,
    status: 'En cocina'
  },
  {
    id: 1002,
    date: '2025-05-16 13:15',
    deliveryMethod: 'Local',
    paymentMethod: 'Efectivo',
    paid: false,
    status: 'En cocina'
  },
  {
    id: 1003,
    date: '2025-05-16 14:00',
    deliveryMethod: 'Delivery',
    paymentMethod: 'Mercado Pago',
    paid: true,
    status: 'En cocina'
  },
];
